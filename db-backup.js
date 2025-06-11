const fs = require('fs');
const path = require('path');

// Configuration
const DB_DIR = path.join(__dirname, 'db');
const BACKUP_DIR = path.join(__dirname, 'db_backup');
const BACKUP_INTERVAL = 3600000; // 1 hour in milliseconds
const MAX_BACKUPS = 5; // Keep 5 most recent backups

// Create backup directory if it doesn't exist
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
  console.log('Created backup directory');
}

// Function to create backup of all database files
function createBackup() {
  try {
    // Get current timestamp for backup folder name
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFolder = path.join(BACKUP_DIR, timestamp);
    
    // Create backup folder for this backup
    fs.mkdirSync(backupFolder, { recursive: true });
    
    // Read all files in the db directory
    const files = fs.readdirSync(DB_DIR);
    
    // Copy each file to the backup folder
    files.forEach(file => {
      if (file.endsWith('.json')) {
        const srcPath = path.join(DB_DIR, file);
        const destPath = path.join(backupFolder, file);
        
        // Only backup if file has content
        const content = fs.readFileSync(srcPath, 'utf8');
        if (content && content !== '{}' && content !== '[]') {
          fs.copyFileSync(srcPath, destPath);
          console.log(`Backed up ${file}`);
        }
      }
    });
    
    // Clean up old backups
    cleanupOldBackups();
    
    console.log(`Backup completed at ${new Date().toLocaleString()}`);
    return true;
  } catch (error) {
    console.error('Backup failed:', error);
    return false;
  }
}

// Function to clean up old backups
function cleanupOldBackups() {
  try {
    // Get all backup folders
    const backupFolders = fs.readdirSync(BACKUP_DIR);
    
    // If we have more than MAX_BACKUPS, delete the oldest ones
    if (backupFolders.length > MAX_BACKUPS) {
      // Sort folders by name (timestamp) in ascending order
      backupFolders.sort();
      
      // Delete the oldest folders
      const foldersToDelete = backupFolders.slice(0, backupFolders.length - MAX_BACKUPS);
      foldersToDelete.forEach(folder => {
        const folderPath = path.join(BACKUP_DIR, folder);
        deleteFolder(folderPath);
        console.log(`Deleted old backup: ${folder}`);
      });
    }
  } catch (error) {
    console.error('Error cleaning up old backups:', error);
  }
}

// Helper function to delete a folder recursively
function deleteFolder(folderPath) {
  if (fs.existsSync(folderPath)) {
    fs.readdirSync(folderPath).forEach(file => {
      const curPath = path.join(folderPath, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        deleteFolder(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(folderPath);
  }
}

// Function to restore from the most recent backup
function restoreFromLatestBackup() {
  try {
    // Get all backup folders
    const backupFolders = fs.readdirSync(BACKUP_DIR);
    
    if (backupFolders.length === 0) {
      console.log('No backups available to restore');
      return false;
    }
    
    // Sort folders by name (timestamp) in ascending order
    backupFolders.sort();
    
    // Get the most recent backup folder
    const latestBackup = backupFolders[backupFolders.length - 1];
    const backupPath = path.join(BACKUP_DIR, latestBackup);
    
    // Read all files in the backup folder
    const files = fs.readdirSync(backupPath);
    
    // Copy each file to the db directory
    files.forEach(file => {
      const srcPath = path.join(backupPath, file);
      const destPath = path.join(DB_DIR, file);
      
      // Check if source file has content
      const content = fs.readFileSync(srcPath, 'utf8');
      if (content && content !== '{}' && content !== '[]') {
        // Check if destination file is empty
        let destContent = '{}';
        try {
          destContent = fs.readFileSync(destPath, 'utf8');
        } catch (error) {
          // File might not exist
        }
        
        if (destContent === '{}' || destContent === '[]') {
          fs.copyFileSync(srcPath, destPath);
          console.log(`Restored ${file} from backup`);
        }
      }
    });
    
    console.log(`Restore completed from backup: ${latestBackup}`);
    return true;
  } catch (error) {
    console.error('Restore failed:', error);
    return false;
  }
}

// Create initial backup
createBackup();

// Schedule regular backups
setInterval(createBackup, BACKUP_INTERVAL);

module.exports = {
  createBackup,
  restoreFromLatestBackup
};