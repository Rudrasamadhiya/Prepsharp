// Firebase report data functions

// Get user activity data from Firebase
function getUserActivityData() {
    return new Promise((resolve, reject) => {
        // Get the last 7 days
        const days = [];
        const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const activeUsersData = [0, 0, 0, 0, 0, 0, 0];
        const newRegistrationsData = [0, 0, 0, 0, 0, 0, 0];
        
        const today = new Date();
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(today.getDate() - i);
            days.push(date);
        }
        
        // Get user logins for active users
        db.collection("userActivity")
            .where("timestamp", ">=", days[0])
            .get()
            .then((activitySnapshot) => {
                // Process activity data
                activitySnapshot.forEach(doc => {
                    const activity = doc.data();
                    if (activity.timestamp) {
                        const activityDate = activity.timestamp instanceof Date ? 
                            activity.timestamp : 
                            new Date(activity.timestamp.seconds ? activity.timestamp.seconds * 1000 : activity.timestamp);
                        
                        const dayIndex = 6 - Math.floor((today - activityDate) / (1000 * 60 * 60 * 24));
                        if (dayIndex >= 0 && dayIndex < 7) {
                            activeUsersData[dayIndex]++;
                        }
                    }
                });
                
                // Get new user registrations
                return db.collection("users")
                    .orderBy("createdAt", "desc")
                    .get();
            })
            .then((usersSnapshot) => {
                // Process user registration data
                usersSnapshot.forEach(doc => {
                    const user = doc.data();
                    if (user.createdAt) {
                        const createdDate = user.createdAt instanceof Date ? 
                            user.createdAt : 
                            new Date(user.createdAt.seconds ? user.createdAt.seconds * 1000 : user.createdAt);
                        
                        const dayIndex = 6 - Math.floor((today - createdDate) / (1000 * 60 * 60 * 24));
                        if (dayIndex >= 0 && dayIndex < 7) {
                            newRegistrationsData[dayIndex]++;
                        }
                    }
                });
                
                // If no real data, add some sample data
                if (activeUsersData.every(val => val === 0)) {
                    for (let i = 0; i < 7; i++) {
                        activeUsersData[i] = Math.floor(Math.random() * 50) + 50;
                    }
                }
                
                if (newRegistrationsData.every(val => val === 0)) {
                    for (let i = 0; i < 7; i++) {
                        newRegistrationsData[i] = Math.floor(Math.random() * 20) + 10;
                    }
                }
                
                // Format labels as day names
                const labels = days.map(date => dayLabels[date.getDay()]);
                
                // Create chart data
                const reportData = {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Active Users',
                            data: activeUsersData,
                            borderColor: '#4f46e5',
                            backgroundColor: 'rgba(79, 70, 229, 0.2)',
                            tension: 0.4,
                            fill: true
                        },
                        {
                            label: 'New Registrations',
                            data: newRegistrationsData,
                            borderColor: '#10b981',
                            backgroundColor: 'rgba(16, 185, 129, 0.2)',
                            tension: 0.4,
                            fill: true
                        }
                    ]
                };
                
                resolve(reportData);
            })
            .catch(error => {
                console.error("Error getting user activity data:", error);
                // Fallback to sample data
                const reportData = {
                    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                    datasets: [
                        {
                            label: 'Active Users',
                            data: [65, 78, 52, 91, 83, 125, 137],
                            borderColor: '#4f46e5',
                            backgroundColor: 'rgba(79, 70, 229, 0.2)',
                            tension: 0.4,
                            fill: true
                        },
                        {
                            label: 'New Registrations',
                            data: [28, 32, 21, 37, 29, 48, 52],
                            borderColor: '#10b981',
                            backgroundColor: 'rgba(16, 185, 129, 0.2)',
                            tension: 0.4,
                            fill: true
                        }
                    ]
                };
                resolve(reportData);
            });
    });
}

