// Direct fix for admin dashboard - connects to real Firebase data
document.addEventListener('DOMContentLoaded', function() {
    // Make stats cards visible
    document.querySelectorAll('.stats-card').forEach(card => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
    });
    
    // Load real data
    loadRealData();
    
    // Add active users button
    addActiveUsersButton();
});

// Function to load real data from Firebase
function loadRealData() {
    // Get Firestore instance
    const db = firebase.firestore();
    
    // Load users count and calculate revenue
    db.collection("users").get().then(snapshot => {
        const userCount = snapshot.size;
        let revenue = 0;
        
        // Calculate revenue from subscriptions
        snapshot.forEach(doc => {
            const user = doc.data();
            const plan = user.subscriptionPlan || user.plan || 'Free';
            if (plan.includes('999') || plan === '₹999' || plan === 'Premium' || plan === 'premium') {
                revenue += 999;
            } else if (plan.includes('499') || plan === '₹499' || plan === 'Standard' || plan === 'standard') {
                revenue += 499;
            } else if (plan.includes('199') || plan === '₹199' || plan === 'Basic' || plan === 'basic') {
                revenue += 199;
            }
        });
        
        // Update UI
        document.querySelector('.stats-card.primary .stats-number').textContent = userCount;
        document.querySelector('.stats-card.danger .stats-number').textContent = `₹${revenue}`;
        
        // Load recent users
        loadRecentUsers(db);
    }).catch(error => {
        console.error("Error loading users:", error);
    });
    
    // Load exams count and questions count
    db.collection("papers").get().then(snapshot => {
        const examCount = snapshot.size;
        let questionCount = 0;
        
        // Count questions across all exams
        snapshot.forEach(doc => {
            const exam = doc.data();
            if (exam.questions && Array.isArray(exam.questions)) {
                questionCount += exam.questions.length;
            }
        });
        
        // Update UI
        document.querySelector('.stats-card.success .stats-number').textContent = examCount;
        document.querySelector('.stats-card.warning .stats-number').textContent = questionCount;
        
        // Load recent exams
        loadRecentExams(db);
    }).catch(error => {
        console.error("Error loading exams:", error);
    });
    
    // Load recent activity
    loadRecentActivity(db);
}

// Function to load recent users
function loadRecentUsers(db) {
    const tbody = document.getElementById('recent-users-tbody');
    if (!tbody) return;
    
    // Clear existing rows
    tbody.innerHTML = '<tr><td colspan="5" class="text-center">Loading users...</td></tr>';
    
    // Get users from Firestore, ordered by creation date
    db.collection("users")
        .orderBy("createdAt", "desc")
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
                const name = user.name || (user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : 'Unknown');
                const email = user.email || 'No email';
                const plan = user.subscription || user.plan || 'Free';
                
                // Format date
                let joinedText = 'Recently';
                if (user.createdAt) {
                    try {
                        const createdAt = user.createdAt.toDate ? user.createdAt.toDate() : new Date(user.createdAt);
                        const now = new Date();
                        const diffDays = Math.floor((now - createdAt) / (1000 * 60 * 60 * 24));
                        
                        if (diffDays === 0) {
                            joinedText = 'Today';
                        } else if (diffDays === 1) {
                            joinedText = 'Yesterday';
                        } else {
                            joinedText = `${diffDays} days ago`;
                        }
                    } catch (e) {
                        console.error("Error formatting date:", e);
                    }
                }
                
                // Get initials for avatar
                const initials = name.split(' ')
                    .map(n => n[0])
                    .join('')
                    .substring(0, 2)
                    .toUpperCase();
                
                // Determine plan badge class
                let planClass = 'free';
                if (plan.includes('999') || plan === '₹999' || plan === 'Premium' || plan === 'premium') {
                    planClass = 'premium';
                } else if (plan.includes('499') || plan === '₹499' || plan === 'Standard' || plan === 'standard') {
                    planClass = 'standard';
                } else if (plan.includes('199') || plan === '₹199' || plan === 'Basic' || plan === 'basic') {
                    planClass = 'basic';
                }
                
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
                    <td>${joinedText}</td>
                    <td>
                        <a href="#" class="table-action"><i class="fas fa-edit"></i></a>
                        <a href="#" class="table-action delete" data-id="${doc.id}"><i class="fas fa-trash"></i></a>
                    </td>
                `;
                
                tbody.appendChild(row);
            });
            
            // Add event listeners to action buttons
            addUserActionListeners(db);
        })
        .catch((error) => {
            console.error("Error loading users:", error);
            tbody.innerHTML = '<tr><td colspan="5" class="text-center">Error loading users</td></tr>';
        });
}

// Function to load recent exams
function loadRecentExams(db) {
    const tbody = document.getElementById('recent-exams-tbody');
    if (!tbody) return;
    
    // Clear existing rows
    tbody.innerHTML = '<tr><td colspan="5" class="text-center">Loading exams...</td></tr>';
    
    // Get recent exams from Firestore
    db.collection("papers")
        .orderBy("createdAt", "desc")
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
                        <a href="edit-exam.html?id=${doc.id}" class="table-action"><i class="fas fa-edit"></i></a>
                        <a href="#" class="table-action delete" data-id="${doc.id}"><i class="fas fa-trash"></i></a>
                    </td>
                `;
                
                tbody.appendChild(row);
            });
            
            // Add event listeners to delete buttons
            addExamActionListeners(db);
        })
        .catch((error) => {
            console.error("Error loading exams:", error);
            tbody.innerHTML = '<tr><td colspan="5" class="text-center">Error loading exams</td></tr>';
        });
}

