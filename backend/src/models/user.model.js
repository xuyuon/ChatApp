const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    userType: {
        type: String,
        enum: ["licensed", "unlicensed"],
        default: "unlicensed",
    },
    // email: {
    //     type: String,
    //     required: true,
    //     unique: true,
    // },
    // avatar: {
    //     type: String,
    // },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);

module.exports = User;