import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TextField, Button, Typography, Box } from "@mui/material";
import { UseStyles } from "./CssFormat";
import Cookies from "js-cookie";
import { usernameValidator, passwordValidator } from "./Validator";

function SignUp() {
    const classes = UseStyles();
    let navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,16}$/;
    const [passwordError, setPasswordError] = useState(false);
  
    const handleSubmit = async (event) => {
      event.preventDefault();
      console.log("Enter handleSubmit");
  
      // Update the API URL to match the backend route
      const signUpUrl = `http://${window.location.hostname}:${process.env.REACT_APP_API_PORT || 5001}/api/auth/signup`;
  
      // Client-side validation
      let userValidateResult = usernameValidator(username);
      let pwdValidateResult = passwordValidator(password);
      let validateResult = userValidateResult + pwdValidateResult;
  
      if (validateResult !== "") {
        alert(validateResult);
        return null;
      }
  
      // Align frontend password validation with backend
      if (password.length < 6) {
        alert("Password must be at least 6 characters long");
        return null;
      }
  
      const postBody = {
        username: username,
        password: password,
      };
  
      try {
        const response = await fetch(signUpUrl, {
          method: "POST",
          mode: "cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(postBody),
          credentials: "include", // Include cookies in the request (for the JWT cookie set by the backend)
        });
  
        const data = await response.json();
  
        if (response.status === 201 && data.message === "User created successfully") {
          Cookies.set("signUpUsernameCookie", username);
          navigate("/"); // Redirect to login after signup
        } else {
          alert(data.message || "Signup failed");
        }
      } catch (err) {
        console.error("Error during signup:", err);
        alert("An error occurred during signup. Please try again.");
      }
    };

  const handlePasswordChange = (event) => {
    const value = event.target.value;
    setPassword(value);
    setPasswordError(!passwordRegex.test(value));
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
              inputProps={{
                pattern: passwordRegex.source,
                title:
                  "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, and one number",
              }}
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