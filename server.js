const express = require('express');
const path = require('path');
const fs = require('fs');
const { sendOTP, verifyOTP } = require('./otp-service');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Database file paths
const USERS_DB_PATH = path.join(__dirname, 'db', 'users.json');
const RESULTS_DB_PATH = path.join(__dirname, 'db', 'results.json');
const PAPERS_DB_PATH = path.join(__dirname, 'db', 'papers.json');

// Create db directory if it doesn't exist
try {
  if (!fs.existsSync(path.join(__dirname, 'db'))) {
    fs.mkdirSync(path.join(__dirname, 'db'), { recursive: true });
    console.log('Created db directory');
  }

  // Initialize database files if they don't exist
  if (!fs.existsSync(USERS_DB_PATH)) {
    fs.writeFileSync(USERS_DB_PATH, JSON.stringify({}));
    console.log('Created users.json file');
  }
  if (!fs.existsSync(RESULTS_DB_PATH)) {
    fs.writeFileSync(RESULTS_DB_PATH, JSON.stringify([]));
    console.log('Created results.json file');
  }
  if (!fs.existsSync(PAPERS_DB_PATH)) {
    fs.writeFileSync(PAPERS_DB_PATH, JSON.stringify([]));
    console.log('Created papers.json file');
  }
  
  // Create temp-users.json for storing unverified users
  const TEMP_USERS_PATH = path.join(__dirname, 'db', 'temp-users.json');
  if (!fs.existsSync(TEMP_USERS_PATH)) {
    fs.writeFileSync(TEMP_USERS_PATH, JSON.stringify({}));
    console.log('Created temp-users.json file');
  }
} catch (error) {
  console.error('Error creating database files:', error);
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

function getPapers() {
  return JSON.parse(fs.readFileSync(PAPERS_DB_PATH));
}

function savePapers(papers) {
  fs.writeFileSync(PAPERS_DB_PATH, JSON.stringify(papers, null, 2));
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

// Registration endpoint - sends OTP for verification
app.post('/api/register', async (req, res) => {
  const { name, email, mobile } = req.body;
  
  try {
    // Generate and send OTP
    const result = await sendOTP(email);
    
    if (result.success) {
      // Store user data temporarily (should use database in production)
      const tempUsers = JSON.parse(fs.readFileSync(path.join(__dirname, 'db', 'temp-users.json'), 'utf8') || '{}');
      
      tempUsers[email] = {
        name,
        email,
        mobile,
        createdAt: Date.now()
      };
      
      fs.writeFileSync(path.join(__dirname, 'db', 'temp-users.json'), JSON.stringify(tempUsers, null, 2));
      
      res.json({ 
        success: true, 
        message: 'OTP sent to your email',
        email: email
      });
    } else {
      res.status(500).json({ 
        success: false, 
        message: 'Failed to send verification email'
      });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'An error occurred during registration'
    });
  }
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

// Create new exam paper
app.post('/api/papers', (req, res) => {
  const paperData = req.body;
  
  // Generate paper name based on exam type
  let paperName = '';
  
  if (paperData.type === 'jee-main') {
    // Format: JEE Main - DD/MM SHIFT# YYYY
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthName = monthNames[parseInt(paperData.month) - 1];
    paperName = `JEE Main - ${paperData.date}/${monthName} Shift ${paperData.shift} ${paperData.year}`;
  } else if (paperData.type === 'jee-advanced') {
    // Format: JEE Advanced - Paper # YYYY
    paperName = `JEE Advanced - Paper ${paperData.paperNumber} ${paperData.year}`;
  } else {
    // Format: EXAM NAME YYYY
    const examNames = {
      'neet': 'NEET',
      'bitsat': 'BITSAT',
      'aiims': 'AIIMS'
    };
    const examName = examNames[paperData.type] || paperData.type.toUpperCase();
    paperName = `${examName} ${paperData.year}`;
  }
  
  // Add unique ID and created timestamp
  const paper = {
    ...paperData,
    id: Date.now().toString(),
    name: paperName,
    createdAt: new Date().toISOString(),
    questions: []
  };
  
  // Save to database
  const papers = getPapers();
  papers.push(paper);
  savePapers(papers);
  
  res.json({ 
    success: true, 
    message: 'Paper created successfully',
    paper: paper
  });
});

// Get all papers
app.get('/api/papers', (req, res) => {
  const papers = getPapers();
  
  res.json({
    success: true,
    papers: papers
  });
});

// Get a specific paper by ID
app.get('/api/papers/:paperId', (req, res) => {
  const paperId = req.params.paperId;
  const paper = getPapers().find(p => p.id === paperId);
  
  if (paper) {
    res.json({
      success: true,
      paper: paper
    });
  } else {
    res.status(404).json({
      success: false,
      message: 'Paper not found'
    });
  }
});

// Update a paper by ID
app.put('/api/papers/:paperId', (req, res) => {
  const paperId = req.params.paperId;
  const updateData = req.body;
  const papers = getPapers();
  const paperIndex = papers.findIndex(p => p.id === paperId);
  
  if (paperIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Paper not found'
    });
  }
  
  // Update the paper with new data
  papers[paperIndex] = {
    ...papers[paperIndex],
    ...updateData,
    updatedAt: new Date().toISOString()
  };
  
  savePapers(papers);
  
  res.json({
    success: true,
    message: 'Paper updated successfully',
    paper: papers[paperIndex]
  });
});

// Add question to paper
app.post('/api/papers/:paperId/questions', (req, res) => {
  const paperId = req.params.paperId;
  const questionData = req.body;
  const papers = getPapers();
  const paperIndex = papers.findIndex(p => p.id === paperId);
  
  if (paperIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Paper not found'
    });
  }
  
  // Add question ID if not provided
  if (!questionData.id) {
    questionData.id = Date.now().toString();
  }
  
  // Add question to paper
  papers[paperIndex].questions.push(questionData);
  savePapers(papers);
  
  res.json({
    success: true,
    message: 'Question added successfully',
    questionId: questionData.id
  });
});

