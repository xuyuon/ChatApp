/**
 * Routes for Chat features and handle HTTP requests 
 */
const express = require("express");
const {
  getChat,
  getChattedUserRoute,
} = require("../controllers/chat.controller");

const router = express.Router();

router.get("/", getChat);
router.get("/chattedUser", getChattedUserRoute);

module.exports = router;