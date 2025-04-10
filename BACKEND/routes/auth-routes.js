const express = require('express');
const router = express.Router();
const {formBooking,formFeedback} = require('../controller/auth-controller');
router.post('/booking',formBooking);
router.post('/feedback',formFeedback);
module.exports = router;