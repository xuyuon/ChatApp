/*
This file contains the validation functions for the login and registration forms.
It includes functions to validate the username and password fields.
*/

export const usernameloginValidator = (username) => {
  if (!username) {
    return "Username is required.\n";
  } else if (username.length > 16) {
    return "Length of Username should be smaller than 16.\n";
  }
  return "";
};

export const usernameValidator = (username) => {
  if (!username) {
    return "Username is required.\n";
  } else if (username.includes("admin")) {
    return "Username cannot include 'admin'.\n";
  } else if (username.length > 16) {
    return "Length of Username should be smaller than 16.\n";
  }
  return "";
};

export const passwordValidator = (password) => {
  if (!password) {
    return "Password is required.\n";
  } else if (password.length < 6) {
    return "Password must be at least 6 characters long.\n";
  }
  return "";
};
