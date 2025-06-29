// Direct fix to show real data from Firebase
document.addEventListener('DOMContentLoaded', function() {
    console.log("Loading real data from Firebase...");
    
    // Initialize Firebase directly
    const firebaseConfig = {
        apiKey: "AIzaSyCtkee-Lv8lEMestaSVJxx7yvKB-lBygPQ",
        authDomain: "prepsharp-c91fd.firebaseapp.com",
        projectId: "prepsharp-c91fd",
        storageBucket: "prepsharp-c91fd.firebasestorage.app",
        messagingSenderId: "688294848433",
        appId: "1:688294848433:web:dd93fc6d61d62392473f90",
        measurementId: "G-LLJSLMXMNY"
    };
    
    // Initialize Firebase
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    
    // Get Firestore instance
    const db = firebase.firestore();
    
    // Load real users data
    loadRealUsers(db);
});

// Function to load real users from Firebase
function loadRealUsers(db) {
    console.log("Loading real users...");
    
    // Get the table body
    const tbody = document.getElementById('recent-users-tbody');
    if (!tbody) {
        console.error("recent-users-tbody not found");
        return;
    }
    
    // Show loading message
    tbody.innerHTML = '<tr><td colspan="5" class="text-center">Loading real users from Firebase...</td></tr>';
    
    // Get users from Firestore
    db.collection("users")
        .get()
        .then((querySnapshot) => {
            console.log("Users query returned:", querySnapshot.size, "users");
            
            if (querySnapshot.empty) {
                tbody.innerHTML = '<tr><td colspan="5" class="text-center">No users found in Firebase</td></tr>';
                return;
            }
            
            // Clear loading message
            tbody.innerHTML = '';
            
            // Add users to table (limit to 4)
            let count = 0;
            querySnapshot.forEach((doc) => {
                if (count >= 4) return;
                
                const user = doc.data();
                console.log("User data:", user);
                
                const name = user.name || user.firstName || 'User';
                const email = user.email || 'No email';
                const plan = user.plan || user.subscriptionPlan || 'Free';
                
                // Get initials
                const initials = name.charAt(0) + (name.split(' ')[1] ? name.split(' ')[1].charAt(0) : '');
                
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
                count++;
            });
            
            // If no users were added (might happen if all were filtered out)
            if (count === 0) {
                tbody.innerHTML = '<tr><td colspan="5" class="text-center">No valid users found</td></tr>';
            }
        })
        .catch((error) => {
            console.error("Error loading users:", error);
            tbody.innerHTML = `<tr><td colspan="5" class="text-center">Error loading users: ${error.message}</td></tr>`;
        });
}