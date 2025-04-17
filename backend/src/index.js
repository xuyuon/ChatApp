import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import { connectDB } from './lib/db.js';
import authRoutes from './routes/auth.route.js';

const app = express();

dotenv.config();
const PORT = process.env.PORT

app.use(cors({
    origin: `http://${process.env.FRONTEND_HOST || 'localhost'}:${process.env.FRONTEND_PORT || 3000}`,
    credentials: true, // Allow cookies to be sent
  }));

app.use(express.json()); 

app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
    console.log('Server is running on port: ' + PORT);
    connectDB();
});