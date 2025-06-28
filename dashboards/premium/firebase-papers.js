// Firebase configuration
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
let db;
try {
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    db = firebase.firestore();
    console.log("Firebase initialized successfully");
    
    // Load papers when the page is ready
    document.addEventListener('DOMContentLoaded', loadPapers);
} catch (error) {
    console.error("Firebase initialization error:", error);
}

// Function to load papers
function loadPapers() {
    const papersGrid = document.querySelector('.papers-container');
    
    // Clear existing content
    papersGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 50px;">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-3">Loading papers...</p>
        </div>
    `;
    
    // Fetch papers from Firestore
    db.collection("papers").get()
        .then((snapshot) => {
            // Filter papers
            const papers = [];
            snapshot.forEach((doc) => {
                const paper = doc.data();
                paper.id = doc.id;
                
                // Only include published papers EXPLICITLY marked for premium dashboard
                if (paper.status === 'Published' && paper.dashboards?.premium === true) {
                    papers.push(paper);
                }
            });
            
            // Sort papers by year (newest first)
            papers.sort((a, b) => {
                const yearA = parseInt(a.year) || 0;
                const yearB = parseInt(b.year) || 0;
                return yearB - yearA;
            });
            
            // Render papers
            renderPapers(papers);
            
            // Also load AI recommendations
            loadAIRecommendations(papers);
        })
        .catch((error) => {
            console.error("Error loading papers:", error);
            papersGrid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 50px;">
                    <i class="fas fa-exclamation-triangle fa-3x text-danger mb-3"></i>
                    <h4>Error Loading Papers</h4>
                    <p>Please try refreshing the page</p>
                </div>
            `;
        });
}

// Function to render papers
function renderPapers(papers) {
    const papersGrid = document.querySelector('.papers-container');
    
    if (papers.length === 0) {
        papersGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 50px;">
                <i class="fas fa-search fa-3x text-muted mb-3"></i>
                <h4>No Papers Found</h4>
                <p>No papers are available for your plan at this time.</p>
            </div>
        `;
        return;
    }
    
    // Clear existing content
    papersGrid.innerHTML = '';
    
    // Render each paper
    papers.forEach((paper, index) => {
        const paperCard = document.createElement('div');
        paperCard.className = 'paper-card';
        
        // Determine difficulty
        let difficulty = 'medium';
        let difficultyText = 'Medium';
        if (paper.difficulty) {
            difficulty = paper.difficulty.toLowerCase();
            difficultyText = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
        }
        
        // Count questions
        const questionCount = Array.isArray(paper.questions) ? paper.questions.length : 0;
        
        // Determine paper type tag
        let typeTagClass = 'tag-jee-main';
        if (paper.type === 'jee-advanced') {
            typeTagClass = 'tag-jee-advanced';
        } else if (paper.type === 'custom') {
            typeTagClass = 'tag-custom';
        }
        
        // Calculate progress (would be based on user data in a real app)
        const progress = Math.floor(Math.random() * 101); // 0-100%
        let progressText = 'Start';
        if (progress === 100) {
            progressText = 'Review';
        } else if (progress > 0) {
            progressText = 'Continue';
        }
        
        paperCard.innerHTML = `
            <div class="paper-header">
                <div class="paper-title">${paper.name || 'Unnamed Exam'}</div>
                <div class="paper-subtitle">
                    <span class="paper-tag ${typeTagClass}">${getExamTypeDisplay(paper.type || 'unknown')}</span>
                    <span>${paper.year || 'N/A'}</span>
                </div>
                <div class="paper-difficulty difficulty-${difficulty}">${difficultyText}</div>
            </div>
            <div class="paper-content">
                <div class="paper-details">
                    <div class="paper-detail">
                        <div class="detail-value">${questionCount}</div>
                        <div class="detail-label">Questions</div>
                    </div>
                    <div class="paper-detail">
                        <div class="detail-value">3h</div>
                        <div class="detail-label">Duration</div>
                    </div>
                    <div class="paper-detail">
                        <div class="detail-value">${questionCount * 4}</div>
                        <div class="detail-label">Marks</div>
                    </div>
                </div>
                <div class="paper-progress">
                    <div class="progress-label">
                        <div class="progress-text">Progress</div>
                        <div class="progress-value">${progress}%</div>
                    </div>
                    <div class="progress-bar">
                        <div class="progress" style="width: ${progress}%;"></div>
                    </div>
                </div>
                <div class="paper-actions">
                    <a href="../../exam.html?id=${paper.id}" class="start-btn">${progressText}</a>
                    <button class="btn-icon"><i class="fas fa-info-circle"></i></button>
                </div>
            </div>
        `;
        
        papersGrid.appendChild(paperCard);
    });
}

// Function to load AI recommendations
function loadAIRecommendations(papers) {
    const recommendationsContainer = document.getElementById('ai-recommendations');
    
    if (!recommendationsContainer) return;
    
    if (papers.length === 0) {
        recommendationsContainer.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 20px;">
                <p>Complete some papers to get personalized recommendations</p>
            </div>
        `;
        return;
    }
    
    // For demo purposes, just show 3 random papers as recommendations
    const recommendedPapers = papers.sort(() => 0.5 - Math.random()).slice(0, 3);
    
    recommendationsContainer.innerHTML = '';
    
    // Sample reasons for recommendations
    const reasons = [
        "Focuses on topics you need to improve",
        "Contains questions similar to your missed ones",
        "Matches your study pattern and level",
        "Recommended based on your performance"
    ];
    
    recommendedPapers.forEach((paper, index) => {
        const reason = reasons[index % reasons.length];
        
        const recommendedPaper = document.createElement('div');
        recommendedPaper.className = 'recommended-paper';
        recommendedPaper.innerHTML = `
            <div class="recommended-title">${paper.name || 'Unnamed Exam'}</div>
            <div class="recommended-reason">${reason}</div>
            <a href="../../exam.html?id=${paper.id}" class="start-btn">Start Paper</a>
        `;
        
        recommendationsContainer.appendChild(recommendedPaper);
    });
}

// Function to get exam type display name
function getExamTypeDisplay(type) {
    switch(type) {
        case 'jee-main':
            return 'JEE Main';
        case 'jee-advanced':
            return 'JEE Advanced';
        case 'neet':
            return 'NEET';
        case 'bitsat':
            return 'BITSAT';
        case 'aiims':
            return 'AIIMS';
        case 'custom':
            return 'Custom';
        default:
            return type.toUpperCase();
    }
}