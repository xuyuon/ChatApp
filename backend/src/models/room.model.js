const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  users: [{ type: String, required: true }], // Array of user _ids (sorted for uniqueness)
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Room", roomSchema);