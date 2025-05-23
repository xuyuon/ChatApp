const Room = require("../models/room.model");
const mongoose = require("mongoose");

let usernameSocketDict = {};

/**
 * Find or create a room for two users
 * Parameter: Array of two user _ids (MongoDB ObjectId)
 * Return: Room ID (MongoDB ObjectId as string)
 */

async function findRoom(userIdPair) {
  try {
    // Validate ObjectId
    if (
      !mongoose.Types.ObjectId.isValid(userIdPair[0]) ||
      !mongoose.Types.ObjectId.isValid(userIdPair[1])
    ) {
      throw new Error("Invalid user IDs");
    }

    // Sort user IDs to ensure consistent room lookup
    const sortedUsers = userIdPair
      .map((id) => new mongoose.Types.ObjectId(id))
      .sort((a, b) => a.toString().localeCompare(b.toString()));

    let room = await Room.findOne({
      users: { $all: sortedUsers, $size: sortedUsers.length },
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
 * Parameter: Array of two user _ids (MongoDB ObjectId)
 * Return: the created room object
 */
async function addRoom(userIdPair) {
  try {
    // Validate ObjectId
    if (
      !mongoose.Types.ObjectId.isValid(userIdPair[0]) ||
      !mongoose.Types.ObjectId.isValid(userIdPair[1])
    ) {
      throw new Error("Invalid user IDs");
    }

    const sortedUsers = userIdPair
      .map((id) => new mongoose.Types.ObjectId(id))
      .sort((a, b) => a.toString().localeCompare(b.toString()));

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
 * Parameter: username
 * Return: socketId
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
 * Parameter: username
 * Return: socketId
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
 * Parameter: username
 * Return: Respective
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