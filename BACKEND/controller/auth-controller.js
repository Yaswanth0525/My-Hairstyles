const mongoose = require('mongoose');
const Booking = require('../model/booking');
const Feedback = require('../model/feedback');
const User = require('../model/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sendEmail } = require('../config/email');

const formBooking = async (req, res) => {
  try {
    const { datetime, name, email, phone, serviceName, serviceDuration } = req.body;

    // Basic field validation
    if (!datetime || !name || !email || !phone || !serviceName || !serviceDuration) {
      return res.status(400).json({
        success: false,
        message: 'Please fill all the fields',
      });
    }

    // Check if booking for the same datetime already exists (overlap logic can be improved)
    const checkDate = await Booking.findOne({ 
      datetime,
      status: { $nin: ['cancelled', 'rejected'] } // Only check active bookings
    });
    if (checkDate) {
      return res.status(400).json({
        success: false,
        message: 'That time and date has already been booked',
      });
    }

    // Create and save new booking
    const newBooking = new Booking({
      datetime,
      name,
      email,
      phone,
      serviceName,
      serviceDuration, // <-- Save duration
      status: 'pending'
    });

    await newBooking.save(); 
    
    // Send email notification to owner
    const ownerEmail = process.env.OWNER_EMAIL || 'your-email@gmail.com'; // Set this in your .env file
    const emailResult = await sendEmail(ownerEmail, 'bookingNotification', {
      name,
      email,
      phone,
      serviceName,
      serviceDuration,
      datetime
    });
    
    if (!emailResult.success) {
      console.error('Failed to send booking notification email:', emailResult.error);
    }
    
    return res.status(200).json({
      success: true,
      message: 'Booking successful',
    });
  } catch (err) {
    console.error('Booking error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error in booking',
      error: err.message,
    });
  }
};

const formFeedback = async(req,res)=>{
    try{
        // Verify DB connection
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({
                success: false,
                message: 'Database not connected'
            });
        }

        const {name,email,message} = req.body;
        console.log('Received feedback data:', req.body); // Log incoming data
        const newFeedback = new Feedback({
            name,
            email,
            message
        })
        await newFeedback.save();
        // console.log('Feedback saved successfully');
        return res.status(200).json({
            success: true,
            message: 'Feedback Submitted',
        })
    }catch(err){
        console.error('Detailed feedback error:', {
            message: err.message,
            stack: err.stack,
            requestBody: req.body
        });
        return res.status(500).json({
            success: false,
            message: 'Server Error in Feedback',
            error: err.message
        })
    }
}

const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking ID'
      });
    }

    const deletedBooking = await Booking.findByIdAndDelete(id);
    
    if (!deletedBooking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Booking deleted successfully'
    });
  } catch (err) {
    console.error('Delete booking error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error while deleting booking',
      error: err.message
    });
  }
};

// Public endpoint to check slot availability
const checkSlotAvailability = async (req, res) => {
  try {
    const { datetime } = req.query;

    if (!datetime) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a datetime'
      });
    }

    // Check if the slot is already booked
    const existingBooking = await Booking.findOne({
      datetime: new Date(datetime),
      status: { $nin: ['cancelled', 'rejected'] }
    });

    return res.status(200).json({
      success: true,
      available: !existingBooking,
      message: existingBooking ? 'Slot is not available' : 'Slot is available'
    });
  } catch (err) {
    console.error('Check slot availability error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error while checking slot availability',
      error: err.message
    });
  }
};

// Public endpoint to get all bookings (for users to view)
const getAllBookingsPublic = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ datetime: -1 });
    
    return res.status(200).json({
      success: true,
      bookings: bookings,
    });
  } catch (err) {
    console.error('Get all bookings error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching bookings',
      error: err.message,
    });
  }
};

// Admin-only endpoint to get all bookings
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ datetime: -1 });
    
    return res.status(200).json({
      success: true,
      bookings: bookings,
    });
  } catch (err) {
    console.error('Get all bookings error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching bookings',
      error: err.message,
    });
  }
};

