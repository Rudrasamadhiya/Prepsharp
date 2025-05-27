const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Simple in-memory storage
const users = [];

// Registration endpoint
app.post('/api/register', (req, res) => {
  const { name, email, mobile, password } = req.body;
  
  // Create user
  const user = { 
    id: Date.now().toString(),
    name, 
    email, 
    mobile, 
    password,
    profileComplete: false
  };
  
  users.push(user);
  
  res.json({ 
    success: true, 
    message: 'Registration successful',
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      profileComplete: false
    }
  });
});

// Profile setup endpoint
app.post('/api/profile-setup', (req, res) => {
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
});

// Get user data endpoint
app.get('/api/user/:id', (req, res) => {
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
});

// Serve static files
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, req.path));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
