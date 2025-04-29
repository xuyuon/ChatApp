const http = require("http");
const socketIO = require("socket.io");
const mongoose = require("mongoose");
const Message = require("../models/message.model");
const User = require("../models/user.model");
const Room = require("../models/room.model");

const NEW_MESSAGE_EVENT = "newMessageEvent";
let io;

// Initialize Socket.IO server
const initSocket = (app) => {
  const server = http.createServer(app);
  io = socketIO(server, {
    cors: {
      origin: `http://${process.env.FRONTEND_HOST || "localhost"}:${
        process.env.FRONTEND_PORT || 3000
      }`,
      methods: ["GET", "POST"],
    },
  });

  console.log("Socket.IO server initialized");

  io.on("connection", async (socket) => {
    console.log(`a user connected, the socket.id is ${socket.id}`);

    let socketRoomId = "-1";
    let inRoomFlag = false;
    let userIdPair = [];
    let usernamePair = [];

    socket.on("reqChatted", async (username) => {
      console.log("reqChatted received, username:", username);
      try {
        const user = await User.findOne({ username });
        if (!user) return;
        const chattedUsers = await getChattedUser(user._id);
        io.to(socket.id).emit("chattedUser", chattedUsers);
      } catch (error) {
        console.error("Error in reqChatted:", error);
      }
    });

    socket.on("joinRoom", async (usernames) => {
      console.log("received joinRoom, usernames:", usernames);
      if (usernames[1] === "") {
        console.log("recipient empty, returning");
        return;
      }
      if (inRoomFlag) {
        console.log("already in room, returning");
        return;
      }

      usernamePair = usernames[1].includes("\n")
        ? [usernames[0], usernames[1].replaceAll("\n", "")]
        : usernames;
      inRoomFlag = true;

      try {
        // Find user IDs
        userIdPair = await findUserIdPair(usernamePair);
        console.log("userIdPair:", userIdPair);

        // Find or create room
        socketRoomId = await findOrCreateRoom(userIdPair);
        console.log("socketRoomId:", socketRoomId);

        socket.join(socketRoomId);

        // Fetch chat history
        const messages = await fetchChat(socketRoomId);
        console.log("chat history retrieved");

        const emitObj = messages.map((msg) => ({
          content: msg.content,
          sender_id: usernamePair[userIdPair.indexOf(msg.sender_id.toString())],
          receiver_id: usernamePair[userIdPair.indexOf(msg.receiver_id.toString())],
          timeSent: msg.timeSent.toISOString(),
        }));

        console.log("parsed emitObj:", emitObj);
        io.to(socket.id).emit("chatHistory", emitObj);

        await sendChattedUsers(userIdPair, usernamePair, io);
      } catch (error) {
        console.error("Error in joinRoom:", error);
        inRoomFlag = false;
      }
    });

    socket.on(NEW_MESSAGE_EVENT, async (data) => {
      if (!inRoomFlag) {
        console.log("inRoomFlag false, received msg:", data.content);
        return;
      }

      console.log("received text msg:", data.content);

      try {
        // Save message to database
        const message = await writeChatToDb(data, socketRoomId, userIdPair);
        if (!message) throw new Error("Failed to save message");

        // Broadcast message to room
        io.in(socketRoomId).emit(NEW_MESSAGE_EVENT, {
          content: data.content,
          sender_id: data.sender_id,
          receiver_id: data.receiver_id,
          timeSent: data.timeSent,
        });

        await sendChattedUsers(userIdPair, usernamePair, io);
      } catch (error) {
        console.error("Error in newMessageEvent:", error);
      }
    });

    socket.on("leaveRoom", () => {
      console.log("leaveRoom received, inRoomFlag:", inRoomFlag);
      if (inRoomFlag) {
        socket.leave(socketRoomId);
        console.log(`removed socket ${socket.id} from ${socketRoomId}`);
        socketRoomId = "-1";
        userIdPair = [];
        usernamePair = [];
        inRoomFlag = false;
      }
      console.log("inRoomFlag set to:", inRoomFlag);
    });

    socket.on("disconnect", () => {
      if (inRoomFlag) {
        console.log("socket disconnected without leaving room");
        socket.leave(socketRoomId);
        socketRoomId = "-1";
        userIdPair = [];
        usernamePair = [];
        inRoomFlag = false;
      }
      console.log("user disconnected");
    });
  });

  return server;
};

