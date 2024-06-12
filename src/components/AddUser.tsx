import React, { useState, ChangeEvent } from "react";
import { Box, Card, TextField, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const baseUrl = "http://localhost:5000/userData"; // Base URL declaration

const AddUser: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const onChangeName = (event: ChangeEvent<HTMLInputElement>) => {
    const newName = event.target.value;
    setName(newName);
    if (!newName) {
      setNameError("Please enter a username");
    } else {
      setNameError("");
    }
  };

  const onChangeEmail = (event: ChangeEvent<HTMLInputElement>) => {
    const newEmail = event.target.value;
    setEmail(newEmail);
    if (!newEmail) {
      setEmailError("Please enter an email address");
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(newEmail)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  const onChangeMobile = (event: ChangeEvent<HTMLInputElement>) => {
    const newMobile = event.target.value;
    setMobile(newMobile);
    if (!newMobile) {
      setMobileError("Please enter a mobile number");
    } else {
      setMobileError("");
    }
  };

  const onChangePassword = (event: ChangeEvent<HTMLInputElement>) => {
    const newPassword = event.target.value;
    setPassword(newPassword);
    if (!newPassword) {
      setPasswordError("Please enter a password");
    } else {
      setPasswordError("");
    }
  };

  const onChangeConfirmPassword = (event: ChangeEvent<HTMLInputElement>) => {
    const newConfirmPassword = event.target.value;
    setConfirmPassword(newConfirmPassword);
    if (!newConfirmPassword) {
      setConfirmPasswordError("Please confirm your password");
    } else if (newConfirmPassword !== password) {
      setConfirmPasswordError("Passwords do not match");
    } else {
      setConfirmPasswordError("");
    }
  };

  const onChangeFile = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const selectedFile = files[0];
      setImage(selectedFile);
      console.log(selectedFile);
    }
  };

  const handleAddUser = async () => {
    if (!name) {
      setNameError("Please enter a username");
    } else {
      setNameError("");
    }

    if (!email) {
      setEmailError("Please enter an email");
    } else {
      setEmailError("");
    }

    if (!mobile) {
      setMobileError("Please enter a mobile number");
    } else {
      setMobileError("");
    }

    if (!password) {
      setPasswordError("Please enter a password");
    } else {
      setPasswordError("");
    }

    if (!confirmPassword) {
      setConfirmPasswordError("Please confirm your password");
    } else if (confirmPassword !== password) {
      setConfirmPasswordError("Passwords do not match");
    } else {
      setConfirmPasswordError("");
    }

    const formData = new FormData();
    formData.append("userName", name);
    formData.append("userEmail", email);
    formData.append("userMobile", mobile);
    formData.append("userPassword", password);
    if (image) {
      formData.append("userImage", image);
    }

    axios
      .post(
        `${baseUrl}/post`,
        formData
        //   {
        //   userName: name,
        //   userEmail: email,
        //   userMobile: mobile,
        //   userPassword: password,
        //   userImage: image,
        // }
      )
      .then((res) => {
        console.log("User added:", res.data);
        navigate("/", { replace: true });
      })
      .catch((error) => {
        console.error("Error adding data", error);
      });
  };

  const handleCancel = () => {
    navigate("/", { replace: true });
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
          Add User
        </Typography>
        <TextField
          label="Username"
          type="text"
          autoComplete="userName"
          fullWidth
          margin="normal"
          value={name}
          onChange={onChangeName}
        />
        {nameError && (
          <span style={{ color: "red", marginTop: 4 }}>{nameError}</span>
        )}
        <TextField
          label="Email"
          type="email"
          autoComplete="email"
          fullWidth
          margin="normal"
          value={email}
          onChange={onChangeEmail}
        />
        {emailError && (
          <span style={{ color: "red", marginTop: 4 }}>{emailError}</span>
        )}
        <TextField
          label="Mobile"
          type="number"
          autoComplete="mobile"
          fullWidth
          margin="normal"
          value={mobile}
          onChange={onChangeMobile}
        />
        {mobileError && (
          <span style={{ color: "red", marginTop: 4 }}>{mobileError}</span>
        )}
        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={onChangePassword}
        />
        {passwordError && (
          <span style={{ color: "red", marginTop: 4 }}>{passwordError}</span>
        )}
        <TextField
          label="Confirm Password"
          type="password"
          fullWidth
          margin="normal"
          value={confirmPassword}
          onChange={onChangeConfirmPassword}
        />
        {confirmPasswordError && (
          <span style={{ color: "red", marginTop: 4 }}>
            {confirmPasswordError}
          </span>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={onChangeFile}
          style={{ marginTop: "10px" }}
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
            onClick={handleAddUser}
          >
            Add
          </Button>
        </Box>
      </Card>
    </Box>
  );
};

export default AddUser;
