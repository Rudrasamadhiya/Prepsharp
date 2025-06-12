/**
 * Database setup script for PrepSharp
 */

const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  multipleStatements: true
};

async function setupDatabase() {
  let connection;
  
  try {
    // Create connection
    connection = await mysql.createConnection(dbConfig);
    
    // Create database if it doesn't exist
    const dbName = process.env.DB_NAME || 'prepsharp_db';
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
    console.log(`Database '${dbName}' created or already exists`);
    
    // Use the database
    await connection.query(`USE ${dbName}`);
    
    // Read schema file
    const schemaPath = path.join(__dirname, 'models', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Execute schema
    await connection.query(schema);
    console.log('Database schema created successfully');
    
    console.log('Database setup completed');
  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run setup
setupDatabase();