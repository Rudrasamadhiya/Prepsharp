const fs = require('fs');
const path = require('path');

// Base directory for standard dashboard pages
const baseDir = path.join(__dirname, 'dashboards', 'standard');

// Update navigation links in dashboard.html
function updateDashboardLinks() {
  const filePath = path.join(baseDir, 'dashboard.html');
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Update sidebar navigation links
  content = content.replace(
    /<nav class="sidebar-nav">[\s\S]*?<\/nav>/,
    `<nav class="sidebar-nav">
                <ul>
                    <li class="active">
                        <a href="dashboard.html"><i class="fas fa-home"></i> <span>Dashboard</span></a>
                    </li>
                    <li>
                        <a href="practice-papers.html"><i class="fas fa-book"></i> <span>Practice Papers</span></a>
                    </li>
                    <li>
                        <a href="analytics.html"><i class="fas fa-chart-line"></i> <span>Analytics</span></a>
                    </li>
                    <li>
                        <a href="question-bank.html"><i class="fas fa-question-circle"></i> <span>Question Bank</span></a>
                    </li>
                    <li>
                        <a href="study-plan.html"><i class="fas fa-calendar-alt"></i> <span>Study Plan</span></a>
                    </li>
                    <li>
                        <a href="settings.html"><i class="fas fa-cog"></i> <span>Settings</span></a>
                    </li>
                </ul>
            </nav>`
  );
  
  // Update "View All" link for practice papers
  content = content.replace(
    /<a href="#" class="view-all">View All<\/a>/,
    '<a href="practice-papers.html" class="view-all">View All</a>'
  );
  
  // Update "View Full Plan" link for study plan
  content = content.replace(
    /<a href="#" class="view-all">View Full Plan<\/a>/,
    '<a href="study-plan.html" class="view-all">View Full Plan</a>'
  );
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Updated links in dashboard.html');
}

// Update all other pages to link back to dashboard and each other
function updateOtherPagesLinks() {
  const pages = [
    'practice-papers.html',
    'analytics.html',
    'question-bank.html',
    'study-plan.html',
    'settings.html'
  ];
  
  pages.forEach(page => {
    const filePath = path.join(baseDir, page);
    if (!fs.existsSync(filePath)) {
      console.warn(`File not found: ${filePath}`);
      return;
    }
    
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Update sidebar navigation links based on current page
    const pageName = path.basename(page, '.html');
    
    // Create navigation HTML with the current page marked as active
    const navHtml = `<nav class="sidebar-nav">
                <ul>
                    <li${pageName === 'dashboard' ? ' class="active"' : ''}>
                        <a href="dashboard.html"><i class="fas fa-home"></i> <span>Dashboard</span></a>
                    </li>
                    <li${pageName === 'practice-papers' ? ' class="active"' : ''}>
                        <a href="practice-papers.html"><i class="fas fa-book"></i> <span>Practice Papers</span></a>
                    </li>
                    <li${pageName === 'analytics' ? ' class="active"' : ''}>
                        <a href="analytics.html"><i class="fas fa-chart-line"></i> <span>Analytics</span></a>
                    </li>
                    <li${pageName === 'question-bank' ? ' class="active"' : ''}>
                        <a href="question-bank.html"><i class="fas fa-question-circle"></i> <span>Question Bank</span></a>
                    </li>
                    <li${pageName === 'study-plan' ? ' class="active"' : ''}>
                        <a href="study-plan.html"><i class="fas fa-calendar-alt"></i> <span>Study Plan</span></a>
                    </li>
                    <li${pageName === 'settings' ? ' class="active"' : ''}>
                        <a href="settings.html"><i class="fas fa-cog"></i> <span>Settings</span></a>
                    </li>
                </ul>
            </nav>`;
    
    // Replace the navigation section
    content = content.replace(
      /<nav class="sidebar-nav">[\s\S]*?<\/nav>/,
      navHtml
    );
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated links in ${page}`);
  });
}

// Run the updates
updateDashboardLinks();
updateOtherPagesLinks();

console.log('All navigation links have been updated.');