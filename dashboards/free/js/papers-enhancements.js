// Enhancements for practice papers
document.addEventListener('DOMContentLoaded', function() {
    // Create detail panel for desktop view
    const isMobile = window.innerWidth <= 768;
    
    if (!isMobile) {
        // Create panel elements
        const detailPanel = document.createElement('div');
        detailPanel.className = 'detail-panel';
        detailPanel.innerHTML = `
            <div class="detail-panel-header">
                <div class="detail-panel-title">
                    <i class="fas fa-file-alt" style="margin-right: 10px;"></i>
                    Paper Details
                </div>
                <button class="detail-panel-close"><i class="fas fa-times"></i></button>
            </div>
            <div class="detail-panel-content"></div>
        `;
        
        const overlay = document.createElement('div');
        overlay.className = 'detail-panel-overlay';
        
        // Add to body
        document.body.appendChild(detailPanel);
        document.body.appendChild(overlay);
        
        // Close panel when clicking close button or overlay
        detailPanel.querySelector('.detail-panel-close').addEventListener('click', closeDetailPanel);
        overlay.addEventListener('click', closeDetailPanel);
        
        // Close panel with escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') closeDetailPanel();
        });
    }
    
    // Function to close detail panel
    function closeDetailPanel() {
        const panel = document.querySelector('.detail-panel');
        const overlay = document.querySelector('.detail-panel-overlay');
        if (panel) panel.classList.remove('show');
        if (overlay) overlay.classList.remove('show');
    }
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
        
        // Find existing toggle button
        const toggle = card.querySelector('.paper-toggle');
        if (!toggle) return; // Skip if no toggle button found
        
        // Check if we're on mobile or desktop
        const isMobile = window.innerWidth <= 768;
        
        // Add click event
        toggle.addEventListener('click', function() {
            if (isMobile) {
                // Mobile behavior: toggle inline with enhanced display
                description.classList.toggle('show');
                toggle.classList.toggle('active');
                
                // Enhance description when showing
                if (description.classList.contains('show')) {
                    // Add animation class if not already present
                    if (!description.classList.contains('enhanced')) {
                        description.classList.add('enhanced');
                        
                        // Get the description text element
                        const descText = description.querySelector('.paper-description-text');
                        if (descText) {
                            // Add a quote element for visual interest
                            const quoteEl = document.createElement('div');
                            quoteEl.className = 'paper-quote';
                            quoteEl.innerHTML = `
                                <i class="fas fa-quote-left" style="margin-right: 5px; color: #4f46e5; opacity: 0.7;"></i> 
                                Prepare thoroughly for your exams
                                <div style="display: flex; align-items: center; margin-top: 8px; font-size: 11px;">
                                    <i class="fas fa-check-circle" style="color: #4f46e5; margin-right: 5px;"></i>
                                    <span>Verified content</span>
                                </div>
                            `;
                            quoteEl.style.fontStyle = 'italic';
                            quoteEl.style.color = '#6b7280';
                            quoteEl.style.fontSize = '13px';
                            quoteEl.style.marginTop = '10px';
                            quoteEl.style.padding = '10px';
                            quoteEl.style.background = 'linear-gradient(to right, rgba(79, 70, 229, 0.05), transparent)';
                            quoteEl.style.borderLeft = '3px solid rgba(79, 70, 229, 0.5)';
                            quoteEl.style.borderRadius = '0 8px 8px 0';
                            quoteEl.style.boxShadow = '0 4px 10px rgba(79, 70, 229, 0.08)';
                            
                            // Insert after description text
                            descText.parentNode.insertBefore(quoteEl, descText.nextSibling);
                        }
                    }
                }
                
                toggle.innerHTML = description.classList.contains('show') ? 
                    'Hide Details <i class="fas fa-chevron-up"></i>' : 
                    'Show Details <i class="fas fa-chevron-down"></i>';
                
                // Add haptic feedback if available
                if (window.navigator && window.navigator.vibrate) {
                    window.navigator.vibrate(50);
                }
            } else {
                // Desktop behavior: show in panel
                showDetailPanel(card);
            }
        });
    }
    
    // Function to show detail panel for desktop
    function showDetailPanel(card) {
        const panel = document.querySelector('.detail-panel');
        const overlay = document.querySelector('.detail-panel-overlay');
        const content = panel.querySelector('.detail-panel-content');
        const title = panel.querySelector('.detail-panel-title');
        
        // Get paper details
        const paperTitle = card.querySelector('.paper-header h3').textContent;
        const paperDescription = card.querySelector('.paper-description-text')?.textContent || '';
        const paperMeta = card.querySelector('.paper-meta').cloneNode(true);
        const subjectBadges = card.querySelector('.paper-body div').cloneNode(true);
        
        // Update panel content
        title.textContent = paperTitle;
        content.innerHTML = '';
        
        // Add description with enhanced styling
        const descriptionEl = document.createElement('div');
        descriptionEl.className = 'detail-panel-description';
        
        // Get paper type and year
        const paperType = card.getAttribute('data-paper-type') || 'jee-main';
        const paperTypeFormatted = paperType === 'jee-advanced' ? 'JEE Advanced' : 'JEE Main';
        
        descriptionEl.innerHTML = `
            <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
                <div>
                    <span class="badge bg-primary" style="font-size: 14px; padding: 8px 15px; margin-right: 10px;">
                        <i class="fas fa-file-alt" style="margin-right: 5px;"></i> ${paperTypeFormatted}
                    </span>
                    <span class="badge bg-secondary" style="font-size: 14px; padding: 8px 15px;">
                        <i class="fas fa-clock" style="margin-right: 5px;"></i> 3 hours
                    </span>
                </div>
            </div>
            
            <div class="question-container" style="margin-bottom: 25px; background: #f8fafc; border-radius: 12px; padding: 20px; border-left: 4px solid #4f46e5;">
                <p style="font-weight: 500; color: #1e293b; font-family: 'Poppins', sans-serif; font-size: 16px; line-height: 1.7;">
                    ${paperDescription}
                </p>
            </div>
            
            <div class="option-container" style="margin-top: 20px; padding: 15px; border-radius: 8px; background: white; border: 1px solid #e2e8f0; transition: all 0.2s ease;">
                <div class="d-flex align-items-center">
                    <div style="margin-right: 15px;">
                        <span class="badge bg-primary" style="padding: 8px; font-size: 14px;"><i class="fas fa-lightbulb"></i></span>
                    </div>
                    <div>
                        <p class="option-label" style="font-weight: 500; color: #1e293b; margin-bottom: 5px;">Pro Tip</p>
                        <p class="option-text" style="color: #64748b; margin-bottom: 0;">Prepare thoroughly for your exams with this comprehensive practice paper.</p>
                        <div style="margin-top: 8px;">
                            <span class="badge bg-success" style="font-size: 11px;"><i class="fas fa-check-circle" style="margin-right: 3px;"></i> Verified content</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        content.appendChild(descriptionEl);
        
        // Add subject badges with title
        const subjectsSection = document.createElement('div');
        subjectsSection.className = 'card';
        subjectsSection.style.background = 'white';
        subjectsSection.style.borderRadius = '16px';
        subjectsSection.style.boxShadow = '0 2px 15px rgba(0, 0, 0, 0.05)';
        subjectsSection.style.marginBottom = '20px';
        subjectsSection.style.border = 'none';
        subjectsSection.style.overflow = 'hidden';
        
        // Create card header
        const cardHeader = document.createElement('div');
        cardHeader.style.background = 'linear-gradient(135deg, #4f46e5, #8b5cf6)';
        cardHeader.style.color = 'white';
        cardHeader.style.padding = '15px 20px';
        cardHeader.style.fontWeight = '600';
        cardHeader.style.display = 'flex';
        cardHeader.style.justifyContent = 'space-between';
        cardHeader.style.alignItems = 'center';
        cardHeader.innerHTML = `<h5 style="margin: 0; font-size: 16px; font-weight: 600;">Subjects Covered</h5>`;
        
        // Create card body
        const cardBody = document.createElement('div');
        cardBody.style.padding = '20px';
        
        // Enhance subject badges
        const enhancedBadges = document.createElement('div');
        enhancedBadges.style.display = 'flex';
        enhancedBadges.style.flexWrap = 'wrap';
        enhancedBadges.style.gap = '10px';
        
        const badges = subjectBadges.querySelectorAll('.subject-badge');
        badges.forEach(badge => {
            // Create badge element that matches the style in preview-exam.html
            const newBadge = document.createElement('span');
            newBadge.className = 'badge bg-primary me-2';
            newBadge.style.fontSize = '14px';
            newBadge.style.padding = '8px 15px';
            newBadge.style.fontWeight = '500';
            newBadge.textContent = badge.textContent;
            enhancedBadges.appendChild(newBadge);
        });
        
        cardBody.appendChild(enhancedBadges);
        subjectsSection.appendChild(cardHeader);
        subjectsSection.appendChild(cardBody);
        content.appendChild(subjectsSection);
        
        // Add meta info with card styling like in preview-exam.html
        const metaSection = document.createElement('div');
        metaSection.className = 'card';
        metaSection.style.background = 'white';
        metaSection.style.borderRadius = '16px';
        metaSection.style.boxShadow = '0 2px 15px rgba(0, 0, 0, 0.05)';
        metaSection.style.marginBottom = '20px';
        metaSection.style.border = 'none';
        metaSection.style.overflow = 'hidden';
        
        // Create card header
        const cardHeader = document.createElement('div');
        cardHeader.style.background = 'linear-gradient(135deg, #4f46e5, #8b5cf6)';
        cardHeader.style.color = 'white';
        cardHeader.style.padding = '15px 20px';
        cardHeader.style.fontWeight = '600';
        cardHeader.style.display = 'flex';
        cardHeader.style.justifyContent = 'space-between';
        cardHeader.style.alignItems = 'center';
        cardHeader.innerHTML = `<h5 style="margin: 0; font-size: 16px; font-weight: 600;">Paper Information</h5>`;
        
        // Create card body
        const cardBody = document.createElement('div');
        cardBody.style.padding = '20px';
        
        // Create a table-like layout for meta info
        const metaTable = document.createElement('div');
        metaTable.style.display = 'grid';
        metaTable.style.gridTemplateColumns = 'repeat(2, 1fr)';
        metaTable.style.gap = '15px';
        
        // Extract meta info from paperMeta
        const spans = paperMeta.querySelectorAll('span');
        spans.forEach(span => {
            const metaItem = document.createElement('div');
            metaItem.style.marginBottom = '10px';
            
            // Get icon and text
            const icon = span.querySelector('i');
            const iconClass = icon ? icon.className : 'fas fa-info-circle';
            const text = span.textContent.replace(/[^a-zA-Z0-9 ]/g, '').trim();
            
            metaItem.innerHTML = `
                <div style="margin-bottom: 5px;">
                    <i class="${iconClass}" style="color: #4f46e5; margin-right: 5px;"></i>
                    <strong style="color: #1e293b;">${text.split(' ')[0]}:</strong>
                </div>
                <div style="color: #64748b;">${text.split(' ').slice(1).join(' ')}</div>
            `;
            
            metaTable.appendChild(metaItem);
        });
        
        // Add additional meta info
        const additionalMeta = [
            { icon: 'fas fa-calendar-check', label: 'Status', value: 'Available now' },
            { icon: 'fas fa-chart-line', label: 'Analytics', value: 'Performance tracking' },
            { icon: 'fas fa-medal', label: 'Rewards', value: 'Earn badges' },
            { icon: 'fas fa-users', label: 'Attempts', value: '1000+' }
        ];
        
        additionalMeta.forEach(item => {
            const metaItem = document.createElement('div');
            metaItem.style.marginBottom = '10px';
            
            metaItem.innerHTML = `
                <div style="margin-bottom: 5px;">
                    <i class="${item.icon}" style="color: #4f46e5; margin-right: 5px;"></i>
                    <strong style="color: #1e293b;">${item.label}:</strong>
                </div>
                <div style="color: #64748b;">${item.value}</div>
            `;
            
            metaTable.appendChild(metaItem);
        });
        
        cardBody.appendChild(metaTable);
        metaSection.appendChild(cardHeader);
        metaSection.appendChild(cardBody);
        
        content.appendChild(metaSection);
        
        // Add a call-to-action button
        const ctaSection = document.createElement('div');
        ctaSection.style.marginTop = '30px';
        ctaSection.style.textAlign = 'center';
        
        const ctaButton = document.createElement('a');
        ctaButton.href = card.querySelector('.paper-footer a').getAttribute('href');
        ctaButton.className = 'btn btn-primary';
        ctaButton.style.display = 'inline-flex';
        ctaButton.style.alignItems = 'center';
        ctaButton.style.justifyContent = 'center';
        ctaButton.style.padding = '10px 25px';
        ctaButton.style.backgroundColor = '#4f46e5';
        ctaButton.style.color = 'white';
        ctaButton.style.borderRadius = '8px';
        ctaButton.style.fontWeight = '600';
        ctaButton.style.fontSize = '15px';
        ctaButton.style.textDecoration = 'none';
        ctaButton.style.border = 'none';
        ctaButton.style.fontFamily = "'Poppins', sans-serif";
        ctaButton.innerHTML = '<i class="fas fa-play-circle" style="margin-right: 8px;"></i> Start Exam Now';
        
        ctaSection.appendChild(ctaButton);
        content.appendChild(ctaSection);
        
        // Show panel
        panel.classList.add('show');
        overlay.classList.add('show');
    }
    
    // Initialize description toggles
    setupDescriptionToggles();
    
    // Also process any cards that might already be in the DOM
    document.querySelectorAll('.paper-card').forEach(addToggleToCard);
    
    // Add a fallback to ensure toggles are added after page load
    setTimeout(function() {
        document.querySelectorAll('.paper-card').forEach(function(card) {
            if (!card.querySelector('.paper-toggle')) {
                addToggleToCard(card);
            }
        });
    }, 1000);

    // Mobile-specific enhancements
    if (window.innerWidth <= 768) {
        // Initialize variables for pull-to-refresh
        let touchStartY = 0;
        let touchEndY = 0;
        const pullIndicator = document.querySelector('.pull-indicator');
        const minPullDistance = 80; // Minimum distance to trigger refresh
        
        if (pullIndicator) {
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
        }
        
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
    }
    
    // Handle window resize for responsive behavior
    const initialIsMobile = window.innerWidth <= 768;
    window.addEventListener('resize', function() {
        const currentIsMobile = window.innerWidth <= 768;
        if (initialIsMobile !== currentIsMobile) {
            // Refresh the page if switching between mobile and desktop
            window.location.reload();
        }
    });
    
    // Add active class to filter options on tap/click
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
});