const express = require('express');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const app = express();
const dbBackup = require('./db-backup');

// Load environment variables
dotenv.config();

// Set JWT secret from environment or use a default (in production, always use environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'change-this-to-a-long-random-string-in-production';

// Apply security middleware
require('./security-middleware')(app);

// Optional OTP service import
let sendOTP, verifyOTP;
try {
  const otpService = require('./otp-service');
  sendOTP = otpService.sendOTP;
  verifyOTP = otpService.verifyOTP;
} catch (error) {
  console.log('OTP service not available, some features will be disabled');
  sendOTP = () => ({ success: false, message: 'OTP service not available' });
  verifyOTP = () => ({ success: false, message: 'OTP service not available' });
}

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
  
  // Try to restore data if files are empty
  const usersData = fs.readFileSync(USERS_DB_PATH, 'utf8');
  const resultsData = fs.readFileSync(RESULTS_DB_PATH, 'utf8');
  const papersData = fs.readFileSync(PAPERS_DB_PATH, 'utf8');
  
  if ((usersData === '{}' || resultsData === '[]' || papersData === '[]') && 
      dbBackup && typeof dbBackup.restoreFromLatestBackup === 'function') {
    console.log('Detected empty database files, attempting to restore from backup...');
    dbBackup.restoreFromLatestBackup();
  }
} catch (error) {
  console.error('Error creating database files:', error);
}

// Helper functions for database operations
function getUsers() {
  try {
    const data = fs.readFileSync(USERS_DB_PATH, 'utf8');
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Error reading users database:', error);
    return {};
  }
}

function saveUsers(users) {
  try {
    fs.writeFileSync(USERS_DB_PATH, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error('Error saving users database:', error);
  }
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

// Login endpoint - handles both regular login and OTP login
app.post('/api/login', async (req, res) => {
  const { email, password, loginMethod } = req.body;
  
  // Get users from database
  const users = getUsers();
  
  // Find user by email
  const userId = Object.keys(users).find(id => users[id].email === email);
  const user = userId ? users[userId] : null;
  
  if (loginMethod === 'otp') {
    // OTP login flow
    try {
      // Send OTP for verification
      const result = await sendOTP(email);
      
      if (result.success) {
        res.json({ 
          success: true, 
          message: 'OTP sent to your email',
          email: email,
          requiresOTP: true
        });
      } else {
        res.status(500).json({ 
          success: false, 
          message: 'Failed to send verification email'
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'An error occurred during login'
      });
    }
  } else {
    // Regular password login
    if (!user) {
      // User not found
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password'
      });
    }
    
    // In a real app, you would verify the password hash here
    // For demo, we'll just check if password exists
    if (!password) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password'
      });
    }
    
    // Check if user is verified
    if (!user.verified) {
      // Send OTP for verification
      try {
        const result = await sendOTP(email);
        
        if (result.success) {
          return res.json({ 
            success: true, 
            message: 'Please verify your email first',
            email: email,
            requiresVerification: true
          });
        } else {
          return res.status(500).json({ 
            success: false, 
            message: 'Failed to send verification email'
          });
        }
      } catch (error) {
        console.error('Verification error:', error);
        return res.status(500).json({ 
          success: false, 
          message: 'An error occurred during verification'
        });
      }
    }
    
    // Login successful
    res.json({ 
      success: true, 
      message: 'Login successful',
      user: {
        id: userId,
        name: user.name,
        email: user.email,
        mobile: user.mobile || '',
        stream: user.stream || 'engineering',
        profileComplete: user.profileComplete || false
      }
    });
  }
});

// Check if email exists endpoint
app.get('/api/check-email', (req, res) => {
  const email = req.query.email;
  
  if (!email) {
    return res.status(400).json({ 
      success: false, 
      message: 'Email parameter is required'
    });
  }
  
  try {
    const users = getUsers();
    const exists = Object.values(users).some(user => user.email === email);
    
    res.json({
      success: true,
      exists: exists
    });
  } catch (error) {
    console.error('Error checking email:', error);
    res.status(500).json({ 
      success: false, 
      message: 'An error occurred while checking email'
    });
  }
});

// Check if mobile exists endpoint
app.get('/api/check-mobile', (req, res) => {
  const mobile = req.query.mobile;
  
  if (!mobile) {
    return res.status(400).json({ 
      success: false, 
      message: 'Mobile parameter is required'
    });
  }
  
  try {
    const users = getUsers();
    const exists = Object.values(users).some(user => user.mobile === mobile);
    
    res.json({
      success: true,
      exists: exists
    });
  } catch (error) {
    console.error('Error checking mobile:', error);
    res.status(500).json({ 
      success: false, 
      message: 'An error occurred while checking mobile'
    });
  }
});

// Registration endpoint - direct registration without OTP
app.post('/api/register', async (req, res) => {
  const { name, email, mobile, password } = req.body;
  
  try {
    // Check if user already exists
    const users = getUsers();
    const existingEmail = Object.values(users).find(user => user.email === email);
    
    if (existingEmail) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email already registered'
      });
    }
    
    // Check if mobile already exists
    const existingMobile = Object.values(users).find(user => user.mobile === mobile);
    
    if (existingMobile) {
      return res.status(400).json({ 
        success: false, 
        message: 'Mobile number already registered'
      });
    }
    
    // Create new user
    const userId = Date.now().toString();
    users[userId] = {
      id: userId,
      name,
      email,
      mobile,
      password, // In production, this should be hashed
      verified: true,
      profileComplete: false,
      createdAt: Date.now()
    };
    
    // Save to database
    saveUsers(users);
    
    res.json({ 
      success: true, 
      message: 'Registration successful',
      user: {
        id: userId,
        name,
        email,
        mobile
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'An error occurred during registration'
    });
  }
});

