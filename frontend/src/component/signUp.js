import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TextField, Button, Typography, Box } from "@mui/material";
import { UseStyles } from "./CssFormat";
import toast from "react-hot-toast";

import { usernameValidator, passwordValidator } from "../lib/Validator";
import { axiosInstance } from "../lib/axios";



function SignUp() {
  const classes = UseStyles();
  let navigate = useNavigate();

  // state variables
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [passwordConfirmError, setPasswordConfirmError] = useState(false);


  const validateForm = () => {
    console.log("validateForm");
    // Client-side validation
    let userValidateResult = usernameValidator(username);
    let pwdValidateResult = passwordValidator(password);
    let validateResult = userValidateResult + pwdValidateResult;

    if (validateResult !== "") {
      toast.error(validateResult);
      return false;
    }
    if (password !== passwordConfirm) {
      toast.error("Passwords do not match.");
      return false;
    }
    return true;
  }


  const handleSignUp = async () => {
    console.log("handleSignUp");
    try {
      const response = await axiosInstance.post("/auth/signup",
        { username, password, }
      );
      const data = response.data;
      if (response.status === 201) {
        toast.success("User created successfully. Please log in.");
        navigate("/"); // Redirect to login after successful signup
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.response.data.message);
    }
  }


  const handleSubmit = async (event) => {
    console.log("handleSubmit");
    event.preventDefault();

    const success = validateForm();
    if (success === true) {
      handleSignUp();
    }
  };


  const handlePasswordChange = (event) => {
    const value = event.target.value;
    setPassword(value);

    // Validate the password and update the error state
    const isValid = passwordValidator(value) === "";
    setPasswordError(!isValid); // Set error to false if valid
  };


  const handlePasswordConfirmChange = (event) => {
    const value = event.target.value;
    setPasswordConfirm(value);
    setPasswordConfirmError(!(value === password));
  };


  return (
    <div className={classes.rootNormal}>
      <div className={classes.formContainer} style={{ width: "40%" }}>
        <form className={classes.form} onSubmit={handleSubmit}>
          <Typography
            variant="h2"
            className={classes.form_title}
            style={{ color: "#FB9231" }}
          >
            Chat App
          </Typography>
          <Box className={classes.form_item}>
            <Typography variant="h6">Please fill in your username:</Typography>
            <TextField
              label="Username"
              variant="outlined"
              className={classes.inputField}
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              fullWidth
            />
          </Box>
          <Box className={classes.form_item}>
            <Typography variant="h6">Please fill in your Password:</Typography>
            <TextField
              label="Password"
              variant="outlined"
              className={classes.inputField}
              type="password"
              value={password}
              onChange={handlePasswordChange}
              error={passwordError}
              helperText={passwordError ? "Invalid password" : ""}
              fullWidth
            />
          </Box>
          <Box className={classes.form_item}>
            <Typography variant="h6">Confirm your Password:</Typography>
            <TextField
              label="Confirm Password"
              variant="outlined"
              className={classes.inputField}
              type="password"
              value={passwordConfirm}
              onChange={(event) => handlePasswordConfirmChange(event)}
              error={passwordConfirmError}
              helperText={passwordConfirmError ? "Passwords do not match" : ""}
              fullWidth
            />
          </Box>
          <Box className={classes.form_button_grp}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              type="submit"
              className={classes.button}
            >
              Sign up
            </Button>
          </Box>
          <Box className={classes.form_redirect}>
            OR
            <Link className={classes.linkText} to="/">
              return to login
            </Link>
          </Box>
        </form>
      </div>
    </div>
  );
}

export default SignUp;