// Helper functions
async function findUserIdPair(usernamePair) {
  try {
    const user1 = await User.findOne({ username: usernamePair[0] });
    const user2 = await User.findOne({ username: usernamePair[1] });
    if (!user1 || !user2) {
      throw new Error("User not found");
    }
    return [user1._id.toString(), user2._id.toString()];
  } catch (error) {
    console.error("findUserIdPair failed:", error);
    throw error;
  }
}

async function findOrCreateRoom(userIdPair) {
  try {
    let room = await Room.findOne({
      users: { $all: [userIdPair[0], userIdPair[1]] },
    });

    if (!room) {
      room = new Room({
        users: [userIdPair[0], userIdPair[1]],
        message_id: [],
      });
      await room.save();
    }

    return room._id.toString();
  } catch (error) {
    console.error("findOrCreateRoom failed:", error);
    throw error;
  }
}

async function fetchChat(roomId) {
  try {
    const room = await Room.findById(roomId).populate("message_id");
    if (!room) return [];
    return room.message_id; // Returns array of Message documents
  } catch (error) {
    console.error("fetchChat failed:", error);
    return [];
  }
}

async function writeChatToDb(data, roomId, userIdPair) {
  try {
    const message = new Message({
      chat_id: roomId,
      sender_id: userIdPair[0], // Assumes sender_id is first user
      receiver_id: userIdPair[1], // Assumes receiver_id is second user
      content: data.content,
      timeSent: new Date(data.timeSent),
    });
    await message.save();

    // Update Room with message ID
    await Room.findByIdAndUpdate(roomId, {
      $push: { message_id: message._id },
    });

    console.log("writeChatToDb success");
    return message;
  } catch (error) {
    console.error("writeChatToDb failed:", error);
    return null;
  }
}

async function getChattedUser(userId) {
  try {
    console.log("getChattedUser, userId:", userId);
    const rooms = await Room.find({ users: userId }).populate("users");
    const chattedUserIds = rooms
      .flatMap((room) => room.users)
      .filter((u) => u._id.toString() !== userId.toString())
      .map((u) => u._id);

    const users = await User.find(
      { _id: { $in: chattedUserIds } },
      { username: 1 }
    );

    return users.map((user) => user.username);
  } catch (error) {
    console.error("getChattedUser failed:", error);
    return [];
  }
}

async function sendChattedUsers(userIdPair, usernamePair, io) {
  try {
    const [chattedUserList0, chattedUserList1] = await Promise.all([
      getChattedUser(userIdPair[0]),
      getChattedUser(userIdPair[1]),
    ]);

    io.to(userIdPair[0]).emit("chattedUser", chattedUserList0);
    io.to(userIdPair[1]).emit("chattedUser", chattedUserList1);
  } catch (error) {
    console.error("sendChattedUsers failed:", error);
  }
}

// HTTP route handlers
const getChat = async (req, res) => {
  res.send("this is chat!");
};

const getChatTables = async (req, res) => {
  console.log("GET /chatTables");
  const { username } = req.query;
  if (!username) {
    return res.status(400).json({ message: "Username is required" });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const users = await User.find({ _id: { $ne: user._id } }, { username: 1 });
    res.json(users.map((u) => u.username));
  } catch (error) {
    console.error("getChatTables failed:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getChattedUserRoute = async (req, res) => {
  console.log("GET /chattedUser");
  const { username } = req.query;
  if (!username) {
    return res.status(400).json({ message: "Username is required" });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const chattedUsers = await getChattedUser(user._id);
    res.json(chattedUsers);
  } catch (error) {
    console.error("getChattedUserRoute failed:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  initSocket,
  getChat,
  getChatTables,
  getChattedUserRoute,
};