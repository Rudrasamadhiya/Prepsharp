const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

// Middleware to check if user has an active subscription
function checkSubscription(req, res, next) {
  // Skip subscription check for these paths
  const openPaths = [
    '/api/login',
    '/api/register',
    '/api/subscription/plans',
    '/api/subscription/subscribe',
    '/api/subscription/status',
    '/api/check-email',
    '/api/check-mobile',
    '/api/send-otp',
    '/api/verify-otp',
    '/api/resend-otp',
    '/api/profile-setup'
  ];
  
  // Check if path is in open paths
  for (const openPath of openPaths) {
    if (req.path.startsWith(openPath)) {
      return next();
    }
  }
  
  // Get user ID from token
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return next(); // No token, proceed (will be handled by auth middleware)
  }
  
  try {
    // Verify token
    const JWT_SECRET = process.env.JWT_SECRET || 'change-this-to-a-long-random-string-in-production';
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;
    
    // Check if user has active subscription
    const SUBSCRIPTIONS_DB_PATH = path.join(__dirname, 'db', 'subscriptions.json');
    
    if (!fs.existsSync(SUBSCRIPTIONS_DB_PATH)) {
      return next(); // No subscriptions database, proceed
    }
    
    const subscriptionsData = fs.readFileSync(SUBSCRIPTIONS_DB_PATH, 'utf8');
    const subscriptions = JSON.parse(subscriptionsData || '{}');
    
    // Check if user has any subscriptions
    if (!subscriptions[userId] || subscriptions[userId].length === 0) {
      // Allow access to free content
      if (req.path.includes('free') || req.path.includes('basic')) {
        return next();
      }
      
      return res.status(403).json({
        success: false,
        message: 'Subscription required',
        requiresSubscription: true
      });
    }
    
    // Check if user has active subscription
    const userSubscriptions = subscriptions[userId];
    const activeSubscriptions = userSubscriptions.filter(sub => {
      return sub.status === 'active' && new Date(sub.expiryDate) > new Date();
    });
    
    if (activeSubscriptions.length === 0) {
      // Allow access to free content
      if (req.path.includes('free') || req.path.includes('basic')) {
        return next();
      }
      
      return res.status(403).json({
        success: false,
        message: 'Active subscription required',
        requiresSubscription: true
      });
    }
    
    // User has active subscription, proceed
    next();
  } catch (error) {
    console.error('Error checking subscription:', error);
    next(); // Proceed on error (will be handled by auth middleware)
  }
}

module.exports = function(app) {
  // Add subscription check middleware
  app.use(checkSubscription);
  
  // Add other security middleware here
  app.use((req, res, next) => {
    // Set security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
  });
};