const fs = require('fs');
const path = require('path');

// Base directory for standard dashboard pages
const baseDir = path.join(__dirname, 'dashboards', 'standard');

// Pages to update
const pages = [
  'dashboard.html',
  'practice-papers.html',
  'analytics.html',
  'question-bank.html',
  'study-plan.html',
  'settings.html'
];

// Update each page to include the auth-check.js script
pages.forEach(page => {
  const filePath = path.join(baseDir, page);
  if (!fs.existsSync(filePath)) {
    console.warn(`File not found: ${filePath}`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Check if auth-check.js is already included
  if (content.includes('auth-check.js')) {
    console.log(`${page} already includes auth-check.js`);
    return;
  }
  
  // Add auth-check.js script before the first script tag
  const scriptTag = '<script src="../../assets/js/auth-check.js"></script>';
  
  // Find the position to insert the script (before the first existing script)
  const headEndPos = content.indexOf('</head>');
  if (headEndPos !== -1) {
    content = content.slice(0, headEndPos) + 
              `    ${scriptTag}\n` + 
              content.slice(headEndPos);
    
    // Remove any duplicate user name and initials setting code
    // This is now handled by auth-check.js
    content = content.replace(/\/\/ Get logged in user name from session\/localStorage[\s\S]*?function getInitials\(name\)[\s\S]*?}\s*}\);/g, '');
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Added auth-check.js to ${page}`);
  } else {
    console.warn(`Could not find </head> in ${page}`);
  }
});

console.log('Auth check added to all standard dashboard pages.');