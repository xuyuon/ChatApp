const Room = require("../models/room.model");
const mongoose = require("mongoose");

// In-memory dictionary for username-to-socket mapping
let usernameSocketDict = {};

/**
 * Find or create a room for two users
 * @param {string[]} userIdPair - Array of two user _ids
 * @returns {string} Room ID (MongoDB ObjectId)
 */
async function findRoom(userIdPair) {
  try {
    // Sort user IDs to ensure consistent room lookup
    const sortedUsers = userIdPair.sort();
    let room = await Room.findOne({
      users: sortedUsers,
    });
    if (!room) {
      room = await addRoom(userIdPair);
    }
    return room._id.toString();
  } catch (error) {
    console.error("Error finding room:", error);
    return "-1";
  }
}

/**
 * Create a new room for two users
 * @param {string[]} userIdPair - Array of two user _ids
 * @returns {object} Created room document
 */
async function addRoom(userIdPair) {
  try {
    const sortedUsers = userIdPair.sort();
    const room = new Room({
      users: sortedUsers,
    });
    await room.save();
    return room;
  } catch (error) {
    console.error("Error adding room:", error);
    throw error;
  }
}

/**
 * Add a socket ID to the username's socket list
 * @param {string} username
 * @param {string} socketId
 */
function addUsernameSocketDict(username, socketId) {
  if (!usernameSocketDict[username]) {
    usernameSocketDict[username] = [];
  }
  if (!usernameSocketDict[username].includes(socketId)) {
    usernameSocketDict[username].push(socketId);
  }
}

/**
 * Remove a socket ID from the username's socket list
 * @param {string} username
 * @param {string} socketId
 */
function deleteUsernameSocketDict(username, socketId) {
  if (usernameSocketDict[username]) {
    usernameSocketDict[username] = usernameSocketDict[username].filter(
      (id) => id !== socketId
    );
    if (usernameSocketDict[username].length === 0) {
      delete usernameSocketDict[username];
    }
  }
}

/**
 * Get the list of socket IDs for a username
 * @param {string} username
 * @returns {string[]}
 */
function getUsernameSocketDict(username) {
  return usernameSocketDict[username] || [];
}

module.exports = {
  findRoom,
  addRoom,
  addUsernameSocketDict,
  deleteUsernameSocketDict,
  getUsernameSocketDict,
};