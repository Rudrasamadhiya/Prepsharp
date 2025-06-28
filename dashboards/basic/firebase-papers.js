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
    const papersGrid = document.querySelector('.papers-grid');
    
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
                
                // Only include published papers EXPLICITLY marked for basic dashboard
                if (paper.status === 'Published' && paper.dashboards?.basic === true) {
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
    const papersGrid = document.querySelector('.papers-grid');
    
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
    
    // Update stats
    const availablePapers = document.querySelector('.stat-value');
    if (availablePapers) {
        availablePapers.textContent = papers.length;
    }
    
    // Render each paper
    papers.forEach((paper) => {
        const paperCard = document.createElement('div');
        paperCard.className = 'paper-card';
        
        // Determine badge
        let badgeHTML = '';
        if (paper.isNew) {
            badgeHTML = '<div class="paper-badge">NEW</div>';
        } else if (paper.isPopular) {
            badgeHTML = '<div class="paper-badge popular">POPULAR</div>';
        }
        
        // Count questions
        const questionCount = Array.isArray(paper.questions) ? paper.questions.length : 0;
        
        paperCard.innerHTML = `
            <div class="paper-banner">
                ${badgeHTML}
            </div>
            <div class="paper-content">
                <div class="paper-icon">
                    <i class="fas fa-file-alt"></i>
                </div>
                <h3 class="paper-title">${paper.name || 'Unnamed Exam'}</h3>
                <div class="paper-subtitle">
                    <span class="paper-tag">${getExamTypeDisplay(paper.type || 'unknown')}</span>
                    <span>${paper.year || 'N/A'}</span>
                </div>
                
                <div class="paper-details">
                    <div class="detail-item">
                        <div class="detail-value">${questionCount}</div>
                        <div class="detail-label">Questions</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-value">3h</div>
                        <div class="detail-label">Duration</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-value">${questionCount * 4}</div>
                        <div class="detail-label">Marks</div>
                    </div>
                </div>
                
                <div class="paper-actions">
                    <a href="../../exam.html?id=${paper.id}" class="start-button">
                        <i class="fas fa-play"></i> Start Paper
                    </a>
                    <button class="info-button" onclick="showPaperInfo('${paper.id}')">
                        <i class="fas fa-info"></i>
                    </button>
                </div>
            </div>
        `;
        
        papersGrid.appendChild(paperCard);
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
        default:
            return type.toUpperCase();
    }
}

// Function to show paper info
function showPaperInfo(paperId) {
    // This would show a modal with paper details
    alert('Paper info functionality will be implemented here');
}