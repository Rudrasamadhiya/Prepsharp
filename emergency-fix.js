// Emergency fix for admin dashboard sections
document.addEventListener('DOMContentLoaded', function() {
    console.log("Emergency fix loading...");
    
    // Fix stats cards
    document.querySelectorAll('.stats-card').forEach(card => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
    });
    
    // Fix recent users
    fixRecentUsers();
    
    // Fix recent exams
    fixRecentExams();
    
    // Fix recent activity
    fixRecentActivity();
});

// Fix recent users section
function fixRecentUsers() {
    const tbody = document.getElementById('recent-users-tbody');
    if (!tbody) return;
    
    // Add sample users
    tbody.innerHTML = `
        <tr>
            <td>
                <div class="d-flex align-items-center">
                    <div class="user-avatar">JD</div>
                    <span class="ms-2">John Doe</span>
                </div>
            </td>
            <td>john@example.com</td>
            <td><span class="badge-status premium">Premium</span></td>
            <td>Today</td>
            <td>
                <a href="#" class="table-action"><i class="fas fa-edit"></i></a>
                <a href="#" class="table-action delete"><i class="fas fa-trash"></i></a>
            </td>
        </tr>
        <tr>
            <td>
                <div class="d-flex align-items-center">
                    <div class="user-avatar">JS</div>
                    <span class="ms-2">Jane Smith</span>
                </div>
            </td>
            <td>jane@example.com</td>
            <td><span class="badge-status standard">Standard</span></td>
            <td>Yesterday</td>
            <td>
                <a href="#" class="table-action"><i class="fas fa-edit"></i></a>
                <a href="#" class="table-action delete"><i class="fas fa-trash"></i></a>
            </td>
        </tr>
        <tr>
            <td>
                <div class="d-flex align-items-center">
                    <div class="user-avatar">RJ</div>
                    <span class="ms-2">Robert Johnson</span>
                </div>
            </td>
            <td>robert@example.com</td>
            <td><span class="badge-status basic">Basic</span></td>
            <td>2 days ago</td>
            <td>
                <a href="#" class="table-action"><i class="fas fa-edit"></i></a>
                <a href="#" class="table-action delete"><i class="fas fa-trash"></i></a>
            </td>
        </tr>
    `;
}

// Fix recent exams section
function fixRecentExams() {
    const tbody = document.getElementById('recent-exams-tbody');
    if (!tbody) return;
    
    // Add sample exams
    tbody.innerHTML = `
        <tr>
            <td>JEE Main 2023</td>
            <td>Mock Test</td>
            <td>75</td>
            <td>2023</td>
            <td>
                <a href="#" class="table-action"><i class="fas fa-edit"></i></a>
                <a href="#" class="table-action delete"><i class="fas fa-trash"></i></a>
            </td>
        </tr>
        <tr>
            <td>NEET 2023</td>
            <td>Practice Test</td>
            <td>180</td>
            <td>2023</td>
            <td>
                <a href="#" class="table-action"><i class="fas fa-edit"></i></a>
                <a href="#" class="table-action delete"><i class="fas fa-trash"></i></a>
            </td>
        </tr>
        <tr>
            <td>JEE Advanced 2023</td>
            <td>Mock Test</td>
            <td>54</td>
            <td>2023</td>
            <td>
                <a href="#" class="table-action"><i class="fas fa-edit"></i></a>
                <a href="#" class="table-action delete"><i class="fas fa-trash"></i></a>
            </td>
        </tr>
    `;
}

// Fix recent activity section
function fixRecentActivity() {
    const container = document.getElementById('recent-activity-container');
    if (!container) return;
    
    // Add sample activities
    container.innerHTML = `
        <div class="activity-item p-3">
            <div class="activity-icon primary">
                <i class="fas fa-user"></i>
            </div>
            <div class="activity-content">
                <div class="activity-title">New user registered: John Doe</div>
                <div class="activity-time">Today, 10:30 AM</div>
            </div>
        </div>
        <div class="activity-item p-3">
            <div class="activity-icon warning">
                <i class="fas fa-file-alt"></i>
            </div>
            <div class="activity-content">
                <div class="activity-title">New exam added: JEE Main 2023</div>
                <div class="activity-time">Yesterday, 3:45 PM</div>
            </div>
        </div>
        <div class="activity-item p-3">
            <div class="activity-icon success">
                <i class="fas fa-rupee-sign"></i>
            </div>
            <div class="activity-content">
                <div class="activity-title">New subscription: Premium Plan</div>
                <div class="activity-time">2 days ago</div>
            </div>
        </div>
    `;
}