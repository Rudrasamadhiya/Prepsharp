// Practice Papers functionality for PrepSharp
// This file handles the practice papers page functionality with GitHub integration

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
    
    // Load available papers
    loadAvailablePapers(currentUser);
    
    // Initialize animations
    initializeAnimations();
    
    // Setup event handlers
    setupEventHandlers();
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

// Load available papers based on user subscription
function loadAvailablePapers(user) {
    // Get available papers
    const papers = DB.getAvailablePapers(user.subscription);
    
    // Get papers grid container
    const papersGrid = document.querySelector('.papers-grid');
    
    // Clear existing papers
    papersGrid.innerHTML = '';
    
    // Add papers to the grid
    papers.forEach(paper => {
        const paperCard = createPaperCard(paper);
        papersGrid.appendChild(paperCard);
    });
    
    // Update stats in header
    updateHeaderStats(user);
}

// Update header statistics
function updateHeaderStats(user) {
    // Get user performance data
    const performance = DB.getUserPerformance(user.email);
    
    // Update available papers count
    const availablePapersElement = document.querySelector('.stat-value:nth-child(1)');
    if (availablePapersElement) {
        availablePapersElement.textContent = DB.papers.length;
    }
    
    // Update completed papers count
    const completedPapersElement = document.querySelector('.stat-value:nth-child(3)');
    if (completedPapersElement) {
        completedPapersElement.textContent = performance.completedPapers;
    }
    
    // Update average score
    const averageScoreElement = document.querySelector('.stat-value:nth-child(5)');
    if (averageScoreElement) {
        averageScoreElement.textContent = performance.overallScore + '%';
    }
}

// Create a paper card element
function createPaperCard(paper) {
    const div = document.createElement('div');
    div.className = 'paper-card';
    div.dataset.id = paper.id;
    
    // Create paper banner
    const banner = document.createElement('div');
    banner.className = 'paper-banner';
    
    // Add badge if paper is new or popular
    if (paper.isNew) {
        const badge = document.createElement('div');
        badge.className = 'paper-badge';
        badge.textContent = 'NEW';
        banner.appendChild(badge);
    } else if (paper.isPopular) {
        const badge = document.createElement('div');
        badge.className = 'paper-badge popular';
        badge.textContent = 'POPULAR';
        banner.appendChild(badge);
    }
    
    div.appendChild(banner);
    
    // Create paper content
    const content = document.createElement('div');
    content.className = 'paper-content';
    
    // Add paper icon
    const icon = document.createElement('div');
    icon.className = 'paper-icon';
    icon.innerHTML = '<i class="fas fa-file-alt"></i>';
    content.appendChild(icon);
    
    // Add paper title
    const title = document.createElement('h3');
    title.className = 'paper-title';
    title.textContent = paper.title;
    content.appendChild(title);
    
    // Add paper subtitle
    const subtitle = document.createElement('div');
    subtitle.className = 'paper-subtitle';
    
    const tag = document.createElement('span');
    tag.className = 'paper-tag';
    tag.textContent = paper.type;
    subtitle.appendChild(tag);
    
    subtitle.appendChild(document.createTextNode(paper.date));
    content.appendChild(subtitle);
    
    // Add paper details
    const details = document.createElement('div');
    details.className = 'paper-details';
    
    // Add questions detail
    const questionsDetail = document.createElement('div');
    questionsDetail.className = 'detail-item';
    
    const questionsValue = document.createElement('div');
    questionsValue.className = 'detail-value';
    questionsValue.textContent = paper.questions;
    questionsDetail.appendChild(questionsValue);
    
    const questionsLabel = document.createElement('div');
    questionsLabel.className = 'detail-label';
    questionsLabel.textContent = 'Questions';
    questionsDetail.appendChild(questionsLabel);
    
    details.appendChild(questionsDetail);
    
    // Add duration detail
    const durationDetail = document.createElement('div');
    durationDetail.className = 'detail-item';
    
    const durationValue = document.createElement('div');
    durationValue.className = 'detail-value';
    durationValue.textContent = paper.duration;
    durationDetail.appendChild(durationValue);
    
    const durationLabel = document.createElement('div');
    durationLabel.className = 'detail-label';
    durationLabel.textContent = 'Duration';
    durationDetail.appendChild(durationLabel);
    
    details.appendChild(durationDetail);
    
    // Add marks detail
    const marksDetail = document.createElement('div');
    marksDetail.className = 'detail-item';
    
    const marksValue = document.createElement('div');
    marksValue.className = 'detail-value';
    marksValue.textContent = paper.marks;
    marksDetail.appendChild(marksValue);
    
    const marksLabel = document.createElement('div');
    marksLabel.className = 'detail-label';
    marksLabel.textContent = 'Marks';
    marksDetail.appendChild(marksLabel);
    
    details.appendChild(marksDetail);
    
    content.appendChild(details);
    
    // Add paper actions
    const actions = document.createElement('div');
    actions.className = 'paper-actions';
    
    // Add start button
    const startButton = document.createElement('button');
    startButton.className = 'start-button';
    startButton.innerHTML = '<i class="fas fa-play"></i> Start Paper';
    actions.appendChild(startButton);
    
    // Add info button
    const infoButton = document.createElement('button');
    infoButton.className = 'info-button';
    infoButton.innerHTML = '<i class="fas fa-info"></i>';
    actions.appendChild(infoButton);
    
    content.appendChild(actions);
    
    div.appendChild(content);
    
    return div;
}

