/**
 * User model for PrepSharp
 */

const { pool } = require('../config/database');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

class User {
  /**
   * Create a new user
   * @param {Object} userData - User data
   * @returns {Object} Created user
   */
  static async create(userData) {
    const { name, email, password } = userData;
    const userId = uuidv4();
    const passwordHash = await bcrypt.hash(password, 10);
    
    const query = `
      INSERT INTO users (user_id, name, email, password_hash)
      VALUES (?, ?, ?, ?)
    `;
    
    try {
      await pool.execute(query, [userId, name, email, passwordHash]);
      return { userId, name, email };
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }
  
  /**
   * Find user by email
   * @param {string} email - User email
   * @returns {Object|null} User data or null if not found
   */
  static async findByEmail(email) {
    const query = `
      SELECT user_id, name, email, password_hash, created_at, last_login
      FROM users
      WHERE email = ?
    `;
    
    try {
      const [rows] = await pool.execute(query, [email]);
      return rows.length ? rows[0] : null;
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw error;
    }
  }
  
  /**
   * Find user by ID
   * @param {string} userId - User ID
   * @returns {Object|null} User data or null if not found
   */
  static async findById(userId) {
    const query = `
      SELECT user_id, name, email, created_at, last_login
      FROM users
      WHERE user_id = ?
    `;
    
    try {
      const [rows] = await pool.execute(query, [userId]);
      return rows.length ? rows[0] : null;
    } catch (error) {
      console.error('Error finding user by ID:', error);
      throw error;
    }
  }
  
  /**
   * Update user's last login time
   * @param {string} userId - User ID
   * @returns {boolean} Success status
   */
  static async updateLastLogin(userId) {
    const query = `
      UPDATE users
      SET last_login = CURRENT_TIMESTAMP
      WHERE user_id = ?
    `;
    
    try {
      await pool.execute(query, [userId]);
      return true;
    } catch (error) {
      console.error('Error updating last login:', error);
      throw error;
    }
  }
}

module.exports = User;