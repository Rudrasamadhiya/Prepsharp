const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Login endpoint - always returns success
app.post('/api/login', (req, res) => {
  const { email } = req.body;
  
  // Always return success with user data
  res.json({ 
    success: true, 
    message: 'Login successful',
    user: {
      id: '12345',
      name: 'Test User',
      email: email,
      mobile: '1234567890',
      stream: 'engineering',
      profileComplete: true
    }
  });
});

// Registration endpoint - always returns success
app.post('/api/register', (req, res) => {
  const { name, email, mobile } = req.body;
  
  // Always return success
  res.json({ 
    success: true, 
    message: 'Registration successful',
    user: {
      id: '12345',
      name: name,
      email: email,
      mobile: mobile,
      profileComplete: false
    }
  });
});

// Profile setup endpoint - always returns success
app.post('/api/profile-setup', (req, res) => {
  const { fullName, stream } = req.body;
  
  // Always return success
  res.json({ 
    success: true, 
    message: 'Profile setup completed',
    user: {
      id: '12345',
      name: fullName,
      email: 'user@example.com',
      mobile: '1234567890',
      stream: stream,
      profileComplete: true
    }
  });
});

// Get user data endpoint
app.get('/api/user/:id', (req, res) => {
  // Always return success with engineering stream
  res.json({ 
    success: true, 
    user: {
      id: req.params.id,
      name: 'Test User',
      email: 'user@example.com',
      mobile: '1234567890',
      stream: 'engineering',
      profileComplete: true
    }
  });
});

// Serve static files
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, req.path));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));