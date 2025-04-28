const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser")
const { connectDB } = require("./lib/db");
const authRoutes = require("./routes/auth.route");
const friendRoutes = require('./routes/friend.route.js');
const chatRoutes = require("./routes/chat.route");
const { initSocket } = require("./controllers/chat.controller");

const app = express();
dotenv.config();

const PORT = process.env.PORT;

app.use(
  cors({
    origin: `http://${"localhost"}:${3000}`,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/friends', friendRoutes);
app.use("/api/chat", chatRoutes);

const server = initSocket(app);

server.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
  connectDB();
});