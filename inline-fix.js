// Inline script to directly load data
console.log("Directly loading recent data...");

// Function to load recent users
function loadRecentUsersDirectly() {
    const tbody = document.getElementById('recent-users-tbody');
    if (!tbody) {
        console.error("recent-users-tbody not found");
        return;
    }
    
    // Clear existing rows
    tbody.innerHTML = '<tr><td colspan="5" class="text-center">Loading users...</td></tr>';
    
    // Get Firestore instance
    const db = firebase.firestore();
    
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
                    <td>Today</td>
                    <td>
                        <a href="#" class="table-action"><i class="fas fa-edit"></i></a>
                        <a href="#" class="table-action delete"><i class="fas fa-trash"></i></a>
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
function loadRecentExamsDirectly() {
    const tbody = document.getElementById('recent-exams-tbody');
    if (!tbody) {
        console.error("recent-exams-tbody not found");
        return;
    }
    
    // Clear existing rows
    tbody.innerHTML = '<tr><td colspan="5" class="text-center">Loading exams...</td></tr>';
    
    // Get Firestore instance
    const db = firebase.firestore();
    
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
                        <a href="#" class="table-action delete"><i class="fas fa-trash"></i></a>
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

// Execute immediately
setTimeout(function() {
    loadRecentUsersDirectly();
    loadRecentExamsDirectly();
}, 500);