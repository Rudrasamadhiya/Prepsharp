// Direct fix for stats cards
document.addEventListener('DOMContentLoaded', function() {
    // Make stats cards visible immediately
    document.querySelectorAll('.stats-card').forEach(card => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
    });
    
    // Get Firestore instance
    const db = firebase.firestore();
    
    // Add sample data if none exists
    addSampleDataIfNeeded(db);
});

// Function to add sample data if none exists
function addSampleDataIfNeeded(db) {
    // Check if users collection is empty
    db.collection("users").limit(1).get().then(snapshot => {
        if (snapshot.empty) {
            console.log("Adding sample users...");
            addSampleUsers(db);
        }
    });
    
    // Check if papers collection is empty
    db.collection("papers").limit(1).get().then(snapshot => {
        if (snapshot.empty) {
            console.log("Adding sample papers...");
            addSamplePapers(db);
        }
    });
    
    // Update stats after a delay to ensure data is added
    setTimeout(() => updateStats(db), 2000);
}

// Function to add sample users
function addSampleUsers(db) {
    const sampleUsers = [
        {
            name: "John Doe",
            email: "john@example.com",
            plan: "Premium",
            createdAt: firebase.firestore.Timestamp.now()
        },
        {
            name: "Jane Smith",
            email: "jane@example.com",
            plan: "Basic",
            createdAt: firebase.firestore.Timestamp.now()
        },
        {
            name: "Bob Johnson",
            email: "bob@example.com",
            plan: "Free",
            createdAt: firebase.firestore.Timestamp.now()
        }
    ];
    
    // Add sample users to Firestore
    sampleUsers.forEach(user => {
        db.collection("users").add(user);
    });
}

// Function to add sample papers
function addSamplePapers(db) {
    const samplePapers = [
        {
            name: "JEE Main 2023",
            type: "Mock Test",
            year: 2023,
            questions: [
                { question: "Sample question 1", answer: "Sample answer 1" },
                { question: "Sample question 2", answer: "Sample answer 2" }
            ],
            createdAt: firebase.firestore.Timestamp.now()
        },
        {
            name: "NEET 2023",
            type: "Practice Test",
            year: 2023,
            questions: [
                { question: "Sample question 1", answer: "Sample answer 1" },
                { question: "Sample question 2", answer: "Sample answer 2" },
                { question: "Sample question 3", answer: "Sample answer 3" }
            ],
            createdAt: firebase.firestore.Timestamp.now()
        }
    ];
    
    // Add sample papers to Firestore
    samplePapers.forEach(paper => {
        db.collection("papers").add(paper);
    });
}

// Function to update stats
function updateStats(db) {
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
    });
}