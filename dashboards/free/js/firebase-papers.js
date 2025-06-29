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
                
                // Only include published papers EXPLICITLY marked for free dashboard
                if (paper.status === 'Published' && paper.dashboards?.free === true) {
                    papers.push(paper);
                }
            });
            
            // Initialize filters
            window.examTypeFilter = '';
            window.yearFilter = '';
            window.searchFilter = '';
            
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

// Function to filter papers
function filterPapers() {
    if (!window.allPapers) return;
    
    const filtered = window.allPapers.filter(paper => {
        const typeMatch = !window.examTypeFilter || 
                          (paper.type === 'jee-main' && window.examTypeFilter === 'JEE Main') ||
                          (paper.type === 'jee-advanced' && window.examTypeFilter === 'JEE Advanced');
                          
        const yearMatch = !window.yearFilter || paper.year === window.yearFilter;
        
        const searchMatch = !window.searchFilter || 
                           paper.name.toLowerCase().includes(window.searchFilter);
                           
        return typeMatch && yearMatch && searchMatch;
    });
    
    renderPapers(filtered);
}

// Function to render papers
function renderPapers(papers) {
    const papersGrid = document.querySelector('.papers-grid');
    
    if (papers.length === 0) {
        papersGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 50px;">
                <i class="fas fa-search fa-3x text-muted mb-3"></i>
                <h4>No Papers Found</h4>
                <p>Try adjusting your filters</p>
            </div>
        `;
        return;
    }
    
    // Store all papers for filtering
    window.allPapers = papers;
    
    // Sort papers: free papers first, then premium papers
    papers.sort((a, b) => {
        const aIsFree = a.isFree === true || a.isFree === undefined;
        const bIsFree = b.isFree === true || b.isFree === undefined;
        
        if (aIsFree && !bIsFree) return -1; // a is free, b is premium
        if (!aIsFree && bIsFree) return 1;  // a is premium, b is free
        
        // If both are free or both are premium, sort by year (newest first)
        const yearA = parseInt(a.year) || 0;
        const yearB = parseInt(b.year) || 0;
        return yearB - yearA;
    });
    
    // Clear existing content
    papersGrid.innerHTML = '';
    
    // Add a visual separator between free and premium papers
    let lastWasFree = null;
    
    papers.forEach((paper, index) => {
        const isFree = paper.isFree === true || paper.isFree === undefined;
        
        // Add separator when transitioning from free to premium
        if (lastWasFree === true && !isFree) {
            const separator = document.createElement('div');
            separator.className = 'premium-separator';
            separator.style.gridColumn = '1/-1';
            separator.innerHTML = `
                <div class="premium-header">
                    <i class="fas fa-crown"></i>
                    <h3>Premium Papers</h3>
                    <span>Upgrade to access</span>
                </div>
            `;
            papersGrid.appendChild(separator);
        }
        
        lastWasFree = isFree;
        const isPremium = !isFree;
        
        const paperCard = document.createElement('div');
        paperCard.className = `paper-card animate-card-${(index % 6) + 1}`;
        
        // Determine if it's new or popular
        let badgeClass = '';
        let badgeText = '';
        
        if (isPremium) {
            badgeClass = 'locked';
            badgeText = 'PREMIUM';
        } else if (paper.isNew) {
            badgeClass = 'new';
            badgeText = 'NEW';
        } else if (paper.isPopular) {
            badgeClass = 'popular';
            badgeText = 'POPULAR';
        }
        
        // Create badges for subjects
        const subjectBadges = (paper.subjects || ['physics', 'chemistry', 'mathematics']).map(subject => {
            return `<span class="subject-badge ${subject}">${subject.charAt(0).toUpperCase() + subject.slice(1)}</span>`;
        }).join('');
        
        // Get question count
        const questionCount = paper.questions?.length || (paper.type === 'jee-advanced' ? 54 : 90);
        
        paperCard.innerHTML = `
            ${badgeClass ? `<div class="paper-badge ${badgeClass}">${badgeText}</div>` : ''}
            <div class="paper-header">
                <h3>${paper.name || 'Unnamed Exam'}</h3>
            </div>
            <div class="paper-body">
                <p>${paper.description || `${paper.type === 'jee-advanced' ? 'JEE Advanced' : 'JEE Main'} Examination from ${paper.year || 'recent'} session.`}</p>
                <div>
                    ${subjectBadges}
                </div>
                <div class="paper-meta">
                    <span><i class="fas fa-clock"></i> 3 hours</span>
                    <span><i class="fas fa-question-circle"></i> ${questionCount} questions</span>
                </div>
            </div>
            <div class="paper-footer">
                <a href="../../exam.html?id=${paper.id}" class="start-btn">Start Exam</a>
                <span><i class="fas fa-users"></i> ${Math.floor(Math.random() * 3000) + 1000}+ attempts</span>
            </div>
            ${isPremium ? `
            <div class="locked-overlay">
                <div class="locked-icon"><i class="fas fa-lock"></i></div>
                <div class="locked-text">Premium Paper</div>
                <a href="../../subscription.html" class="upgrade-btn">Upgrade Now</a>
            </div>` : ''}
        `;
        
        papersGrid.appendChild(paperCard);
    });
    
    // Add click handlers to locked overlays
    document.querySelectorAll('.locked-overlay').forEach(overlay => {
        overlay.addEventListener('click', function() {
            window.location.href = '../../subscription.html';
        });
    });
}