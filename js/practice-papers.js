// Practice Papers Handler - Firebase Integration
document.addEventListener('DOMContentLoaded', function() {
    // Get logged in user data
    const loggedInUser = localStorage.getItem('loggedInUser') || sessionStorage.getItem('loggedInUser');
    
    if (loggedInUser) {
        const userData = JSON.parse(loggedInUser);
        const userId = userData.email;
        
        // Load papers from Firebase
        loadPapers(userId);
        
        // Setup search and filters
        setupSearchAndFilters();
    }
});

// Load papers from Firebase
function loadPapers(userId) {
    // Get papers collection from Firebase
    db.collection("papers")
        .get()
        .then((snapshot) => {
            const papers = [];
            snapshot.forEach((doc) => {
                papers.push({id: doc.id, ...doc.data()});
            });
            
            // Get user stats to check completed papers
            db.collection("userStats").doc(userId)
                .get()
                .then((doc) => {
                    let completedPapers = [];
                    let averageScore = 0;
                    
                    if (doc.exists) {
                        const stats = doc.data();
                        completedPapers = stats.completedPapers || [];
                        averageScore = stats.averageScore || 0;
                    }
                    
                    // Update header stats
                    updateHeaderStats(papers.length, completedPapers.length, averageScore);
                    
                    // Update papers grid
                    updatePapersGrid(papers, completedPapers);
                })
                .catch((error) => {
                    console.error("Error getting user stats:", error);
                    
                    // Update UI without completed papers info
                    updateHeaderStats(papers.length, 0, 0);
                    updatePapersGrid(papers, []);
                });
        })
        .catch((error) => {
            console.error("Error getting papers:", error);
            
            // Show error message
            const papersGrid = document.querySelector('.papers-grid');
            if (papersGrid) {
                papersGrid.innerHTML = '<div class="error-message">Failed to load papers. Please try again later.</div>';
            }
        });
}

// Update header stats
function updateHeaderStats(availablePapers, completedPapers, averageScore) {
    // Update available papers
    const availablePapersElement = document.querySelector('.header-stats .stat-card:nth-child(1) .stat-value');
    if (availablePapersElement) {
        availablePapersElement.textContent = availablePapers;
    }
    
    // Update completed papers
    const completedPapersElement = document.querySelector('.header-stats .stat-card:nth-child(2) .stat-value');
    if (completedPapersElement) {
        completedPapersElement.textContent = completedPapers;
    }
    
    // Update average score
    const averageScoreElement = document.querySelector('.header-stats .stat-card:nth-child(3) .stat-value');
    if (averageScoreElement) {
        averageScoreElement.textContent = `${averageScore}%`;
    }
}

