// This is a simple OTP service for development purposes
// In production, use a proper email service like SendGrid, Mailgun, etc.

// Store OTPs in memory (use a database in production)
const otpStore = {};

// Generate a random 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send OTP to email (mock implementation)
async function sendOTP(email) {
  try {
    // Generate OTP
    const otp = generateOTP();
    
    // Store OTP with expiration time (15 minutes)
    otpStore[email] = {
      otp,
      expiresAt: Date.now() + 15 * 60 * 1000 // 15 minutes
    };
    
    // In a real implementation, you would send an email here
    console.log(`OTP for ${email}: ${otp}`);
    
    return {
      success: true,
      message: 'OTP sent successfully'
    };
  } catch (error) {
    console.error('Error sending OTP:', error);
    return {
      success: false,
      message: 'Failed to send OTP'
    };
  }
}

// Verify OTP
function verifyOTP(email, otp) {
  // Check if OTP exists for email
  if (!otpStore[email]) {
    return {
      success: false,
      message: 'OTP not found or expired'
    };
  }
  
  // Check if OTP is expired
  if (otpStore[email].expiresAt < Date.now()) {
    delete otpStore[email]; // Clean up expired OTP
    return {
      success: false,
      message: 'OTP expired'
    };
  }
  
  // Check if OTP matches
  if (otpStore[email].otp !== otp) {
    return {
      success: false,
      message: 'Invalid OTP'
    };
  }
  
  // OTP is valid, clean up
  delete otpStore[email];
  
  return {
    success: true,
    message: 'OTP verified successfully'
  };
}

module.exports = {
  sendOTP,
  verifyOTP
};