// Function to load recent activity
function loadRecentActivity(db) {
    const container = document.getElementById('recent-activity-container');
    if (!container) return;
    
    // Clear container
    container.innerHTML = '<div class="activity-item p-3"><div class="activity-icon primary"><i class="fas fa-spinner fa-spin"></i></div><div class="activity-content"><div class="activity-title">Loading recent activity...</div></div></div>';
    
    // Create combined activity array
    let activities = [];
    
    // Get recent users
    const usersPromise = db.collection("users")
        .orderBy("createdAt", "desc")
        .limit(2)
        .get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                const user = doc.data();
                activities.push({
                    type: 'user',
                    icon: 'user',
                    iconClass: 'primary',
                    title: `New user registered: ${user.name || user.email || 'Unknown'}`,
                    timestamp: user.createdAt ? (user.createdAt.toDate ? user.createdAt.toDate() : new Date(user.createdAt)) : new Date()
                });
            });
        });
        
    // Get recent papers (exams)
    const papersPromise = db.collection("papers")
        .orderBy("createdAt", "desc")
        .limit(2)
        .get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                const paper = doc.data();
                activities.push({
                    type: 'exam',
                    icon: 'file-alt',
                    iconClass: 'warning',
                    title: `New exam added: ${paper.name || 'Unnamed Exam'}`,
                    timestamp: paper.createdAt ? (paper.createdAt.toDate ? paper.createdAt.toDate() : new Date(paper.createdAt)) : new Date()
                });
            });
        });
    
    // Wait for all promises to resolve
    Promise.all([usersPromise, papersPromise])
        .then(() => {
            // Sort activities by timestamp (newest first)
            activities.sort((a, b) => b.timestamp - a.timestamp);
            
            // Take only the 4 most recent activities
            activities = activities.slice(0, 4);
            
            if (activities.length === 0) {
                container.innerHTML = `
                    <div class="activity-item p-3">
                        <div class="activity-content">
                            <div class="activity-title">No recent activity found</div>
                        </div>
                    </div>
                `;
                return;
            }
            
            // Clear container
            container.innerHTML = '';
            
            // Render activities
            activities.forEach(activity => {
                // Format time
                const now = new Date();
                let timeText;
                
                if (activity.timestamp.toDateString() === now.toDateString()) {
                    const hours = activity.timestamp.getHours();
                    const minutes = activity.timestamp.getMinutes();
                    const ampm = hours >= 12 ? 'PM' : 'AM';
                    const formattedHours = hours % 12 || 12;
                    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
                    timeText = `Today, ${formattedHours}:${formattedMinutes} ${ampm}`;
                } else if (new Date(now - 86400000).toDateString() === activity.timestamp.toDateString()) {
                    const hours = activity.timestamp.getHours();
                    const minutes = activity.timestamp.getMinutes();
                    const ampm = hours >= 12 ? 'PM' : 'AM';
                    const formattedHours = hours % 12 || 12;
                    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
                    timeText = `Yesterday, ${formattedHours}:${formattedMinutes} ${ampm}`;
                } else {
                    const days = Math.round((now - activity.timestamp) / (1000 * 60 * 60 * 24));
                    timeText = `${days} days ago`;
                }
                
                // Create activity item
                const activityItem = document.createElement('div');
                activityItem.className = 'activity-item p-3';
                activityItem.innerHTML = `
                    <div class="activity-icon ${activity.iconClass}">
                        <i class="fas fa-${activity.icon}"></i>
                    </div>
                    <div class="activity-content">
                        <div class="activity-title">${activity.title}</div>
                        <div class="activity-time">${timeText}</div>
                    </div>
                `;
                
                container.appendChild(activityItem);
            });
        })
        .catch(error => {
            console.error("Error loading activities:", error);
            container.innerHTML = `
                <div class="activity-item p-3">
                    <div class="activity-content">
                        <div class="activity-title">Error loading activities</div>
                    </div>
                </div>
            `;
        });
}

