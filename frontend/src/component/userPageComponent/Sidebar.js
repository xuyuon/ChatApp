/**
 * Sidebar navigation component
 * Provides navigation buttons for accessing different pages and handles user logout with confirmation dialogs.
 */

import "./sidebar.css";
import SidebarButton from "./SidebarButton";

import HomeIcon from "@mui/icons-material/Home";
import PeopleIcon from "@mui/icons-material/People";
import ChatIcon from "@mui/icons-material/Chat";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SettingsIcon from '@mui/icons-material/Settings';

import { toast } from "react-hot-toast";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, TextField } from "@mui/material";

import { axiosInstance } from "../../lib/axios";




function Sidebar({ logInAs, setLogInAs }) {
  const [clickedButton, setClickedButton] = useState("Home"); // Record which button is clicked
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false); // State for logout confirmation dialog
  const [openUnlicensedDialog, setOpenUnlicensedDialog] = useState(false); // State for unlicensed dialog
  const navigate = useNavigate();


  const handleLogout = async () => {
    console.log("Initiating logout");

    try {
      const response = await axiosInstance.post("/auth/logout", {});
      const data = response.data;
      if (response.status === 200) {
        sessionStorage.removeItem("username"); // Clear the session storage
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
        to="/userPage/home"
        selected={clickedButton === "Home"}
        onClick={() => setClickedButton("Home")}
      />
      <SidebarButton
        text="Friends"
        Icon={PeopleIcon}
        to="/userPage/friends"
        selected={clickedButton === "Friends"}
        onClick={(e) => {
          e.preventDefault(); // Prevent the Link from navigating immediately
          if (logInAs !== "licensed") {
            setOpenUnlicensedDialog(true); // Open the unlicensed dialog
          } else {
            setClickedButton("Friends");
            navigate("/userPage/friends"); // Navigate to the friends page
          }
        }}
      />
      <SidebarButton
        text="Chat"
        Icon={ChatIcon}
        to="/userPage/chat"
        selected={clickedButton === "Chat"}
        onClick={(e) => {
          e.preventDefault(); // Prevent the Link from navigating immediately
          if (logInAs !== "licensed") {
            setOpenUnlicensedDialog(true); // Open the unlicensed dialog
          } else {
            setClickedButton("Chat");
            navigate("/userPage/chat"); // Navigate to the chat page
          }
        }}
      />
      <SidebarButton
        text="Settings"
        Icon={SettingsIcon}
        to="/userPage/setting"
        selected={clickedButton === "Settings"}
        onClick={(e) => setClickedButton("Settings")}
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

      {/* Unlicensed Dialog */}
      <Dialog open={openUnlicensedDialog} onClose={() => setOpenUnlicensedDialog(false)}>
        <DialogTitle>Functionality unavailable</DialogTitle>
        <DialogContent>
          <Typography>Sorry, only licensed users can access to this functionality. Please register your license key in setting page</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUnlicensedDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={(e) => {
            setClickedButton("Settings");
            navigate("/userPage/setting");
            setOpenUnlicensedDialog(false);
          }} color="secondary">
            Go to Settings
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Sidebar;