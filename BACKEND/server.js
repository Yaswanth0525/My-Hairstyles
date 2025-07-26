require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth-routes');
const Booking = require('./model/booking');
const app = express();
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');

// CORS configuration - must be before other middleware
app.use(cors({
  origin: true, // Allow all origins for debugging
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Debug middleware to log requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - Origin: ${req.headers.origin}`);
  next();
});

app.use(helmet());

// Rate limiting to prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
});
app.use(limiter);

connectDB().catch(err => {
  console.error('Failed to connect to MongoDB:', err);
  process.exit(1);
});

// Add health check endpoint
app.get('/disco/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({
    status: 'up', 
    db: dbStatus,
    timestamp: new Date()
  });
});

// Add test endpoint for debugging
app.get('/disco/test', (req, res) => {
  res.json({
    message: 'Backend is working!',
    timestamp: new Date().toISOString()
  });
});

app.use(express.json());
app.set('trust proxy', 1)

// Remove the old bookings endpoint since we have it in routes now
// app.get('/disco/bookings/retrieve', async (req, res) => {
//   try {
//     const bookings = await Booking.find().sort({ datetime: 1 });
//     res.status(200).json({
//       success: true,
//       bookings: bookings,
//     });
//   } catch (err) {
//     res.status(500).json({ error: 'Server Error' });
//   }
// });

app.use('/disco/', authRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log('CORS origins allowed:', [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'http://localhost:3001',
    'https://my-hairstyles.vercel.app',
    'https://my-hairstyles-1.onrender.com'
  ]);
});