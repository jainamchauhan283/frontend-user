import React, { useState, useEffect } from "react";
// Ex. Libraries
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
    userImage: "",
  });

  const [image, setImage] = useState<File | null>(null);

  useEffect(() => {
    if (location.state && location.state.user) {
      setUser(location.state.user);
    }
  }, [location.state]);

  const handleCancel = () => {
    navigate("/", { replace: true });
  };

  const handleUpdate = () => {
    const formData = new FormData();
    formData.append("userName", user.userName);
    formData.append("userEmail", user.userEmail);
    formData.append("userMobile", user.userMobile);
    if (image) {
      formData.append("userImage", image);
    }
    // Perform update logic here
    // For demonstration, let's assume we're updating the user with an API call
    axios
      .patch(`http://localhost:5000/userData/patch/${user._id}`, formData)
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const selectedFile = files[0];
      setImage(selectedFile);
    }
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
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ marginTop: "10px" }}
        />
        <img
          src={`http://localhost:5000/files/${user.userImage}`}
          alt={`${user.userName}'s profile`}
          style={{
            maxWidth: "100%",
            maxHeight: "150px",
            objectFit: "cover",
            marginTop: "10px",
          }}
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
