const mongoose = require('mongoose');

async function connectDB() {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
} catch (error) {
    console.error(`Error: ${error}`);

}
}

module.exports = { connectDB };