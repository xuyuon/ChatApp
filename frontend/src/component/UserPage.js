import "./UserPage.css";
import Sidebar from "./userPageComponent/Sidebar";
import ChatPage from "./userPageComponent/ChatPage";
import FriendPage from "./userPageComponent/FriendPage";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const UserPage = ({ logInAs, setLogInAs }) => {
  return (
    <div>
      <Sidebar logInAs={logInAs} setLogInAs={setLogInAs} />
      <Routes>
        <Route
          path="chat"
          element={<ChatPage sender={sessionStorage.getItem("username")} />}
        />
        <Route path="friends" element={<FriendPage />} />
      </Routes>
    </div>
  );
};

export default UserPage;
