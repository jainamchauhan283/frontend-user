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
} from "@mui/material";
import axios from "axios";

const baseUrl = "http://localhost:5000/userData";

interface User {
  _id: string;
  userName: string;
  userEmail: string;
  userMobile: string;
}

const HomePage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

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
                    <Button variant="contained" fullWidth sx={{ mr: 1 }}>
                      Delete
                    </Button>
                  </CardActions>
                </Card>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
};

export default HomePage;
