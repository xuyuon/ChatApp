import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';


import "./App.css";
import Login from "./component/Login";
import SignUp from "./component/signUp";
import UserPage from "./component/UserPage.js";
import Friend from "./component/userPageComponent/FriendPage.js";

import { checkAuth } from "./lib/checkAuth";




function App() {
  const [logInAs, setLogInAs] = useState("");
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  /*
  logInAs can be:
  - "" (not logged in)
  - "licensed" (logged in as licensed user)
  - "unlicensed" (logged in as unlicensed user)
  */

  // Check if user is logged in when the component mounts
  useEffect(() => {
    const setUserState = async () => {
      const user_data = await checkAuth();
      if (user_data !== null) {
        console.log("User data from checkAuth:", user_data);
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
      {
        // Show sign-in and sign-up routes when not logged in
        !logInAs && (
          <Routes>
            <Route path="/login" element={<Login setLogInAs={setLogInAs} />} />
            <Route path="/signUp" element={<SignUp />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        )
      }

      {
        // show user page when logged in as licensed user
        logInAs === "licensed" && (
          <Routes>
            <Route path="/" element={<UserPage logInAs={logInAs} setLogInAs={setLogInAs} />} />
            <Route path="/friends" element={<Friend logInAs={logInAs} setLogInAs={setLogInAs} />} />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        )
      }

      {
        // show user page when logged in as unlicensed user
        logInAs === "unlicensed" && (
          <Routes>
            <Route path="/" element={<UserPage logInAs={logInAs} setLogInAs={setLogInAs} />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        )
      }
      <Toaster />
    </div>
  );
}

export default App;