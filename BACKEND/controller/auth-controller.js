const mongoose = require('mongoose');
const Booking = require('../model/booking');
const Feedback = require('../model/feedback');

const formBooking = async (req, res) => {
  try {
    const { datetime, name, email, phone, serviceName } = req.body;

    // Basic field validation
    if (!datetime || !name || !email || !phone || !serviceName) {
      return res.status(400).json({
        success: false,
        message: 'Please fill all the fields',
      });
    }

    // Check if booking for the same datetime already exists
    const checkDate = await Booking.findOne({ datetime });
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
    });

    await newBooking.save(); 
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

module.exports = {formBooking, formFeedback, deleteBooking};


