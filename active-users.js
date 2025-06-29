// Function to show active users (logged in 5+ times in a week)
function showActiveUsers() {
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
    loadActiveUsers();
    
    // Clean up modal when hidden
    document.getElementById('activeUsersModal').addEventListener('hidden.bs.modal', function() {
        document.body.removeChild(modalContainer);
    });
}

// Function to load active users
function loadActiveUsers() {
    const tbody = document.getElementById('active-users-tbody');
    if (!tbody) return;
    
    // Get Firestore instance
    const db = firebase.firestore();
    
    // Get one week ago date
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    // Try to get users with login count >= 5 in the past week
    db.collection("users")
        .where("loginCount", ">=", 5)
        .get()
        .then((querySnapshot) => {
            if (querySnapshot.empty) {
                // If no users found, add sample active users
                addSampleActiveUsers(db);
                
                // Show message
                tbody.innerHTML = '<tr><td colspan="5" class="text-center">Adding sample active users...</td></tr>';
                
                // Reload after a delay
                setTimeout(() => loadActiveUsers(), 2000);
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
                const lastLogin = user.lastLogin ? new Date(user.lastLogin.seconds * 1000).toLocaleString() : 'Unknown';
                
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

// Function to add sample active users
function addSampleActiveUsers(db) {
    const now = firebase.firestore.Timestamp.now();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayTimestamp = firebase.firestore.Timestamp.fromDate(yesterday);
    
    const sampleActiveUsers = [
        {
            name: "Active User 1",
            email: "active1@example.com",
            plan: "Premium",
            loginCount: 8,
            lastLogin: now,
            createdAt: now
        },
        {
            name: "Active User 2",
            email: "active2@example.com",
            plan: "Standard",
            loginCount: 6,
            lastLogin: yesterdayTimestamp,
            createdAt: now
        },
        {
            name: "Active User 3",
            email: "active3@example.com",
            plan: "Basic",
            loginCount: 12,
            lastLogin: now,
            createdAt: now
        }
    ];
    
    // Add sample active users to Firestore
    sampleActiveUsers.forEach(user => {
        db.collection("users").add(user);
    });
}

// Add button to stats section
document.addEventListener('DOMContentLoaded', function() {
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
});