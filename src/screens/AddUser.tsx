import React, { useState, ChangeEvent, useEffect } from "react";
import { Box, Card, TextField, Button, Typography, Input } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { addUser } from "../services/apiServices";
import {
  showSuccessToast,
  showErrorToast,
  logToConsole,
} from "../utils/utilities";
import { MESSAGES } from "../utils/constants";

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
  const [imageError, setImageError] = useState("");
  const [error, setError] = useState("");
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const onChangeName = (event: ChangeEvent<HTMLInputElement>) => {
    const newName = event.target.value;
    setName(newName);
    if (!newName) {
      setNameError(MESSAGES.ENTER_USERNAME);
    } else {
      setNameError("");
    }
  };

  const onChangeEmail = (event: ChangeEvent<HTMLInputElement>) => {
    const newEmail = event.target.value;
    setEmail(newEmail);
    if (!newEmail) {
      setEmailError(MESSAGES.ENTER_EMAIL);
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(newEmail)) {
      setEmailError(MESSAGES.VALID_EMAIL);
    } else {
      setEmailError("");
    }
  };

  const onChangeMobile = (event: ChangeEvent<HTMLInputElement>) => {
    const newMobile = event.target.value;
    setMobile(newMobile);
    if (!newMobile) {
      setMobileError(MESSAGES.ENTER_MOBILE);
    } else {
      setMobileError("");
    }
  };

  const onChangePassword = (event: ChangeEvent<HTMLInputElement>) => {
    const newPassword = event.target.value;
    setPassword(newPassword);
    if (!newPassword) {
      setPasswordError(MESSAGES.ENTER_PASSWORD);
    } else {
      setPasswordError("");
    }
  };

  const onChangeConfirmPassword = (event: ChangeEvent<HTMLInputElement>) => {
    const newConfirmPassword = event.target.value;
    setConfirmPassword(newConfirmPassword);
    if (!newConfirmPassword) {
      setConfirmPasswordError(MESSAGES.CONFIRM_PASSWORD);
    } else if (newConfirmPassword !== password) {
      setConfirmPasswordError(MESSAGES.PASSWORDS_DO_NOT_MATCH);
    } else {
      setConfirmPasswordError("");
    }
  };

  const onChangeFile = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const selectedFile = files[0];
      setImage(selectedFile);
      setImageError("");
    }
  };

  const handleAddUser = async () => {
    if (!isOnline) {
      showErrorToast(MESSAGES.OFFLINE_ERROR);
      return;
    }

    if (!name) {
      setNameError(MESSAGES.ENTER_USERNAME);
    } else {
      setNameError("");
    }

    if (!email) {
      setEmailError(MESSAGES.ENTER_EMAIL);
    } else {
      setEmailError("");
    }

    if (!mobile) {
      setMobileError(MESSAGES.ENTER_MOBILE);
    } else {
      setMobileError("");
    }

    if (!password) {
      setPasswordError(MESSAGES.ENTER_PASSWORD);
    } else {
      setPasswordError("");
    }

    if (!confirmPassword) {
      setConfirmPasswordError(MESSAGES.CONFIRM_PASSWORD);
    } else if (confirmPassword !== password) {
      setConfirmPasswordError(MESSAGES.PASSWORDS_DO_NOT_MATCH);
    } else {
      setConfirmPasswordError("");
    }

    if (!image) {
      setImageError(MESSAGES.SELECT_IMAGE);
    } else {
      setImageError("");
    }

    const formData = new FormData();
    formData.append("userName", name);
    formData.append("userEmail", email);
    formData.append("userMobile", mobile);
    formData.append("userPassword", password);
    if (image) {
      formData.append("userImage", image);
    }

    try {
      const { status, data, error } = await addUser(formData);

      if (status && data) {
        logToConsole("User added:", data);
        // console.log("User added:", data);
        showSuccessToast(MESSAGES.REGISTRATION_SUCCESS);
        navigate("/login", { replace: true });
      } else {
        if (error === "This Email already exists") {
          setEmailError(MESSAGES.EMAIL_EXISTS);
        } else {
          logToConsole("Error adding data", error);
          setError(MESSAGES.SOMETHING_WENT_WRONG);
        }
      }
    } catch (error: any) {
      logToConsole("Error adding data", error);
      // setError("Something went wrong. Please try again.");
      setError(error.message);
    }
  };

  // const handleCancel = () => {
  //   navigate("/", { replace: true });
  // };

  const handleLogin = () => {
    navigate("/login", { replace: true });
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
      {" "}
      {!isOnline && (
        <Typography color="error">
          You are offline. Some functionalities may not be available.
        </Typography>
      )}
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
          Register
        </Typography>
        <TextField
          label="Username"
          type="text"
          autoComplete="userName"
          fullWidth
          margin="dense"
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
          margin="dense"
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
          margin="dense"
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
          margin="dense"
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
          margin="dense"
          value={confirmPassword}
          onChange={onChangeConfirmPassword}
        />
        {confirmPasswordError && (
          <span style={{ color: "red", marginTop: 4 }}>
            {confirmPasswordError}
          </span>
        )}
        <Input
          fullWidth
          type="file"
          sx={{
            my: 1,
          }}
          inputProps={{
            accept: "image/*",
          }}
          onChange={onChangeFile}
        />
        {imageError && (
          <span style={{ color: "red", marginTop: 4 }}>{imageError}</span>
        )}
        {error && <Typography color="error">{error}</Typography>}
        {/* <Box
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
        </Box> */}
        <Button
          sx={{
            mt: 2,
          }}
          variant="contained"
          fullWidth
          color="primary"
          onClick={handleAddUser}
        >
          Register
        </Button>
        <Box mt={1}>
          <span>Already have an account? </span>
          <Button onClick={handleLogin}>Login</Button>
        </Box>
      </Card>
    </Box>
  );
};

export default AddUser;
