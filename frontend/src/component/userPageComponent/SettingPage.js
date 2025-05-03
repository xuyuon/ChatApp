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


const SettingPage = ({ logInAs, setLogInAs }) => {
  // state variables
  const [licenseKey, setLicenseKey] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
          This is the profile settings content.
        </CardContent>
      </Card>
    </Box>
  );
}

export default SettingPage;