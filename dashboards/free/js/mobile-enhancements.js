// Enhancements for practice papers
document.addEventListener('DOMContentLoaded', function() {
    // Function to add description toggle to paper cards
    function setupDescriptionToggles() {
        // Get all paper cards that are dynamically loaded
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes.length) {
                    mutation.addedNodes.forEach(function(node) {
                        if (node.classList && node.classList.contains('paper-card')) {
                            addToggleToCard(node);
                        } else if (node.querySelectorAll) {
                            node.querySelectorAll('.paper-card').forEach(addToggleToCard);
                        }
                    });
                }
            });
        });
        
        // Start observing the papers grid for added cards
        const papersGrid = document.querySelector('.papers-grid');
        if (papersGrid) {
            observer.observe(papersGrid, { childList: true, subtree: true });
        }
        
        // Also check for any existing cards
        document.querySelectorAll('.paper-card').forEach(addToggleToCard);
    }
    
    // Function to add toggle to a single card
    function addToggleToCard(card) {
        // Find the description element
        const description = card.querySelector('.paper-meta');
        if (!description) return;
        
        // Create toggle button
        const toggle = document.createElement('div');
        toggle.className = 'paper-toggle';
        toggle.innerHTML = 'Show Details <i class="fas fa-chevron-down"></i>';
        
        // Insert toggle before the description
        description.parentNode.insertBefore(toggle, description);
        
        // Add click event
        toggle.addEventListener('click', function() {
            description.classList.toggle('show');
            toggle.classList.toggle('active');
            toggle.innerHTML = description.classList.contains('show') ? 
                'Hide Details <i class="fas fa-chevron-up"></i>' : 
                'Show Details <i class="fas fa-chevron-down"></i>';
            
            // Add haptic feedback if available
            if (window.navigator && window.navigator.vibrate) {
                window.navigator.vibrate(50);
            }
        });
    }
    
    // Initialize description toggles
    setupDescriptionToggles();
    
    // Also process any cards that might already be in the DOM
    document.querySelectorAll('.paper-card').forEach(addToggleToCard);
    // Initialize variables for pull-to-refresh
    let touchStartY = 0;
    let touchEndY = 0;
    const pullIndicator = document.querySelector('.pull-indicator');
    const minPullDistance = 80; // Minimum distance to trigger refresh
    
    // Touch start event
    document.addEventListener('touchstart', function(e) {
        touchStartY = e.touches[0].clientY;
    }, { passive: true });
    
    // Touch move event - show pull indicator
    document.addEventListener('touchmove', function(e) {
        touchEndY = e.touches[0].clientY;
        const pullDistance = touchEndY - touchStartY;
        
        // Only activate when scrolled to top
        if (window.scrollY === 0 && pullDistance > 0) {
            pullIndicator.classList.add('active');
            
            // Prevent default scrolling if pulling down
            if (pullDistance > 30) {
                e.preventDefault();
            }
        }
    }, { passive: false });
    
    // Touch end event - trigger refresh if pulled enough
    document.addEventListener('touchend', function() {
        const pullDistance = touchEndY - touchStartY;
        
        if (window.scrollY === 0 && pullDistance > minPullDistance) {
            // Show loading animation
            pullIndicator.innerHTML = '<i class="fas fa-spinner fa-spin" style="margin-right: 8px;"></i> Refreshing...';
            
            // Simulate refresh (replace with actual refresh logic)
            setTimeout(function() {
                window.location.reload();
            }, 1000);
        } else {
            // Hide pull indicator
            pullIndicator.classList.remove('active');
        }
    }, { passive: true });
    
    // Add active class to filter options on tap
    const filterOptions = document.querySelectorAll('.filter-option');
    filterOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove active class from siblings
            const siblings = Array.from(this.parentElement.children);
            siblings.forEach(sibling => sibling.classList.remove('active'));
            
            // Add active class to clicked option
            this.classList.add('active');
            
            // Add haptic feedback if available
            if (window.navigator && window.navigator.vibrate) {
                window.navigator.vibrate(50);
            }
            
            // Filter papers (this would be implemented in the main papers.js file)
            // For now, just add a visual feedback
            const papersGrid = document.querySelector('.papers-grid');
            if (papersGrid) {
                papersGrid.style.opacity = '0.6';
                setTimeout(() => {
                    papersGrid.style.opacity = '1';
                }, 300);
            }
        });
    });
    
    // Improve touch feedback on buttons
    const allButtons = document.querySelectorAll('button, .start-btn, .upgrade-btn');
    allButtons.forEach(button => {
        button.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.97)';
        });
        
        button.addEventListener('touchend', function() {
            this.style.transform = '';
        });
    });
    
    // Fix viewport height issues on mobile
    function setVH() {
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    
    // Set initial viewport height
    setVH();
    
    // Update on resize and orientation change
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', setVH);
});