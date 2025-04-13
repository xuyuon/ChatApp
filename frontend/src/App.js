import React, { useState, useEffect } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import { SocketProvider } from "./component/userPageComponent/Socket";
import Content from "./component/Content";
import SignUp from "./component/signUp";
import UserPage from "./component/UserPage";
import Cookies from "js-cookie";

function App() {
  const [logInAs, setLogInAs] = useState("");
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = sessionStorage.getItem("token") || Cookies.get("jwt");
    if (storedToken && logInAs) {
      setToken(storedToken);
    }
  }, [logInAs]);

  // Override setLogInAs to clear token on logout
  const handleSetLogInAs = (value) => {
    if (!value) {
      setToken(null);
      sessionStorage.clear();
      Cookies.remove("jwt");
    }
    setLogInAs(value);
  };

  return (
    <SocketProvider token={logInAs ? token : null}>
      {!logInAs && (
        <Routes>
          <Route path="/" element={<Content setLogInAs={handleSetLogInAs} />} />
          <Route path="/signUp" element={<SignUp />} />
        </Routes>
      )}
      {logInAs && (
        <Routes>
          <Route
            path="/*"
            element={<UserPage setLogInAs={handleSetLogInAs} logInAs={logInAs} />}
          />
        </Routes>
      )}
    </SocketProvider>
  );
}

export default App;