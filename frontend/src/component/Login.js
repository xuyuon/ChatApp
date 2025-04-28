import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Typography,
  FormControl,
  Box,
} from "@mui/material";

import toast from "react-hot-toast";
import { UseStyles } from "./CssFormat";

import { passwordValidator, usernameloginValidator } from "../lib/Validator";
import { axiosInstance } from "../lib/axios";
import { checkAuth } from "../lib/checkAuth";


function Login({ setLogInAs }) {
  const classes = UseStyles();
  let navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");


  const validateForm = () => {
    console.log("validateForm");
    // Client-side validation
    let userValidateResult = usernameloginValidator(username);
    let pwdValidateResult = passwordValidator(password);
    let validateResult = userValidateResult + pwdValidateResult;

    if (validateResult !== "") {
      toast.error(validateResult);
      return false;
    }
    return true;
  };


  const handleSubmit = (event) => {
    console.log("handleSubmit");
    event.preventDefault();
    const success = validateForm();
    if (success === true) {
      loginAction();
    }
  };


  const loginAction = async () => {
    console.log("Enter loginAction");
    try {
      const response = await axiosInstance.post("/auth/login",
        { username, password },
      );

      const data = response.data;

      if (response.status === 200) {
        sessionStorage.setItem("username", username);
        toast.success("Login successful");

        const user_data = await checkAuth();
        setLogInAs(user_data.userType);

        navigate("/"); // Redirect to home page after successful login
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.response.data.message);
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