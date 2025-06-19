// User Stats Handler - Firebase Integration
document.addEventListener('DOMContentLoaded', function() {
    // Get logged in user data
    const loggedInUser = localStorage.getItem('loggedInUser') || sessionStorage.getItem('loggedInUser');
    
    if (loggedInUser) {
        const userData = JSON.parse(loggedInUser);
        const userId = userData.email; // Use email as unique identifier
        
        // Load user stats from Firebase
        loadUserStats(userId);
        
        // Setup action buttons
        setupActionButtons(userId);
    }
});

// Load user stats from Firebase
function loadUserStats(userId) {
    // First try to get user-specific stats from Firebase
    db.collection("userStats").doc(userId)
        .get()
        .then((doc) => {
            if (doc.exists) {
                // User has stats in Firebase
                const stats = doc.data();
                updateStatsCards(stats);
                updateSubjectScores(stats.subjectScores);
            } else {
                // No user-specific stats, load available papers from Firebase
                loadAvailablePapers(userId);
            }
        })
        .catch((error) => {
            console.error("Error getting user stats:", error);
            // Fallback to loading papers
            loadAvailablePapers(userId);
        });
}

// Load available papers from Firebase
function loadAvailablePapers(userId) {
    db.collection("papers")
        .get()
        .then((snapshot) => {
            // Count papers by type
            let mainPapers = 0;
            let advancedPapers = 0;
            
            snapshot.forEach((doc) => {
                const paper = doc.data();
                if (paper.type === 'jee-main') {
                    mainPapers++;
                } else if (paper.type === 'jee-advanced') {
                    advancedPapers++;
                }
            });
            
            // Create default stats with actual paper counts
            const stats = {
                availablePapers: mainPapers + advancedPapers,
                completedPapers: 0,
                averageScore: 0,
                subjectScores: {
                    physics: 0,
                    chemistry: 0,
                    mathematics: 0
                }
            };
            
            // Update UI
            updateStatsCards(stats);
            updateSubjectScores(stats.subjectScores);
            
            // Create user stats in Firebase
            db.collection("userStats").doc(userId).set(stats)
                .then(() => {
                    console.log("User stats created in Firebase");
                })
                .catch((error) => {
                    console.error("Error creating user stats:", error);
                });
        })
        .catch((error) => {
            console.error("Error getting papers:", error);
            // Use empty stats
            const stats = {
                availablePapers: 0,
                completedPapers: 0,
                averageScore: 0,
                subjectScores: {
                    physics: 0,
                    chemistry: 0,
                    mathematics: 0
                }
            };
            updateStatsCards(stats);
            updateSubjectScores(stats.subjectScores);
        });
}

// Update stats cards with user data
function updateStatsCards(stats) {
    // Update available papers
    const availablePapersCard = document.querySelector('.stat-card[data-value="0"]:nth-child(1)');
    if (availablePapersCard) {
        availablePapersCard.dataset.value = stats.availablePapers;
        const counter = availablePapersCard.querySelector('.counter');
        if (counter) counter.textContent = stats.availablePapers;
    }
    
    // Update completed papers
    const completedPapersCard = document.querySelector('.stat-card[data-value="0"]:nth-child(2)');
    if (completedPapersCard) {
        completedPapersCard.dataset.value = stats.completedPapers;
        const counter = completedPapersCard.querySelector('.counter');
        if (counter) counter.textContent = stats.completedPapers;
    }
    
    // Update average score
    const averageScoreCard = document.querySelector('.stat-card[data-value="0"]:nth-child(3)');
    if (averageScoreCard) {
        averageScoreCard.dataset.value = stats.averageScore;
        const counter = averageScoreCard.querySelector('.counter');
        if (counter) counter.textContent = stats.averageScore;
    }
}

