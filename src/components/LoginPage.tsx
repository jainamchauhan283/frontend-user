import {
  Box,
  Button,
  Card,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { ChangeEvent, useState } from "react";
import { useDispatch } from "react-redux";
import { setFormData } from "../redux/formSlice";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { toast } from "react-hot-toast";
import { loginUser } from "./apiserver";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
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
    if (!email || !password) {
      setEmailError(!email ? "Please enter an email" : "");
      setPasswordError(!password ? "Please enter a password" : "");
      return;
    }

    try {
      const payload = { email, password };
      const { status, data } = await loginUser(payload);

      if (status && data && data.user) {
        // Dispatch form data to Redux or handle data as needed
        dispatch(
          setFormData({
            username: data.user.userName,
            email: data.user.userEmail,
            accessToken: data.accessToken,
          })
        );
        toast.success("Login successful", { duration: 1500 }); // Show success toast
        setTimeout(() => {
          // Navigate to TaskPage
          navigate("/task", { replace: true });
        }, 1000);
      } else {
        // Handle unsuccessful login
        setError("Invalid credentials");
      }
    } catch (error: any) {
      // setError("Something went wrong. Please try again.");
      setError(error.message);
    }
  };

  const handleRegister = () => {
    navigate("/register", { replace: true });
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
          Login
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
          type={showPassword ? "text" : "password"}
          fullWidth
          margin="normal"
          value={password}
          onChange={onChangePassword}
          InputProps={{
            // Use InputProps to include endAdornment
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
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
        <Box mt={1}>
          <span>Don't have an account? </span>
          <Button onClick={handleRegister}>Register</Button>
        </Box>
      </Card>
    </Box>
  );
};

export default LoginPage;
