const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  message: { type: String, required: true }, // Text message
  sendTime: { type: Date, required: true },
  sender: { type: String, required: true }, // User _id (MongoDB ObjectId as string)
  receiver: { type: String, required: true }, // User _id
});

module.exports = mongoose.model("Message", messageSchema);