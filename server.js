require('dotenv').config();
const express = require('express');
const cors = require('cors');
const twilio = require('twilio');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/prepsharp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Define User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: String, required: true },
  password: { type: String, required: true },
  profileComplete: { type: Boolean, default: false },
  stream: String,
  class: String,
  referral: String,
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

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

// User registration endpoint
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'User with this email already exists' 
      });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create new user
    const user = new User({
      name,
      email,
      mobile,
      password: hashedPassword,
      profileComplete: false
    });
    
    await user.save();
    
    // Return user data without password
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      profileComplete: user.profileComplete
    };
    
    res.json({ 
      success: true, 
      message: 'Registration successful',
      user: userData
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during registration' 
    });
  }
});

// Profile setup endpoint
app.post('/api/profile-setup', async (req, res) => {
  try {
    const { userId, fullName, phone, stream, className, referral } = req.body;
    
    // Find and update user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    // Update user profile
    user.name = fullName || user.name;
    user.mobile = phone || user.mobile;
    user.stream = stream;
    user.class = className;
    user.referral = referral;
    user.profileComplete = true;
    
    await user.save();
    
    // Return updated user data
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      stream: user.stream,
      class: user.class,
      profileComplete: user.profileComplete
    };
    
    res.json({ 
      success: true, 
      message: 'Profile setup completed',
      user: userData
    });
  } catch (error) {
    console.error('Profile setup error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during profile setup' 
    });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }
    
    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }
    
    // Return user data without password
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      stream: user.stream,
      class: user.class,
      profileComplete: user.profileComplete
    };
    
    res.json({ 
      success: true, 
      message: 'Login successful',
      user: userData
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during login' 
    });
  }
});

// Get user data endpoint
app.get('/api/user/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    // Return user data without password
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      stream: user.stream,
      class: user.class,
      profileComplete: user.profileComplete
    };
    
    res.json({ 
      success: true, 
      user: userData
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching user data' 
    });
  }
});

// Serve index.html at the root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));