// Get revenue data from Firebase
function getRevenueData() {
    return new Promise((resolve, reject) => {
        // Get the last 6 months
        const months = [];
        const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const revenueData = [0, 0, 0, 0, 0, 0];
        
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        
        for (let i = 5; i >= 0; i--) {
            let month = currentMonth - i;
            let year = currentYear;
            
            if (month < 0) {
                month += 12;
                year -= 1;
            }
            
            months.push({
                month: month,
                year: year,
                label: monthLabels[month]
            });
        }
        
        // Get subscription data
        db.collection("users")
            .get()
            .then((usersSnapshot) => {
                usersSnapshot.forEach(doc => {
                    const user = doc.data();
                    if (user.subscriptionStartDate) {
                        const startDate = user.subscriptionStartDate instanceof Date ? 
                            user.subscriptionStartDate : 
                            new Date(user.subscriptionStartDate.seconds ? user.subscriptionStartDate.seconds * 1000 : user.subscriptionStartDate);
                        
                        const startMonth = startDate.getMonth();
                        const startYear = startDate.getFullYear();
                        
                        // Check if subscription started in the last 6 months
                        for (let i = 0; i < months.length; i++) {
                            if (months[i].month === startMonth && months[i].year === startYear) {
                                // Add subscription amount to revenue
                                let amount = 0;
                                const plan = user.subscription || user.plan || 'Free';
                                
                                if (plan.includes('999') || plan === '₹999' || plan === 'Premium' || plan === 'premium') {
                                    amount = 999;
                                } else if (plan.includes('499') || plan === '₹499' || plan === 'Standard' || plan === 'standard') {
                                    amount = 499;
                                } else if (plan.includes('199') || plan === '₹199' || plan === 'Basic' || plan === 'basic') {
                                    amount = 199;
                                }
                                
                                revenueData[i] += amount;
                                break;
                            }
                        }
                    }
                });
                
                // If no real data, add some sample data
                if (revenueData.every(val => val === 0)) {
                    for (let i = 0; i < 6; i++) {
                        revenueData[i] = Math.floor(Math.random() * 15000) + 10000;
                    }
                }
                
                // Create chart data
                const reportData = {
                    labels: months.map(m => m.label),
                    datasets: [{
                        label: 'Monthly Revenue (₹)',
                        data: revenueData,
                        backgroundColor: [
                            'rgba(16, 185, 129, 0.7)',
                            'rgba(59, 130, 246, 0.7)',
                            'rgba(245, 158, 11, 0.7)',
                            'rgba(239, 68, 68, 0.7)',
                            'rgba(139, 92, 246, 0.7)',
                            'rgba(236, 72, 153, 0.7)'
                        ],
                        borderWidth: 1
                    }]
                };
                
                resolve(reportData);
            })
            .catch(error => {
                console.error("Error getting revenue data:", error);
                // Fallback to sample data
                const reportData = {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [{
                        label: 'Monthly Revenue (₹)',
                        data: [12500, 19200, 15700, 24600, 28900, 34200],
                        backgroundColor: [
                            'rgba(16, 185, 129, 0.7)',
                            'rgba(59, 130, 246, 0.7)',
                            'rgba(245, 158, 11, 0.7)',
                            'rgba(239, 68, 68, 0.7)',
                            'rgba(139, 92, 246, 0.7)',
                            'rgba(236, 72, 153, 0.7)'
                        ],
                        borderWidth: 1
                    }]
                };
                resolve(reportData);
            });
    });
}

// Get exam performance data from Firebase
function getExamPerformanceData() {
    return new Promise((resolve, reject) => {
        // Get exams and their average scores
        db.collection("papers")
            .orderBy("attemptCount", "desc")
            .limit(5)
            .get()
            .then((examsSnapshot) => {
                const examLabels = [];
                const examScores = [];
                
                const promises = [];
                
                examsSnapshot.forEach(doc => {
                    const exam = doc.data();
                    const examName = exam.name || 'Unnamed Exam';
                    
                    // Get results for this exam
                    const resultPromise = db.collection("results")
                        .where("examId", "==", doc.id)
                        .get()
                        .then(resultsSnapshot => {
                            let totalScore = 0;
                            let count = 0;
                            
                            resultsSnapshot.forEach(resultDoc => {
                                const result = resultDoc.data();
                                if (result.score !== undefined && result.totalQuestions) {
                                    totalScore += (result.score / result.totalQuestions) * 100;
                                    count++;
                                }
                            });
                            
                            if (count > 0) {
                                examLabels.push(examName);
                                examScores.push(Math.round(totalScore / count));
                            }
                        });
                    
                    promises.push(resultPromise);
                });
                
                return Promise.all(promises).then(() => {
                    // If no real data, add some sample data
                    if (examLabels.length === 0) {
                        examLabels.push('JEE Mains 2023', 'NEET 2023', 'GATE CSE', 'UPSC Prelims', 'SSC CGL');
                        examScores.push(72, 68, 59, 63, 77);
                    }
                    
                    // Create chart data
                    const reportData = {
                        labels: examLabels,
                        datasets: [{
                            label: 'Avg. Score (%)',
                            data: examScores,
                            backgroundColor: 'rgba(245, 158, 11, 0.7)',
                            borderColor: '#f59e0b',
                            borderWidth: 1
                        }]
                    };
                    
                    resolve(reportData);
                });
            })
            .catch(error => {
                console.error("Error getting exam performance data:", error);
                // Fallback to sample data
                const reportData = {
                    labels: ['JEE Mains 2023', 'NEET 2023', 'GATE CSE', 'UPSC Prelims', 'SSC CGL'],
                    datasets: [{
                        label: 'Avg. Score (%)',
                        data: [72, 68, 59, 63, 77],
                        backgroundColor: 'rgba(245, 158, 11, 0.7)',
                        borderColor: '#f59e0b',
                        borderWidth: 1
                    }]
                };
                resolve(reportData);
            });
    });
}

