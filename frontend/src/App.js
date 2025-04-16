import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";

import "./App.css";
import Content from "./component/Content";
import SignUp from "./component/signUp";
import UserPage from "./component/UserPage.js";
import { checkAuth } from "./lib/checkAuth";



function App() {
  const [logInAs, setLogInAs] = useState("");

  return (
    <div>
      {
        // Show sign-in and sign-up routes when not logged in
        !logInAs && (
          <Routes>
            <Route path="/" element={<Content setLogInAs={setLogInAs} />} />
            <Route path="/signUp" element={<SignUp />} />
          </Routes>
        )
      }

      {
        // Show user page when logged in as user
        logInAs === "user" && <UserPage setLogInAs={setLogInAs} />
      }
      <Toaster />
    </div>
  );
}

export default App;