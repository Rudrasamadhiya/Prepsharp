// Update all free dashboard pages with dark mode support
const fs = require('fs');
const path = require('path');

// List of pages to update
const pages = [
  'dashboard.html',
  'practice-papers.html',
  'analytics.html',
  'question-bank.html',
  'study-plan.html',
  'ai-coach.html',
  'peer-comparison.html',
  'mock-interviews.html',
  'index.html'
];

// Base directory
const baseDir = 'C:\\Users\\HP\\myproject\\jeeapp\\src\\webapp\\Prepsharp\\dashboards\\free';

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
    
    // Add free-theme-manager.js script
    content = content.replace(
      '<script src="js/auth-check-disabled.js"></script>',
      '<script src="js/auth-check-disabled.js"></script>\n    <script src="../../js/free-theme-manager.js"></script>'
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