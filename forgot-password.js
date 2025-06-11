// Server-side code for handling password reset requests

// Mock database of users (in a real app, this would be your actual database)
const users = [
  { email: "test@example.com", password: "password123", name: "Test User" },
  { email: "user@prepsharp.com", password: "userpass", name: "PrepSharp User" }
];

// Function to verify if email exists in database
function verifyEmail(email) {
  return users.find(user => user.email === email);
}

// Generate a random token
function generateResetToken() {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

// Store tokens with expiration (in a real app, this would be in a database)
const resetTokens = {};

// Process password reset request
function handlePasswordReset(email) {
  // Check if email exists
  const user = verifyEmail(email);
  
  if (!user) {
    return { success: false, message: "Email not found in our records" };
  }
  
  // Generate token
  const token = generateResetToken();
  
  // Store token with 1-hour expiration
  const expiryTime = new Date();
  expiryTime.setHours(expiryTime.getHours() + 1);
  
  resetTokens[email] = {
    token: token,
    expiry: expiryTime
  };
  
  // In a real app, send email with reset link
  const resetLink = `https://yourwebsite.com/reset-password.html?token=${token}&email=${encodeURIComponent(email)}`;
  
  console.log(`Password reset requested for: ${email}`);
  console.log(`Reset link: ${resetLink}`);
  console.log(`Token will expire at: ${expiryTime}`);
  
  // This would be where you'd call your email sending function
  sendResetEmail(email, resetLink, user.name);
  
  return { success: true, message: "Password reset link sent to your email" };
}

// Function to send email (mock implementation)
function sendResetEmail(email, resetLink, userName) {
  // In a real app, this would use a service like SendGrid, Mailgun, etc.
  console.log(`
    To: ${email}
    Subject: PrepSharp Password Reset
    
    Hello ${userName},
    
    You requested a password reset for your PrepSharp account.
    Click the link below to reset your password:
    
    ${resetLink}
    
    This link will expire in 1 hour.
    
    If you didn't request this reset, please ignore this email.
    
    PrepSharp Team
  `);
}

// Function to verify token and reset password
function resetPassword(email, token, newPassword) {
  // Check if token exists and is valid
  if (!resetTokens[email] || resetTokens[email].token !== token) {
    return { success: false, message: "Invalid or expired token" };
  }
  
  // Check if token is expired
  if (new Date() > resetTokens[email].expiry) {
    delete resetTokens[email]; // Clean up expired token
    return { success: false, message: "Reset link has expired" };
  }
  
  // Find user and update password
  const userIndex = users.findIndex(user => user.email === email);
  if (userIndex !== -1) {
    users[userIndex].password = newPassword;
    
    // Remove used token
    delete resetTokens[email];
    
    return { success: true, message: "Password has been reset successfully" };
  }
  
  return { success: false, message: "User not found" };
}

// Export functions for use in your application
module.exports = {
  handlePasswordReset,
  resetPassword
};