import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    TextField,
    Button,
    Typography,
    FormControl,
    Box,
  } from "@mui/material";
import { UseStyles } from "./CssFormat";
import { passwordValidator, usernameloginValidator } from "./Validator";

function Login({ setLogInAs }) {
    const classes = UseStyles();
    let navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
  
    // Remove this line; we don't need to set the cookie here
    // Cookies.set("signUpUsernameCookie", username);
  
    const handleSubmit = (event) => {
      console.log("handleSubmit");
      event.preventDefault();
      loginAction();
    };
  
    const loginAction = async () => {
      console.log("Enter loginAction");
  
      // Update the API URL to match the backend route
      const loginUrl = `http://${window.location.hostname}:${process.env.REACT_APP_API_PORT || 5001}/api/auth/login`;
  
      // Client-side validation
      let userValidateResult = usernameloginValidator(username);
      let pwdValidateResult = passwordValidator(password);
      let validateResult = userValidateResult + pwdValidateResult;
  
      if (validateResult !== "") {
        alert(validateResult);
        return null;
      }
  
      // Determine mode (admin or user) based on username
      let mode = "";
      if (username.includes("admin")) {
        console.log("Login as Admin");
        mode = "admin";
      } else {
        console.log("Login as User");
        mode = "user";
      }
  
      const postBody = {
        username: username,
        password: password,
      };
  
      try {
        const response = await fetch(loginUrl, {
          method: "POST",
          mode: "cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(postBody),
          credentials: "include", // Include cookies in the request (for the JWT cookie set by the backend)
        });
  
        const data = await response.json();
  
        if (response.status === 200 && data.message === "Logged in successfully") {
          sessionStorage.setItem("username", username);
          alert("Login Success");
          if (mode === "user") {
            setLogInAs("user");
            navigate("/userHome");
          } else {
            setLogInAs("admin");
            navigate("/adminHome");
          }
        } else {
          alert(data.message || "Login failed");
        }
      } catch (err) {
        console.error("Detailed error during login:", err);
        alert("An error occurred during login. Please try again: " + err.message);
      }
    };

    return (
        <div className={classes.root}>
          <div
            className={classes.formContainer}
            style={{
              padding: "5%",
              width: "70%",
              borderColor: "white",
              borderRadius: "25px",
            }}
          >
            <Box>
              <Typography variant="h6" className={classes.loginDesc}>
                Welcome back
              </Typography>
              <Typography
                variant="h3"
                className={classes.loginTitle}
                style={{ fontWeight: "800" }}
              >
                Sign in
              </Typography>
            </Box>
            <FormControl className={classes.form} onSubmit={handleSubmit}>
              <Box className={classes.form_item}>
                <Typography variant="h6">Username:</Typography>
                <TextField
                  label="Username"
                  variant="outlined"
                  required
                  className={classes.inputField}
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  margin="dense"
                  fullWidth
                />
              </Box>
              <Box
                style={{
                  display: "flex",
                  flexDirection: "column",
                  padding: "20px 0 20px 0",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="h6">Password:</Typography>
                  <Link
                    className={classes.linkText}
                    style={{ opacity: "0.6" }}
                    to="/forgot_password"
                  >
                    {" "}
                    Forgot password?
                  </Link>
                </div>
                <TextField
                  label="Password"
                  variant="outlined"
                  required
                  type="password"
                  className={classes.inputField}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  margin="dense"
                  fullWidth
                />
              </Box>
              <Box className={classes.form_button_grp}>
                <Button
                  classes={{ root: classes.button }}
                  variant="contained"
                  type="submit"
                  onClick={handleSubmit}
                >
                  Sign In
                </Button>
              </Box>
              <Box className={classes.form_redirect}>
                <Typography variant="h6">
                  I don't have an account ?
                  <Link
                    className={classes.linkText}
                    style={{ color: "#F47458" }}
                    to="/signUp"
                  >
                    {" "}
                    Sign Up
                  </Link>
                </Typography>
              </Box>
            </FormControl>
          </div>
        </div>
      );
    }
    
    export default Login;