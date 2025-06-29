// Function to load recent activity
function loadRecentActivity() {
    const container = document.getElementById('recent-activity-container');
    if (!container) {
        console.error("recent-activity-container not found");
        return;
    }
    
    // Clear container
    container.innerHTML = '<div class="activity-item p-3"><div class="activity-icon primary"><i class="fas fa-spinner fa-spin"></i></div><div class="activity-content"><div class="activity-title">Loading recent activity...</div></div></div>';
    
    // Get Firestore instance
    const db = firebase.firestore();
    
    // Create sample activities
    const activities = [
        {
            type: 'user',
            icon: 'user',
            iconClass: 'primary',
            title: 'New user registered',
            time: 'Today'
        },
        {
            type: 'exam',
            icon: 'file-alt',
            iconClass: 'warning',
            title: 'New exam added',
            time: 'Yesterday'
        },
        {
            type: 'payment',
            icon: 'rupee-sign',
            iconClass: 'success',
            title: 'New subscription purchased',
            time: '2 days ago'
        }
    ];
    
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
}

// Execute immediately
setTimeout(function() {
    loadRecentActivity();
}, 700);