// Admin-only endpoint to update booking status
const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking ID'
      });
    }

    if (!['pending', 'accepted', 'rejected', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedBooking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Send email to customer based on status
    if (status === 'accepted') {
      const emailResult = await sendEmail(updatedBooking.email, 'bookingConfirmation', {
        name: updatedBooking.name,
        email: updatedBooking.email,
        serviceName: updatedBooking.serviceName,
        serviceDuration: updatedBooking.serviceDuration,
        datetime: updatedBooking.datetime
      });
      
      if (!emailResult.success) {
        console.error('Failed to send confirmation email:', emailResult.error);
      }
    } else if (status === 'rejected') {
      const emailResult = await sendEmail(updatedBooking.email, 'bookingRejection', {
        name: updatedBooking.name,
        email: updatedBooking.email,
        serviceName: updatedBooking.serviceName,
        serviceDuration: updatedBooking.serviceDuration,
        datetime: updatedBooking.datetime
      });
      
      if (!emailResult.success) {
        console.error('Failed to send rejection email:', emailResult.error);
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Booking status updated successfully',
      booking: updatedBooking
    });
  } catch (err) {
    console.error('Update booking status error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error while updating booking status',
      error: err.message
    });
  }
};

const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide username and password',
      });
    }

    // Find admin user
    const admin = await User.findOne({ username });
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: admin._id, username: admin.username, role: 'admin' },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '24h' }
    );

    return res.status(200).json({
      success: true,
      message: 'Admin login successful',
      token,
      user: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: 'admin'
      }
    });
  } catch (err) {
    console.error('Admin login error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error in admin login',
      error: err.message,
    });
  }
};

const adminRegister = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please fill all the fields',
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ username }, { email }]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Username or email already exists',
      });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new admin user
    const newAdmin = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newAdmin.save();

    return res.status(201).json({
      success: true,
      message: 'Admin user created successfully',
    });
  } catch (err) {
    console.error('Admin registration error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error in admin registration',
      error: err.message,
    });
  }
};

const getAllFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find().sort({ createdAt: -1 });
    
    return res.status(200).json({
      success: true,
      feedback: feedback,
    });
  } catch (err) {
    console.error('Get all feedback error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching feedback',
      error: err.message,
    });
  }
};

const deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid feedback ID'
      });
    }

    const deletedFeedback = await Feedback.findByIdAndDelete(id);
    
    if (!deletedFeedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Feedback deleted successfully'
    });
  } catch (err) {
    console.error('Delete feedback error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error while deleting feedback',
      error: err.message
    });
  }
};

const SERVICE_DURATIONS = {
  "Classic Haircut": 30,
  "Beard Trim": 20,
  "Hot Towel Shave": 30,
  "Hair & Beard Combo": 60,
  // Add all your services here
};

const getUnavailableSlots = async (req, res) => {
  try {
    const { date, serviceName } = req.query;
    if (!date || !serviceName) return res.status(400).json({ success: false, message: 'Missing params' });

    const serviceDuration = SERVICE_DURATIONS[serviceName];
    if (!serviceDuration) return res.status(400).json({ success: false, message: 'Invalid service' });

    const dayStart = new Date(date + 'T00:00:00');
    const dayEnd = new Date(date + 'T23:59:59');

    const bookings = await Booking.find({
      serviceName,
      status: { $nin: ['cancelled', 'rejected'] },
      datetime: { $gte: dayStart, $lte: dayEnd }
    });

    // Return array of { start, end } for each booking
    const blocked = bookings.map(b => ({
      start: b.datetime,
      end: new Date(new Date(b.datetime).getTime() + serviceDuration * 60000)
    }));

    res.json({ success: true, blocked });
  } catch (err) {
    console.error('Get unavailable slots error:', err);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

module.exports = {
  formBooking, 
  formFeedback, 
  deleteBooking,
  checkSlotAvailability,
  getAllBookingsPublic,
  getAllBookings,
  updateBookingStatus,
  adminLogin,
  adminRegister,
  getAllFeedback,
  deleteFeedback,
  getUnavailableSlots
};


