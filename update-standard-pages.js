const fs = require('fs');
const path = require('path');

// Pages to update
const pages = [
  'dashboard.html',
  'practice-papers.html',
  'analytics.html',
  'question-bank.html',
  'study-plan.html',
  'settings.html'
];

// Base directory for standard dashboard pages
const baseDir = path.join(__dirname, 'dashboards', 'standard');

// Function to update a page
function updatePage(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Add dropdown-override.css reference if not already present
    if (!content.includes('dropdown-override.css')) {
      content = content.replace(
        '<link rel="stylesheet" href="../../assets/css/dashboard.css">',
        '<link rel="stylesheet" href="../../assets/css/dashboard.css">\n    <link rel="stylesheet" href="../../assets/css/dropdown-override.css">'
      );
    }
    
    // Replace search container and user profile
    content = content.replace(
      /<!-- Top Navigation -->([\s\S]*?)<div class="user-actions">/m,
      '<!-- Top Navigation -->\n            <header class="top-nav">\n                <div class="user-actions">'
    );
    
    // Update user profile
    content = content.replace(
      /<div class="user-profile"(?:\s+id="userProfile")?>([\s\S]*?)<\/div>\s*<\/div>\s*<\/header>/m,
      `<div class="user-profile" id="userProfile">
                        <div class="avatar-initials" id="userInitials">JS</div>
                        <span class="user-name" id="loggedInUserName">John Smith</span>
                        <i class="fas fa-chevron-down"></i>
                        <div class="user-dropdown">
                            <a href="#" class="dropdown-item"><i class="fas fa-user"></i> My Profile</a>
                            <a href="#" class="dropdown-item"><i class="fas fa-cog"></i> Settings</a>
                            <a href="#" class="dropdown-item"><i class="fas fa-question-circle"></i> Help</a>
                            <div class="dropdown-divider"></div>
                            <a href="../../index.html" class="dropdown-item"><i class="fas fa-sign-out-alt"></i> Logout</a>
                        </div>
                    </div>
                </div>
            </header>`
    );
    
    // Update user profile styles if they exist
    if (content.includes('.user-profile {')) {
      content = content.replace(
        /\.user-profile\s*{[\s\S]*?\.user-profile:hover \.user-dropdown\s*{[\s\S]*?}/m,
        `.user-profile {
            position: relative;
            cursor: pointer;
        }
        
        .avatar-initials {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background-color: var(--accent-color);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
            font-size: 14px;
            margin-right: 10px;
        }
        
        .user-dropdown {
            position: absolute;
            top: 100%;
            right: 0;
            width: 200px;
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            padding: 10px 0;
            z-index: 100;
            opacity: 0;
            visibility: hidden;
            transform: translateY(-10px);
            transition: all 0.3s ease;
        }`
      );
    }
    
    // Add user profile dropdown functionality if not already present
    if (!content.includes('userProfile.addEventListener')) {
      const scriptTag = '</script>';
      const userProfileScript = `
    // User profile dropdown functionality
    document.addEventListener('DOMContentLoaded', function() {
        const userProfile = document.getElementById('userProfile');
        const userDropdown = document.querySelector('.user-dropdown');
        
        if (userProfile && userDropdown) {
            // Override the hover-based dropdown with click-based
            userProfile.addEventListener('click', function(e) {
                userDropdown.style.opacity = userDropdown.style.opacity === '1' ? '0' : '1';
                userDropdown.style.visibility = userDropdown.style.visibility === 'visible' ? 'hidden' : 'visible';
                userDropdown.style.transform = userDropdown.style.transform === 'translateY(0px)' ? 'translateY(-10px)' : 'translateY(0px)';
                e.stopPropagation();
            });
            
            // Close dropdown when clicking elsewhere
            document.addEventListener('click', function() {
                userDropdown.style.opacity = '0';
                userDropdown.style.visibility = 'hidden';
                userDropdown.style.transform = 'translateY(-10px)';
            });
        }
        
        // Get logged in user name from session/localStorage
        const loggedInUser = localStorage.getItem('loggedInUser') || sessionStorage.getItem('loggedInUser');
        if (loggedInUser) {
            const userData = JSON.parse(loggedInUser);
            let fullName = '';
            
            // Prioritize firstName/lastName if available
            if (userData.firstName || userData.lastName) {
                fullName = \`\${userData.firstName || ''} \${userData.lastName || ''}\`.trim();
            } 
            // If name fields aren't available, try the name property
            else if (userData.name) {
                fullName = userData.name;
            }
            // Last resort: use email but without the domain part
            else if (userData.email) {
                fullName = userData.email.split('@')[0];
            }
            
            // Set the user name
            document.getElementById('loggedInUserName').textContent = fullName;
            
            // Generate and set initials
            const initials = getInitials(fullName);
            document.getElementById('userInitials').textContent = initials;
        }
        
        // Function to get initials from name
        function getInitials(name) {
            return name
                .split(' ')
                .map(part => part.charAt(0))
                .join('')
                .toUpperCase()
                .substring(0, 2);
        }
    });
${scriptTag}`;

      content = content.replace(scriptTag, userProfileScript);
    }
    
    // Write the updated content back to the file
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${path.basename(filePath)}`);
    
  } catch (error) {
    console.error(`Error updating ${filePath}:`, error);
  }
}

// Process each page
pages.forEach(page => {
  const filePath = path.join(baseDir, page);
  if (fs.existsSync(filePath)) {
    updatePage(filePath);
  } else {
    console.warn(`File not found: ${filePath}`);
  }
});

console.log('All standard dashboard pages have been updated.');