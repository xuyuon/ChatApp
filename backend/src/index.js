const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { connectDB } = require("./lib/db");
const authRoutes = require("./routes/auth.route");
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

app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);

const server = initSocket(app);

server.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
  connectDB();
});