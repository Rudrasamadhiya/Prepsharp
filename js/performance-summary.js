// Performance Summary Handler - Firebase Integration
document.addEventListener('DOMContentLoaded', function() {
    // Get logged in user data
    const loggedInUser = localStorage.getItem('loggedInUser') || sessionStorage.getItem('loggedInUser');
    
    if (loggedInUser) {
        const userData = JSON.parse(loggedInUser);
        const userId = userData.email;
        
        // Load performance data from Firebase
        loadPerformanceData(userId);
    }
});

// Load performance data from Firebase
function loadPerformanceData(userId) {
    // Get user stats from Firebase
    db.collection("userStats").doc(userId)
        .get()
        .then((doc) => {
            if (doc.exists) {
                const stats = doc.data();
                updatePerformanceStats(stats);
            } else {
                // Create default performance data
                const defaultStats = {
                    averageScore: 68,
                    scoreChange: 3,
                    studyTime: 12,
                    studyTimeChange: 2,
                    questionsAnswered: 42,
                    totalQuestions: 50
                };
                
                // Update UI with default data
                updatePerformanceStats(defaultStats);
                
                // Save default stats to Firebase
                db.collection("userStats").doc(userId).set(defaultStats, { merge: true })
                    .catch(error => console.error("Error saving default stats:", error));
            }
        })
        .catch((error) => {
            console.error("Error getting performance data:", error);
            
            // Use default data on error
            const defaultStats = {
                averageScore: 68,
                scoreChange: 3,
                studyTime: 12,
                studyTimeChange: 2,
                questionsAnswered: 42,
                totalQuestions: 50
            };
            
            updatePerformanceStats(defaultStats);
        });
}

// Update performance stats
function updatePerformanceStats(stats) {
    // Update average score
    const averageScoreElement = document.querySelector('.stat-highlight:nth-child(1) .stat-value');
    if (averageScoreElement) {
        averageScoreElement.innerHTML = `${stats.averageScore || 0}<span>%</span>`;
    }
    
    // Update score change
    const scoreChangeElement = document.querySelector('.stat-highlight:nth-child(1) .stat-change');
    if (scoreChangeElement && stats.scoreChange) {
        const changeClass = stats.scoreChange > 0 ? 'positive' : stats.scoreChange < 0 ? 'negative' : 'neutral';
        const changeIcon = stats.scoreChange > 0 ? 'fa-arrow-up' : stats.scoreChange < 0 ? 'fa-arrow-down' : 'fa-minus';
        scoreChangeElement.className = `stat-change ${changeClass}`;
        scoreChangeElement.innerHTML = `<i class="fas ${changeIcon}"></i> ${Math.abs(stats.scoreChange)}%`;
    }
    
    // Update study time
    const studyTimeElement = document.querySelector('.stat-highlight:nth-child(2) .stat-value');
    if (studyTimeElement) {
        studyTimeElement.innerHTML = `${stats.studyTime || 0}<span>hrs</span>`;
    }
    
    // Update study time change
    const timeChangeElement = document.querySelector('.stat-highlight:nth-child(2) .stat-change');
    if (timeChangeElement && stats.studyTimeChange) {
        const changeClass = stats.studyTimeChange > 0 ? 'positive' : stats.studyTimeChange < 0 ? 'negative' : 'neutral';
        const changeIcon = stats.studyTimeChange > 0 ? 'fa-arrow-up' : stats.studyTimeChange < 0 ? 'fa-arrow-down' : 'fa-minus';
        timeChangeElement.className = `stat-change ${changeClass}`;
        timeChangeElement.innerHTML = `<i class="fas ${changeIcon}"></i> ${Math.abs(stats.studyTimeChange)}hrs`;
    }
    
    // Update questions answered
    const questionsElement = document.querySelector('.stat-highlight:nth-child(3) .stat-value');
    if (questionsElement) {
        const questions = stats.questionsAnswered || 0;
        const total = stats.totalQuestions || 50;
        questionsElement.innerHTML = `${questions}<span>/${total}</span>`;
    }
    
    // Update questions change
    const questionsChangeElement = document.querySelector('.stat-highlight:nth-child(3) .stat-change');
    if (questionsChangeElement) {
        questionsChangeElement.className = 'stat-change neutral';
        questionsChangeElement.innerHTML = '<i class="fas fa-minus"></i> 0';
    }
}