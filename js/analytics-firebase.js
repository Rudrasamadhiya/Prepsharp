// Analytics Firebase Integration
document.addEventListener('DOMContentLoaded', function() {
    // Get logged in user data
    const loggedInUser = localStorage.getItem('loggedInUser') || sessionStorage.getItem('loggedInUser');
    
    if (loggedInUser) {
        const userData = JSON.parse(loggedInUser);
        const userId = userData.email;
        
        // Load analytics data from Firebase
        loadAnalyticsData(userId);
    }
});

// Load analytics data from Firebase
function loadAnalyticsData(userId) {
    db.collection("userStats").doc(userId)
        .get()
        .then((doc) => {
            if (doc.exists) {
                const stats = doc.data();
                updateAnalyticsUI(stats);
            } else {
                // Create default analytics data
                const defaultStats = {
                    averageScore: 68,
                    subjectScores: {
                        physics: 65,
                        chemistry: 72,
                        mathematics: 58
                    },
                    timeSpent: {
                        physics: 15,
                        chemistry: 12,
                        mathematics: 15
                    },
                    recentPerformance: [
                        {
                            paper: "JEE Main 2023 Paper 1",
                            date: "July 10, 2023",
                            score: 85,
                            timeTaken: "2h 45m",
                            status: "Completed"
                        },
                        {
                            paper: "JEE Main 2022 Paper 2",
                            date: "July 5, 2023",
                            score: 72,
                            timeTaken: "2h 50m",
                            status: "Completed"
                        },
                        {
                            paper: "JEE Main 2022 Paper 1",
                            date: "June 28, 2023",
                            score: 58,
                            timeTaken: "2h 30m",
                            status: "Completed"
                        },
                        {
                            paper: "JEE Main 2021 Paper 2",
                            date: "June 20, 2023",
                            score: 68,
                            timeTaken: "2h 40m",
                            status: "Completed"
                        },
                        {
                            paper: "JEE Main 2021 Paper 1",
                            date: "June 15, 2023",
                            score: 75,
                            timeTaken: "2h 55m",
                            status: "Completed"
                        }
                    ],
                    monthlyPerformance: [55, 60, 58, 65, 68, 72, 75]
                };
                
                // Update UI with default data
                updateAnalyticsUI(defaultStats);
                
                // Save default stats to Firebase
                db.collection("userStats").doc(userId).set(defaultStats, { merge: true })
                    .catch(error => console.error("Error saving default analytics:", error));
            }
        })
        .catch((error) => {
            console.error("Error getting analytics data:", error);
        });
}

// Update analytics UI
function updateAnalyticsUI(stats) {
    // Update overall performance chart
    updateOverallChart(stats.monthlyPerformance);
    
    // Update average score
    const averageScoreElement = document.querySelector('.chart-legend span');
    if (averageScoreElement) {
        averageScoreElement.textContent = `${stats.averageScore}%`;
    }
    
    // Update subject scores
    updateSubjectScores(stats.subjectScores);
    
    // Update time spent chart
    updateTimeChart(stats.timeSpent);
    
    // Update recent performance table
    updatePerformanceTable(stats.recentPerformance);
}

// Update overall performance chart
function updateOverallChart(monthlyData) {
    const overallChart = window.overallChart;
    if (overallChart) {
        overallChart.data.datasets[0].data = monthlyData;
        overallChart.update();
    }
}

// Update subject scores
function updateSubjectScores(subjectScores) {
    // Physics
    const physicsScoreElement = document.querySelector('.subject-progress:nth-child(1) .subject-score');
    const physicsProgressElement = document.querySelector('.subject-progress:nth-child(1) .progress');
    if (physicsScoreElement && physicsProgressElement) {
        physicsScoreElement.textContent = `${subjectScores.physics}%`;
        physicsProgressElement.style.width = `${subjectScores.physics}%`;
    }
    
    // Chemistry
    const chemistryScoreElement = document.querySelector('.subject-progress:nth-child(2) .subject-score');
    const chemistryProgressElement = document.querySelector('.subject-progress:nth-child(2) .progress');
    if (chemistryScoreElement && chemistryProgressElement) {
        chemistryScoreElement.textContent = `${subjectScores.chemistry}%`;
        chemistryProgressElement.style.width = `${subjectScores.chemistry}%`;
    }
    
    // Mathematics
    const mathScoreElement = document.querySelector('.subject-progress:nth-child(3) .subject-score');
    const mathProgressElement = document.querySelector('.subject-progress:nth-child(3) .progress');
    if (mathScoreElement && mathProgressElement) {
        mathScoreElement.textContent = `${subjectScores.mathematics}%`;
        mathProgressElement.style.width = `${subjectScores.mathematics}%`;
    }
}

// Update time spent chart
function updateTimeChart(timeSpent) {
    const timeChart = window.timeChart;
    if (timeChart) {
        timeChart.data.datasets[0].data = [
            timeSpent.physics,
            timeSpent.chemistry,
            timeSpent.mathematics
        ];
        timeChart.update();
        
        // Update total hours
        const totalHours = timeSpent.physics + timeSpent.chemistry + timeSpent.mathematics;
        const totalHoursElement = document.querySelector('.chart-container + .chart-legend span');
        if (totalHoursElement) {
            totalHoursElement.textContent = totalHours;
        }
    }
}

// Update performance table
function updatePerformanceTable(recentPerformance) {
    const tableBody = document.querySelector('.performance-table tbody');
    if (!tableBody) return;
    
    // Clear existing rows
    tableBody.innerHTML = '';
    
    // Add new rows
    recentPerformance.forEach(performance => {
        const row = document.createElement('tr');
        
        // Determine score class
        let scoreClass = 'score-medium';
        if (performance.score >= 80) {
            scoreClass = 'score-high';
        } else if (performance.score < 60) {
            scoreClass = 'score-low';
        }
        
        row.innerHTML = `
            <td>${performance.paper}</td>
            <td>${performance.date}</td>
            <td>
                <span class="score-badge ${scoreClass}">${performance.score}%</span>
            </td>
            <td>${performance.timeTaken}</td>
            <td>${performance.status}</td>
        `;
        
        tableBody.appendChild(row);
    });
}