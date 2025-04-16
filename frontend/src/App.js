import "./App.css";
import Content from "./component/Content";
import { Routes, Route } from "react-router-dom";
import SignUp from "./component/signUp";
import UserPage from "./component/UserPage.js";
import { useState } from "react";

import { Toaster } from "react-hot-toast";

function App() {
  const [logInAs, setLogInAs] = useState("");

  return (
    <div>
      {
        // Show sign-in and sign-up routes when not logged in
        !logInAs ? (
          <Routes>
            <Route path="/" element={<Content setLogInAs={setLogInAs} />} />
            <Route path="/signUp" element={<SignUp />} />
          </Routes>
        ) : (
          // Show user page when logged in
          <Routes>
            <Route path="/userPage" element={<UserPage setLogInAs={setLogInAs} />} />
          </Routes>
        )
      }
      <Toaster />
    </div>
  );
}

export default App;