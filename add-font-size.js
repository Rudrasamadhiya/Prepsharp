// Add font-size.css to all free dashboard pages
const fs = require('fs');
const path = require('path');

// List of pages to update
const pages = [
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
    
    // Add font-size.css link
    content = content.replace(
      '<link rel="stylesheet" href="../../assets/css/dark-mode.css">',
      '<link rel="stylesheet" href="../../assets/css/dark-mode.css">\n    <link rel="stylesheet" href="../../assets/css/font-size.css">'
    );
    
    // Write the updated content back to the file
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${page}`);
  } catch (error) {
    console.error(`Error updating ${page}:`, error);
  }
});