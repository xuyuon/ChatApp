const http = require("http");
const socketIO = require("socket.io");
const mongoose = require("mongoose");
const Message = require("../models/message.model");
const User = require("../models/user.model");
const Room = require("../models/room.model");
const {
  findRoom,
  addRoom,
  addUsernameSocketDict,
  deleteUsernameSocketDict,
  getUsernameSocketDict,
} = require("../lib/room");

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

  io.on("connection", async (socket) => {
    console.log(`a user connected, the socket.id is ${socket.id}`);

    let SOCKET_ROOM_ID = "-1";
    let USER_ID_PAIR = [];
    let USERNAME_ID_DICT = {};
    let USERNAME_PAIR = [];
    let IN_ROOM_FLAG = false;

    socket.on("reqChatted", async (username) => {
      console.log("reqChatted received, username:", username);
      try {
        const user = await User.findOne({ username });
        if (!user) return;
        const chattedUserList = await getChattedUser(user._id.toString());
        io.to(socket.id).emit("chattedUser", chattedUserList);
      } catch (error) {
        console.error("Error in reqChatted:", error);
      }
    });

    socket.on("joinRoom", async (usernamePair) => {
      console.log("received joinRoom, usernamePair:", usernamePair);
      if (usernamePair[1] === "") {
        console.log("recipient empty, returning");
        return;
      }
      if (IN_ROOM_FLAG) {
        console.log("already in room, returning");
        return;
      }

      USERNAME_PAIR = usernamePair[1].includes("\n")
        ? [usernamePair[0], usernamePair[1].replaceAll("\n", "")]
        : usernamePair;

      IN_ROOM_FLAG = true;

      console.log(`socket.id ${socket.id} emitted 'joinRoom'`);
      console.log(`${USERNAME_PAIR[0]} wants to open a room with ${USERNAME_PAIR[1]}`);

      try {
        USER_ID_PAIR = await findUserIdPair(USERNAME_PAIR);
        USER_ID_PAIR.forEach((id, i) => {
          USERNAME_ID_DICT[id] = USERNAME_PAIR[i];
        });

        console.log("userIdPair:", USER_ID_PAIR);
        console.log("usernameIdDict:", USERNAME_ID_DICT);

        addUsernameSocketDict(USERNAME_PAIR[0], socket.id);

        SOCKET_ROOM_ID = await findRoom(USER_ID_PAIR);
        console.log("socketRoomId:", SOCKET_ROOM_ID);

        socket.join(SOCKET_ROOM_ID);

        const result = await fetchChat(USER_ID_PAIR);
        console.log("chat history retrieved");

        const emitObj = result.map((chatObj) => ({
          message: chatObj.message,
          sender: USERNAME_ID_DICT[chatObj.sender],
          receiver: USERNAME_ID_DICT[chatObj.receiver],
          sendTime: parseDateToUTC8(chatObj.sendTime),
        }));

        console.log("parsed emitObj:", emitObj);
        io.to(socket.id).emit("chatHistory", emitObj);

        await sendChattedUsers(USER_ID_PAIR, USERNAME_PAIR, io);
      } catch (error) {
        console.error("Error in joinRoom:", error);
        IN_ROOM_FLAG = false;
      }
    });

    socket.on(NEW_MESSAGE_EVENT, async (data) => {
      if (!IN_ROOM_FLAG) {
        console.log("inRoomFlag false, received msg:", data.message);
        return;
      }

      console.log("received text msg:", data.message);

      try {
        io.in(SOCKET_ROOM_ID).emit(NEW_MESSAGE_EVENT, data);
        await writeChatToDb(data.message, USER_ID_PAIR);
        await sendChattedUsers(USER_ID_PAIR, USERNAME_PAIR, io);
      } catch (error) {
        console.error("Error in newMessageEvent:", error);
      }
    });

    socket.on("leaveRoom", () => {
      console.log("leaveRoom received, inRoomFlag:", IN_ROOM_FLAG);
      if (IN_ROOM_FLAG) {
        socket.leave(SOCKET_ROOM_ID);
        console.log(`removed socket ${socket.id} from ${SOCKET_ROOM_ID}`);
        deleteUsernameSocketDict(USERNAME_PAIR[0], socket.id);
        SOCKET_ROOM_ID = "-1";
        USER_ID_PAIR = [];
        USERNAME_ID_DICT = {};
        USERNAME_PAIR = [];
        IN_ROOM_FLAG = false;
      }
      console.log("inRoomFlag set to:", IN_ROOM_FLAG);
    });

    socket.on("test", () => {
      console.log("test received");
    });

    socket.on("disconnect", () => {
      if (IN_ROOM_FLAG) {
        console.log("socket disconnected without leaving room");
        socket.leave(SOCKET_ROOM_ID);
        deleteUsernameSocketDict(USERNAME_PAIR[0], socket.id);
        SOCKET_ROOM_ID = "-1";
        USER_ID_PAIR = [];
        USERNAME_ID_DICT = {};
        USERNAME_PAIR = [];
        IN_ROOM_FLAG = false;
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
    return `{"message": "findUserIdPair failed. User not found"}`;
  }
}

async function fetchChat(userIdPair) {
  try {
    const messages = await Message.find({
      $or: [
        { sender: userIdPair[0], receiver: userIdPair[1] },
        { sender: userIdPair[1], receiver: userIdPair[0] },
      ],
    }).sort({ sendTime: 1 });
    return messages.map((msg) => ({
      message: msg.message,
      sendTime: msg.sendTime,
      sender: msg.sender,
      receiver: msg.receiver,
    }));
  } catch (error) {
    console.error("fetchChat failed:", error);
    return [];
  }
}

function parseDateToUTC8(dateObject) {
  const offsetToUTC = dateObject.getTimezoneOffset() * 60 * 1000;
  const nowWithOffset = dateObject - offsetToUTC;
  const newNow = new Date(nowWithOffset);
  return newNow.toISOString().replace("T", " ").slice(0, -5);
}

async function writeChatToDb(messageContent, userIdPair) {
  try {
    const now = new Date();
    const message = new Message({
      message: messageContent,
      sendTime: now,
      sender: userIdPair[0],
      receiver: userIdPair[1],
    });
    await message.save();
    console.log("writeChatToDb success");
    return `{"message": "Write chat to db success"}`;
  } catch (error) {
    console.error("writeChatToDb failed:", error);
    return `{"message": "writeChatToDb failed. DB error"}`;
  }
}

async function getChattedUser(userId) {
  try {
    console.log("getChattedUser, userId:", userId);
    const messages = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: userId }, { receiver: userId }],
        },
      },
      {
        $group: {
          _id: null,
          senders: { $addToSet: "$sender" },
          receivers: { $addToSet: "$receiver" },
          maxSendTime: { $max: "$sendTime" },
        },
      },
      {
        $project: {
          users: { $setUnion: ["$senders", "$receivers"] },
          maxSendTime: 1,
        },
      },
    ]);

    if (!messages.length) return [];

    const chattedUserIds = messages[0].users.filter((id) => id !== userId);
    const users = await User.find(
      { _id: { $in: chattedUserIds.map((id) => mongoose.Types.ObjectId(id)) } },
      { username: 1 }
    ).sort({ "messages.maxSendTime": -1 });

    return users.map((user) => user.username);
  } catch (error) {
    console.error("getChattedUser failed:", error);
    return ["Error retrieving chatted users"];
  }
}

async function sendChattedUsers(userIdPair, usernamePair, bigIOsocket) {
  try {
    const [chattedUserList0, chattedUserList1] = await Promise.all([
      getChattedUser(userIdPair[0]),
      getChattedUser(userIdPair[1]),
    ]);

    const user0SocketList = getUsernameSocketDict(usernamePair[0]);
    const user1SocketList = getUsernameSocketDict(usernamePair[1]);

    for (const socketID of user0SocketList) {
      bigIOsocket.to(socketID).emit("chattedUser", chattedUserList0);
    }
    for (const socketID of user1SocketList) {
      bigIOsocket.to(socketID).emit("chattedUser", chattedUserList1);
    }
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

    // Placeholder: Return all users (adapt if Follow model exists)
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

    const chattedUsers = await getChattedUser(user._id.toString());
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