import "./UserPage.css";
import Sidebar from "./userPageComponent/Sidebar";
import ChatPage from "./userPageComponent/ChatPage";
import FriendPage from "./userPageComponent/FriendPage";
import SettingPage from "./userPageComponent/SettingPage";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Grid, Box } from "@mui/material";

const UserPage = ({ logInAs, setLogInAs }) => {
  return (
    <div>
      <Grid direction="row" container spacing={0}>
        <Grid item style={{ width: "290px" }}>
          <Sidebar logInAs={logInAs} setLogInAs={setLogInAs} />
        </Grid>
        <Grid item xs style={{overflow: "auto"}}>
          <Routes>
            <Route
              path="chat"
              element={<ChatPage sender={sessionStorage.getItem("username")} />}
            />
            <Route path="friends" element={<FriendPage />} />
            <Route path="setting" element={<SettingPage />} />
          </Routes>
        </Grid>
      </Grid>
    </div>
  );
};

export default UserPage;
