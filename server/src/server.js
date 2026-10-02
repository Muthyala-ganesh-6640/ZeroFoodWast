import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import http from 'http';
import dotenv from 'dotenv';

import { connectDB } from './config/db.js';
import { seedDemoData } from './utils/seed.js';
import { initSocketServer } from './sockets/index.js';
import authRoutes from './routes/authRoutes.js';
import donationRoutes from './routes/donationRoutes.js';
import partnerRoutes from './routes/partnerRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import Donation from './models/Donation.js';
import User from './models/User.js';
import Partner from './models/Partner.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_URL || '*',
    credentials: true,
  })
);
app.use(helmet());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    message: 'Too many requests from this IP. Please try again later.',
  })
);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'ZeroFoodWaste API is running.' });
});

app.get('/api/public/stats', async (req, res) => {
  try {
    const [totalFoodRescued, totalMealsServed, activeDonors, verifiedPartners, completedDeliveries] = await Promise.all([
      Donation.aggregate([{ $group: { _id: null, total: { $sum: '$quantity' } } }]),
      Donation.aggregate([{ $group: { _id: null, total: { $sum: '$servings' } } }]),
      User.countDocuments({ role: 'DONOR' }),
      Partner.countDocuments({ verificationStatus: 'VERIFIED' }),
      Donation.countDocuments({ status: 'COMPLETED' }),
    ]);

    return res.json({
      totalFoodRescued: totalFoodRescued[0]?.total || 0,
      totalMealsServed: totalMealsServed[0]?.total || 0,
      activeDonors: activeDonors || 0,
      verifiedPartners: verifiedPartners || 0,
      completedDeliveries: completedDeliveries || 0,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Unable to fetch public stats.' });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/partners', partnerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: err.message || 'Internal server error.' });
});

const startServer = async () => {
  try {
    await connectDB();
    await seedDemoData();
    initSocketServer(server);

    server.listen(port, () => {
      console.log(`ZeroFoodWaste server running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Server startup failed:', error);
    process.exit(1);
  }
};

startServer();