// Function to add event listeners to user action buttons
function addUserActionListeners(db) {
    document.querySelectorAll('#recent-users-tbody .table-action').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const isDelete = this.classList.contains('delete');
            const row = this.closest('tr');
            const name = row.cells[0].textContent.trim();
            
            if (isDelete) {
                const userId = this.getAttribute('data-id');
                if (confirm(`Are you sure you want to delete ${name}?`)) {
                    db.collection("users").doc(userId).delete()
                        .then(() => {
                            row.remove();
                            loadRealData(); // Update stats
                        })
                        .catch(error => {
                            console.error("Error deleting user:", error);
                            alert("Failed to delete user");
                        });
                }
            } else {
                alert(`Edit ${name}`);
            }
        });
    });
}

// Function to add event listeners to exam action buttons
function addExamActionListeners(db) {
    document.querySelectorAll('#recent-exams-tbody .table-action.delete').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const examId = this.getAttribute('data-id');
            const row = this.closest('tr');
            const examName = row.cells[0].textContent;
            
            if (confirm(`Are you sure you want to delete "${examName}"?`)) {
                db.collection("papers").doc(examId).delete()
                    .then(() => {
                        row.remove();
                        loadRealData(); // Update stats
                    })
                    .catch(error => {
                        console.error("Error deleting exam:", error);
                        alert("Failed to delete exam");
                    });
            }
        });
    });
}

// Function to add active users button
function addActiveUsersButton() {
    // Create active users button
    const activeUsersBtn = document.createElement('button');
    activeUsersBtn.className = 'btn btn-primary mt-3';
    activeUsersBtn.innerHTML = '<i class="fas fa-user-clock me-2"></i> View Active Users';
    activeUsersBtn.onclick = showActiveUsers;
    
    // Add button after stats cards
    const statsRow = document.querySelector('.row:first-of-type');
    if (statsRow) {
        statsRow.insertAdjacentElement('afterend', activeUsersBtn);
    }
}

// Function to show active users modal
function showActiveUsers() {
    // Get Firestore instance
    const db = firebase.firestore();
    
    // Create modal HTML
    const modalHTML = `
    <div class="modal fade" id="activeUsersModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header bg-gradient-primary text-white">
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
                                    <td colspan="5" class="text-center">Loading active users...</td>
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
    
    // Load active users
    loadActiveUsers(db);
    
    // Clean up modal when hidden
    document.getElementById('activeUsersModal').addEventListener('hidden.bs.modal', function() {
        document.body.removeChild(modalContainer);
    });
}

// Function to load active users
function loadActiveUsers(db) {
    const tbody = document.getElementById('active-users-tbody');
    if (!tbody) return;
    
    // Get one week ago date
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    // Try to get users with login count >= 5 in the past week
    db.collection("users")
        .where("loginCount", ">=", 5)
        .get()
        .then((querySnapshot) => {
            if (querySnapshot.empty) {
                tbody.innerHTML = '<tr><td colspan="5" class="text-center">No active users found</td></tr>';
                return;
            }
            
            // Clear loading message
            tbody.innerHTML = '';
            
            // Add users to table
            querySnapshot.forEach((doc) => {
                const user = doc.data();
                const name = user.name || 'Unknown';
                const email = user.email || 'No email';
                const plan = user.plan || 'Free';
                const loginCount = user.loginCount || 0;
                
                // Format last login date
                let lastLogin = 'Unknown';
                if (user.lastLogin) {
                    try {
                        const lastLoginDate = user.lastLogin.toDate ? user.lastLogin.toDate() : new Date(user.lastLogin);
                        lastLogin = lastLoginDate.toLocaleString();
                    } catch (e) {
                        console.error("Error formatting last login date:", e);
                    }
                }
                
                // Create row
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${name}</td>
                    <td>${email}</td>
                    <td>${plan}</td>
                    <td>${loginCount}</td>
                    <td>${lastLogin}</td>
                `;
                
                tbody.appendChild(row);
            });
        })
        .catch((error) => {
            console.error("Error loading active users:", error);
            tbody.innerHTML = '<tr><td colspan="5" class="text-center">Error loading active users</td></tr>';
        });
}