// Profile setup endpoint - updates user data in database
app.post('/api/profile-setup', (req, res) => {
  const { userId, fullName, stream, classValue, mobile, referral } = req.body;
  
  if (!userId) {
    return res.status(400).json({
      success: false,
      message: 'User ID is required'
    });
  }
  
  try {
    // Get users from database
    const users = getUsers();
    
    // Check if user exists
    if (!users[userId]) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Update user data
    users[userId].name = fullName || users[userId].name;
    users[userId].stream = stream || users[userId].stream;
    users[userId].class = classValue || users[userId].class;
    users[userId].mobile = mobile || users[userId].mobile;
    users[userId].referral = referral || users[userId].referral;
    users[userId].profileComplete = true;
    
    // Save updated user data
    saveUsers(users);
    
    // Return success with updated user data
    res.json({ 
      success: true, 
      message: 'Profile setup completed',
      user: {
        id: userId,
        name: users[userId].name,
        email: users[userId].email,
        mobile: users[userId].mobile,
        stream: users[userId].stream,
        class: users[userId].class,
        profileComplete: true
      }
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while updating profile'
    });
  }
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

// Get all users endpoint
app.get('/api/users', (req, res) => {
  try {
    const users = getUsers();
    res.json({
      success: true,
      users: users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users'
    });
  }
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
  
  // Clean up questions array if it exists
  if (paperData.questions) {
    paperData.questions = paperData.questions.filter(q => q !== null);
  } else {
    paperData.questions = [];
  }
  
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
    createdAt: new Date().toISOString()
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
  
  // Clean up questions array - remove null entries
  if (updateData.questions) {
    updateData.questions = updateData.questions.filter(q => q !== null);
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
  
  // Initialize questions array if it doesn't exist
  if (!papers[paperIndex].questions) {
    papers[paperIndex].questions = [];
  }
  
  // Add question to paper
  papers[paperIndex].questions.push(questionData);
  
  // Log for debugging
  console.log(`Added question to paper ${paperId}. Total questions: ${papers[paperIndex].questions.length}`);
  
  savePapers(papers);
  
  res.json({
    success: true,
    message: 'Question added successfully',
    questionId: questionData.id,
    paperName: papers[paperIndex].name,
    totalQuestions: papers[paperIndex].questions.length
  });
});

// Serve static files
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, req.path));
});

// Send OTP endpoint
app.post('/api/send-otp', async (req, res) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({
      success: false,
      message: 'Email is required'
    });
  }
  
  try {
    // Generate and send OTP
    const result = await sendOTP(email);
    
    if (result.success) {
      res.json({
        success: true,
        message: 'OTP sent successfully'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to send verification email'
      });
    }
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while sending OTP'
    });
  }
});

// Send OTP endpoint
app.post('/api/send-otp', async (req, res) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({
      success: false,
      message: 'Email is required'
    });
  }
  
  try {
    // Generate and send OTP
    const result = await sendOTP(email);
    
    if (result.success) {
      res.json({
        success: true,
        message: 'OTP sent successfully'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to send verification email'
      });
    }
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while sending OTP'
    });
  }
});

// Verify OTP endpoint
app.post('/api/verify-otp', (req, res) => {
  const { email, otp, isLogin } = req.body;
  
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
      // Get users from database
      const users = getUsers();
      
      // Check if this is a login attempt or registration verification
      if (isLogin) {
        // Find user by email
        const userId = Object.keys(users).find(id => users[id].email === email);
        
        if (!userId) {
          return res.status(400).json({
            success: false,
            message: 'User not found'
          });
        }
        
        // Mark user as verified if not already
        if (!users[userId].verified) {
          users[userId].verified = true;
          saveUsers(users);
        }
        
        // Return success with user data
        return res.json({
          success: true,
          message: 'Login successful',
          redirectUrl: 'dashboard.html',
          user: {
            id: userId,
            name: users[userId].name,
            email: users[userId].email,
            mobile: users[userId].mobile || '',
            stream: users[userId].stream || 'engineering',
            profileComplete: users[userId].profileComplete || false
          }
        });
      } else {
        // This is a registration verification
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
        const userId = Date.now().toString();
        
        users[userId] = {
          id: userId,
          name: tempUsers[email].name,
          email: email,
          mobile: tempUsers[email].mobile,
          password: tempUsers[email].password, // In production, this should be hashed
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
      }
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

// Send OTP endpoint for registration and login
app.post('/api/send-otp', async (req, res) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({
      success: false,
      message: 'Email is required'
    });
  }
  
  try {
    // Generate and send OTP
    const result = await sendOTP(email);
    
    if (result.success) {
      res.json({
        success: true,
        message: 'OTP sent successfully'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to send verification email'
      });
    }
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while sending OTP'
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