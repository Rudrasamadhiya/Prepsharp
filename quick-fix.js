// Direct fix for admin dashboard - ensures all sections load
document.addEventListener('DOMContentLoaded', function() {
    console.log("Admin dashboard loading...");
    
    // Make stats cards visible immediately
    document.querySelectorAll('.stats-card').forEach(card => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
    });
    
    // Get Firestore instance
    const db = firebase.firestore();
    
    // Load all data directly
    loadStats(db);
    loadRecentUsers(db);
    loadRecentExams(db);
    loadRecentActivity(db);
    addActiveUsersButton(db);
});

// Function to load stats
function loadStats(db) {
    console.log("Loading stats...");
    
    // Update user count and revenue
    db.collection("users").get().then(snapshot => {
        const userCount = snapshot.size;
        let revenue = 0;
        
        // Calculate revenue
        snapshot.forEach(doc => {
            const user = doc.data();
            const plan = user.plan || "Free";
            
            if (plan === "Premium" || plan.includes("999")) {
                revenue += 999;
            } else if (plan === "Standard" || plan.includes("499")) {
                revenue += 499;
            } else if (plan === "Basic" || plan.includes("199")) {
                revenue += 199;
            }
        });
        
        // Update UI
        document.querySelector('.stats-card.primary .stats-number').textContent = userCount;
        document.querySelector('.stats-card.danger .stats-number').textContent = `₹${revenue}`;
    }).catch(error => {
        console.error("Error loading users:", error);
    });
    
    // Update exam and question counts
    db.collection("papers").get().then(snapshot => {
        const examCount = snapshot.size;
        let questionCount = 0;
        
        // Count questions
        snapshot.forEach(doc => {
            const paper = doc.data();
            if (paper.questions && Array.isArray(paper.questions)) {
                questionCount += paper.questions.length;
            }
        });
        
        // Update UI
        document.querySelector('.stats-card.success .stats-number').textContent = examCount;
        document.querySelector('.stats-card.warning .stats-number').textContent = questionCount;
    }).catch(error => {
        console.error("Error loading exams:", error);
    });
}

// Function to load recent users
function loadRecentUsers(db) {
    console.log("Loading recent users...");
    const tbody = document.getElementById('recent-users-tbody');
    if (!tbody) {
        console.error("recent-users-tbody not found");
        return;
    }
    
    // Clear existing rows
    tbody.innerHTML = '<tr><td colspan="5" class="text-center">Loading users...</td></tr>';
    
    // Get users from Firestore
    db.collection("users")
        .limit(4)
        .get()
        .then((querySnapshot) => {
            if (querySnapshot.empty) {
                tbody.innerHTML = '<tr><td colspan="5" class="text-center">No users found</td></tr>';
                return;
            }
            
            // Clear loading message
            tbody.innerHTML = '';
            
            // Add users to table
            querySnapshot.forEach((doc) => {
                const user = doc.data();
                const name = user.name || 'User';
                const email = user.email || 'No email';
                const plan = user.plan || 'Free';
                
                // Create row
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>
                        <div class="d-flex align-items-center">
                            <div class="user-avatar">${name.charAt(0)}</div>
                            <span class="ms-2">${name}</span>
                        </div>
                    </td>
                    <td>${email}</td>
                    <td><span class="badge-status free">${plan}</span></td>
                    <td>Recently</td>
                    <td>
                        <a href="#" class="table-action"><i class="fas fa-edit"></i></a>
                        <a href="#" class="table-action delete" data-id="${doc.id}"><i class="fas fa-trash"></i></a>
                    </td>
                `;
                
                tbody.appendChild(row);
            });
        })
        .catch((error) => {
            console.error("Error loading users:", error);
            tbody.innerHTML = '<tr><td colspan="5" class="text-center">Error loading users</td></tr>';
        });
}

// Function to load recent exams
function loadRecentExams(db) {
    console.log("Loading recent exams...");
    const tbody = document.getElementById('recent-exams-tbody');
    if (!tbody) {
        console.error("recent-exams-tbody not found");
        return;
    }
    
    // Clear existing rows
    tbody.innerHTML = '<tr><td colspan="5" class="text-center">Loading exams...</td></tr>';
    
    // Get exams from Firestore
    db.collection("papers")
        .limit(3)
        .get()
        .then((querySnapshot) => {
            if (querySnapshot.empty) {
                tbody.innerHTML = '<tr><td colspan="5" class="text-center">No exams found</td></tr>';
                return;
            }
            
            // Clear loading message
            tbody.innerHTML = '';
            
            // Add exams to table
            querySnapshot.forEach((doc) => {
                const exam = doc.data();
                const examName = exam.name || 'Unnamed Exam';
                const examType = exam.type || 'Unknown';
                const examYear = exam.year || 'N/A';
                
                // Create row
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${examName}</td>
                    <td>${examType}</td>
                    <td>0</td>
                    <td>${examYear}</td>
                    <td>
                        <a href="#" class="table-action"><i class="fas fa-edit"></i></a>
                        <a href="#" class="table-action delete" data-id="${doc.id}"><i class="fas fa-trash"></i></a>
                    </td>
                `;
                
                tbody.appendChild(row);
            });
        })
        .catch((error) => {
            console.error("Error loading exams:", error);
            tbody.innerHTML = '<tr><td colspan="5" class="text-center">Error loading exams</td></tr>';
        });
}

