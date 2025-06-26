const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

admin.initializeApp();

// Configure nodemailer with your email service
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-app-password'
  }
});

exports.sendEmailOTP = functions.firestore
  .document('mail/{mailId}')
  .onCreate(async (snap, context) => {
    const mailData = snap.data();
    
    try {
      // Send email
      await transporter.sendMail({
        from: '"PrepSharp" <your-email@gmail.com>',
        to: mailData.to,
        subject: mailData.message.subject,
        html: mailData.message.html
      });
      
      // Update status
      await snap.ref.update({
        status: 'sent',
        sentAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      return null;
    } catch (error) {
      console.error('Error sending email:', error);
      
      // Update status
      await snap.ref.update({
        status: 'error',
        error: error.message
      });
      
      return null;
    }
  });