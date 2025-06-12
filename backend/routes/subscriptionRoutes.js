/**
 * Subscription routes for PrepSharp
 */

const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');
const authenticate = require('../middleware/authMiddleware');

// Get all plans (public)
router.get('/plans', subscriptionController.getPlans);

// Protected routes (require authentication)
router.use(authenticate);

// Create subscription
router.post('/', subscriptionController.createSubscription);

// Get active subscription
router.get('/active', subscriptionController.getActiveSubscription);

// Cancel subscription
router.delete('/:subscriptionId', subscriptionController.cancelSubscription);

// Verify Razorpay payment
router.post('/verify-payment', subscriptionController.verifyPayment);

module.exports = router;