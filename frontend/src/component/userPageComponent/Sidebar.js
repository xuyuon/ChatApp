import "./sidebar.css";
import SidebarButton from "./SidebarButton";

import HomeIcon from "@mui/icons-material/Home";
import PeopleIcon from "@mui/icons-material/People";
import ChatIcon from "@mui/icons-material/Chat";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import DoneAllIcon from '@mui/icons-material/DoneAll';

import { toast } from "react-hot-toast";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, TextField } from "@mui/material";

import { axiosInstance } from "../../lib/axios";
import { checkAuth } from "../../lib/checkAuth";




function Sidebar({ LogInAs, setLogInAs }) {
  const [clickedButton, setClickedButton] = useState("Home"); // Record which button is clicked
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false); // State for logout confirmation dialog
  const [licenseKey, setLicenseKey] = useState(""); // State for license key input
  const [openLicenseDialog, setOpenLicenseDialog] = useState(false); // State for license dialog
  const navigate = useNavigate();


  const handleAddLicense = async () => {
    console.log("Add License");
    try {
      if (LogInAs === "licensed") {
        toast.error("You are already a licensed user"); // Show error message
        return;
      }

      const response = await axiosInstance.post("/auth/add-license", { licenseKey });
      if (response.status === 200) {
        toast.success("License added successfully! You are ready to explore the full functionality!"); // Show success message
        const userData = await checkAuth(); // Check user data after adding license
        setLogInAs(userData.userType); // Update the login role
      }
    } catch (err) {
      console.error("Detailed error during add license:", err);
      toast.error(err.response.data.message); // Show error message
    }
  };


  const handleLogout = async () => {
    console.log("Initiating logout");

    try {
      const response = await axiosInstance.post("/auth/logout", {});
      console.log("Logout response:", response);
      const data = response.data;
      console.log("Logout data:", data);
      if (response.status === 200) {
        sessionStorage.removeItem("username"); // Clear the session storage
        console.log(LogInAs);
        setLogInAs(""); // Clear the login role
        setClickedButton(""); // Reset the selected button
        toast.success("Logout successful"); // Show success message
        navigate("/"); // Redirect to the login page
      } else {
        toast.error(data.message || "Logout failed"); // Show error message
      }
    } catch (err) {
      console.error("Detailed error during logout:", err);
      toast.error(err.response.data.message); // Show error message
    } finally {
      setOpenLogoutDialog(false); // Close the dialog
    }
  };

  return (
    <div className="sidebar">
      <SidebarButton
        text="Home"
        Icon={HomeIcon}
        to="/userHome"
        selected={clickedButton === "Home"}
        onClick={() => setClickedButton("Home")}
      />
      <SidebarButton
        text="Profile"
        Icon={AccountCircleIcon}
        to="/my profile"
        selected={clickedButton === "Profile"}
        onClick={() => setClickedButton("Profile")}
      />
      <SidebarButton
        text="Friends"
        Icon={PeopleIcon}
        to="/friends"
        selected={clickedButton === "Friends"}
        onClick={() => setClickedButton("Friends")}
      />
      <SidebarButton
        text="Chat"
        Icon={ChatIcon}
        to="/chat"
        selected={clickedButton === "Chat"}
        onClick={() => setClickedButton("Chat")}
      />
      <SidebarButton
        text="Add License"
        Icon={DoneAllIcon}
        onClick={(e) => {
          e.preventDefault(); // Prevent the Link from navigating immediately
          setOpenLicenseDialog(true); // Call the function to add license
        }}
      />
      <SidebarButton
        text="Sign out"
        Icon={ExitToAppIcon}
        to="/"
        onClick={(e) => {
          e.preventDefault(); // Prevent the Link from navigating immediately
          setOpenLogoutDialog(true); // Open the confirmation dialog
        }}
      />

      {/* Logout Confirmation Dialog */}
      <Dialog open={openLogoutDialog} onClose={() => setOpenLogoutDialog(false)}>
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to sign out?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenLogoutDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleLogout} color="secondary">
            Sign Out
          </Button>
        </DialogActions>
      </Dialog>

      {/* License Key Dialog */}
      <Dialog open={openLicenseDialog} onClose={() => setOpenLicenseDialog(false)}>
        <DialogTitle>Add License Key to Unlock Full Function</DialogTitle>
        <DialogContent>
          <Typography>Please enter your license key:</Typography>
          <TextField
            value={licenseKey}
            onChange={(e) => setLicenseKey(e.target.value)}
            fullWidth
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenLicenseDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddLicense} color="secondary">
            Add License
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Sidebar;