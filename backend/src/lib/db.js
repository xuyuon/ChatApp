import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            // small optimisation so Jest / dev reloads don’t open duplicates
            maxPoolSize: 10
            });
        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error}`);

    }
}