const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  datetime: {
    type: Date,
    required: true,
  },
  serviceName: {
    type: String,
    required: true,
    trim: true,
  },
  serviceDuration: {
    type: Number, // Duration in minutes
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
  },
  phone: {
    type: String,
    required: true,
    trim: true,
    match: [/^[6-9]\d{9}$/, 'Please enter a valid Indian phone number'],
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'cancelled'],
    default: 'pending',
    required: true,
  }
}, {timestamps: true,});
module.exports = mongoose.model('Booking', bookingSchema);