// Update papers grid
function updatePapersGrid(papers, completedPapers) {
    const papersGrid = document.querySelector('.papers-grid');
    if (!papersGrid) return;
    
    // Clear existing content
    papersGrid.innerHTML = '';
    
    // Sort papers by year (newest first)
    papers.sort((a, b) => {
        const yearA = parseInt(a.year) || 0;
        const yearB = parseInt(b.year) || 0;
        return yearB - yearA;
    });
    
    // Add papers to grid
    papers.forEach((paper) => {
        // Check if paper is completed
        const isCompleted = completedPapers.some(p => p.id === paper.id);
        
        // Create paper card
        const paperCard = document.createElement('div');
        paperCard.className = 'paper-card';
        
        // Format paper type for display
        const paperType = paper.type === 'jee-main' ? 'JEE Main' : 
                         paper.type === 'jee-advanced' ? 'JEE Advanced' : paper.type;
        
        // Create badge based on paper properties
        let badgeHTML = '';
        if (paper.isNew) {
            badgeHTML = '<div class="paper-badge">NEW</div>';
        } else if (paper.popular) {
            badgeHTML = '<div class="paper-badge popular">POPULAR</div>';
        }
        
        // Create paper card HTML
        paperCard.innerHTML = `
            <div class="paper-banner">
                ${badgeHTML}
            </div>
            <div class="paper-content">
                <div class="paper-icon">
                    <i class="fas fa-${isCompleted ? 'check-circle' : 'file-alt'}"></i>
                </div>
                <h3 class="paper-title">${paper.name || `${paperType} ${paper.year} Paper ${paper.paperNumber || ''}`}</h3>
                <div class="paper-subtitle">
                    <span class="paper-tag">${paperType}</span>
                    <span>${paper.month || ''} ${paper.year}</span>
                </div>
                
                <div class="paper-details">
                    <div class="detail-item">
                        <div class="detail-value">${paper.questionCount || 90}</div>
                        <div class="detail-label">Questions</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-value">${paper.duration || '3h'}</div>
                        <div class="detail-label">Duration</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-value">${paper.totalMarks || 300}</div>
                        <div class="detail-label">Marks</div>
                    </div>
                </div>
                
                <div class="paper-actions">
                    <button class="start-button" data-paper-id="${paper.id}">
                        <i class="fas fa-${isCompleted ? 'redo' : 'play'}"></i> ${isCompleted ? 'Retake' : 'Start'} Paper
                    </button>
                    <button class="info-button" data-paper-id="${paper.id}">
                        <i class="fas fa-info"></i>
                    </button>
                </div>
            </div>
        `;
        
        // Add event listeners
        const startButton = paperCard.querySelector('.start-button');
        if (startButton) {
            startButton.addEventListener('click', function() {
                const paperId = this.getAttribute('data-paper-id');
                window.location.href = `exam.html?id=${paperId}`;
            });
        }
        
        const infoButton = paperCard.querySelector('.info-button');
        if (infoButton) {
            infoButton.addEventListener('click', function() {
                const paperId = this.getAttribute('data-paper-id');
                showPaperInfo(paperId, papers);
            });
        }
        
        papersGrid.appendChild(paperCard);
    });
}

