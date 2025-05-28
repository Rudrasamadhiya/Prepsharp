const express = require('express');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
require('dotenv').config();

const app = express();

// Security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:"],
    },
  },
  // For development only, remove in production
  crossOriginEmbedderPolicy: false,
}));

// Parse cookies (needed for CSRF)
app.use(cookieParser());

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'prepsharp-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production', 
    httpOnly: true,
    sameSite: 'strict'
  }
}));

// Rate limiting for login/register
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: 'Too many login attempts, please try again later'
});

// Apply rate limiting to auth routes
app.use('/api/login', authLimiter);
app.use('/api/register', authLimiter);

// CSRF protection
const csrfProtection = csrf({ cookie: true });

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
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

// Password hashing functions
async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

async function comparePassword(password, hash) {
  return await bcrypt.compare(password, hash);
}

// CSRF token route
app.get('/api/csrf-token', csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// Login endpoint with validation and security
app.post('/api/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 })
], csrfProtection, async (req, res) => {
  // Validate input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false,
      errors: errors.array() 
    });
  }

  const { email, password } = req.body;
  
  try {
    // Get users from database
    const users = getUsers();
    
    // Find user by email
    const user = Object.values(users).find(u => u.email === email);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
    
    // Check password
    const passwordMatch = await comparePassword(password, user.passwordHash);
    
    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
    
    // Set user in session
    req.session.userId = user.id;
    
    // Return user data (excluding sensitive info)
    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        stream: user.stream,
        profileComplete: user.profileComplete
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred during login'
    });
  }
});

// Registration endpoint with validation
app.post('/api/register', [
  body('name').trim().isLength({ min: 2 }),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }),
  body('mobile').isMobilePhone()
], csrfProtection, async (req, res) => {
  // Validate input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false,
      errors: errors.array() 
    });
  }

  const { name, email, password, mobile } = req.body;
  
  try {
    // Check if user already exists
    const users = getUsers();
    if (Object.values(users).some(u => u.email === email)) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }
    
    // Hash password
    const passwordHash = await hashPassword(password);
    
    // Create new user
    const userId = Date.now().toString();
    users[userId] = {
      id: userId,
      name,
      email,
      mobile,
      passwordHash,
      profileComplete: false,
      createdAt: new Date().toISOString()
    };
    
    // Save user
    saveUsers(users);
    
    // Set user in session
    req.session.userId = userId;
    
    // Return success
    res.json({
      success: true,
      message: 'Registration successful',
      user: {
        id: userId,
        name,
        email,
        mobile,
        profileComplete: false
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

// Authentication middleware
function requireAuth(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }
  
  // Get user from database
  const users = getUsers();
  const user = users[req.session.userId];
  
  if (!user) {
    // Clear invalid session
    req.session.destroy();
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }
  
  // Add user to request
  req.user = user;
  next();
}

// Profile setup endpoint
app.post('/api/profile-setup', [
  body('fullName').trim().isLength({ min: 2 }),
  body('stream').isIn(['engineering', 'medical', 'other'])
], csrfProtection, requireAuth, (req, res) => {
  // Validate input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false,
      errors: errors.array() 
    });
  }

  const { fullName, stream } = req.body;
  
  try {
    // Update user profile
    const users = getUsers();
    users[req.user.id].name = fullName;
    users[req.user.id].stream = stream;
    users[req.user.id].profileComplete = true;
    
    // Save updated user
    saveUsers(users);
    
    // Return updated user
    res.json({
      success: true,
      message: 'Profile setup completed',
      user: {
        id: req.user.id,
        name: fullName,
        email: req.user.email,
        mobile: req.user.mobile,
        stream: stream,
        profileComplete: true
      }
    });
  } catch (error) {
    console.error('Profile setup error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred during profile setup'
    });
  }
});

// Get user data endpoint
app.get('/api/user', requireAuth, (req, res) => {
  // Return user data (excluding sensitive info)
  res.json({
    success: true,
    user: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      mobile: req.user.mobile,
      stream: req.user.stream,
      profileComplete: req.user.profileComplete
    }
  });
});

// Logout endpoint
app.post('/api/logout', csrfProtection, (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Failed to logout'
      });
    }
    
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  });
});

// Save exam result endpoint
app.post('/api/results', csrfProtection, requireAuth, (req, res) => {
  const result = req.body;
  
  // Add user ID, unique ID and timestamp
  result.userId = req.user.id;
  result.id = Date.now().toString();
  result.date = new Date().toISOString();
  
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

// Get all results for current user
app.get('/api/results', requireAuth, (req, res) => {
  const results = getResults().filter(result => result.userId === req.user.id);
  
  res.json({
    success: true,
    results: results
  });
});

// Get a specific result by ID
app.get('/api/results/:resultId', requireAuth, (req, res) => {
  const resultId = req.params.resultId;
  const result = getResults().find(r => r.id === resultId);
  
  // Check if result exists and belongs to user
  if (!result || result.userId !== req.user.id) {
    return res.status(404).json({
      success: false,
      message: 'Result not found'
    });
  }
  
  res.json({
    success: true,
    result: result
  });
});

// Error handler
app.use((err, req, res, next) => {
  if (err.code === 'EBADCSRFTOKEN') {
    return res.status(403).json({
      success: false,
      message: 'Invalid or missing CSRF token'
    });
  }
  
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    message: 'An unexpected error occurred'
  });
});

// Serve static files for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, req.path));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Secure server running on port ${PORT}`));