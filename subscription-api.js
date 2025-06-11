const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Database file path
const SUBSCRIPTIONS_DB_PATH = path.join(__dirname, 'db', 'subscriptions.json');

// Helper functions for subscription operations
function getSubscriptions() {
  try {
    const data = fs.readFileSync(SUBSCRIPTIONS_DB_PATH, 'utf8');
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Error reading subscriptions database:', error);
    return {};
  }
}

function saveSubscriptions(subscriptions) {
  try {
    fs.writeFileSync(SUBSCRIPTIONS_DB_PATH, JSON.stringify(subscriptions, null, 2));
  } catch (error) {
    console.error('Error saving subscriptions database:', error);
  }
}

// Get users helper function
function getUsers() {
  try {
    const USERS_DB_PATH = path.join(__dirname, 'db', 'users.json');
    const data = fs.readFileSync(USERS_DB_PATH, 'utf8');
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Error reading users database:', error);
    return {};
  }
}

function saveUsers(users) {
  try {
    const USERS_DB_PATH = path.join(__dirname, 'db', 'users.json');
    fs.writeFileSync(USERS_DB_PATH, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error('Error saving users database:', error);
  }
}

// Subscription plans endpoint - get available plans
router.get('/plans', (req, res) => {
  // Define subscription plans
  const plans = [
    {
      id: 'basic',
      name: 'Basic Plan',
      price: 499,
      duration: 30, // days
      features: [
        'Access to JEE Main practice papers',
        'Basic performance analytics',
        'Limited question bank access'
      ]
    },
    {
      id: 'standard',
      name: 'Standard Plan',
      price: 999,
      duration: 90, // days
      features: [
        'Access to JEE Main & Advanced practice papers',
        'Detailed performance analytics',
        'Full question bank access',
        'Personalized study plan'
      ]
    },
    {
      id: 'premium',
      name: 'Premium Plan',
      price: 1999,
      duration: 365, // days
      features: [
        'Access to all exam papers (JEE, NEET, BITSAT)',
        'Advanced performance analytics',
        'Complete question bank access',
        'Personalized study plan',
        'Mock test series',
        'Doubt solving support'
      ]
    }
  ];
  
  res.json({
    success: true,
    plans: plans
  });
});

// Subscribe to a plan endpoint
router.post('/subscribe', (req, res) => {
  const { userId, planId, paymentId } = req.body;
  
  // Validate input
  if (!userId || !planId) {
    return res.status(400).json({
      success: false,
      message: 'User ID and Plan ID are required'
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
    
    // Get available plans
    const plans = [
      {
        id: 'basic',
        name: 'Basic Plan',
        price: 499,
        duration: 30 // days
      },
      {
        id: 'standard',
        name: 'Standard Plan',
        price: 999,
        duration: 90 // days
      },
      {
        id: 'premium',
        name: 'Premium Plan',
        price: 1999,
        duration: 365 // days
      }
    ];
    
    // Find selected plan
    const selectedPlan = plans.find(plan => plan.id === planId);
    
    if (!selectedPlan) {
      return res.status(404).json({
        success: false,
        message: 'Plan not found'
      });
    }
    
    // Calculate expiry date
    const now = new Date();
    const expiryDate = new Date(now);
    expiryDate.setDate(now.getDate() + selectedPlan.duration);
    
    // Create subscription record
    const subscriptionId = Date.now().toString();
    const subscription = {
      id: subscriptionId,
      userId: userId,
      planId: planId,
      planName: selectedPlan.name,
      startDate: now.toISOString(),
      expiryDate: expiryDate.toISOString(),
      status: 'active',
      paymentId: paymentId || 'manual-entry',
      createdAt: now.toISOString()
    };
    
    // Save to subscriptions database
    const subscriptions = getSubscriptions();
    
    // Initialize user subscriptions array if it doesn't exist
    if (!subscriptions[userId]) {
      subscriptions[userId] = [];
    }
    
    // Add new subscription
    subscriptions[userId].push(subscription);
    
    // Save updated subscriptions
    saveSubscriptions(subscriptions);
    
    // Update user record with subscription info
    users[userId].hasActiveSubscription = true;
    users[userId].currentSubscription = {
      id: subscriptionId,
      planId: planId,
      planName: selectedPlan.name,
      expiryDate: expiryDate.toISOString()
    };
    
    // Save updated user data
    saveUsers(users);
    
    res.json({
      success: true,
      message: 'Subscription activated successfully',
      subscription: subscription
    });
  } catch (error) {
    console.error('Subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while processing subscription'
    });
  }
});

// Get user subscription status
router.get('/status/:userId', (req, res) => {
  const userId = req.params.userId;
  
  if (!userId) {
    return res.status(400).json({
      success: false,
      message: 'User ID is required'
    });
  }
  
  try {
    // Get subscriptions from database
    const subscriptions = getSubscriptions();
    
    // Check if user has any subscriptions
    if (!subscriptions[userId] || subscriptions[userId].length === 0) {
      return res.json({
        success: true,
        hasActiveSubscription: false,
        message: 'No active subscription found'
      });
    }
    
    // Get the latest subscription
    const userSubscriptions = subscriptions[userId];
    const activeSubscriptions = userSubscriptions.filter(sub => {
      return sub.status === 'active' && new Date(sub.expiryDate) > new Date();
    });
    
    if (activeSubscriptions.length === 0) {
      return res.json({
        success: true,
        hasActiveSubscription: false,
        message: 'No active subscription found',
        expiredSubscriptions: userSubscriptions.filter(sub => sub.status === 'active')
      });
    }
    
    // Sort by expiry date (descending) to get the one that expires last
    activeSubscriptions.sort((a, b) => new Date(b.expiryDate) - new Date(a.expiryDate));
    const currentSubscription = activeSubscriptions[0];
    
    res.json({
      success: true,
      hasActiveSubscription: true,
      subscription: currentSubscription
    });
  } catch (error) {
    console.error('Error fetching subscription status:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching subscription status'
    });
  }
});

// Cancel subscription endpoint
router.post('/cancel', (req, res) => {
  const { userId, subscriptionId } = req.body;
  
  // Validate input
  if (!userId || !subscriptionId) {
    return res.status(400).json({
      success: false,
      message: 'User ID and Subscription ID are required'
    });
  }
  
  try {
    // Get subscriptions from database
    const subscriptions = getSubscriptions();
    
    // Check if user has any subscriptions
    if (!subscriptions[userId] || subscriptions[userId].length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No subscriptions found for this user'
      });
    }
    
    // Find the subscription to cancel
    const subscriptionIndex = subscriptions[userId].findIndex(sub => sub.id === subscriptionId);
    
    if (subscriptionIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found'
      });
    }
    
    // Update subscription status
    subscriptions[userId][subscriptionIndex].status = 'cancelled';
    subscriptions[userId][subscriptionIndex].cancelledAt = new Date().toISOString();
    
    // Save updated subscriptions
    saveSubscriptions(subscriptions);
    
    // Update user record
    const users = getUsers();
    if (users[userId]) {
      users[userId].hasActiveSubscription = false;
      delete users[userId].currentSubscription;
      saveUsers(users);
    }
    
    res.json({
      success: true,
      message: 'Subscription cancelled successfully'
    });
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while cancelling subscription'
    });
  }
});

module.exports = router;