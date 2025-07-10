/**
 * Section information functionality
 */

document.addEventListener('DOMContentLoaded', () => {
    // Create info panel
    const infoPanel = document.createElement('div');
    infoPanel.className = 'section-info-panel';
    infoPanel.style.display = 'none';
    document.body.appendChild(infoPanel);
    
    // Add click event listeners to all info buttons
    const infoButtons = document.querySelectorAll('.info-button');
    
    infoButtons.forEach((button, index) => {
        button.addEventListener('click', (event) => {
            // Stop event propagation to prevent section tab click
            event.stopPropagation();
            
            // Get section name from parent element
            const sectionName = button.parentElement.textContent.trim();
            
            // Show section information panel
            showSectionInfoPanel(sectionName, index, button);
        });
        
        // For non-active sections, show on hover
        if (!button.parentElement.classList.contains('active')) {
            button.parentElement.addEventListener('mouseenter', (event) => {
                const sectionName = button.parentElement.textContent.trim();
                showSectionInfoPanel(sectionName, index, button.parentElement, true);
            });
            
            button.parentElement.addEventListener('mouseleave', () => {
                hideInfoPanel();
            });
        }
    });
    
    // Click outside to close panel
    document.addEventListener('click', (event) => {
        if (!event.target.closest('.section-info-panel') && 
            !event.target.closest('.info-button')) {
            hideInfoPanel();
        }
    });
    
    // Show section information panel
    function showSectionInfoPanel(sectionName, index, targetElement, isHover = false) {
        // Get section statistics
        const stats = getSectionStatistics(index);
        
        // Create panel content
        infoPanel.innerHTML = `
            <div class="panel-header">${sectionName} Statistics</div>
            <div class="panel-content">
                <div class="stat-item">
                    <div class="stat-color answered"></div>
                    <div class="stat-label">Answered:</div>
                    <div class="stat-value">${stats.answered}</div>
                </div>
                <div class="stat-item">
                    <div class="stat-color not-answered"></div>
                    <div class="stat-label">Not Answered:</div>
                    <div class="stat-value">${stats.notAnswered}</div>
                </div>
                <div class="stat-item">
                    <div class="stat-color not-visited"></div>
                    <div class="stat-label">Not Visited:</div>
                    <div class="stat-value">${stats.notVisited}</div>
                </div>
                <div class="stat-item">
                    <div class="stat-color marked"></div>
                    <div class="stat-label">Marked for Review:</div>
                    <div class="stat-value">${stats.marked}</div>
                </div>
                <div class="stat-item">
                    <div class="stat-color answered-marked"></div>
                    <div class="stat-label">Answered & Marked:</div>
                    <div class="stat-value">${stats.answeredMarked}</div>
                </div>
                <div class="stat-total">
                    <div class="stat-label">Total Questions:</div>
                    <div class="stat-value">${stats.total}</div>
                </div>
            </div>
        `;
        
        // Position the panel
        const rect = targetElement.getBoundingClientRect();
        
        if (isHover) {
            // Position for hover (above the section tab)
            infoPanel.style.position = 'absolute';
            infoPanel.style.top = `${rect.top - infoPanel.offsetHeight - 10}px`;
            infoPanel.style.left = `${rect.left}px`;
        } else {
            // Position for click (below the section tab)
            infoPanel.style.position = 'absolute';
            infoPanel.style.top = `${rect.bottom + 10}px`;
            infoPanel.style.left = `${rect.left}px`;
        }
        
        // Show the panel
        infoPanel.style.display = 'block';
    }
    
    // Hide info panel
    function hideInfoPanel() {
        infoPanel.style.display = 'none';
    }
    
    // Get section statistics
    function getSectionStatistics(sectionIndex) {
        // Get question range for this section
        const questionRange = getSectionQuestionRange(sectionIndex);
        const startIndex = questionRange.start;
        const endIndex = questionRange.end;
        
        // Initialize counters
        let answered = 0;
        let notAnswered = 0;
        let notVisited = 0;
        let marked = 0;
        let answeredMarked = 0;
        
        // Get all question buttons in the palette
        const questionButtons = document.querySelectorAll('.question-btn');
        
        // Count questions by status within this section's range
        for (let i = startIndex; i <= endIndex && i < questionButtons.length; i++) {
            const btn = questionButtons[i];
            
            if (btn.classList.contains('answered-marked')) {
                answeredMarked++;
            } else if (btn.classList.contains('answered')) {
                answered++;
            } else if (btn.classList.contains('marked')) {
                marked++;
            } else if (btn.classList.contains('not-answered')) {
                notAnswered++;
            } else if (btn.classList.contains('not-visited')) {
                notVisited++;
            }
        }
        
        // Calculate total
        const total = endIndex - startIndex + 1;
        
        return {
            answered,
            notAnswered,
            notVisited,
            marked,
            answeredMarked,
            total
        };
    }
    
    // Get question range for a section
    function getSectionQuestionRange(sectionIndex) {
        // Define section ranges based on index
        const ranges = [
            { start: 0, end: 19 },   // Physics Section 1: 0-19 (20 questions)
            { start: 20, end: 24 },  // Physics Section 2: 20-24 (5 questions)
            { start: 25, end: 44 },  // Chemistry Section 1: 25-44 (20 questions)
            { start: 45, end: 49 },  // Chemistry Section 2: 45-49 (5 questions)
            { start: 50, end: 69 },  // Mathematics Section 1: 50-69 (20 questions)
            { start: 70, end: 74 }   // Mathematics Section 2: 70-74 (5 questions)
        ];
        
        return ranges[sectionIndex] || { start: 0, end: 0 };
    }
});

// Add styles for the info panel
document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style');
    style.textContent = `
        .section-info-panel {
            background-color: white;
            border: 1px solid #ddd;
            border-radius: 4px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            width: 250px;
            z-index: 1000;
        }
        
        .panel-header {
            background-color: #0066cc;
            color: white;
            padding: 8px 12px;
            font-weight: bold;
            border-top-left-radius: 4px;
            border-top-right-radius: 4px;
        }
        
        .panel-content {
            padding: 10px;
        }
        
        .stat-item {
            display: flex;
            align-items: center;
            margin-bottom: 8px;
        }
        
        .stat-color {
            width: 20px;
            height: 20px;
            margin-right: 10px;
        }
        
        .stat-color.answered {
            background-color: #22c55e;
            clip-path: polygon(50% 0%, 100% 30%, 80% 100%, 20% 100%, 0% 30%);
        }
        
        .stat-color.not-answered {
            background-color: #ef4444;
            clip-path: polygon(20% 0%, 80% 0%, 100% 70%, 50% 100%, 0% 70%);
        }
        
        .stat-color.not-visited {
            background-color: #d1d5db;
        }
        
        .stat-color.marked {
            background-color: #a855f7;
            border-radius: 50%;
        }
        
        .stat-color.answered-marked {
            background-color: #6b21a8;
            border-radius: 50%;
        }
        
        .stat-label {
            flex: 1;
        }
        
        .stat-value {
            font-weight: bold;
        }
        
        .stat-total {
            display: flex;
            margin-top: 10px;
            padding-top: 10px;
            border-top: 1px solid #ddd;
            font-weight: bold;
        }
    `;
    document.head.appendChild(style);
});