// Initialize animations
function initializeAnimations() {
    // Animate hero section
    gsap.from('.header-section', {
        y: -30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
    });
    
    gsap.from('.stat-card', {
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.2,
        delay: 0.3,
        ease: 'back.out(1.7)'
    });
    
    // Animate filter section
    gsap.from('.filter-container', {
        y: -20,
        opacity: 0,
        duration: 0.6,
        delay: 0.2,
        ease: 'power2.out'
    });
    
    // Animate paper cards
    gsap.from('.paper-card', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        delay: 0.4,
        ease: 'power3.out'
    });
}

// Setup event handlers
function setupEventHandlers() {
    // Handle filter changes
    document.querySelectorAll('.filter-select').forEach(select => {
        select.addEventListener('change', function() {
            // Add animation effect when filtering
            gsap.fromTo('.paper-card', 
                {scale: 0.95, opacity: 0.5},
                {scale: 1, opacity: 1, duration: 0.5, stagger: 0.05}
            );
        });
    });
    
    // Handle pagination
    document.querySelectorAll('.page-button').forEach(btn => {
        btn.addEventListener('click', function() {
            if (!this.classList.contains('active') && !this.querySelector('i')) {
                document.querySelectorAll('.page-button').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                // Add animation effect when changing page
                gsap.fromTo('.paper-card', 
                    {y: 20, opacity: 0},
                    {y: 0, opacity: 1, duration: 0.5, stagger: 0.05}
                );
            }
        });
    });
    
    // Add hover effects to paper cards
    document.addEventListener('mouseover', function(e) {
        if (e.target.closest('.paper-card')) {
            const card = e.target.closest('.paper-card');
            const startButton = card.querySelector('.start-button');
            if (startButton) {
                startButton.style.transform = 'translateY(-3px)';
                startButton.style.boxShadow = '0 15px 25px rgba(79, 70, 229, 0.3)';
            }
        }
    });
    
    document.addEventListener('mouseout', function(e) {
        if (e.target.closest('.paper-card')) {
            const card = e.target.closest('.paper-card');
            const startButton = card.querySelector('.start-button');
            if (startButton) {
                startButton.style.transform = '';
                startButton.style.boxShadow = '';
            }
        }
    });
}

// Helper function to capitalize first letter
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}