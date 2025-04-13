const express = require('express');
const router = express.Router();
const {formBooking, formFeedback, deleteBooking} = require('../controller/auth-controller');
router.post('/booking', formBooking);
router.post('/feedback', formFeedback);
router.delete('/bookings/:id', deleteBooking);
module.exports = router;