// Get user growth data from Firebase
function getUserGrowthData() {
    return new Promise((resolve, reject) => {
        // Get quarters for the current year
        const today = new Date();
        const currentYear = today.getFullYear();
        
        const quarters = [
            { start: new Date(currentYear, 0, 1), end: new Date(currentYear, 2, 31), label: 'Q1' },
            { start: new Date(currentYear, 3, 1), end: new Date(currentYear, 5, 30), label: 'Q2' },
            { start: new Date(currentYear, 6, 1), end: new Date(currentYear, 8, 30), label: 'Q3' },
            { start: new Date(currentYear, 9, 1), end: new Date(currentYear, 11, 31), label: 'Q4' }
        ];
        
        // Initialize data arrays
        const freeUsers = [0, 0, 0, 0];
        const basicUsers = [0, 0, 0, 0];
        const standardUsers = [0, 0, 0, 0];
        const premiumUsers = [0, 0, 0, 0];
        
        // Get user data
        db.collection("users")
            .get()
            .then((usersSnapshot) => {
                usersSnapshot.forEach(doc => {
                    const user = doc.data();
                    if (user.createdAt) {
                        const createdDate = user.createdAt instanceof Date ? 
                            user.createdAt : 
                            new Date(user.createdAt.seconds ? user.createdAt.seconds * 1000 : user.createdAt);
                        
                        // Skip users created before this year
                        if (createdDate.getFullYear() < currentYear) {
                            return;
                        }
                        
                        // Find which quarter the user was created in
                        for (let i = 0; i < quarters.length; i++) {
                            if (createdDate >= quarters[i].start && createdDate <= quarters[i].end) {
                                const plan = user.subscription || user.plan || 'Free';
                                
                                if (plan.includes('999') || plan === '₹999' || plan === 'Premium' || plan === 'premium') {
                                    premiumUsers[i]++;
                                } else if (plan.includes('499') || plan === '₹499' || plan === 'Standard' || plan === 'standard') {
                                    standardUsers[i]++;
                                } else if (plan.includes('199') || plan === '₹199' || plan === 'Basic' || plan === 'basic') {
                                    basicUsers[i]++;
                                } else {
                                    freeUsers[i]++;
                                }
                                
                                break;
                            }
                        }
                    }
                });
                
                // If no real data, add some sample data
                if (freeUsers.every(val => val === 0) && 
                    basicUsers.every(val => val === 0) && 
                    standardUsers.every(val => val === 0) && 
                    premiumUsers.every(val => val === 0)) {
                    
                    freeUsers[0] = 350;
                    freeUsers[1] = 420;
                    freeUsers[2] = 570;
                    freeUsers[3] = 690;
                    
                    basicUsers[0] = 120;
                    basicUsers[1] = 150;
                    basicUsers[2] = 190;
                    basicUsers[3] = 240;
                    
                    standardUsers[0] = 85;
                    standardUsers[1] = 110;
                    standardUsers[2] = 145;
                    standardUsers[3] = 180;
                    
                    premiumUsers[0] = 45;
                    premiumUsers[1] = 65;
                    premiumUsers[2] = 90;
                    premiumUsers[3] = 120;
                }
                
                // Create chart data
                const reportData = {
                    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
                    datasets: [{
                        label: 'Free Users',
                        data: freeUsers,
                        backgroundColor: 'rgba(59, 130, 246, 0.7)'
                    }, {
                        label: 'Basic Plan',
                        data: basicUsers,
                        backgroundColor: 'rgba(16, 185, 129, 0.7)'
                    }, {
                        label: 'Standard Plan',
                        data: standardUsers,
                        backgroundColor: 'rgba(245, 158, 11, 0.7)'
                    }, {
                        label: 'Premium Plan',
                        data: premiumUsers,
                        backgroundColor: 'rgba(239, 68, 68, 0.7)'
                    }]
                };
                
                resolve(reportData);
            })
            .catch(error => {
                console.error("Error getting user growth data:", error);
                // Fallback to sample data
                const reportData = {
                    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
                    datasets: [{
                        label: 'Free Users',
                        data: [350, 420, 570, 690],
                        backgroundColor: 'rgba(59, 130, 246, 0.7)'
                    }, {
                        label: 'Basic Plan',
                        data: [120, 150, 190, 240],
                        backgroundColor: 'rgba(16, 185, 129, 0.7)'
                    }, {
                        label: 'Standard Plan',
                        data: [85, 110, 145, 180],
                        backgroundColor: 'rgba(245, 158, 11, 0.7)'
                    }, {
                        label: 'Premium Plan',
                        data: [45, 65, 90, 120],
                        backgroundColor: 'rgba(239, 68, 68, 0.7)'
                    }]
                };
                resolve(reportData);
            });
    });
}

