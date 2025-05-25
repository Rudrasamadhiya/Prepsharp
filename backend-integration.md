# SMS OTP Integration Guide

This guide explains how to integrate a real SMS service with your OTP system.

## 1. Choose an SMS Provider

Popular options include:
- [Twilio](https://www.twilio.com/)
- [MessageBird](https://www.messagebird.com/)
- [Vonage (formerly Nexmo)](https://www.vonage.com/)
- [AWS SNS](https://aws.amazon.com/sns/)

## 2. Create a Backend API

You'll need a backend API with these endpoints:

### Send OTP Endpoint
```
POST /api/send-otp
```

**Request:**
```json
{
  "phoneNumber": "+919876543210"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent successfully"
}
```

### Verify OTP Endpoint
```
POST /api/verify-otp
```

**Request:**
```json
{
  "phoneNumber": "+919876543210",
  "otp": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP verified successfully",
  "user": {
    "phoneNumber": "+919876543210",
    "verified": true
  }
}
```

## 3. Backend Implementation (Node.js Example with Twilio)

```javascript
const express = require('express');
const twilio = require('twilio');
const app = express();
app.use(express.json());

// Twilio configuration
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

// In-memory OTP storage (use a database in production)
const otpStore = new Map();

// Generate a random 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send OTP endpoint
app.post('/api/send-otp', async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    
    if (!phoneNumber) {
      return res.status(400).json({
        success: false,
        message: 'Phone number is required'
      });
    }
    
    // Generate OTP
    const otp = generateOTP();
    
    // Store OTP with expiration (15 minutes)
    otpStore.set(phoneNumber, {
      otp,
      expiry: Date.now() + 15 * 60 * 1000
    });
    
    // Send SMS via Twilio
    await twilioClient.messages.create({
      body: `Your PrepSharp verification code is: ${otp}`,
      from: twilioPhoneNumber,
      to: phoneNumber
    });
    
    res.json({
      success: true,
      message: 'OTP sent successfully'
    });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send OTP'
    });
  }
});

// Verify OTP endpoint
app.post('/api/verify-otp', (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;
    
    if (!phoneNumber || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Phone number and OTP are required'
      });
    }
    
    // Get stored OTP data
    const otpData = otpStore.get(phoneNumber);
    
    // Check if OTP exists and is valid
    if (!otpData) {
      return res.status(400).json({
        success: false,
        message: 'No OTP found for this number'
      });
    }
    
    // Check if OTP is expired
    if (otpData.expiry < Date.now()) {
      otpStore.delete(phoneNumber);
      return res.status(400).json({
        success: false,
        message: 'OTP has expired'
      });
    }
    
    // Verify OTP
    if (otpData.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP'
      });
    }
    
    // OTP is valid, clear it from store
    otpStore.delete(phoneNumber);
    
    // Return success
    res.json({
      success: true,
      message: 'OTP verified successfully',
      user: {
        phoneNumber,
        verified: true
      }
    });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify OTP'
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

## 4. Update Frontend Code

Replace the OTPService in index.html with this:

```javascript
const OTPService = {
    apiUrl: 'https://your-api-url.com/api',
    
    // Send OTP
    async sendOTP(phoneNumber) {
        try {
            const response = await axios.post(`${this.apiUrl}/send-otp`, {
                phoneNumber
            });
            return response.data;
        } catch (error) {
            console.error('Error sending OTP:', error);
            throw error;
        }
    },
    
    // Verify OTP
    async verifyOTP(phoneNumber, otp) {
        try {
            const response = await axios.post(`${this.apiUrl}/verify-otp`, {
                phoneNumber,
                otp
            });
            return response.data;
        } catch (error) {
            console.error('Error verifying OTP:', error);
            throw error;
        }
    }
};
```

## 5. Security Considerations

1. **Rate Limiting**: Limit the number of OTP requests per phone number
2. **OTP Expiry**: Set a short expiration time (5-15 minutes)
3. **Limited Attempts**: Allow only 3-5 verification attempts before requiring a new OTP
4. **Secure Storage**: Use a database instead of in-memory storage
5. **HTTPS**: Ensure all API endpoints use HTTPS
6. **Environment Variables**: Store API keys and secrets as environment variables