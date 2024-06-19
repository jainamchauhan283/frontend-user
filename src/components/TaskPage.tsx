import React, { useEffect, useState } from "react";
import {
  AppBar,
  Box,
  Button,
  ButtonGroup,
  Card,
  CircularProgress,
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
// import { ToastContainer } from "react-toastify";
import { Toaster, toast } from "react-hot-toast";

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
      setLoading(false);
    } catch (error) {
      setError("Failed to fetch tasks");
      console.error(error);
      setLoading(false);
    }
  };

  const handleAddTask = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
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
        // Clear the task input field
        setTaskName("");

        // Update tasks state to reflect new task addition
        setTasks([...tasks, data.task]);

        // Show success toast
        toast.success("Task added successfully", { duration: 2000 });
      }
    } catch (error) {
      setError("Please enter a Task");
      console.error(error);
    } finally {
      // Reset loading state
      setLoading(false);
    }
  };

  const handleEditClick = (taskId: string, currentTaskName: string) => {
    setEditTaskId(taskId); // Set the task ID being edited
    setTaskName(currentTaskName); // Set the current task name in the input field
    setEditMode(true); // Enable edit mode
  };

  const handleDoneEdit = async () => {
    try {
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

      // Refetch tasks to update the list
      fetchUserTasks();
    } catch (error) {
      setError("Failed to update task");
      console.error(error);
    }
  };

  const handleCancelEdit = () => {
    setTaskName("");
    setEditTaskId("");
    setEditMode(false);
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await axios.delete(`${baseUrl}/api/delete/${taskId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Remove the deleted task from the tasks array
      const updatedTasks = tasks.filter((task) => task._id !== taskId);
      setTasks(updatedTasks);
      // Show delete toast
      toast.success("Delete successful", { duration: 2000 });
    } catch (error) {
      setError("Failed to delete task");
      console.error(error);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        `${baseUrl}/users/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // Clear Redux form data
      dispatch(clearFormData());

      // Navigate to login page
      navigate("/login", { replace: true });
    } catch (error) {
      setError("Failed to logout");
      console.error(error);
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
        <Toaster position="top-right" />
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
        <Typography variant="body2" color="error" sx={{ mt: 1 }}>
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
              {/* </Typography> */}
            </Card>
          ))
        )}
      </Box>
    </>
  );
};

export default TaskPage;
