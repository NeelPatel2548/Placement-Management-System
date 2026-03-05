import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import { initEmailService } from './config/emailService.js';
import authRoutes from './routes/authRoutes.js';

// Load env variables first
dotenv.config();

// Initialize email service AFTER env vars are loaded
initEmailService();

// Connect to MongoDB
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// ─── Routes ───
app.use('/api/auth', authRoutes);

// ─── Health check ───
app.get('/api/health', (req, res) => {
    res.json({ success: true, message: 'PMS Backend is running' });
});

// ─── Start server ───
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 PMS Backend running on http://localhost:${PORT}`);
});
