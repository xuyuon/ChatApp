import "./UserPage.css";
import Sidebar from "./userPageComponent/Sidebar";
// import Home from "./userPageComponent/Home";
// import PostDetailPage from "./userPageComponent/PostDetailPage";
// import CreateNewPost from "./userPageComponent/CreateNewPost";
// import FollowerPage from "./userPageComponent/FollowerPage";
// import ProfilePage from "./userPageComponent/ProfilePage";
// import EditProfile from "./userPageComponent/EditProfile";
// import SearchPage from "./userPageComponent/SearchPage";
// import RecommendationPage from "./userPageComponent/RecommendationPage";
// import OtherProfilePage from "./userPageComponent/OtherProfilePage";
import ChatPage from "./userPageComponent/ChatPage";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const UserPage = ({ setLogInAs }) => {
  return (
    <div>
      <Sidebar setLogInAs={setLogInAs} />
      <Routes>
        {/* <Route path="/userHome" element={<Home />} />
        <Route path="/post" element={<PostDetailPage />} />
        <Route path="/createNewPost" element={<CreateNewPost />} />
        <Route path="/followers" element={<FollowerPage />} />
        <Route path="/my profile" element={<ProfilePage />} />
        <Route path="/profileedit" element={<EditProfile />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/recommendation" element={<RecommendationPage />} />
        <Route path="/other profile" element={<OtherProfilePage />} /> */}
        <Route
          path="chat"
          element={<ChatPage sender={sessionStorage.getItem("username")} />}
        />
      </Routes>
    </div>
  );
};

export default UserPage;
