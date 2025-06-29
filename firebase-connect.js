// Connect to real Firebase data
document.addEventListener('DOMContentLoaded', function() {
    console.log("Connecting to real Firebase data...");
    
    // Make stats cards visible
    document.querySelectorAll('.stats-card').forEach(card => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
    });
    
    // Get Firestore instance directly
    const db = firebase.firestore();
    
    // Load real data
    loadStats(db);
    loadRecentUsers(db);
    loadRecentExams(db);
    loadRecentActivity(db);
});

// Load stats from Firebase
function loadStats(db) {
    // Load users count and revenue
    db.collection("users").get().then(snapshot => {
        const userCount = snapshot.size;
        document.querySelector('.stats-card.primary .stats-number').textContent = userCount;
        
        // Calculate revenue
        let revenue = 0;
        snapshot.forEach(doc => {
            const user = doc.data();
            const plan = user.plan || "Free";
            if (plan === "Premium" || plan.includes("999")) revenue += 999;
            else if (plan === "Standard" || plan.includes("499")) revenue += 499;
            else if (plan === "Basic" || plan.includes("199")) revenue += 199;
        });
        document.querySelector('.stats-card.danger .stats-number').textContent = `₹${revenue}`;
    });
    
    // Load exams and questions count
    db.collection("papers").get().then(snapshot => {
        const examCount = snapshot.size;
        document.querySelector('.stats-card.success .stats-number').textContent = examCount;
        
        // Count questions
        let questionCount = 0;
        snapshot.forEach(doc => {
            const paper = doc.data();
            if (paper.questions && Array.isArray(paper.questions)) {
                questionCount += paper.questions.length;
            }
        });
        document.querySelector('.stats-card.warning .stats-number').textContent = questionCount;
    });
}

// Load recent users from Firebase
function loadRecentUsers(db) {
    const tbody = document.getElementById('recent-users-tbody');
    if (!tbody) return;
    
    db.collection("users").limit(4).get().then(snapshot => {
        if (snapshot.empty) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center">No users found</td></tr>';
            return;
        }
        
        // Clear existing rows
        tbody.innerHTML = '';
        
        // Add users to table
        snapshot.forEach(doc => {
            const user = doc.data();
            const name = user.name || user.firstName || 'User';
            const email = user.email || 'No email';
            const plan = user.plan || 'Free';
            
            // Get initials
            const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
            
            // Determine plan class
            let planClass = 'free';
            if (plan.includes('Premium') || plan.includes('999')) planClass = 'premium';
            else if (plan.includes('Standard') || plan.includes('499')) planClass = 'standard';
            else if (plan.includes('Basic') || plan.includes('199')) planClass = 'basic';
            
            // Create row
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <div class="d-flex align-items-center">
                        <div class="user-avatar">${initials}</div>
                        <span class="ms-2">${name}</span>
                    </div>
                </td>
                <td>${email}</td>
                <td><span class="badge-status ${planClass}">${plan}</span></td>
                <td>Recently</td>
                <td>
                    <a href="#" class="table-action"><i class="fas fa-edit"></i></a>
                    <a href="#" class="table-action delete" data-id="${doc.id}"><i class="fas fa-trash"></i></a>
                </td>
            `;
            
            tbody.appendChild(row);
        });
    }).catch(error => {
        console.error("Error loading users:", error);
        tbody.innerHTML = '<tr><td colspan="5" class="text-center">Error loading users</td></tr>';
    });
}

// Load recent exams from Firebase
function loadRecentExams(db) {
    const tbody = document.getElementById('recent-exams-tbody');
    if (!tbody) return;
    
    db.collection("papers").limit(3).get().then(snapshot => {
        if (snapshot.empty) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center">No exams found</td></tr>';
            return;
        }
        
        // Clear existing rows
        tbody.innerHTML = '';
        
        // Add exams to table
        snapshot.forEach(doc => {
            const exam = doc.data();
            const examName = exam.name || 'Unnamed Exam';
            const examType = exam.type || 'Unknown';
            const examYear = exam.year || 'N/A';
            
            // Count questions
            let questionCount = 0;
            if (exam.questions && Array.isArray(exam.questions)) {
                questionCount = exam.questions.length;
            }
            
            // Create row
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${examName}</td>
                <td>${examType}</td>
                <td>${questionCount}</td>
                <td>${examYear}</td>
                <td>
                    <a href="#" class="table-action"><i class="fas fa-edit"></i></a>
                    <a href="#" class="table-action delete" data-id="${doc.id}"><i class="fas fa-trash"></i></a>
                </td>
            `;
            
            tbody.appendChild(row);
        });
    }).catch(error => {
        console.error("Error loading exams:", error);
        tbody.innerHTML = '<tr><td colspan="5" class="text-center">Error loading exams</td></tr>';
    });
}

// Load recent activity from Firebase
function loadRecentActivity(db) {
    const container = document.getElementById('recent-activity-container');
    if (!container) return;
    
    // Clear container
    container.innerHTML = '';
    
    // Get recent users for activity
    db.collection("users").orderBy("createdAt", "desc").limit(2).get().then(snapshot => {
        snapshot.forEach(doc => {
            const user = doc.data();
            const name = user.name || user.firstName || 'User';
            
            // Create activity item
            const activityItem = document.createElement('div');
            activityItem.className = 'activity-item p-3';
            activityItem.innerHTML = `
                <div class="activity-icon primary">
                    <i class="fas fa-user"></i>
                </div>
                <div class="activity-content">
                    <div class="activity-title">New user registered: ${name}</div>
                    <div class="activity-time">Recently</div>
                </div>
            `;
            
            container.appendChild(activityItem);
        });
    });
    
    // Get recent exams for activity
    db.collection("papers").orderBy("createdAt", "desc").limit(2).get().then(snapshot => {
        snapshot.forEach(doc => {
            const exam = doc.data();
            const examName = exam.name || 'Unnamed Exam';
            
            // Create activity item
            const activityItem = document.createElement('div');
            activityItem.className = 'activity-item p-3';
            activityItem.innerHTML = `
                <div class="activity-icon warning">
                    <i class="fas fa-file-alt"></i>
                </div>
                <div class="activity-content">
                    <div class="activity-title">New exam added: ${examName}</div>
                    <div class="activity-time">Recently</div>
                </div>
            `;
            
            container.appendChild(activityItem);
        });
    });
}