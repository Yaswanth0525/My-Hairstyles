require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth-routes');
const Booking = require('./model/booking');
const app = express();
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
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

const cors = require('cors');
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://my-hairstyles.vercel.app',
    'https://my-hairstyles-1.onrender.com' 
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.set('trust proxy', 1)
app.get('/disco/bookings/retrieve', async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ datetime: 1 });
    res.status(200).json({
      success: true,
      bookings: bookings,
    });
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
});
app.use('/disco/',authRoutes);
const PORT = process.env.PORT || 4000;
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})