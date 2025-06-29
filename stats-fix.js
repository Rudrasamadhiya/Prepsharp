// Fix for stats cards in admin dashboard
document.addEventListener('DOMContentLoaded', function() {
    // Make stats cards visible
    document.querySelectorAll('.stats-card').forEach((card, index) => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
    });
    
    // Load real data from Firebase
    loadRealData();
});

// Function to load real data from Firebase
function loadRealData() {
    // Load recent users and exams
    loadRecentUsers();
    loadRecentExams();
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
    }).catch(error => {
        console.error("Error loading exams:", error);
    });
}