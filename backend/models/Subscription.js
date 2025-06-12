/**
 * Subscription model for PrepSharp
 */

const { pool } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class Subscription {
  /**
   * Create a new subscription
   * @param {Object} subscriptionData - Subscription data
   * @returns {Object} Created subscription
   */
  static async create(subscriptionData) {
    const { userId, planId, paymentId } = subscriptionData;
    const subscriptionId = uuidv4();
    
    // Get plan details to calculate end date
    const [planRows] = await pool.execute(
      'SELECT duration_days FROM plans WHERE plan_id = ?',
      [planId]
    );
    
    if (!planRows.length) {
      throw new Error('Plan not found');
    }
    
    const { duration_days } = planRows[0];
    
    // Calculate end date
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + duration_days);
    
    const query = `
      INSERT INTO subscriptions (
        subscription_id, user_id, plan_id, status, 
        start_date, end_date, payment_id
      )
      VALUES (?, ?, ?, 'active', ?, ?, ?)
    `;
    
    try {
      await pool.execute(query, [
        subscriptionId, 
        userId, 
        planId, 
        startDate, 
        endDate, 
        paymentId
      ]);
      
      return {
        subscriptionId,
        userId,
        planId,
        status: 'active',
        startDate,
        endDate,
        paymentId
      };
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw error;
    }
  }
  
  /**
   * Get active subscription for a user
   * @param {string} userId - User ID
   * @returns {Object|null} Subscription data or null if not found
   */
  static async getActiveSubscription(userId) {
    const query = `
      SELECT s.subscription_id, s.user_id, s.plan_id, s.status,
             s.start_date, s.end_date, s.payment_id,
             p.name as plan_name, p.price, p.features
      FROM subscriptions s
      JOIN plans p ON s.plan_id = p.plan_id
      WHERE s.user_id = ? AND s.status = 'active' AND s.end_date > NOW()
      ORDER BY s.created_at DESC
      LIMIT 1
    `;
    
    try {
      const [rows] = await pool.execute(query, [userId]);
      return rows.length ? rows[0] : null;
    } catch (error) {
      console.error('Error getting active subscription:', error);
      throw error;
    }
  }
  
  /**
   * Cancel a subscription
   * @param {string} subscriptionId - Subscription ID
   * @returns {boolean} Success status
   */
  static async cancel(subscriptionId) {
    const query = `
      UPDATE subscriptions
      SET status = 'cancelled'
      WHERE subscription_id = ?
    `;
    
    try {
      const [result] = await pool.execute(query, [subscriptionId]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      throw error;
    }
  }
  
  /**
   * Check if subscriptions are expired and update their status
   * @returns {number} Number of updated subscriptions
   */
  static async checkExpiredSubscriptions() {
    const query = `
      UPDATE subscriptions
      SET status = 'expired'
      WHERE status = 'active' AND end_date < NOW()
    `;
    
    try {
      const [result] = await pool.execute(query);
      return result.affectedRows;
    } catch (error) {
      console.error('Error checking expired subscriptions:', error);
      throw error;
    }
  }
}

module.exports = Subscription;