// Update subject scores
function updateSubjectScores(subjectScores) {
    // Physics
    const physicsScore = document.querySelector('.subject-score[data-score="65"]');
    if (physicsScore && subjectScores.physics !== undefined) {
        physicsScore.dataset.score = subjectScores.physics;
        const progress = physicsScore.querySelector('.progress');
        const scoreValue = physicsScore.querySelector('.score-value');
        if (progress) progress.style.width = `${subjectScores.physics}%`;
        if (scoreValue) scoreValue.textContent = `${subjectScores.physics}%`;
    }
    
    // Chemistry
    const chemistryScore = document.querySelector('.subject-score[data-score="72"]');
    if (chemistryScore && subjectScores.chemistry !== undefined) {
        chemistryScore.dataset.score = subjectScores.chemistry;
        const progress = chemistryScore.querySelector('.progress');
        const scoreValue = chemistryScore.querySelector('.score-value');
        if (progress) progress.style.width = `${subjectScores.chemistry}%`;
        if (scoreValue) scoreValue.textContent = `${subjectScores.chemistry}%`;
    }
    
    // Mathematics
    const mathScore = document.querySelector('.subject-score[data-score="58"]');
    if (mathScore && subjectScores.mathematics !== undefined) {
        mathScore.dataset.score = subjectScores.mathematics;
        const progress = mathScore.querySelector('.progress');
        const scoreValue = mathScore.querySelector('.score-value');
        if (progress) progress.style.width = `${subjectScores.mathematics}%`;
        if (scoreValue) scoreValue.textContent = `${subjectScores.mathematics}%`;
    }
}

// Setup action buttons
function setupActionButtons(userId) {
    // New Test button
    const newTestBtn = document.querySelector('.action-btn:nth-child(1)');
    if (newTestBtn) {
        newTestBtn.addEventListener('click', function() {
            window.location.href = 'practice-papers.html';
        });
    }
    
    // Refresh button
    const refreshBtn = document.querySelector('.action-btn:nth-child(2)');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            // Show refresh toast
            showToast('Refreshing data...');
            
            // Add animation to stats cards
            document.querySelectorAll('.stat-card').forEach(card => {
                card.style.transition = 'all 0.3s ease';
                card.style.transform = 'scale(0.95)';
                card.style.opacity = '0.7';
                
                setTimeout(() => {
                    card.style.transform = 'scale(1)';
                    card.style.opacity = '1';
                }, 300);
            });
            
            // Reload user stats
            loadUserStats(userId);
            
            // Show success toast after a delay
            setTimeout(() => {
                showToast('Data refreshed successfully!');
            }, 1000);
        });
    }
    
    // Export button
    const exportBtn = document.querySelector('.action-btn:nth-child(3)');
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            // Get user stats
            db.collection("userStats").doc(userId)
                .get()
                .then((doc) => {
                    let stats;
                    if (doc.exists) {
                        stats = doc.data();
                    } else {
                        stats = {
                            availablePapers: 0,
                            completedPapers: 0,
                            averageScore: 0,
                            subjectScores: {
                                physics: 0,
                                chemistry: 0,
                                mathematics: 0
                            }
                        };
                    }
                    
                    // Create export data
                    const exportData = {
                        user: userId,
                        exportDate: new Date().toISOString(),
                        stats: stats
                    };
                    
                    // Convert to JSON string
                    const jsonData = JSON.stringify(exportData, null, 2);
                    
                    // Create download link
                    const blob = new Blob([jsonData], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `prepsharp_stats_${userId.split('@')[0]}.json`;
                    
                    // Trigger download
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                    
                    showToast('Stats exported successfully!');
                })
                .catch((error) => {
                    console.error("Error getting user stats for export:", error);
                    showToast('Error exporting stats');
                });
        });
    }
}

// Show toast message
function showToast(message) {
    const toast = document.createElement('div');
    toast.classList.add('toast');
    toast.textContent = message;
    document.body.appendChild(toast);
    
    // Animate toast
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        toast.style.transition = 'all 0.3s ease';
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';
    }, 10);
    
    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(-20px)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}