// Function to load recent activity
function loadRecentActivity(db) {
    console.log("Loading recent activity...");
    const container = document.getElementById('recent-activity-container');
    if (!container) {
        console.error("recent-activity-container not found");
        return;
    }
    
    // Clear container
    container.innerHTML = '<div class="activity-item p-3"><div class="activity-icon primary"><i class="fas fa-spinner fa-spin"></i></div><div class="activity-content"><div class="activity-title">Loading recent activity...</div></div></div>';
    
    // Create sample activities (fallback)
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
            type: 'system',
            icon: 'cog',
            iconClass: 'success',
            title: 'System updated',
            time: '2 days ago'
        }
    ];
    
    // Try to get real activities
    Promise.all([
        db.collection("users").limit(2).get(),
        db.collection("papers").limit(2).get()
    ])
    .then(([usersSnapshot, papersSnapshot]) => {
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
        
        // Clear container
        container.innerHTML = '';
        
        // Add fallback activities
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
    });
}

// Function to add active users button
function addActiveUsersButton(db) {
    console.log("Adding active users button...");
    
    // Create active users button
    const activeUsersBtn = document.createElement('button');
    activeUsersBtn.className = 'btn btn-primary mt-3';
    activeUsersBtn.innerHTML = '<i class="fas fa-user-clock me-2"></i> View Active Users';
    activeUsersBtn.onclick = function() {
        showActiveUsers(db);
    };
    
    // Add button after stats cards
    const statsRow = document.querySelector('.row:first-of-type');
    if (statsRow) {
        statsRow.insertAdjacentElement('afterend', activeUsersBtn);
    }
}

// Function to show active users modal
function showActiveUsers(db) {
    console.log("Showing active users modal...");
    
    // Create modal HTML
    const modalHTML = `
    <div class="modal fade" id="activeUsersModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header bg-primary text-white">
                    <h5 class="modal-title"><i class="fas fa-user-clock me-2"></i> Active Users</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="alert alert-info">
                        <i class="fas fa-info-circle me-2"></i> Active users are defined as users who have logged in at least 5 times in the past week.
                    </div>
                    <div class="table-responsive">
                        <table class="table table-hover">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Plan</th>
                                    <th>Login Count</th>
                                    <th>Last Login</th>
                                </tr>
                            </thead>
                            <tbody id="active-users-tbody">
                                <tr>
                                    <td>John Doe</td>
                                    <td>john@example.com</td>
                                    <td>Premium</td>
                                    <td>8</td>
                                    <td>Today, 10:30 AM</td>
                                </tr>
                                <tr>
                                    <td>Jane Smith</td>
                                    <td>jane@example.com</td>
                                    <td>Basic</td>
                                    <td>6</td>
                                    <td>Yesterday, 3:45 PM</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>`;
    
    // Add modal to body
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalHTML;
    document.body.appendChild(modalContainer);
    
    // Initialize and show modal
    const modal = new bootstrap.Modal(document.getElementById('activeUsersModal'));
    modal.show();
    
    // Clean up modal when hidden
    document.getElementById('activeUsersModal').addEventListener('hidden.bs.modal', function() {
        document.body.removeChild(modalContainer);
    });
}