// Show paper info
function showPaperInfo(paperId, papers) {
    const paper = papers.find(p => p.id === paperId);
    if (!paper) return;
    
    // Format paper type for display
    const paperType = paper.type === 'jee-main' ? 'JEE Main' : 
                     paper.type === 'jee-advanced' ? 'JEE Advanced' : paper.type;
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'paper-info-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${paper.name || `${paperType} ${paper.year} Paper ${paper.paperNumber || ''}`}</h3>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <div class="info-row">
                    <div class="info-label">Type:</div>
                    <div class="info-value">${paperType}</div>
                </div>
                <div class="info-row">
                    <div class="info-label">Year:</div>
                    <div class="info-value">${paper.month || ''} ${paper.year}</div>
                </div>
                <div class="info-row">
                    <div class="info-label">Questions:</div>
                    <div class="info-value">${paper.questionCount || 90}</div>
                </div>
                <div class="info-row">
                    <div class="info-label">Duration:</div>
                    <div class="info-value">${paper.duration || '3 hours'}</div>
                </div>
                <div class="info-row">
                    <div class="info-label">Total Marks:</div>
                    <div class="info-value">${paper.totalMarks || 300}</div>
                </div>
                <div class="info-row">
                    <div class="info-label">Subjects:</div>
                    <div class="info-value">${(paper.subjects || ['Physics', 'Chemistry', 'Mathematics']).join(', ')}</div>
                </div>
                <div class="info-row">
                    <div class="info-label">Description:</div>
                    <div class="info-value">${paper.description || 'Standard JEE paper with questions from Physics, Chemistry, and Mathematics.'}</div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="start-paper-btn" data-paper-id="${paper.id}">Start Paper</button>
            </div>
        </div>
    `;
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .paper-info-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        }
        
        .modal-content {
            background-color: white;
            border-radius: 20px;
            width: 90%;
            max-width: 500px;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
        }
        
        .modal-header {
            padding: 20px;
            border-bottom: 1px solid rgba(0, 0, 0, 0.1);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .modal-header h3 {
            margin: 0;
            font-size: 20px;
            font-weight: 700;
        }
        
        .close-modal {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #64748b;
        }
        
        .modal-body {
            padding: 20px;
        }
        
        .info-row {
            display: flex;
            margin-bottom: 15px;
        }
        
        .info-label {
            width: 120px;
            font-weight: 600;
            color: #64748b;
        }
        
        .info-value {
            flex: 1;
        }
        
        .modal-footer {
            padding: 20px;
            border-top: 1px solid rgba(0, 0, 0, 0.1);
            text-align: right;
        }
        
        .start-paper-btn {
            background: #4f46e5;
            color: white;
            border: none;
            padding: 12px 25px;
            border-radius: 10px;
            font-family: 'Poppins', sans-serif;
            font-size: 15px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .start-paper-btn:hover {
            background: #4338ca;
            transform: translateY(-3px);
            box-shadow: 0 10px 20px rgba(79, 70, 229, 0.2);
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(modal);
    
    // Add event listeners
    const closeButton = modal.querySelector('.close-modal');
    if (closeButton) {
        closeButton.addEventListener('click', function() {
            modal.remove();
        });
    }
    
    const startButton = modal.querySelector('.start-paper-btn');
    if (startButton) {
        startButton.addEventListener('click', function() {
            const paperId = this.getAttribute('data-paper-id');
            window.location.href = `exam.html?id=${paperId}`;
        });
    }
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Setup search and filters
function setupSearchAndFilters() {
    const searchInput = document.querySelector('.search-input');
    const filterSelects = document.querySelectorAll('.filter-select');
    
    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            applyFilters();
        });
    }
    
    // Filter functionality
    filterSelects.forEach(select => {
        select.addEventListener('change', function() {
            applyFilters();
        });
    });
}

// Apply filters
function applyFilters() {
    const searchInput = document.querySelector('.search-input');
    const filterSelects = document.querySelectorAll('.filter-select');
    const paperCards = document.querySelectorAll('.paper-card');
    
    // Get filter values
    const searchValue = searchInput ? searchInput.value.toLowerCase() : '';
    const paperTypeFilter = filterSelects[0] ? filterSelects[0].value : '';
    const yearFilter = filterSelects[1] ? filterSelects[1].value : '';
    const sortFilter = filterSelects[2] ? filterSelects[2].value : '';
    
    // Filter papers
    paperCards.forEach(card => {
        const title = card.querySelector('.paper-title').textContent.toLowerCase();
        const paperType = card.querySelector('.paper-tag').textContent;
        const year = card.querySelector('.paper-subtitle span:last-child').textContent;
        
        // Check if paper matches filters
        const matchesSearch = !searchValue || title.includes(searchValue);
        const matchesType = !paperTypeFilter || (paperTypeFilter === 'jee-main' && paperType === 'JEE Main') || 
                           (paperTypeFilter === 'solved' && card.querySelector('.fa-check-circle')) ||
                           (paperTypeFilter === 'unsolved' && !card.querySelector('.fa-check-circle'));
        const matchesYear = !yearFilter || year.includes(yearFilter);
        
        // Show or hide paper
        if (matchesSearch && matchesType && matchesYear) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });
    
    // Apply sorting
    if (sortFilter && paperCards.length > 0) {
        const papersGrid = document.querySelector('.papers-grid');
        const cardsArray = Array.from(paperCards).filter(card => card.style.display !== 'none');
        
        // Sort cards
        cardsArray.sort((a, b) => {
            if (sortFilter === 'newest') {
                const yearA = a.querySelector('.paper-subtitle span:last-child').textContent;
                const yearB = b.querySelector('.paper-subtitle span:last-child').textContent;
                return yearB.localeCompare(yearA);
            } else if (sortFilter === 'oldest') {
                const yearA = a.querySelector('.paper-subtitle span:last-child').textContent;
                const yearB = b.querySelector('.paper-subtitle span:last-child').textContent;
                return yearA.localeCompare(yearB);
            }
            return 0;
        });
        
        // Reorder cards
        cardsArray.forEach(card => {
            papersGrid.appendChild(card);
        });
    }
}