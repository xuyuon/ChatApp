import "./UserPage.css";
import Sidebar from "./userPageComponent/Sidebar";
import HomePage from "./userPageComponent/HomePage";
import ChatPage from "./userPageComponent/ChatPage";
import FriendPage from "./userPageComponent/FriendPage";
import SettingPage from "./userPageComponent/SettingPage";

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Grid, Box } from "@mui/material";
import CircularProgress from '@mui/material/CircularProgress';
import { checkAuth } from "../lib/checkAuth";


const UserPage = ({logInAs, setLogInAs}) => {
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Check if user is logged in when the component mounts
  useEffect(() => {
    const setUserState = async () => {
      const user_data = await checkAuth();
      if (user_data !== null) {
        console.log("User type:", user_data.userType);
        setLogInAs(user_data.userType);
      }
      setIsCheckingAuth(false);
    }
    setUserState();
  }, []);

  if (isCheckingAuth) {
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
    <div>
      <Grid direction="row" container spacing={0}>
        <Grid item style={{ width: "290px" }}>
          <Sidebar logInAs={logInAs} setLogInAs={setLogInAs} />
        </Grid>
        <Grid item xs style={{overflow: "auto"}}>
          <Routes>
            <Route path="home" element={<HomePage />} />
            <Route
              path="chat"
              element={<ChatPage sender={sessionStorage.getItem("username")} />}
            />
            <Route path="friends" element={<FriendPage />} />
            <Route path="setting" element={<SettingPage logInAs={logInAs} setLogInAs={setLogInAs}/>} />
          </Routes>
        </Grid>
      </Grid>
    </div>
  );
};

export default UserPage;
