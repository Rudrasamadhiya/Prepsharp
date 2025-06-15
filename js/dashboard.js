// Dashboard functionality for PrepSharp
// This file handles the dashboard-specific functionality

document.addEventListener('DOMContentLoaded', function() {
    // Get current user
    const currentUser = DB.getCurrentUser();
    
    // If no user is logged in, redirect to login page
    if (!currentUser) {
        window.location.href = '../../login.html';
        return;
    }
    
    // Update user profile information
    updateUserProfile(currentUser);
    
    // Load user performance data
    loadUserPerformance(currentUser);
    
    // Load available papers
    loadAvailablePapers(currentUser);
    
    // Initialize UI components
    initializeUI();
});

// Update user profile information in the UI
function updateUserProfile(user) {
    // Update user name
    const userNameElements = document.querySelectorAll('.user-name');
    userNameElements.forEach(element => {
        element.textContent = user.name;
    });
    
    // Update subscription badge
    const planBadges = document.querySelectorAll('.plan-badge');
    planBadges.forEach(badge => {
        badge.textContent = capitalizeFirstLetter(user.subscription) + ' Plan';
        badge.className = 'plan-badge ' + user.subscription;
    });
}

// Load user performance data
function loadUserPerformance(user) {
    // Get user performance data
    const performance = DB.getUserPerformance(user.email);
    
    // Update stats cards
    updateStatsCards(performance);
    
    // Update performance chart
    updatePerformanceChart(performance);
    
    // Update subject scores
    updateSubjectScores(performance);
}

// Update stats cards with user performance data
function updateStatsCards(performance) {
    // Get stats cards
    const statsCards = document.querySelectorAll('.stat-card');
    
    // Update practice papers count
    const papersCard = statsCards[0];
    const papersCounter = papersCard.querySelector('.counter');
    papersCard.dataset.value = DB.papers.length;
    
    // Update completed papers count
    const completedCard = statsCards[1];
    const completedCounter = completedCard.querySelector('.counter');
    completedCard.dataset.value = performance.completedPapers;
    
    // Update average score
    const scoreCard = statsCards[2];
    const scoreCounter = scoreCard.querySelector('.counter');
    scoreCard.dataset.value = performance.overallScore;
}

// Update performance chart with user data
function updatePerformanceChart(performance) {
    // Get chart context
    const ctx = document.getElementById('performanceChart').getContext('2d');
    
    // Update chart data
    performanceChart.data.datasets[0].data = performance.monthlyScores;
    performanceChart.update();
    
    // Update performance stats
    document.querySelector('.stat-highlight:nth-child(1) .stat-value').innerHTML = 
        performance.overallScore + '<span>%</span>';
    
    document.querySelector('.stat-highlight:nth-child(2) .stat-value').innerHTML = 
        performance.totalStudyTime + '<span>hrs</span>';
    
    document.querySelector('.stat-highlight:nth-child(3) .stat-value').innerHTML = 
        performance.questionsAnswered + '<span>/50</span>';
}

// Update subject scores
function updateSubjectScores(performance) {
    // Get subject scores
    const subjectScores = document.querySelectorAll('.subject-score');
    
    // Update Physics score
    const physicsScore = subjectScores[0];
    physicsScore.dataset.score = performance.subjectScores.Physics;
    
    // Update Chemistry score
    const chemistryScore = subjectScores[1];
    chemistryScore.dataset.score = performance.subjectScores.Chemistry;
    
    // Update Mathematics score
    const mathScore = subjectScores[2];
    mathScore.dataset.score = performance.subjectScores.Mathematics;
}

// Load available papers based on user subscription
function loadAvailablePapers(user) {
    // Get available papers
    const papers = DB.getAvailablePapers(user.subscription);
    
    // Get paper list container
    const paperList = document.querySelector('.paper-list');
    
    // Clear existing papers
    paperList.innerHTML = '';
    
    // Add papers to the list (limit to 3 for dashboard)
    papers.slice(0, 3).forEach(paper => {
        const paperItem = createPaperItem(paper);
        paperList.appendChild(paperItem);
    });
    
    // Add hover effects to paper items
    addPaperItemEffects();
}

