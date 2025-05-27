const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Simple in-memory storage
const users = [];

// Add a test user
users.push({
  id: "1001",
  name: "Test User",
  email: "test@example.com",
  mobile: "1234567890",
  password: "password123",
  profileComplete: true,
  stream: "engineering"
});

// Registration endpoint
app.post('/api/register', (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;
    
    // Check if user already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res.json({ 
        success: false, 
        message: 'User with this email already exists' 
      });
    }
    
    // Create new user
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      mobile,
      password,
      profileComplete: false
    };
    
    users.push(newUser);
    console.log('User registered:', newUser);
    
    // Return user data without password
    const userData = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      mobile: newUser.mobile,
      profileComplete: newUser.profileComplete
    };
    
    res.json({ 
      success: true, 
      message: 'Registration successful',
      user: userData
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.json({ 
      success: false, 
      message: 'Server error during registration' 
    });
  }
});

// Login endpoint
app.post('/api/login', (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt:', email);
    
    // Find user by email
    const user = users.find(u => u.email === email);
    console.log('User found:', user ? 'Yes' : 'No');
    
    if (!user || user.password !== password) {
      return res.json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }
    
    // Return user data without password
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      stream: user.stream,
      class: user.class,
      profileComplete: user.profileComplete
    };
    
    console.log('Login successful for:', email);
    res.json({ 
      success: true, 
      message: 'Login successful',
      user: userData
    });
  } catch (error) {
    console.error('Login error:', error);
    res.json({ 
      success: false, 
      message: 'Server error during login' 
    });
  }
});

// Profile setup endpoint
app.post('/api/profile-setup', (req, res) => {
  try {
    const { userId, fullName, phone, stream, className, referral } = req.body;
    
    // Find user
    const user = users.find(u => u.id === userId);
    
    if (user) {
      user.name = fullName || user.name;
      user.mobile = phone || user.mobile;
      user.stream = stream;
      user.class = className;
      user.referral = referral;
      user.profileComplete = true;
      
      console.log('Profile updated for user:', user.email);
      
      res.json({ 
        success: true, 
        message: 'Profile setup completed',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          mobile: user.mobile,
          stream: user.stream,
          class: user.class,
          profileComplete: true
        }
      });
    } else {
      console.log('User not found for profile update, ID:', userId);
      res.json({ 
        success: true, 
        message: 'Profile setup completed',
        user: {
          id: userId,
          name: fullName,
          mobile: phone,
          stream: stream,
          class: className,
          profileComplete: true
        }
      });
    }
  } catch (error) {
    console.error('Profile setup error:', error);
    res.json({ 
      success: false, 
      message: 'Server error during profile setup' 
    });
  }
});

// Get user data endpoint
app.get('/api/user/:id', (req, res) => {
  try {
    const userId = req.params.id;
    const user = users.find(u => u.id === userId);
    
    if (user) {
      res.json({ 
        success: true, 
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          mobile: user.mobile,
          stream: user.stream,
          class: user.class,
          profileComplete: user.profileComplete
        }
      });
    } else {
      res.json({ 
        success: true, 
        user: {
          id: userId,
          profileComplete: true
        }
      });
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    res.json({ 
      success: false, 
      message: 'Server error while fetching user data' 
    });
  }
});

// Serve static files
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, req.path));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));