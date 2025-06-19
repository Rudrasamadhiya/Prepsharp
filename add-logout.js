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

// Update each page to include the logout.js script
pages.forEach(page => {
  const filePath = path.join(baseDir, page);
  if (!fs.existsSync(filePath)) {
    console.warn(`File not found: ${filePath}`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Check if logout.js is already included
  if (content.includes('logout.js')) {
    console.log(`${page} already includes logout.js`);
    return;
  }
  
  // Add logout.js script before the closing body tag
  const scriptTag = '<script src="../../assets/js/logout.js"></script>';
  
  // Find the position to insert the script (before the closing body tag)
  const bodyEndPos = content.lastIndexOf('</body>');
  if (bodyEndPos !== -1) {
    content = content.slice(0, bodyEndPos) + 
              `    ${scriptTag}\n` + 
              content.slice(bodyEndPos);
    
    // Update the logout link to use the correct href
    content = content.replace(
      /<a href="\.\.\/\.\.\/index\.html" class="dropdown-item"><i class="fas fa-sign-out-alt"><\/i> Logout<\/a>/g,
      '<a href="#" class="dropdown-item logout-link"><i class="fas fa-sign-out-alt"></i> Logout</a>'
    );
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Added logout.js to ${page}`);
  } else {
    console.warn(`Could not find </body> in ${page}`);
  }
});

console.log('Logout functionality added to all standard dashboard pages.');