// Serve static files
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, req.path));
});

// Verify OTP endpoint
app.post('/api/verify-otp', (req, res) => {
  const { email, otp } = req.body;
  
  if (!email || !otp) {
    return res.status(400).json({
      success: false,
      message: 'Email and OTP are required'
    });
  }
  
  // Verify OTP
  const result = verifyOTP(email, otp);
  
  if (result.success) {
    try {
      // Get temp user data
      const tempUsersPath = path.join(__dirname, 'db', 'temp-users.json');
      const tempUsers = JSON.parse(fs.readFileSync(tempUsersPath, 'utf8') || '{}');
      
      if (!tempUsers[email]) {
        return res.status(400).json({
          success: false,
          message: 'User registration data not found'
        });
      }
      
      // Move user from temp to permanent storage
      const users = getUsers();
      const userId = Date.now().toString();
      
      users[userId] = {
        id: userId,
        name: tempUsers[email].name,
        email: email,
        mobile: tempUsers[email].mobile,
        verified: true,
        profileComplete: false,
        createdAt: Date.now()
      };
      
      // Save user
      saveUsers(users);
      
      // Remove from temp storage
      delete tempUsers[email];
      fs.writeFileSync(tempUsersPath, JSON.stringify(tempUsers, null, 2));
      
      // Return success with user data
      res.json({
        success: true,
        message: 'Email verified successfully',
        redirectUrl: 'profile-setup.html',
        user: {
          id: userId,
          name: users[userId].name,
          email: users[userId].email,
          mobile: users[userId].mobile,
          profileComplete: false
        }
      });
    } catch (error) {
      console.error('Error during verification:', error);
      res.status(500).json({
        success: false,
        message: 'An error occurred during verification'
      });
    }
  } else {
    res.status(400).json({
      success: false,
      message: result.message
    });
  }
});

// Resend OTP endpoint
app.post('/api/resend-otp', async (req, res) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({
      success: false,
      message: 'Email is required'
    });
  }
  
  try {
    // Check if user exists in temp storage
    const tempUsersPath = path.join(__dirname, 'db', 'temp-users.json');
    const tempUsers = JSON.parse(fs.readFileSync(tempUsersPath, 'utf8') || '{}');
    
    if (!tempUsers[email]) {
      return res.status(400).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Generate and send new OTP
    const result = await sendOTP(email);
    
    if (result.success) {
      res.json({
        success: true,
        message: 'OTP resent successfully'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to send verification email'
      });
    }
  } catch (error) {
    console.error('Error resending OTP:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while resending OTP'
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));