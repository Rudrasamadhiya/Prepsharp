// Functions to load recent users and exams
// Immediately execute when script loads
document.addEventListener('DOMContentLoaded', function() {
    loadRecentUsers();
    loadRecentExams();
});

function loadRecentUsers() {
    const tbody = document.getElementById('recent-users-tbody');
    if (!tbody) return;
    
    // Clear existing rows
    tbody.innerHTML = '<tr><td colspan="5" class="text-center">Loading users...</td></tr>';
    
    // Get users from Firestore, ordered by creation date
    firebase.firestore().collection("users")
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
                // Handle different timestamp formats
                let createdAt;
                if (user.createdAt) {
                    if (user.createdAt.seconds) {
                        // Firestore Timestamp
                        createdAt = new Date(user.createdAt.seconds * 1000);
                    } else if (user.createdAt.toDate) {
                        // Firestore Timestamp with toDate method
                        createdAt = user.createdAt.toDate();
                    } else {
                        // Regular date string or timestamp
                        createdAt = new Date(user.createdAt);
                    }
                } else {
                    createdAt = new Date();
                }
                
                // Format date
                const now = new Date();
                let joinedText;
                
                if (createdAt.toDateString() === now.toDateString()) {
                    joinedText = 'Today';
                } else if (new Date(now - 86400000).toDateString() === createdAt.toDateString()) {
                    joinedText = 'Yesterday';
                } else {
                    const days = Math.round((now - createdAt) / (1000 * 60 * 60 * 24));
                    joinedText = `${days} days ago`;
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
            addUserActionListeners();
        })
        .catch((error) => {
            console.error("Error loading users:", error);
            tbody.innerHTML = '<tr><td colspan="5" class="text-center">Error loading users</td></tr>';
        });
}

function loadRecentExams() {
    const tbody = document.getElementById('recent-exams-tbody');
    if (!tbody) return;
    
    // Clear existing rows
    tbody.innerHTML = '<tr><td colspan="5" class="text-center">Loading exams...</td></tr>';
    
    // Get recent exams from Firestore
    firebase.firestore().collection("papers")
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
            addExamActionListeners();
        })
        .catch((error) => {
            console.error("Error loading exams:", error);
            tbody.innerHTML = '<tr><td colspan="5" class="text-center">Error loading exams</td></tr>';
        });
}

function addUserActionListeners() {
    document.querySelectorAll('#recent-users-tbody .table-action').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const isDelete = this.classList.contains('delete');
            const row = this.closest('tr');
            const name = row.cells[0].textContent.trim();
            
            if (isDelete) {
                const userId = this.getAttribute('data-id');
                if (confirm(`Are you sure you want to delete ${name}?`)) {
                    firebase.firestore().collection("users").doc(userId).delete()
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

function addExamActionListeners() {
    document.querySelectorAll('#recent-exams-tbody .table-action.delete').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const examId = this.getAttribute('data-id');
            const row = this.closest('tr');
            const examName = row.cells[0].textContent;
            
            if (confirm(`Are you sure you want to delete "${examName}"?`)) {
                firebase.firestore().collection("papers").doc(examId).delete()
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