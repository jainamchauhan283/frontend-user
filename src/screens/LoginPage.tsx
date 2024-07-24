// Ex. Libraries
import {
  Box,
  Button,
  Card,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { Visibility, VisibilityOff } from "@mui/icons-material";
// Redux
import { setFormData } from "../redux/reducer";
// Services
import { loginUser } from "../services/apiServices";
// Utils
import { MESSAGES } from "../utils/constants";
import { showSuccessToast, showErrorToast } from "../utils/utilities";
import { getErrorMessage } from "../utils/errorUtils";

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
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [loading, setLoading] = useState(false);

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

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
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

  const onChangePassword = (event: ChangeEvent<HTMLInputElement>) => {
    const newPassword = event.target.value;
    setPassword(newPassword);
    if (!newPassword) {
      setPasswordError(MESSAGES.ENTER_PASSWORD);
    } else {
      setPasswordError("");
    }
  };

  // const handleLogin = async () => {
  //   if (!isOnline) {
  //     showErrorToast(MESSAGES.OFFLINE_ERROR); // Show no internet toast
  //     return;
  //   }

  //   if (!email || !password) {
  //     setEmailError(!email ? MESSAGES.ENTER_EMAIL : "");
  //     setPasswordError(!password ? MESSAGES.ENTER_PASSWORD : "");
  //     return;
  //   }

  //   setLoading(true);

  //   try {
  //     const payload = { email, password };
  //     const { status, data } = await loginUser(payload);

  //     if (status && data && data.user) {
  //       // Dispatch form data to Redux or handle data as needed
  //       dispatch(
  //         setFormData({
  //           username: data.user.userName,
  //           email: data.user.userEmail,
  //           accessToken: data.accessToken,
  //         })
  //       );

  //       showSuccessToast(MESSAGES.LOGIN_SUCCESS); // Show success toast
  //       setTimeout(() => {
  //         // Navigate to TaskPage
  //         navigate("/task", { replace: true });
  //         setLoading(false); // Stop loading after navigation
  //       }, 1000);
  //     } else {
  //       // Handle unsuccessful login
  //       setError(MESSAGES.INVALID_CREDENTIAL);
  //       setLoading(false); // Stop loading on error
  //     }
  //   } catch (error) {
  //     setError(getErrorMessage(error));
  //     setLoading(false); // Stop loading on error
  //   }
  // };

  const handleLogin = async () => {
    if (!isOnline) {
      showErrorToast(MESSAGES.OFFLINE_ERROR);
      return;
    }

    if (!email || !password) {
      setEmailError(!email ? MESSAGES.ENTER_EMAIL : "");
      setPasswordError(!password ? MESSAGES.ENTER_PASSWORD : "");
      return;
    }

    setLoading(true);

    try {
      const payload = { email, password };
      const { status, data } = await loginUser(payload);

      if (status && data && data.user) {
        const { user, accessToken } = data;

        // Dispatch form data to Redux
        dispatch(
          setFormData({
            username: user.userName,
            email: user.userEmail,
            accessToken: accessToken,
            userId: user._id, // Store user ID
          })
        );

        showSuccessToast(MESSAGES.LOGIN_SUCCESS);

        setTimeout(() => {
          // Navigate to TaskPage with userId as state
          navigate("/task", { replace: true, state: { userId: user._id } });
          setLoading(false);
        }, 1000);
      } else {
        setError(MESSAGES.INVALID_CREDENTIAL);
        setLoading(false);
      }
    } catch (error) {
      setError(getErrorMessage(error));
      setLoading(false);
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
          disabled={loading} // Disable button when loading
        >
          {loading ? <CircularProgress size={24} /> : "Login"}
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
