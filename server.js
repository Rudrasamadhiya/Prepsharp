require('dotenv').config();
const express = require('express');
const cors = require('cors');
const twilio = require('twilio');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const otpStore = new Map();

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

app.post('/api/send-otp', async (req, res) => {
  const { phoneNumber } = req.body;
  const otp = generateOTP();
  
  try {
    // For testing purposes, log the OTP instead of sending SMS
    console.log(`OTP for ${phoneNumber}: ${otp}`);
    
    // Uncomment this to use actual Twilio SMS
    /*
    await client.messages.create({
      body: `Your PrepSharp verification code is: ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber
    });
    */
    
    otpStore.set(phoneNumber, {
      otp,
      expiry: Date.now() + 5 * 60 * 1000
    });
    
    res.json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ success: false, message: 'Failed to send OTP' });
  }
});

app.post('/api/verify-otp', (req, res) => {
  const { phoneNumber, otp } = req.body;
  const storedData = otpStore.get(phoneNumber);
  
  if (!storedData) {
    return res.status(400).json({ success: false, message: 'No OTP found' });
  }
  
  if (storedData.expiry < Date.now()) {
    otpStore.delete(phoneNumber);
    return res.status(400).json({ success: false, message: 'OTP expired' });
  }
  
  if (storedData.otp !== otp) {
    return res.status(400).json({ success: false, message: 'Invalid OTP' });
  }
  
  otpStore.delete(phoneNumber);
  res.json({ 
    success: true, 
    message: 'OTP verified successfully',
    user: { phoneNumber, verified: true }
  });
});

// Serve index.html at the root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));