const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const { connectDB } = require('./lib/db.js');
const authRoutes = require('./routes/auth.route.js');
const friendRoutes = require('./routes/friend.route.js');
const chatRoutes = require("./routes/chat.route");
const { initSocket } = require("./controllers/chat.controller");


const app = express();

dotenv.config();
const PORT = process.env.PORT

app.use(cors({
    origin: `http://${process.env.FRONTEND_HOST || 'localhost'}:${process.env.FRONTEND_PORT || 3000}`,
    credentials: true, // Allow cookies to be sent
  }));

app.use(express.json()); 
app.use(cookieParser()); // parse cookies

app.use('/api/auth', authRoutes);
app.use('/api/friends', friendRoutes);
app.use("/api/chat", chatRoutes);

const server = initSocket(app);

server.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
  connectDB();
});