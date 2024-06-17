import {
  AppBar,
  Box,
  Button,
  Card,
  CircularProgress,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const baseUrl = "http://localhost:5000";

const TaskPage: React.FC = () => {
  const navigate = useNavigate();
  const [taskName, setTaskName] = useState("");
  const [error, setError] = useState("");
  const [userName, setUserName] = useState("");
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const userName = localStorage.getItem("userName");
    if (userName) {
      setUserName(userName);
      fetchUserTasks(); // Fetch tasks when component mounts
    }
  }, []);

  const fetchUserTasks = async () => {
    try {
      setLoading(true);
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        setError("Access token not found");
        return;
      }

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

  const handleAddTask = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        setError("Access token not found");
        return;
      }

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
      console.log(data);

      // Clear the task input field
      setTaskName("");

      // Update tasks state to reflect new task addition
      setTasks([...tasks, data.task]);
    } catch (error) {
      setError("Failed to add task");
      console.error(error);
    }
  };

  const handleLogout = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        setError("Access token not found");
        return;
      }

      await axios.post(
        `${baseUrl}/userData/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // Clear local storage items
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userName");

      navigate("/loginPage", { replace: true });
      console.log("Logout successful");
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
        <Box
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
        </Box>
        <Typography variant="body2" color="error">
          {error}
        </Typography>

        {loading ? (
          <CircularProgress sx={{ mt: 3 }} />
        ) : (
          tasks.map((task) => (
            <Card
              key={task._id}
              variant="outlined"
              sx={{ mt: 1, p: 1, width: "100%" }}
            >
              <Typography variant="h6">{task.taskName}</Typography>
            </Card>
          ))
        )}
      </Box>
    </>
  );
};

export default TaskPage;
