// Enhanced version of activity loader that tries to get real data
function loadRealActivity() {
    const container = document.getElementById('recent-activity-container');
    if (!container) return;
    
    // Get Firestore instance
    const db = firebase.firestore();
    
    // Try to get real data
    Promise.all([
        // Try to get recent users
        db.collection("users").orderBy("createdAt", "desc").limit(1).get(),
        // Try to get recent exams
        db.collection("papers").orderBy("createdAt", "desc").limit(1).get()
    ])
    .then(([usersSnapshot, examsSnapshot]) => {
        // Create activities array
        const activities = [];
        
        // Add user activities
        if (!usersSnapshot.empty) {
            usersSnapshot.forEach(doc => {
                const user = doc.data();
                activities.push({
                    type: 'user',
                    icon: 'user',
                    iconClass: 'primary',
                    title: `New user registered: ${user.name || user.email || 'Unknown'}`,
                    time: 'Recently'
                });
            });
        }
        
        // Add exam activities
        if (!examsSnapshot.empty) {
            examsSnapshot.forEach(doc => {
                const exam = doc.data();
                activities.push({
                    type: 'exam',
                    icon: 'file-alt',
                    iconClass: 'warning',
                    title: `New exam added: ${exam.name || 'Unnamed Exam'}`,
                    time: 'Recently'
                });
            });
        }
        
        // Add a default activity if none found
        if (activities.length === 0) {
            activities.push({
                type: 'system',
                icon: 'info-circle',
                iconClass: 'success',
                title: 'System is ready',
                time: 'Just now'
            });
        }
        
        // Clear container
        container.innerHTML = '';
        
        // Add activities to container
        activities.forEach(activity => {
            const activityItem = document.createElement('div');
            activityItem.className = 'activity-item p-3';
            activityItem.innerHTML = `
                <div class="activity-icon ${activity.iconClass}">
                    <i class="fas fa-${activity.icon}"></i>
                </div>
                <div class="activity-content">
                    <div class="activity-title">${activity.title}</div>
                    <div class="activity-time">${activity.time}</div>
                </div>
            `;
            
            container.appendChild(activityItem);
        });
    })
    .catch(error => {
        console.error("Error loading activities:", error);
        // Fall back to default activities
        loadRecentActivity();
    });
}

// Execute immediately
setTimeout(function() {
    loadRealActivity();
}, 800);