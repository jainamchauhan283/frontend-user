import React, { useEffect, useState } from "react";
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
  Divider,
  IconButton,
  InputBase,
  Paper,
  Toolbar,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { clearFormData } from "../redux/formSlice";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import DoneIcon from "@mui/icons-material/Done";
import { toast } from "react-hot-toast";

const baseUrl = "http://localhost:5000";

const TaskPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const accessToken = useSelector((state: any) => state.form.accessToken);
  const userName = useSelector((state: any) => state.form.username);

  const [taskName, setTaskName] = useState("");
  const [error, setError] = useState("");
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false); // State to manage edit mode
  const [editTaskId, setEditTaskId] = useState(""); // State to store task ID being edited
  const [deleteTaskId, setDeleteTaskId] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (!accessToken) {
      navigate("/login", { replace: true });
    } else {
      fetchUserTasks();
    }
  }, [accessToken, navigate]);

  const fetchUserTasks = async () => {
    try {
      setLoading(true);

      const response = await axios.get(`${baseUrl}/api/get/tasks`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = response.data;
      setTasks(data);
    } catch (error:any) {
      if (error.response && error.response.status === 403) {
        // Token expired or invalid, redirect to login
        navigate("/login", { replace: true });
      } else {
        setError("Failed to fetch tasks");
        console.error("Failed to fetch tasks:", error);
        toast.error("Failed to fetch tasks", { duration: 2000 });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // Check if taskName is empty
    if (taskName.trim() === "") {
      setError("Please Enter a Task");
      return;
    }
    setError(""); // Clear any existing error message
    try {
      setLoading(true);
      const response = await axios.post(
        `${baseUrl}/api/post/tasks`,
        { taskName },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const data = response.data;
      // Check if data contains a task object
      if (data && data.task) {
        setTaskName(""); // Clear the task input field

        setTasks([...tasks, data.task]); // Update tasks state to reflect new task add
        toast.success("Task added successfully", { duration: 2000 });
      }
    } catch (error) {
      setError("Failed to add task");
      console.error(error);
      toast.error("Failed to add task", { duration: 2000 }); // Show error toast
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  const handleEditClick = (taskId: string, currentTaskName: string) => {
    setEditTaskId(taskId); // Set the task ID being edited
    setTaskName(currentTaskName); // Set the current task name in the input field
    setEditMode(true); // Enable edit mode
  };

  const handleDoneEdit = async () => {
    try {
      setLoading(true);
      // Make PATCH request to update the task
      await axios.patch(
        `${baseUrl}/api/update/${editTaskId}`,
        { taskName },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      // Clear the input field and reset state
      setTaskName("");
      setEditTaskId("");
      setEditMode(false);

      fetchUserTasks(); // Refetch tasks to update the list
      toast.success("Task Update successfully");
    } catch (error) {
      setError("Failed to update task");
      console.error(error);
      toast.error("Failed to Update successfully"); // Show error toast
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setTaskName("");
    setEditTaskId("");
    setEditMode(false);
  };

  const handleDeleteTask = (taskId: string) => {
    setDeleteTaskId(taskId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`${baseUrl}/api/delete/${deleteTaskId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const updatedTasks = tasks.filter((task) => task._id !== deleteTaskId);
      setTasks(updatedTasks);
      setDeleteDialogOpen(false);
      toast.success("Task deleted successfully", { duration: 2000 });
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete task");
    } finally {
      setLoading(false);
    }
  };

  const cancelDelete = () => {
    setDeleteDialogOpen(false);
    setDeleteTaskId("");
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      await axios.post(
        `${baseUrl}/users/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      dispatch(clearFormData()); // Clear Redux form data
      setTimeout(() => {
        toast.success("Logout successful"); // show logout toast msg
      }, 1000);
      navigate("/login", { replace: true }); // Navigate to login page
    } catch (error) {
      // setError("Failed to logout");
      console.error(error);
      toast.error("Something went wrong"); // show error toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AppBar position="static" color="inherit">
        <Toolbar>
          <Typography variant="h5">Hello, {userName}</Typography>{" "}
          <Button onClick={handleLogout}>Logout</Button>
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          m: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Paper
          component="form"
          sx={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            p: 1,
          }}
        >
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Task"
            inputProps={{ "aria-label": "Task" }}
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
          />
          <IconButton
            type="button"
            sx={{ p: "10px" }}
            onClick={() => {
              if (editMode) {
                handleCancelEdit();
              } else {
                setTaskName("");
              }
            }}
            aria-label="cancel"
          >
            <CloseIcon />
          </IconButton>
          <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
          {editMode ? (
            <IconButton
              color="primary"
              sx={{ p: "10px" }}
              onClick={handleDoneEdit}
              aria-label="done-edit"
            >
              <DoneIcon />
            </IconButton>
          ) : (
            <IconButton
              color="primary"
              sx={{ p: "10px" }}
              onClick={handleAddTask}
              aria-label="add-task"
            >
              <AddIcon />
            </IconButton>
          )}
        </Paper>
        {/* <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <TextField
            label="Task"
            type="text"
            autoComplete="Task"
            fullWidth
            margin="normal"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
          />
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              m: 2,
            }}
          >
            <Button
              variant="outlined"
              fullWidth
              sx={{ width: "calc(50% - 8px)" }}
              color="error"
              onClick={() => setTaskName("")} // Clear input on Cancel
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              fullWidth
              sx={{ width: "calc(50% - 8px)" }}
              color="primary"
              onClick={handleAddTask}
            >
              Add
            </Button>
          </Box>
        </Box> */}
        <Typography variant="body1" color="error" sx={{ mt: 1 }}>
          {error}
        </Typography>

        {loading ? (
          <CircularProgress sx={{ mt: 3 }} />
        ) : (
          tasks.map((task) => (
            <Card
              key={task._id}
              variant="outlined"
              // sx={{ mt: 1, p: 1, width: "100%" }}
              sx={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                p: 1,
                m: 1,
              }}
            >
              <Typography variant="h6" sx={{ ml: 1, flex: 1 }}>
                {/* {task._id === editTaskId ? (
                  <InputBase
                    value={taskName}
                    onChange={(e) => setTaskName(e.target.value)}
                    autoFocus
                  />
                ) : (
                  task.taskName
                )} */}
                {task.taskName}
              </Typography>
              <ButtonGroup variant="text" aria-label="Basic button group">
                {editMode && task._id === editTaskId ? (
                  <></>
                ) : (
                  <Button
                    onClick={() => handleEditClick(task._id, task.taskName)}
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
          ))
        )}
      </Box>
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
