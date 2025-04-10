const mongoose = require('mongoose');
const Booking = require('../model/booking');
const Feedback = require('../model/feedback');
const formBooking = async(req,res)=>{
    try{
        const {datetime,name,email,phone} = req.body;
        if(!datetime || !name || !email || !phone){
            return res.status(400).json({
                success: false,
                message: 'Please fill all the fields',
            })
        }
        const checkDate = await Booking.findOne({datetime});
        // console.log('Check Date:', checkDate);
        if(checkDate){ 
            return res.status(400).json({
                success: false,
                message: 'That time and date has already booked',
            });
        }
        const newBooking = new Booking({
            datetime,
            name,
            email,
            phone
        })
        newBooking.save();
        return res.status(200).json({
            success: true,
            message: 'Booking Successful',
        })
    }catch(err){
        return res.status(500).json({
            error: err.message,
            success: false,
            message: 'Server Error in Booking',
        })
    }
}
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

module.exports = {formBooking,formFeedback};


