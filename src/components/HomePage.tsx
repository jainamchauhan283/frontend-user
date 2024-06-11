import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Fab,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const baseUrl = "http://localhost:5000/userData"; // BASEURL

interface User {
  _id: string;
  userName: string;
  userEmail: string;
  userMobile: string;
}

const HomePage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [deleteUserId, setDeleteUserId] = useState<string>("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${baseUrl}/get`);
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleAddUser = () => {
    navigate("/addUser", { replace: true });
  };

  const handleDelete = (id: string) => {
    setDeleteUserId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    axios
      .delete(`${baseUrl}/delete/${deleteUserId}`)
      .then((res) => {
        console.log("Deleted:", res.data);
        // Update the local data state after deletion
        setUsers((prevUsers) =>
          prevUsers.filter((user) => user._id !== deleteUserId)
        );
        setDeleteDialogOpen(false);
      })
      .catch((error) => {
        console.error("Error deleting user:", error);
      });
  };

  const cancelDelete = () => {
    setDeleteDialogOpen(false);
    setDeleteUserId("");
  };

  return (
    <>
      <AppBar position="static" color="inherit">
        <Toolbar>
          <Typography variant="h5">All Users</Typography>
        </Toolbar>
      </AppBar>
      <Box sx={{ m: 3 }}>
        <Grid container spacing={2}>
          {users.map((user) => (
            <Grid item key={user._id} xs={12} sm={6} md={4} lg={3}>
              <Box
                sx={{
                  border: "1px solid #3f51b5",
                  //   borderRadius: "8px",
                  transition: "transform 0.2s",
                  "&:hover": {
                    transform: "scale(1.05)",
                  },
                }}
              >
                <Card>
                  <CardContent>
                    <Typography variant="h6">{user.userName}</Typography>
                    <Typography variant="body1" color="text.secondary">
                      <strong>Email :</strong> {user.userEmail}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      <strong>Mobile :</strong> {user.userMobile}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button variant="outlined" fullWidth sx={{ mr: 1 }}>
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      sx={{ mr: 1 }}
                      fullWidth
                      onClick={() => handleDelete(user._id)}
                    >
                      Delete
                    </Button>
                  </CardActions>
                </Card>
              </Box>
            </Grid>
          ))}
        </Grid>
        <Fab
          color="primary"
          aria-label="add"
          sx={{ position: "fixed", bottom: 16, right: 16 }}
          onClick={handleAddUser}
        >
          <AddIcon />
        </Fab>
        <Dialog open={deleteDialogOpen} onClose={cancelDelete}>
          <DialogTitle>Delete User</DialogTitle>
          <DialogContent>
            <Typography variant="body1">
              Are you sure you want to delete this user?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={cancelDelete}>Cancel</Button>
            <Button onClick={confirmDelete} color="error">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
};

export default HomePage;
