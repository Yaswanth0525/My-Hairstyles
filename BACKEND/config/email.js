const nodemailer = require('nodemailer');

// Create transporter for Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail address
    pass: process.env.EMAIL_PASS  // Your Gmail app password
  }
});

// Email templates
const emailTemplates = {
  // Booking notification to owner
  bookingNotification: (bookingData) => ({
    subject: 'New Booking Received',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #333; text-align: center; margin-bottom: 30px;">🎉 New Booking Received!</h2>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #495057; margin-top: 0;">📋 Booking Details</h3>
            <p><strong>Customer Name:</strong> ${bookingData.name}</p>
            <p><strong>Email:</strong> ${bookingData.email}</p>
            <p><strong>Phone:</strong> ${bookingData.phone}</p>
            <p><strong>Service:</strong> ${bookingData.serviceName}</p>
            <p><strong>Date & Time:</strong> ${new Date(bookingData.datetime).toLocaleString()}</p>
            <p><strong>Duration:</strong> ${bookingData.serviceDuration} minutes</p>
            <p><strong>Status:</strong> <span style="color: #ffc107; font-weight: bold;">Pending</span></p>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #6c757d; font-size: 14px;">
              Please log in to your admin panel to accept or reject this booking.
            </p>
          </div>
        </div>
      </div>
    `
  }),

  // Confirmation email to user when booking is accepted
  bookingConfirmation: (bookingData) => ({
    subject: 'Booking Confirmed - My Hairstyles',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #28a745; text-align: center; margin-bottom: 30px;">✅ Booking Confirmed!</h2>
          
          <div style="background-color: #d4edda; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #28a745;">
            <h3 style="color: #155724; margin-top: 0;">🎉 Your booking has been accepted!</h3>
            <p style="color: #155724; margin-bottom: 0;">We're excited to see you!</p>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #495057; margin-top: 0;">📋 Booking Details</h3>
            <p><strong>Service:</strong> ${bookingData.serviceName}</p>
            <p><strong>Date & Time:</strong> ${new Date(bookingData.datetime).toLocaleString()}</p>
            <p><strong>Duration:</strong> ${bookingData.serviceDuration} minutes</p>
            <p><strong>Status:</strong> <span style="color: #28a745; font-weight: bold;">Confirmed</span></p>
          </div>
          
          <div style="background-color: #fff3cd; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <h4 style="color: #856404; margin-top: 0;">📝 Important Reminders</h4>
            <ul style="color: #856404; margin-bottom: 0;">
              <li>Please arrive 5 minutes before your appointment</li>
              <li>Bring any reference photos if needed</li>
              <li>Contact us if you need to reschedule</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #6c757d; font-size: 14px;">
              Thank you for choosing My Hairstyles! We look forward to serving you.
            </p>
          </div>
        </div>
      </div>
    `
  }),

  // Rejection email to user when booking is rejected
  bookingRejection: (bookingData) => ({
    subject: 'Booking Update - My Hairstyles',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #dc3545; text-align: center; margin-bottom: 30px;">❌ Booking Update</h2>
          
          <div style="background-color: #f8d7da; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #dc3545;">
            <h3 style="color: #721c24; margin-top: 0;">We're sorry, but your booking could not be confirmed.</h3>
            <p style="color: #721c24; margin-bottom: 0;">Please contact us to reschedule or choose another time.</p>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #495057; margin-top: 0;">📋 Original Booking Details</h3>
            <p><strong>Service:</strong> ${bookingData.serviceName}</p>
            <p><strong>Date & Time:</strong> ${new Date(bookingData.datetime).toLocaleString()}</p>
            <p><strong>Duration:</strong> ${bookingData.serviceDuration} minutes</p>
            <p><strong>Status:</strong> <span style="color: #dc3545; font-weight: bold;">Rejected</span></p>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #6c757d; font-size: 14px;">
              We apologize for any inconvenience. Please feel free to book another appointment.
            </p>
          </div>
        </div>
      </div>
    `
  })
};

// Function to send email
const sendEmail = async (to, template, data) => {
  try {
    const emailContent = emailTemplates[template](data);
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: to,
      subject: emailContent.subject,
      html: emailContent.html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, error: error.message };
  }
};

module.exports = { sendEmail }; 