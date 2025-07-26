const express = require('express');
const router = express.Router();
const {formBooking, formFeedback, deleteBooking, checkSlotAvailability, getAllBookingsPublic, getAllBookings, updateBookingStatus, adminLogin, adminRegister, getAllFeedback, deleteFeedback, getUnavailableSlots} = require('../controller/auth-controller');
const authMiddleware = require('../middleware/auth-middle');

// Public routes
router.post('/booking', formBooking);
router.post('/feedback', formFeedback);
router.delete('/bookings/:id', deleteBooking);

// Public booking viewing and slot checking
router.get('/bookings', getAllBookingsPublic);
router.get('/check-slot', checkSlotAvailability);
router.get('/unavailable-slots', getUnavailableSlots);

// Admin authentication routes
router.post('/admin/login', adminLogin);
// router.post('/admin/register', adminRegister); // Registration disabled for security

// Admin-only routes (protected with authentication)
router.get('/admin/bookings', authMiddleware, getAllBookings);
router.put('/admin/bookings/:id/status', authMiddleware, updateBookingStatus);
router.delete('/admin/bookings/:id', authMiddleware, deleteBooking);
router.get('/admin/feedback', authMiddleware, getAllFeedback);
router.delete('/admin/feedback/:id', authMiddleware, deleteFeedback);

module.exports = router;