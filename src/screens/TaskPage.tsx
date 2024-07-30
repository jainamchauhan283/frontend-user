import React, { useEffect, useState } from "react";
// Ex. Libraries
import {
  AppBar,
  Box,
  Button,
  ButtonGroup,
  Card,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
  Grid,
  InputBase,
  Toolbar,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import AddIcon from "@mui/icons-material/Add";
// Redux
import { logoutFormData } from "../redux/reducer";
// Services
import {
  addTask,
  deleteTask,
  fetchTasks,
  fetchUserAndPayment,
  logoutUser,
  updateTask,
} from "../services/apiServices";
import axiosInstance from "../services/api";
// Utils
import { MESSAGES } from "../utils/constants";
import { getErrorMessage } from "../utils/errorUtils";
import { showSuccessToast, showErrorToast } from "../utils/utilities";
// Interfaces
import { AddTaskPayload } from "../interfaces/payload/addTaskPayload";
import { EditTaskPayload } from "../interfaces/payload/editTaskPayload";

const TaskPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const accessToken = useSelector((state: any) => state.form.accessToken);
  // const user = useSelector((state: any) => state.form.user);
  // const payment = useSelector((state: any) => state.form.payment);

  const [user, setUser] = useState<any>(null);
  const [payment, setPayment] = useState<any>(null);

  const [taskName, setTaskName] = useState("");
  const [taskDescription, settaskDescription] = useState("");
  const [error, setError] = useState("");
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editTaskId, setEditTaskId] = useState("");
  const [deleteTaskId, setDeleteTaskId] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");

  useEffect(() => {
    if (!accessToken) {
      navigate("/login", { replace: true });
    } else {
      fetchUserData();
      fetchUserTasks();
    }
    const handleOnline = () => {
      setIsOnline(true);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [accessToken, navigate]);

  const fetchUserData = async () => {
    if (!isOnline) return;

    try {
      const { user, payment } = await fetchUserAndPayment(accessToken);
      setUser(user);
      setPayment(payment);
    } catch (error) {
      setError(getErrorMessage(error));
      console.error("Failed to fetch user and payment data:", error);
    }
  };

  const fetchUserTasks = async () => {
    if (!isOnline) {
      setTasks([]); // Clear tasks when offline
      showErrorToast(MESSAGES.OFFLINE_TASK_ERROR);
      return;
    }
    setLoading(true);
    try {
      const { status, data, error } = await fetchTasks(accessToken);
      if (status) {
        setTasks(data);
      } else {
        if (error === "Request failed with status code 403") {
          navigate("/login", { replace: true });
        }
      }
    } catch (error) {
      setError(getErrorMessage(error));
      console.error("Failed to fetch tasks:", error);
    }
    setLoading(false);
  };

  const handleAddTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Check online status
    if (!isOnline) {
      showErrorToast(MESSAGES.OFFLINE_ADD_TASK_ERROR);
      return;
    }
    // Validate input fields
    if (taskName.trim() === "" || taskDescription.trim() === "") {
      setError(MESSAGES.ENTER_TASK);
      return;
    }
    // Check subscription limit
    const isSubscriptionActive = !!payment;
    if (!isSubscriptionActive && tasks.length >= 5) {
      showErrorToast("Task limit reached. Please subscribe to add more tasks.");
      return;
    }
    // Check for duplicate tasks
    if (
      tasks.some(
        (task) => task.taskName.toLowerCase() === taskName.toLowerCase()
      )
    ) {
      setError(MESSAGES.DUPLICATE_TASK_ERROR);
      return;
    }

    setLoading(true);
    setError("");

    const payload: AddTaskPayload = {
      taskName,
      taskDescription,
      accessToken,
    };

    try {
      const { status, data } = await addTask(payload);
      if (status && data) {
        setTasks([...tasks, data.data?.task]);
        // Clear the input fields
        setTaskName("");
        settaskDescription("");
        setOpenDialog(false);
        showSuccessToast(MESSAGES.ADD_TASK_SUCCESS);
      } else {
        setError("Failed to add task");
        showErrorToast(MESSAGES.ADD_TASK_FAILURE);
      }
    } catch (error) {
      setError(getErrorMessage(error));
      showErrorToast(MESSAGES.ADD_TASK_FAILURE);
      console.error(error);
    }

    setLoading(false);
  };

  const handleEditClick = (
    taskId: string,
    currentTaskName: string,
    currenttaskDescription: string
  ) => {
    setEditTaskId(taskId); // Set the task ID being edited
    setTaskName(currentTaskName); // Set the current task name in the input field
    settaskDescription(currenttaskDescription); // Set the current task description in the input field
    setEditMode(true); // Enable edit mode
    setDialogTitle("Edit Task");
    setOpenDialog(true);
  };

  const handleDoneEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const payload: EditTaskPayload = {
      taskId: editTaskId,
      taskName: taskName,
      taskDescription: taskDescription,
      accessToken: accessToken,
    };
    try {
      const { status } = await updateTask(payload);
      if (status) {
        setEditMode(false);
        setEditTaskId("");
        setTaskName("");
        settaskDescription("");
        setOpenDialog(false);
        fetchUserTasks();
        showSuccessToast(MESSAGES.UPDATE_TASK_SUCCESS);
      } else {
        setError("Failed to update task");
        showErrorToast(MESSAGES.UPDATE_TASK_FAILURE);
      }
    } catch (error) {
      setError(getErrorMessage(error));
      showErrorToast(MESSAGES.UPDATE_TASK_FAILURE);
      console.error(error);
    }
    setLoading(false);
  };

  // const handleCancelEdit = () => {
  //   setTaskName("");
  //   setEditTaskId("");
  //   setEditMode(false);
  //   setOpenDialog(false);
  // };

  const handleDeleteTask = (taskId: string) => {
    setDeleteTaskId(taskId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    setLoading(true);
    const payload = {
      taskId: deleteTaskId,
      accessToken: accessToken,
    };
    try {
      const { status } = await deleteTask(payload);
      if (status) {
        setTasks(tasks.filter((task) => task._id !== deleteTaskId));
        setDeleteDialogOpen(false);
        showSuccessToast(MESSAGES.DELETE_TASK_SUCCESS);
      } else {
        showErrorToast(MESSAGES.DELETE_TASK_FAILURE);
      }
    } catch (error) {
      showErrorToast(MESSAGES.DELETE_TASK_FAILURE);
      console.error(error);
    }
    setLoading(false);
  };

  const cancelDelete = () => {
    setDeleteDialogOpen(false);
    setDeleteTaskId("");
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      const { status } = await logoutUser(accessToken);
      if (status) {
        dispatch(logoutFormData());
        showSuccessToast(MESSAGES.LOG_OUT_SUCCESS);
        navigate("/login", { replace: true });
      }
    } catch (error) {
      showErrorToast(MESSAGES.LOG_OUT_FAILURE);
      console.error(error);
    }
    setLoading(false);
  };

  const openAddDialog = () => {
    setOpenDialog(true);
    setDialogTitle("Add Task");
    setTaskName("");
    settaskDescription("");
  };

  const openEditDialog = (
    taskId: string,
    currentTaskName: string,
    currentTaskDescription: string
  ) => {
    setOpenDialog(true);
    setDialogTitle("Edit Task");
    setEditTaskId(taskId);
    setTaskName(currentTaskName);
    settaskDescription(currentTaskDescription);
  };

  const closeDialog = () => {
    setOpenDialog(false);
    setDialogTitle("");
    setTaskName("");
    settaskDescription("");
    setEditTaskId("");
    setEditMode(false);
  };

  const handlePayment = async () => {
    try {
      // Call your backend to create a new order
      const { data } = await axiosInstance.post(
        "http://localhost:5000/payments/create",
        { amount: 50 },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const { amount, id: order_id, currency } = data.data;
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: amount.toString(),
        currency: currency,
        name: "Task Manager",
        description: "Subscription Payment",
        order_id: order_id,
        handler: async function (response: {
          razorpay_payment_id: any;
          razorpay_order_id: any;
          razorpay_signature: any;
        }) {
          try {
            const paymentData = {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            };
            // Verify the payment on the backend
            // const result = await axiosInstance.post(
            await axiosInstance.post(
              "http://localhost:5000/payments/verify",
              paymentData,
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            );
            showSuccessToast("Payment Successful");
            window.location.reload();
          } catch (error) {
            console.error("Payment verification error:", error);
            showErrorToast("Payment verification failed");
          }
        },
        prefill: {
          name: "Jainam Chauhan",
          email: "jainam.chauhan.311@gmail.com",
          contact: "7096665228",
        },
        notes: {
          address: "Razorpay Corporate Office",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on(
        "payment.failed",
        function (response: { error: { description: any } }) {
          showErrorToast(`Payment failed: ${response.error.description}`);
        }
      );

      rzp.open();
    } catch (error) {
      console.error("Error creating order:", error);
      showErrorToast("Error initiating payment");
    }
  };

  return (
    <>
      <AppBar position="static" color="inherit">
        <Toolbar>
          <Typography variant="h5">Hello, {user?.userName}</Typography>
          <Box sx={{ flexGrow: 1 }} />
          {!payment && (
            <Button
              variant="outlined"
              color="error"
              sx={{ marginRight: 2 }}
              onClick={handlePayment}
            >
              Subscribe Now
            </Button>
          )}

          {payment && (
            <Typography variant="h6">You have active subscription</Typography>
          )}
          <Button variant="contained" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          m: 3,
          p: 2,
          // display: "flex",
          // flexDirection: "column",
          // alignItems: "center",
        }}
      >
        <Typography variant="body1" color="error" sx={{ mt: 1 }}>
          {error}
        </Typography>

        {loading ? (
          <CircularProgress sx={{ mt: 3 }} />
        ) : !isOnline ? (
          <Typography variant="h6" color="error" sx={{ mt: 3 }}>
            You are offline. Please check your internet connection.
          </Typography>
        ) : tasks.length > 0 ? (
          // tasks.map((task) => (
          //   <Card
          //     key={task._id}
          //     variant="outlined"
          //     sx={{
          //       display: "flex",
          //       flexDirection: "column",
          //       width: "100%",
          //       p: 1,
          //       m: 1,
          //     }}
          //   >
          //     <Typography variant="h6" sx={{ ml: 1 }}>
          //       {task.taskName}
          //     </Typography>
          //     {task.taskDescription && (
          //       <Typography
          //         variant="body2"
          //         sx={{ ml: 1, mt: 1, color: "text.secondary" }}
          //       >
          //         {task.taskDescription}
          //       </Typography>
          //     )}
          //     <ButtonGroup variant="text" aria-label="Basic button group">
          //       {editMode && task._id === editTaskId ? (
          //         <></>
          //       ) : (
          //         <Button
          //           onClick={() =>
          //             handleEditClick(
          //               task._id,
          //               task.taskName,
          //               task.taskDescription
          //             )
          //           }
          //         >
          //           Edit
          //         </Button>
          //       )}
          //       <Button
          //         onClick={() => handleDeleteTask(task._id)}
          //         color="error"
          //       >
          //         Delete
          //       </Button>
          //     </ButtonGroup>
          //   </Card>
          // ))
          <Grid container spacing={2}>
            {tasks.map((task) => (
              <Grid item key={task._id} xs={12} sm={6} md={4} lg={3}>
                <Card
                // key={task._id}
                  variant="outlined"
                  sx={{
                    border: "1px solid #3f51b5",
                    borderRadius: "8px",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    "&:hover": {
                      transform: "scale(1.05)",
                      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                    },
                    display: "flex",
                    flexDirection: "column",
                    p: 2,
                  }}
                >
                  <Typography variant="h6" sx={{ ml: 1 }}>
                    {task.taskName}
                  </Typography>
                  {task.taskDescription && (
                    <Typography
                      variant="body2"
                      sx={{ ml: 1, mt: 1, color: "text.secondary" }}
                    >
                      {task.taskDescription}
                    </Typography>
                  )}
                  <ButtonGroup variant="text" aria-label="Basic button group">
                    {editMode && task._id === editTaskId ? (
                      <></>
                    ) : (
                      <Button
                        onClick={() =>
                          handleEditClick(
                            task._id,
                            task.taskName,
                            task.taskDescription
                          )
                        }
                      >
                        Edit
                      </Button>
                    )}
                    <Button
                      onClick={() => handleDeleteTask(task._id)}
                      color="error"
                    >
                      Delete
                    </Button>
                  </ButtonGroup>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography variant="body1" sx={{ mt: 3 }}>
            No tasks available.
          </Typography>
        )}
        <Fab
          color="primary"
          aria-label="add"
          sx={{ position: "fixed", bottom: 16, right: 16 }}
          onClick={openAddDialog}
        >
          <AddIcon />
        </Fab>
      </Box>
      <Dialog open={openDialog} onClose={closeDialog}>
        <DialogTitle>{dialogTitle}</DialogTitle>
        <DialogContent>
          <form onSubmit={editMode ? handleDoneEdit : handleAddTask}>
            <InputBase
              placeholder="Task Name"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              fullWidth
              sx={{
                border: "1px solid #ccc",
                borderRadius: 1,
                padding: 1,
                mb: 2,
              }}
            />
            <InputBase
              placeholder="Task Description"
              value={taskDescription}
              onChange={(e) => settaskDescription(e.target.value)}
              fullWidth
              multiline
              rows={4}
              sx={{
                border: "1px solid #ccc",
                borderRadius: 1,
                padding: 1,
                mb: 2,
              }}
            />
            <DialogActions>
              <Button onClick={closeDialog}>Cancel</Button>
              <Button type="submit" color="primary">
                {editMode ? "Update" : "Add"}
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onClose={cancelDelete}>
        <DialogTitle>Delete Task</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to delete this task?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete}>Cancel</Button>
          <Button onClick={confirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TaskPage;
