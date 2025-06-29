// Direct fix to show real activity from Firebase
document.addEventListener('DOMContentLoaded', function() {
    console.log("Loading real activity from Firebase...");
    
    // Get Firestore instance
    const db = firebase.firestore();
    
    // Load real activity data
    loadRealActivity(db);
});

// Function to load real activity from Firebase
function loadRealActivity(db) {
    console.log("Loading real activity...");
    
    // Get the container
    const container = document.getElementById('recent-activity-container');
    if (!container) {
        console.error("recent-activity-container not found");
        return;
    }
    
    // Show loading message
    container.innerHTML = '<div class="activity-item p-3"><div class="activity-icon primary"><i class="fas fa-spinner fa-spin"></i></div><div class="activity-content"><div class="activity-title">Loading real activity from Firebase...</div></div></div>';
    
    // Create activities array
    let activities = [];
    
    // Get recent users for activity
    const usersPromise = db.collection("users")
        .limit(2)
        .get()
        .then(snapshot => {
            console.log("Users for activity:", snapshot.size);
            snapshot.forEach(doc => {
                const user = doc.data();
                activities.push({
                    type: 'user',
                    icon: 'user',
                    iconClass: 'primary',
                    title: `New user registered: ${user.name || user.firstName || user.email || 'Unknown'}`,
                    time: 'Recently'
                });
            });
        })
        .catch(error => {
            console.error("Error getting users for activity:", error);
        });
    
    // Get recent exams for activity
    const examsPromise = db.collection("papers")
        .limit(2)
        .get()
        .then(snapshot => {
            console.log("Exams for activity:", snapshot.size);
            snapshot.forEach(doc => {
                const exam = doc.data();
                activities.push({
                    type: 'exam',
                    icon: 'file-alt',
                    iconClass: 'warning',
                    title: `New exam added: ${exam.name || 'Unnamed Exam'}`,
                    time: 'Recently'
                });
            });
        })
        .catch(error => {
            console.error("Error getting exams for activity:", error);
        });
    
    // Wait for all promises to resolve
    Promise.all([usersPromise, examsPromise])
        .then(() => {
            console.log("All activity data loaded:", activities.length, "activities");
            
            // If no activities, add a default one
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
            container.innerHTML = `
                <div class="activity-item p-3">
                    <div class="activity-icon danger">
                        <i class="fas fa-exclamation-triangle"></i>
                    </div>
                    <div class="activity-content">
                        <div class="activity-title">Error loading activities: ${error.message}</div>
                        <div class="activity-time">Just now</div>
                    </div>
                </div>
            `;
        });
}