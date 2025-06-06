import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  Snackbar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "../store/userSlice";

const Login = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "",
  });

  const navigate = useNavigate();

  const sendOtp = async () => {
    try {
      const response = await axios.post("/auth/login", { email });
      setNotification({
        open: true,
        message: response.data.message,
        severity: "success",
      });
      setOtpSent(true);
    } catch (error) {
      setNotification({
        open: true,
        message: error.response?.data?.message || "Error sending OTP",
        severity: "error",
      });
    }
  };

  const verifyOtp = async () => {
    try {
      const response = await axios.post("/auth/login", { email, otp });
      setNotification({
        open: true,
        message: response.data.message,
        severity: "success",
      });

      const { user, token } = response.data;

      dispatch(setUser({ ...user, token: token }));

      navigate("/"); // Redirect to home on success
    } catch (error) {
      setNotification({
        open: true,
        message: error.response?.data?.message || "OTP verification failed",
        severity: "error",
      });
    }
  };

  const closeNotification = () =>
    setNotification({ ...notification, open: false });

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #6B73FF 0%, #000DFF 74%)",
      }}
    >
      <Box
        sx={{
          width: 300,
          padding: 4,
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          borderRadius: 2,
          boxShadow: 3,
          textAlign: "center",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Login
        </Typography>

        {/* Email input */}
        <TextField
          fullWidth
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          margin="normal"
          disabled={otpSent}
        />

        {/* OTP input */}
        {otpSent && (
          <TextField
            fullWidth
            label="Enter OTP"
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            margin="normal"
          />
        )}

        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={otpSent ? verifyOtp : sendOtp}
          sx={{ mt: 2 }}
        >
          {otpSent ? "Login" : "Send OTP"}
        </Button>
      </Box>

      <Snackbar
        open={notification.open}
        autoHideDuration={3000}
        onClose={closeNotification}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={closeNotification}
          severity={notification.severity}
          variant="filled"
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Login;