// Create a paper item element
function createPaperItem(paper) {
    const li = document.createElement('li');
    li.className = 'paper-item';
    
    // Create paper info
    const paperInfo = document.createElement('div');
    paperInfo.className = 'paper-info';
    
    // Add badge if paper is new or popular
    if (paper.isNew) {
        const badge = document.createElement('div');
        badge.className = 'paper-badge new';
        badge.textContent = 'NEW';
        paperInfo.appendChild(badge);
    } else if (paper.isPopular) {
        const badge = document.createElement('div');
        badge.className = 'paper-badge popular';
        badge.textContent = 'POPULAR';
        paperInfo.appendChild(badge);
    }
    
    // Add paper title
    const title = document.createElement('h3');
    title.textContent = paper.title;
    paperInfo.appendChild(title);
    
    // Add paper subjects
    const subjects = document.createElement('p');
    paper.subjects.forEach(subject => {
        const icon = document.createElement('i');
        icon.className = getSubjectIcon(subject);
        icon.classList.add('subject-icon');
        subjects.appendChild(icon);
        subjects.appendChild(document.createTextNode(' ' + subject + ' '));
    });
    paperInfo.appendChild(subjects);
    
    // Add paper meta
    const meta = document.createElement('div');
    meta.className = 'paper-meta';
    
    // Add duration
    const duration = document.createElement('span');
    duration.innerHTML = `<i class="fas fa-clock"></i> ${paper.duration}`;
    meta.appendChild(duration);
    
    // Add rating
    const rating = document.createElement('span');
    rating.innerHTML = `<i class="fas fa-star"></i> ${paper.rating}`;
    meta.appendChild(rating);
    
    // Add popularity
    const popularity = document.createElement('span');
    popularity.innerHTML = `<i class="fas fa-users"></i> ${(paper.popularity / 1000).toFixed(1)}k`;
    meta.appendChild(popularity);
    
    paperInfo.appendChild(meta);
    li.appendChild(paperInfo);
    
    // Add start button
    const startBtn = document.createElement('a');
    startBtn.href = '#';
    startBtn.className = 'start-btn';
    startBtn.innerHTML = 'Start <i class="fas fa-arrow-right"></i>';
    li.appendChild(startBtn);
    
    return li;
}

// Get icon class for subject
function getSubjectIcon(subject) {
    switch (subject) {
        case 'Physics':
            return 'fas fa-atom';
        case 'Chemistry':
            return 'fas fa-flask';
        case 'Mathematics':
            return 'fas fa-square-root-alt';
        default:
            return 'fas fa-book';
    }
}

// Add hover effects to paper items
function addPaperItemEffects() {
    const paperItems = document.querySelectorAll('.paper-item');
    paperItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            gsap.to(this, {
                paddingLeft: '25px',
                duration: 0.3
            });
            
            // Animate the start button
            const startBtn = this.querySelector('.start-btn');
            gsap.to(startBtn, {
                scale: 1.05,
                duration: 0.3
            });
        });
        
        item.addEventListener('mouseleave', function() {
            gsap.to(this, {
                paddingLeft: '18px',
                duration: 0.3
            });
            
            // Reset the start button
            const startBtn = this.querySelector('.start-btn');
            gsap.to(startBtn, {
                scale: 1,
                duration: 0.3
            });
        });
    });
}

// Initialize UI components
function initializeUI() {
    // Initialize notification interactions
    setupNotifications();
    
    // Initialize animations
    initializeAnimations();
    
    // Make stat cards interactive
    makeStatCardsInteractive();
    
    // Add interactivity to time filter
    setupTimeFilter();
    
    // Add interactivity to subject scores
    makeSubjectScoresInteractive();
    
    // Add interactivity to plan selector
    setupPlanSelector();
    
    // Add interactivity to quick action buttons
    setupActionButtons();
}

// Helper function to capitalize first letter
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}