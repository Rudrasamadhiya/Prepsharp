/**
 * Subscription controller for PrepSharp
 */

const Subscription = require('../models/Subscription');
const User = require('../models/User');
const { pool } = require('../config/database');

/**
 * Get all available plans
 */
exports.getPlans = async (req, res) => {
  try {
    const [plans] = await pool.execute('SELECT * FROM plans');
    
    res.status(200).json({
      success: true,
      plans
    });
  } catch (error) {
    console.error('Error getting plans:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get plans' 
    });
  }
};

/**
 * Create a new subscription
 */
exports.createSubscription = async (req, res) => {
  try {
    const { planId, paymentId } = req.body;
    const userId = req.user.userId;
    
    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    // Check if plan exists
    const [planRows] = await pool.execute(
      'SELECT * FROM plans WHERE plan_id = ?',
      [planId]
    );
    
    if (!planRows.length) {
      return res.status(404).json({ 
        success: false, 
        message: 'Plan not found' 
      });
    }
    
    // Check if user already has an active subscription
    const activeSubscription = await Subscription.getActiveSubscription(userId);
    if (activeSubscription) {
      // Cancel the existing subscription
      await Subscription.cancel(activeSubscription.subscription_id);
    }
    
    // Create new subscription
    const subscription = await Subscription.create({
      userId,
      planId,
      paymentId
    });
    
    res.status(201).json({
      success: true,
      message: 'Subscription created successfully',
      subscription
    });
  } catch (error) {
    console.error('Error creating subscription:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create subscription' 
    });
  }
};

/**
 * Get user's active subscription
 */
exports.getActiveSubscription = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    // Get active subscription
    const subscription = await Subscription.getActiveSubscription(userId);
    
    if (!subscription) {
      return res.status(404).json({ 
        success: false, 
        message: 'No active subscription found' 
      });
    }
    
    res.status(200).json({
      success: true,
      subscription
    });
  } catch (error) {
    console.error('Error getting active subscription:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get subscription' 
    });
  }
};

/**
 * Cancel subscription
 */
exports.cancelSubscription = async (req, res) => {
  try {
    const { subscriptionId } = req.params;
    const userId = req.user.userId;
    
    // Check if subscription belongs to user
    const [subscriptionRows] = await pool.execute(
      'SELECT * FROM subscriptions WHERE subscription_id = ? AND user_id = ?',
      [subscriptionId, userId]
    );
    
    if (!subscriptionRows.length) {
      return res.status(404).json({ 
        success: false, 
        message: 'Subscription not found or not authorized' 
      });
    }
    
    // Cancel subscription
    const success = await Subscription.cancel(subscriptionId);
    
    if (!success) {
      return res.status(400).json({ 
        success: false, 
        message: 'Failed to cancel subscription' 
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Subscription cancelled successfully'
    });
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to cancel subscription' 
    });
  }
};

/**
 * Verify Razorpay payment
 */
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
    
    // In a real implementation, you would verify the signature here
    // using the Razorpay SDK and your secret key
    
    // For demo purposes, we'll just accept the payment
    res.status(200).json({
      success: true,
      message: 'Payment verified successfully'
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to verify payment' 
    });
  }
};