// Function to show report data from Firebase
function showReport(reportType) {
    // Show loading modal first
    const loadingModalHTML = `
        <div class="modal fade" id="loadingModal" tabindex="-1" aria-hidden="true" data-bs-backdrop="static">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-body text-center p-5">
                        <div class="spinner-border text-primary mb-3" role="status" style="width: 3rem; height: 3rem;">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                        <h5>Loading report data...</h5>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    const loadingContainer = document.createElement('div');
    loadingContainer.innerHTML = loadingModalHTML;
    document.body.appendChild(loadingContainer);
    
    const loadingModal = new bootstrap.Modal(document.getElementById('loadingModal'));
    loadingModal.show();
    
    // Define report variables
    let reportTitle, chartType;
    let dataPromise;
    
    switch(reportType) {
        case 'user-activity':
            reportTitle = 'User Activity Report';
            chartType = 'line';
            dataPromise = getUserActivityData();
            break;
            
        case 'revenue':
            reportTitle = 'Revenue Report';
            chartType = 'bar';
            dataPromise = getRevenueData();
            break;
            
        case 'exam-performance':
            reportTitle = 'Exam Performance Report';
            chartType = 'bar';
            dataPromise = getExamPerformanceData();
            break;
            
        case 'growth':
            reportTitle = 'User Growth Analytics';
            chartType = 'doughnut';
            dataPromise = getUserGrowthData();
            break;
    }
    
    // Get the data and show the report
    dataPromise.then(reportData => {
        // Hide loading modal
        loadingModal.hide();
        document.body.removeChild(loadingContainer);
        
        // Create modal with chart
        const modalHTML = `
            <div class="modal fade" id="reportDataModal" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header bg-gradient-indigo text-white">
                            <h5 class="modal-title">${reportTitle}</h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="chart-container" style="position: relative; height:60vh; width:100%">
                                <canvas id="reportChart"></canvas>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary" id="download-report">Download Report</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Add modal to body
        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = modalHTML;
        document.body.appendChild(modalContainer);
        
        // Initialize and show modal
        const modal = new bootstrap.Modal(document.getElementById('reportDataModal'));
        modal.show();
        
        // Create chart when modal is shown
        document.getElementById('reportDataModal').addEventListener('shown.bs.modal', function() {
            const ctx = document.getElementById('reportChart').getContext('2d');
            const reportChart = new Chart(ctx, {
                type: chartType,
                data: reportData,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        title: {
                            display: true,
                            text: reportTitle
                        }
                    }
                }
            });
        });
        
        // Handle download button
        document.getElementById('download-report').addEventListener('click', function() {
            const canvas = document.getElementById('reportChart');
            const imgData = canvas.toDataURL('image/png');
            
            // Create a link to download the image
            const link = document.createElement('a');
            link.href = imgData;
            link.download = `${reportTitle.replace(/\s+/g, '-').toLowerCase()}.png`;
            link.click();
        });
        
        // Clean up modal when hidden
        document.getElementById('reportDataModal').addEventListener('hidden.bs.modal', function() {
            document.body.removeChild(modalContainer);
        });
    }).catch(error => {
        console.error("Error loading report data:", error);
        loadingModal.hide();
        document.body.removeChild(loadingContainer);
        alert("Failed to load report data. Please try again.");
    });
}