const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// In-memory user storage for testing
const users = [];
let userId = 1000;

// Registration endpoint
app.post('/api/register', (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;
    
    // Check if user already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'User with this email already exists' 
      });
    }
    
    // Create new user
    const newUser = {
      id: (userId++).toString(),
      name,
      email,
      mobile,
      password,
      profileComplete: false
    };
    
    users.push(newUser);
    
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
    res.status(500).json({ 
      success: false, 
      message: 'Server error during registration' 
    });
  }
});

// Profile setup endpoint
app.post('/api/profile-setup', (req, res) => {
  try {
    const { userId, fullName, phone, stream, className, referral } = req.body;
    
    // Find user
    const user = users.find(u => u.id === userId);
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
    
    // Return updated user data
    const userData = {
      id: user.id,
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
app.post('/api/login', (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = users.find(u => u.email === email);
    if (!user || user.password !== password) {
      return res.status(400).json({ 
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
app.get('/api/user/:id', (req, res) => {
  try {
    const userId = req.params.id;
    const user = users.find(u => u.id === userId);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
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
