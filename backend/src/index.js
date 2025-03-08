import express from 'express';
import dotenv from 'dotenv';

import { connectDB } from './lib/db.js';
import authRoutes from './routes/auth.route.js';

const app = express();

dotenv.config();
const PORT = process.env.PORT

app.use('/auth', authRoutes);

app.listen(PORT, () => {
    console.log('Server is running on port: ' + PORT);
    connectDB();
});