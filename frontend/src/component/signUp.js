import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TextField, Button, Typography, Box } from "@mui/material";
import { UseStyles } from "./CssFormat";
import { usernameValidator, passwordValidator } from "./Validator";

function SignUp() {
  const classes = UseStyles();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(""); // Clear previous errors

    // Client-side validation (if validators match backend requirements)
    const userValidateResult = usernameValidator(username);
    const pwdValidateResult = passwordValidator(password);
    const validateResult = userValidateResult + pwdValidateResult;

    if (validateResult !== "") {
      setError(validateResult);
      return;
    }

    const signUpUrl = `http://${window.location.hostname}:${
      process.env.REACT_APP_API_PORT || 5001
    }/api/auth/signup`;

    const postBody = {
      username,
      password,
    };

    try {
      const response = await fetch(signUpUrl, {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postBody),
        credentials: "include", // Include cookies for JWT
      });

      const data = await response.json();

      if (response.status === 201 && data.message === "User created successfully") {
        // JWT cookie is set by backend; no need to store token manually unless required
        navigate("/"); // Redirect to login page
      } else {
        setError(data.error || "Signup failed");
      }
    } catch (err) {
      console.error("Error during signup:", err);
      setError("An error occurred during signup. Please try again.");
    }
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
          {error && (
            <Typography color="error" variant="body1">
              {error}
            </Typography>
          )}
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
              onChange={(event) => setPassword(event.target.value)}
              fullWidth
            />
          </Box>
          <Box className={classes.form_button_grp}>
            <Button
              variant="contained"
              color="primary"
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