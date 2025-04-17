import "./sidebar.css";
import SidebarButton from "./SidebarButton";

import HomeIcon from "@mui/icons-material/Home";
import PeopleIcon from "@mui/icons-material/People";
import ChatIcon from "@mui/icons-material/Chat";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

import { toast } from "react-hot-toast";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";

import { axiosInstance } from "../../lib/axios";




function Sidebar({ setLogInAs }) {
  const [clickedButton, setClickedButton] = useState("Home"); // Record which button is clicked
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false); // State for logout confirmation dialog
  const navigate = useNavigate();

  const handleLogout = async () => {
    console.log("Initiating logout");

    try{
      const response = await axiosInstance.post("/auth/logout", {});
      const data = response.data;
      if (response.status === 200) {
        sessionStorage.removeItem("username"); // Clear the session storage
        setLogInAs(""); // Clear the login role
        setClickedButton(""); // Reset the selected button
        toast.success("Logout successful"); // Show success message
        navigate("/"); // Redirect to the login page
      }else {
        toast.error(data.message || "Logout failed"); // Show error message
      }
    }catch(err){
      console.error("Detailed error during logout:", err);
      toast.error("An error occurred during logout. Please try again: " + err.message); // Show error message
    }finally{
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
    </div>
  );
}

export default Sidebar;