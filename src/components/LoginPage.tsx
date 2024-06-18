// LoginPage.tsx
import { Box, Button, Card, TextField, Typography } from "@mui/material";
import { ChangeEvent, useState } from "react";
import { useDispatch } from "react-redux";
import { setFormData } from "../redux/formSlice";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const baseUrl = "http://localhost:5000/users";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [error, setError] = useState("");

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

  const onChangePassword = (event: ChangeEvent<HTMLInputElement>) => {
    const newPassword = event.target.value;
    setPassword(newPassword);
    if (!newPassword) {
      setPasswordError("Please enter a password");
    } else {
      setPasswordError("");
    }
  };

  const handleLogin = async () => {
    if (!email) {
      setEmailError("Please enter an email");
    } else {
      setEmailError("");
    }

    if (!password) {
      setPasswordError("Please enter a password");
    } else {
      setPasswordError("");
    }

    if (email && password) {
      try {
        const response = await axios.post(`${baseUrl}/login`, {
          userEmail: email,
          userPassword: password,
        });
        const data = response.data;

        // Dispatch form data to Redux
        dispatch(
          setFormData({
            username: data.user.userName,
            email: data.user.userEmail,
            accessToken: data.accessToken,
          })
        );

        // Navigate to TaskPage
        navigate("/taskpage", { replace: true });
      } catch (error) {
        setError("Invalid credentials");
        console.error(error);
      }
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
        <Typography variant="h4" align="center" gutterBottom>
          Login User
        </Typography>
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
          <Typography variant="body2" color="error" gutterBottom>
            {emailError}
          </Typography>
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
          <Typography variant="body2" color="error" gutterBottom>
            {passwordError}
          </Typography>
        )}
        <Typography variant="body2" color="error">
          {error}
        </Typography>
        <Button
          variant="contained"
          fullWidth
          color="primary"
          sx={{ marginTop: 2 }}
          onClick={handleLogin}
        >
          Login
        </Button>
      </Card>
    </Box>
  );
};

export default LoginPage;
