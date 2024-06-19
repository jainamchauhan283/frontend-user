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
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { toast } from "react-hot-toast";

const baseUrl = "http://localhost:5000/users";

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
      const response = await axios.post(`${baseUrl}/login`, {
        userEmail: email,
        userPassword: password,
      });

      const { data } = response;

      if (data && data.user) {
        // Dispatch form data to Redux
        dispatch(
          setFormData({
            username: data.user.userName,
            email: data.user.userEmail,
            accessToken: data.accessToken,
          })
        );
        // Show success toast
        toast.success("Login successful", { duration: 1500 });
        setTimeout(() => {
          // Navigate to TaskPage
          navigate("/task", { replace: true });
        }, 1000);
      }
    } catch (error: any) {
      // Handle error response
      if (error.response && error.response.data) {
        setError("Invalid credentials");
        toast.error(error.response.data.error, { duration: 2000 });
      } else {
        setError("Something went wrong. Please try again.");
        console.error(error);
      }
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
        {/* <Typography variant="body2" color="error">
          {error}
        </Typography> */}
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
