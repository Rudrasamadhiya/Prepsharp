// Analytics functionality for PrepSharp
// This file handles the analytics page functionality

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
    
    // Update overall performance chart
    updateOverallChart(performance);
    
    // Update subject progress bars
    updateSubjectProgress(performance);
    
    // Update time spent chart
    updateTimeChart(performance);
    
    // Update recent performance table
    updatePerformanceTable(performance);
}

// Update overall performance chart
function updateOverallChart(performance) {
    // Get chart context
    const ctx = document.getElementById('overallChart').getContext('2d');
    
    // Update chart data
    overallChart.data.datasets[0].data = performance.monthlyScores;
    overallChart.update();
    
    // Update average score text
    const averageScoreElement = document.querySelector('.chart-legend span');
    if (averageScoreElement) {
        averageScoreElement.textContent = performance.overallScore + '%';
    }
}

// Update subject progress bars
function updateSubjectProgress(performance) {
    // Update Physics progress
    const physicsScoreElement = document.querySelector('.subject-header:nth-child(1) .subject-score');
    const physicsProgressElement = document.querySelector('.subject-progress:nth-child(1) .progress');
    
    if (physicsScoreElement && physicsProgressElement) {
        physicsScoreElement.textContent = performance.subjectScores.Physics + '%';
        physicsProgressElement.style.width = performance.subjectScores.Physics + '%';
    }
    
    // Update Chemistry progress
    const chemistryScoreElement = document.querySelector('.subject-header:nth-child(2) .subject-score');
    const chemistryProgressElement = document.querySelector('.subject-progress:nth-child(2) .progress');
    
    if (chemistryScoreElement && chemistryProgressElement) {
        chemistryScoreElement.textContent = performance.subjectScores.Chemistry + '%';
        chemistryProgressElement.style.width = performance.subjectScores.Chemistry + '%';
    }
    
    // Update Mathematics progress
    const mathScoreElement = document.querySelector('.subject-header:nth-child(3) .subject-score');
    const mathProgressElement = document.querySelector('.subject-progress:nth-child(3) .progress');
    
    if (mathScoreElement && mathProgressElement) {
        mathScoreElement.textContent = performance.subjectScores.Mathematics + '%';
        mathProgressElement.style.width = performance.subjectScores.Mathematics + '%';
    }
}

// Update time spent chart
function updateTimeChart(performance) {
    // Get chart context
    const ctx = document.getElementById('timeChart').getContext('2d');
    
    // Update chart data
    timeChart.data.datasets[0].data = [
        performance.subjectScores.Physics / 5, 
        performance.subjectScores.Chemistry / 5, 
        performance.subjectScores.Mathematics / 5
    ];
    timeChart.update();
    
    // Update total hours text
    const totalHoursElement = document.querySelector('.chart-legend:nth-child(2) span');
    if (totalHoursElement) {
        totalHoursElement.textContent = performance.totalStudyTime;
    }
}

// Update recent performance table
function updatePerformanceTable(performance) {
    // Get table body
    const tableBody = document.querySelector('.performance-table tbody');
    
    // Clear existing rows
    tableBody.innerHTML = '';
    
    // Add performance data rows
    performance.recentPerformance.forEach(item => {
        const row = document.createElement('tr');
        
        // Add paper column
        const paperCell = document.createElement('td');
        
        // Find paper details
        const paper = DB.papers.find(p => p.id === item.paperId);
        paperCell.textContent = paper ? paper.title : item.paperId;
        row.appendChild(paperCell);
        
        // Add date column
        const dateCell = document.createElement('td');
        dateCell.textContent = item.date;
        row.appendChild(dateCell);
        
        // Add score column
        const scoreCell = document.createElement('td');
        const scoreSpan = document.createElement('span');
        scoreSpan.className = getScoreClass(item.score);
        scoreSpan.textContent = item.score + '%';
        scoreCell.appendChild(scoreSpan);
        row.appendChild(scoreCell);
        
        // Add time taken column
        const timeCell = document.createElement('td');
        timeCell.textContent = item.timeTaken;
        row.appendChild(timeCell);
        
        // Add status column
        const statusCell = document.createElement('td');
        statusCell.textContent = item.status;
        row.appendChild(statusCell);
        
        tableBody.appendChild(row);
    });
}

// Get score badge class based on score value
function getScoreClass(score) {
    if (score >= 80) {
        return 'score-badge score-high';
    } else if (score >= 60) {
        return 'score-badge score-medium';
    } else {
        return 'score-badge score-low';
    }
}

// Initialize UI components
function initializeUI() {
    // Handle filter changes
    document.querySelectorAll('.filter-select').forEach(select => {
        select.addEventListener('change', function() {
            // In a real app, this would filter the data
            console.log('Filter changed:', this.value);
        });
    });
    
    // Handle view all link
    document.querySelector('.view-all').addEventListener('click', function(e) {
        e.preventDefault();
        // In a real app, this would navigate to a detailed view
        console.log('View all clicked');
    });
    
    // Handle upgrade button
    document.querySelector('.upgrade-btn').addEventListener('click', function() {
        // In a real app, this would navigate to the upgrade page
        console.log('Upgrade clicked');
    });
}

// Helper function to capitalize first letter
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}