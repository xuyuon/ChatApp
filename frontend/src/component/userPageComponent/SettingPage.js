/*
Setting page component
This component is the settings page of the application. 
It allows users to update their username and password, and add a license key.
*/

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  Button,
  Box,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import DoneAllIcon from '@mui/icons-material/DoneAll';
import SettingsIcon from '@mui/icons-material/Settings';


import { styles } from "../../styling/userPage.styling";
import { axiosInstance } from "../../lib/axios";
import { checkAuth } from "../../lib/checkAuth";
import { usernameValidator, passwordValidator } from "../../lib/Validator";


const SettingPage = ({ logInAs, setLogInAs }) => {
  // state variables
  const [licenseKey, setLicenseKey] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  const validateUsernameUpdateForm = () => {
    console.log("validateForm");
    // Client-side validation
    let userValidateResult = usernameValidator(newUsername);
    if (userValidateResult !== "") {
      toast.error(userValidateResult);
      return false;
    }
    return true;
  }

  const validatePasswordUpdateForm = () => {
    console.log("validateForm");
    // Client-side validation
    let passwordValidateResult = passwordValidator(newPassword);
    if (passwordValidateResult !== "") {
      toast.error(passwordValidateResult);
      return false;
    }
    if (newPassword !== passwordConfirm) {
      toast.error("Passwords do not match.");
      return false;
    }
    return true;
  }
  

  const handleAddLicense = async () => {
    console.log("Add License");
    setLoading(true); // Set loading state to true
    try {
      if (logInAs === "licensed") {
        toast.error("You are already a licensed user"); // Show error message
        return;
      }

      const response = await axiosInstance.post("/auth/add-license", { licenseKey });
      if (response.status === 200) {
        toast.success("License added successfully! You are ready to explore the full functionality!"); // Show success message
        const userData = await checkAuth(); // Check user data after adding license
        setLogInAs(userData.userType); // Update the login role
        navigate("/userPage/userHome"); // Redirect to user home page
      }
    } catch (err) {
      console.error("Detailed error during add license:", err);
      toast.error(err.response.data.message); // Show error message
    } finally {
      setLoading(false); // Set loading state to false
    }
  };


  const handleUpdateUsername = async () => {
    console.log("Update Username");
    try {
      const response = await axiosInstance.put("/auth/update-username", { newUsername });
      if (response.status === 200) {
        toast.success("Username updated successfully!"); // Show success message
      }
    } catch (err) {
      console.error("Detailed error during update username:", err);
      toast.error(err.response.data.message); // Show error message
    }
  }

  const handleUpdatePassword = async () => {
    console.log("Update Password");
    try {
      const response = await axiosInstance.put("/auth/update-password", { newPassword, oldPassword });
      if (response.status === 200) {
        toast.success("Password updated successfully!"); // Show success message
        navigate("/userPage/userHome"); // Redirect to user home page
      }
    } catch (err) {
      console.error("Detailed error during update password:", err);
      toast.error(err.response.data.message); // Show error message
    } 
  }

  const handleUpdateUsernameSubmit = async (event) => {
    console.log("handleSubmit");
    event.preventDefault();
    setLoading(true); // Set loading state to true
    try {
      const success = validateUsernameUpdateForm();
      if (success === true) {
        handleUpdateUsername();
      }
    } finally {
      setLoading(false); // Set loading state to false
    }
  }

  const handlePasswordUpdateSubmit = async (event) => {
    console.log("handleSubmit");
    event.preventDefault();
    setLoading(true); // Set loading state to true
    try{
      const success = validatePasswordUpdateForm();
      if (success === true) {
        handleUpdatePassword();
      }
    } finally {
      setLoading(false); // Set loading state to false
    }
  }


  if (loading) {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
      >
        <CircularProgress size={80} />
      </Box>
    );
  }


  return (
    <Box>
      <Card sx={styles.card}>
        <CardHeader
          avatar={<DoneAllIcon sx={styles.icon} />}
          title="Licensing"
          sx={styles.cardHeader}
        />
        <CardContent>

          { logInAs === "unlicensed" && (
            <Box sx={styles.cardContentContainer}>
              <Typography variant="h7">Please fill in your License Key:</Typography>
              <Box sx={styles.inputContainer}>
                <TextField
                  label="License Key"
                  size="small"
                  variant="outlined"
                  fullWidth
                  sx={styles.textField}
                  value={licenseKey}
                  onChange={(e) => setLicenseKey(e.target.value)}
                />
                <Button variant="contained" sx={styles.button} onClick={handleAddLicense}>
                  Register
                </Button>
              </Box>
            </Box>
          )}
          { logInAs === "licensed" && (
            <Box sx={styles.cardContentContainer}>
              <Typography variant="h7">You are logged in as a licensed user</Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      <Card sx={styles.card}>
        <CardHeader
          avatar={<SettingsIcon sx={styles.icon} />}
          title="Profile Settings"
          sx={styles.cardHeader}
        />
        <CardContent>
          <Box sx={styles.cardContentContainer}>
            <Typography variant="h6">Update Username</Typography>
            <Typography variant="h7">Enter your new username: </Typography>
            <Box sx={styles.inputContainer}>
              <TextField
                label="New Username"
                size="small"
                variant="outlined"
                fullWidth
                sx={styles.textField}
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
              />
              <Button variant="contained" sx={styles.button} onClick={handleUpdateUsernameSubmit}>
                Update
              </Button>
            </Box>
          </Box>

          <Box sx={styles.cardContentContainer}>
            <Typography variant="h6">Update Password</Typography>
            <Typography variant="h7">Enter your old password: </Typography>
            <Box sx={styles.inputContainer}>
              <TextField
                label="Old Password"
                size="small"
                variant="outlined"
                fullWidth
                type="password"
                sx={styles.textField}
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
            </Box>
            <Typography variant="h7">Enter your new password: </Typography>
            <Box sx={styles.inputContainer}>
              <TextField
                label="New Password"
                size="small"
                variant="outlined"
                fullWidth
                type="password"
                sx={styles.textField}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </Box>
            <Typography variant="h7">Confirm your new password: </Typography>
            <Box sx={styles.inputContainer}>
              <TextField
                label="Confirm Password"
                size="small"
                variant="outlined"
                fullWidth
                type="password"
                sx={styles.textField}
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
              />
            </Box>
            <Button variant="contained" sx={styles.button} onClick={handlePasswordUpdateSubmit}>
              Update
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default SettingPage;