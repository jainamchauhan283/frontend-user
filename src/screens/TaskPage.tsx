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
import { clearFormData } from "../redux/reducer";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import DoneIcon from "@mui/icons-material/Done";
import {
  addTask,
  deleteTask,
  fetchTasks,
  logoutUser,
  updateTask,
} from "../services/apiServices";
import { MESSAGES } from "../utils/constants";
import { showSuccessToast, showErrorToast } from "../utils/utilities";

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
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) {
      return error.message;
    }
    return String(error);
  };

  useEffect(() => {
    if (!accessToken) {
      navigate("/login", { replace: true });
    } else {
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
  // eslint-disable-next-line
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
    } catch (error: unknown) {
      setError(getErrorMessage(error));
      console.error("Failed to fetch tasks:", error);
    }
    setLoading(false);
  };

  const handleAddTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isOnline) {
      showErrorToast(MESSAGES.OFFLINE_ADD_TASK_ERROR);
      return;
    }
    if (taskName.trim() === "") {
      setError(MESSAGES.ENTER_TASK);
      setLoading(false);
      return;
    }
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
    const payload = {
      taskName,
      accessToken,
    };

    try {
      // const { status, data } = await addTask(payload);
      // if (status) {
      //   setTasks([...tasks, data.data.task]);
      //   setTaskName("");
      //   showSuccessToast(MESSAGES.ADD_TASK_SUCCESS);
      // } else {
      //   setError("Failed to add task");
      //   showErrorToast(MESSAGES.ADD_TASK_FAILURE);
      // }
      const { status, data } = await addTask(payload);
      if (status && data) {
        setTasks([...tasks, data.data]);
        setTaskName("");
        showSuccessToast(MESSAGES.ADD_TASK_SUCCESS);
      } else {
        setError("Failed to add task");
        showErrorToast(MESSAGES.ADD_TASK_FAILURE);
      }
    } catch (error: unknown) {
      setError(getErrorMessage(error));
      showErrorToast(MESSAGES.ADD_TASK_FAILURE);
      console.error(error);
    }
    setLoading(false);
  };

  const handleEditClick = (taskId: string, currentTaskName: string) => {
    setEditTaskId(taskId); // Set the task ID being edited
    setTaskName(currentTaskName); // Set the current task name in the input field
    setEditMode(true); // Enable edit mode
  };

  const handleDoneEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const payload = {
      taskId: editTaskId,
      taskName: taskName,
      accessToken: accessToken,
    };
    try {
      const { status, data } = await updateTask(payload);
      if (status && data) {
        setEditMode(false);
        setEditTaskId("");
        setTaskName("");
        fetchUserTasks();
        showSuccessToast(MESSAGES.UPDATE_TASK_SUCCESS);
      } else {
        setError("Failed to update task");
        showErrorToast(MESSAGES.UPDATE_TASK_FAILURE);
      }
    } catch (error: unknown) {
      setError(getErrorMessage(error));
      showErrorToast(MESSAGES.UPDATE_TASK_FAILURE);
      console.error(error);
    }
    setLoading(false);
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
    setLoading(true);
    const payload = {
      taskId: deleteTaskId,
      accessToken: accessToken,
    };
    try {
      const { status, data } = await deleteTask(payload);
      if (status && data) {
        setTasks(tasks.filter((task) => task._id !== deleteTaskId));
        setDeleteDialogOpen(false);
        showSuccessToast(MESSAGES.DELETE_TASK_SUCCESS);
      } else {
        setError("Failed to delete task");
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
        dispatch(clearFormData());
        showSuccessToast(MESSAGES.LOG_OUT_SUCCESS);
        navigate("/login", { replace: true });
      }
    } catch (error) {
      showErrorToast(MESSAGES.LOG_OUT_FAILURE);
      console.error(error);
    }
    setLoading(false);
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
          onSubmit={editMode ? handleDoneEdit : handleAddTask}
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
          <IconButton
            type="submit"
            color="primary"
            sx={{ p: "10px" }}
            aria-label={editMode ? "done-edit" : "add-task"}
          >
            {editMode ? <DoneIcon /> : <AddIcon />}
          </IconButton>
        </Paper>

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
          tasks.map((task) => (
            <Card
              key={task._id}
              variant="outlined"
              sx={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                p: 1,
                m: 1,
              }}
            >
              <Typography variant="h6" sx={{ ml: 1, flex: 1 }}>
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
        ) : (
          <Typography variant="body1" sx={{ mt: 3 }}>
            No tasks available.
          </Typography>
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
