// Recent Papers Handler - Firebase Integration
document.addEventListener('DOMContentLoaded', function() {
    // Get logged in user data
    const loggedInUser = localStorage.getItem('loggedInUser') || sessionStorage.getItem('loggedInUser');
    
    if (loggedInUser) {
        // Load recent papers from Firebase
        loadRecentPapers();
    }
});

// Load recent papers from Firebase
function loadRecentPapers() {
    // Get papers collection from Firebase
    db.collection("papers")
        .orderBy("year", "desc")
        .limit(3)
        .get()
        .then((snapshot) => {
            const papers = [];
            snapshot.forEach((doc) => {
                papers.push({id: doc.id, ...doc.data()});
            });
            
            // Update recent papers list
            updateRecentPapersList(papers);
        })
        .catch((error) => {
            console.error("Error getting recent papers:", error);
        });
}

// Update recent papers list
function updateRecentPapersList(papers) {
    const papersList = document.querySelector('.paper-list');
    if (!papersList) return;
    
    // Clear existing content
    papersList.innerHTML = '';
    
    // Add papers to list
    papers.forEach((paper, index) => {
        const paperItem = document.createElement('li');
        paperItem.className = 'paper-item';
        
        // Create badge based on paper properties
        let badgeHTML = '';
        if (index === 0) {
            badgeHTML = '<div class="paper-badge new">NEW</div>';
        } else if (paper.popular) {
            badgeHTML = '<div class="paper-badge popular">POPULAR</div>';
        }
        
        // Format paper type for display
        const paperType = paper.type === 'jee-main' ? 'JEE Main' : 
                         paper.type === 'jee-advanced' ? 'JEE Advanced' : paper.type;
        
        // Create subjects HTML
        const subjectsHTML = (paper.subjects || ['Physics', 'Chemistry', 'Mathematics'])
            .map(subject => `<i class="fas fa-${getSubjectIcon(subject)} subject-icon"></i> ${capitalizeFirstLetter(subject)}`)
            .join(' ');
        
        // Create paper item HTML
        paperItem.innerHTML = `
            <div class="paper-info">
                ${badgeHTML}
                <h3>${paper.name || `${paperType} ${paper.year} Paper ${paper.paperNumber || ''}`}</h3>
                <p>${subjectsHTML}</p>
                <div class="paper-meta">
                    <span><i class="fas fa-clock"></i> ${paper.duration || '3h'}</span>
                    <span><i class="fas fa-star"></i> ${paper.rating || '4.8'}</span>
                    <span><i class="fas fa-users"></i> ${paper.attempts || '2.4k'}</span>
                </div>
            </div>
            <a href="practice-papers.html?id=${paper.id}" class="start-btn">Start <i class="fas fa-arrow-right"></i></a>
        `;
        
        papersList.appendChild(paperItem);
    });
}

// Get icon for subject
function getSubjectIcon(subject) {
    subject = subject.toLowerCase();
    if (subject === 'physics') return 'atom';
    if (subject === 'chemistry') return 'flask';
    if (subject === 'mathematics') return 'square-root-alt';
    if (subject === 'biology') return 'dna';
    return 'book';
}

// Capitalize first letter
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}