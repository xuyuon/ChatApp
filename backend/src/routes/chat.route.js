const express = require("express");
const {
  getChat,
  getChatTables,
  getChattedUserRoute,
} = require("../controllers/chat.controller");

const router = express.Router();

router.get("/", getChat);
router.get("/chatTables", getChatTables);
router.get("/chattedUser", getChattedUserRoute);

module.exports = router;