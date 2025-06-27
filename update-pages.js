// Script to update all premium pages with dark mode support
const fs = require('fs');
const path = require('path');

// List of pages to update
const pages = [
  'practice-papers.html',
  'analytics.html',
  'question-bank.html',
  'study-plan.html',
  'peer-comparison.html',
  'mock-interviews.html'
];

// Base directory
const baseDir = 'C:\\Users\\HP\\myproject\\jeeapp\\src\\webapp\\Prepsharp\\dashboards\\premium';

// Process each page
pages.forEach(page => {
  const filePath = path.join(baseDir, page);
  
  try {
    // Read the file
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Add dark-mode.css link
    content = content.replace(
      '<link rel="stylesheet" href="../../assets/css/dashboard.css">',
      '<link rel="stylesheet" href="../../assets/css/dashboard.css">\n    <link rel="stylesheet" href="../../assets/css/dark-mode.css">'
    );
    
    // Add theme-manager.js script
    content = content.replace(
      '<script src="../../js/auth-check-bypass.js"></script>',
      '<script src="../../js/auth-check-bypass.js"></script>\n    <script src="../../js/theme-manager.js"></script>'
    );
    
    // Update logo
    content = content.replace(
      '<img src="../../prepsharp-logo.png"',
      '<img src="../../logo for index (1).png"'
    );
    
    // Write the updated content back to the file
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${page}`);
  } catch (error) {
    console.error(`Error updating ${page}:`, error);
  }
});

console.log('All pages updated successfully!');