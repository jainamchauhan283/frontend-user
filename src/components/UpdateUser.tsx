import React, { useState, useEffect } from "react";
import { Box, Button, Card, TextField, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const UpdateUser: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState({
    _id: "",
    userName: "",
    userEmail: "",
    userMobile: "",
  });

  useEffect(() => {
    if (location.state && location.state.user) {
      setUser(location.state.user);
    }
  }, [location.state]);

  const handleCancel = () => {
    navigate("/", { replace: true });
  };

  const handleUpdate = () => {
    // Perform update logic here
    // For demonstration, let's assume we're updating the user with an API call
    axios
      .patch(`http://localhost:5000/userData/patch/${user._id}`, user)
      .then((res) => {
        console.log("User updated:", res.data);
        navigate("/", { replace: true });
      })
      .catch((error) => {
        console.error("Error updating user:", error);
        // Handle error
      });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Box
      sx={{
        m: 5,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Card
        variant="outlined"
        sx={{
          width: "100%",
          maxWidth: 400,
          boxShadow: 3,
          p: 2,
        }}
      >
        <Typography variant="h4" align="center">
          Update User
        </Typography>
        <TextField
          label="Username"
          type="text"
          autoComplete="userName"
          fullWidth
          margin="normal"
          name="userName"
          value={user.userName}
          onChange={handleChange}
        />
        <TextField
          label="Email"
          type="email"
          autoComplete="email"
          fullWidth
          margin="normal"
          name="userEmail"
          value={user.userEmail}
          onChange={handleChange}
        />
        <TextField
          label="Mobile"
          type="number"
          autoComplete="mobile"
          fullWidth
          margin="normal"
          name="userMobile"
          value={user.userMobile}
          onChange={handleChange}
        />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 2,
          }}
        >
          <Button
            variant="outlined"
            fullWidth
            sx={{ width: "calc(50% - 8px)" }}
            color="error"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            fullWidth
            sx={{ width: "calc(50% - 8px)" }}
            color="primary"
            onClick={handleUpdate}
          >
            Update
          </Button>
        </Box>
      </Card>
    </Box>
  );
};

export default UpdateUser;
