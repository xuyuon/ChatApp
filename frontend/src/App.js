import "./App.css";
import Content from "./component/Content";
import { Routes, Route } from "react-router-dom";
import SignUp from "./component/signUp";
import UserPage from "./component/UserPage.js";
import { useState } from "react";

function App() {
  const [logInAs, setLogInAs] = useState("");

  return (
    <>
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
    </>
  );
}

export default App;