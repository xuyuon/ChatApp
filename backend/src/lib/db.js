/**
 * Establishes a connection to the MongoDB database using Mongoose.
 * The connection string is read from the MONGODB_URI environment variable.
 */

const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error}`);

    }
}

module.exports = { connectDB }