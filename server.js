const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Database file paths
const USERS_DB_PATH = path.join(__dirname, 'db', 'users.json');
const RESULTS_DB_PATH = path.join(__dirname, 'db', 'results.json');

// Create db directory if it doesn't exist
if (!fs.existsSync(path.join(__dirname, 'db'))) {
  fs.mkdirSync(path.join(__dirname, 'db'));
}

// Initialize database files if they don't exist
if (!fs.existsSync(USERS_DB_PATH)) {
  fs.writeFileSync(USERS_DB_PATH, JSON.stringify({}));
}
if (!fs.existsSync(RESULTS_DB_PATH)) {
  fs.writeFileSync(RESULTS_DB_PATH, JSON.stringify([]));
}

// Helper functions for database operations
function getUsers() {
  return JSON.parse(fs.readFileSync(USERS_DB_PATH));
}

function saveUsers(users) {
  fs.writeFileSync(USERS_DB_PATH, JSON.stringify(users, null, 2));
}

function getResults() {
  return JSON.parse(fs.readFileSync(RESULTS_DB_PATH));
}

function saveResults(results) {
  fs.writeFileSync(RESULTS_DB_PATH, JSON.stringify(results, null, 2));
}

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

// Save exam result endpoint
app.post('/api/results', (req, res) => {
  const result = req.body;
  
  // Add unique ID and timestamp if not provided
  if (!result.id) {
    result.id = Date.now().toString();
  }
  if (!result.date) {
    result.date = new Date().toISOString();
  }
  
  // Save to database
  const results = getResults();
  results.push(result);
  saveResults(results);
  
  res.json({ 
    success: true, 
    message: 'Result saved successfully',
    resultId: result.id
  });
});

// Get all results for a user
app.get('/api/results/user/:userId', (req, res) => {
  const userId = req.params.userId;
  const results = getResults().filter(result => result.userId === userId);
  
  res.json({
    success: true,
    results: results
  });
});

// Get a specific result by ID
app.get('/api/results/:resultId', (req, res) => {
  const resultId = req.params.resultId;
  const result = getResults().find(r => r.id === resultId);
  
  if (result) {
    res.json({
      success: true,
      result: result
    });
  } else {
    res.status(404).json({
      success: false,
      message: 'Result not found'
    });
  }
});

// Serve static files
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, req.path));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));