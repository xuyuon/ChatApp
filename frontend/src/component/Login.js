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
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const loginAction = async () => {
    console.log("Enter loginAction");
    const loginUrl = `http://localhost:5001/api/auth/login`;

    const userValidateResult = usernameloginValidator(username);
    const pwdValidateResult = passwordValidator(password);
    const validateResult = userValidateResult + pwdValidateResult;

    if (validateResult !== "") {
      setError(validateResult);
      return;
    }

    const mode = username.includes("admin") ? "admin" : "user";
    console.log(`Login as ${mode}`);
    const postBody = { username, password };

    try {
      const response = await fetch(loginUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postBody),
        credentials: "include",
      });

      let data;
      try {
        data = await response.json();
        console.log("Login response:", data);
      } catch (err) {
        console.error("Invalid JSON:", await response.text());
        throw new Error("Server returned invalid response");
      }

      if (response.ok && data.message === "Login successful") {
        sessionStorage.setItem("username", data.username);
        sessionStorage.setItem("userId", data.userId);
        sessionStorage.setItem("token", data.token);
        console.log("Stored in sessionStorage:", {
          username: data.username,
          userId: data.userId,
          token: data.token,
        });

        setLogInAs(mode);
        navigate("/", {
          state: { username: data.username },
          replace: false,
        });
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(`Login error: ${err.message}`);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("handleSubmit");
    loginAction();
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
        <form onSubmit={handleSubmit}>
          <FormControl className={classes.form}>
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
            {error && (
              <Typography color="error" variant="body1">
                {error}
              </Typography>
            )}
            <Box className={classes.form_button_grp}>
              <Button
                classes={{ root: classes.button }}
                variant="contained"
                type="submit"
              >
                Sign In
              </Button>
            </Box>
            <Box className={classes.form_redirect}>
              <Typography variant="h6">
                I don't have an account?
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
        </form>
      </div>
    </div>
  );
}

export default Login;