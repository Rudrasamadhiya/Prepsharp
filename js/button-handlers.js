// Direct button handlers for preferences section

// Define applyTheme function if it doesn't exist
if (typeof applyTheme !== 'function') {
    window.applyTheme = function(theme) {
        console.log('Applying theme:', theme);
        
        // Apply theme directly to body
        if (theme === 'dark') {
            // Dark mode colors
            const darkBg = '#121212';
            const darkCard = '#1e1e1e';
            const darkText = '#ffffff';
            const darkBorder = '#333333';
            const darkInput = '#2a2a2a';
            
            document.body.style.backgroundColor = darkBg;
            document.body.style.color = darkText;
            
            // Update sidebar
            const sidebar = document.querySelector('.sidebar');
            if (sidebar) {
                sidebar.style.backgroundColor = darkCard;
                sidebar.style.borderRight = `1px solid ${darkBorder}`;
            }
            
            // Update top nav
            const topNav = document.querySelector('.top-nav');
            if (topNav) {
                topNav.style.backgroundColor = darkBg;
                topNav.style.borderBottom = `1px solid ${darkBorder}`;
            }
            
            // Update cards and content areas
            const cards = document.querySelectorAll('.settings-content, .settings-sidebar, .dashboard-card, .subscription-card');
            cards.forEach(card => {
                card.style.backgroundColor = darkCard;
                card.style.color = darkText;
                if (card.style.boxShadow) {
                    card.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.3)';
                }
            });
            
            // Update form elements
            const formElements = document.querySelectorAll('.form-input, .form-select');
            formElements.forEach(el => {
                el.style.backgroundColor = darkInput;
                el.style.color = darkText;
                el.style.borderColor = darkBorder;
            });
            
            // Update buttons
            const secondaryButtons = document.querySelectorAll('.btn-secondary');
            secondaryButtons.forEach(btn => {
                btn.style.borderColor = darkBorder;
                btn.style.color = darkText;
            });
            
            // Update notification options
            const notificationOptions = document.querySelectorAll('.notification-option');
            notificationOptions.forEach(option => {
                option.style.borderBottomColor = darkBorder;
            });
            
            // Ensure all text elements are visible
            const textElements = document.querySelectorAll('.notification-title, .notification-description, .settings-title, .settings-subtitle, .form-label, .detail-label, .detail-value, p, h1, h2, h3, h4, h5, h6, span, a, label');
            textElements.forEach(el => {
                el.style.color = darkText;
            });
            
            // Fix specific text elements that might need different colors
            const lightTextElements = document.querySelectorAll('.text-light, .notification-description, .detail-label');
            lightTextElements.forEach(el => {
                el.style.color = '#b0b0b0';
            });
            
            // Update toggle sliders
            const toggleSliders = document.querySelectorAll('.toggle-slider');
            toggleSliders.forEach(slider => {
                if (!slider.classList.contains('active')) {
                    slider.style.backgroundColor = '#555';
                }
            });
            
            // Set dark mode toggle to checked
            const themeToggle = document.getElementById('themeToggle');
            if (themeToggle) {
                themeToggle.checked = true;
            }
        } else {
            // Light mode colors
            const lightBg = '#f1f5f9';
            const lightCard = '#ffffff';
            const lightText = '#1e293b';
            const lightBorder = '#e2e8f0';
            
            document.body.style.backgroundColor = lightBg;
            document.body.style.color = lightText;
            
            // Update sidebar
            const sidebar = document.querySelector('.sidebar');
            if (sidebar) {
                sidebar.style.backgroundColor = lightCard;
                sidebar.style.borderRight = `1px solid ${lightBorder}`;
            }
            
            // Update top nav
            const topNav = document.querySelector('.top-nav');
            if (topNav) {
                topNav.style.backgroundColor = lightBg;
                topNav.style.borderBottom = `1px solid ${lightBorder}`;
            }
            
            // Update cards and content areas
            const cards = document.querySelectorAll('.settings-content, .settings-sidebar, .dashboard-card, .subscription-card');
            cards.forEach(card => {
                card.style.backgroundColor = lightCard;
                card.style.color = lightText;
                if (card.style.boxShadow) {
                    card.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
                }
            });
            
            // Update form elements
            const formElements = document.querySelectorAll('.form-input, .form-select');
            formElements.forEach(el => {
                el.style.backgroundColor = lightCard;
                el.style.color = lightText;
                el.style.borderColor = lightBorder;
            });
            
            // Update buttons
            const secondaryButtons = document.querySelectorAll('.btn-secondary');
            secondaryButtons.forEach(btn => {
                btn.style.borderColor = lightBorder;
                btn.style.color = lightText;
            });
            
            // Update notification options
            const notificationOptions = document.querySelectorAll('.notification-option');
            notificationOptions.forEach(option => {
                option.style.borderBottomColor = lightBorder;
            });
            
            // Update toggle sliders
            const toggleSliders = document.querySelectorAll('.toggle-slider');
            toggleSliders.forEach(slider => {
                if (!slider.classList.contains('active')) {
                    slider.style.backgroundColor = '#ccc';
                }
            });
            
            // Set dark mode toggle to unchecked
            const themeToggle = document.getElementById('themeToggle');
            if (themeToggle) {
                themeToggle.checked = false;
            }
        }
    };
}

// Define applyFontSize function if it doesn't exist
if (typeof applyFontSize !== 'function') {
    window.applyFontSize = function(fontSize) {
        console.log('Applying font size:', fontSize);
        
        let size;
        switch (fontSize) {
            case 'small': size = '14px'; break;
            case 'medium': size = '16px'; break;
            case 'large': size = '18px'; break;
            default: size = '16px';
        }
        
        // Apply font size to body and all text elements
        document.body.style.fontSize = size;
        
        // Adjust headings proportionally
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        headings.forEach(heading => {
            const currentSize = window.getComputedStyle(heading).fontSize;
            const baseSize = parseInt(currentSize);
            const ratio = parseInt(size) / 16; // 16px is the medium size
            heading.style.fontSize = `${baseSize * ratio}px`;
        });
    };
}

// Define showToast function if it doesn't exist
if (typeof showToast !== 'function') {
    window.showToast = function(message, type = 'success') {
        console.log('Showing toast:', message);
        
        // Create toast element
        const toast = document.createElement('div');
        toast.style.position = 'fixed';
        toast.style.bottom = '20px';
        toast.style.right = '20px';
        toast.style.backgroundColor = type === 'success' ? '#9333ea' : '#ef4444';
        toast.style.color = 'white';
        toast.style.padding = '12px 20px';
        toast.style.borderRadius = '8px';
        toast.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.2)';
        toast.style.zIndex = '9999';
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
        toast.style.transition = 'all 0.3s ease';
        toast.textContent = message;
        
        // Add to document
        document.body.appendChild(toast);
        
        // Animate in
        setTimeout(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateY(0)';
        }, 10);
        
        // Remove after 3 seconds
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(-20px)';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    };
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('Button handlers script loaded');
    
    // Find the preferences section
    const preferencesSection = document.getElementById('preferences');
    if (!preferencesSection) {
        console.error('Preferences section not found');
        return;
    }
    
    // Find the buttons in the preferences section
    const saveButton = preferencesSection.querySelector('.btn-primary');
    const resetButton = preferencesSection.querySelector('.btn-secondary');
    
    console.log('Found buttons:', saveButton, resetButton);
    
    // Add click handler to Save Preferences button
    if (saveButton) {
        saveButton.addEventListener('click', function(e) {
            console.log('Save Preferences button clicked');
            
            // Get preferences values
            const theme = document.getElementById('theme').value;
            const fontSize = document.getElementById('fontSize').value;
            const studyGoal = document.getElementById('studyGoal').value;
            const difficulty = document.getElementById('difficulty').value;
            
            console.log('Saving preferences:', { theme, fontSize, studyGoal, difficulty });
            
            // Apply theme and font size immediately
            if (typeof applyTheme === 'function') {
                applyTheme(theme);
                applyFontSize(fontSize);
            } else {
                console.error('applyTheme or applyFontSize function not found');
                
                // Direct application as fallback
                if (theme === 'dark') {
                    document.body.style.backgroundColor = '#0f172a';
                    document.body.style.color = '#f8fafc';
                } else {
                    document.body.style.backgroundColor = '#f1f5f9';
                    document.body.style.color = '#1e293b';
                }
                
                let size = '16px';
                switch (fontSize) {
                    case 'small': size = '14px'; break;
                    case 'large': size = '18px'; break;
                }
                document.body.style.fontSize = size;
            }
            
            // Save preferences to localStorage
            localStorage.setItem('prepsharp-theme', theme);
            localStorage.setItem('prepsharp-font-size', fontSize);
            localStorage.setItem('prepsharp-study-goal', studyGoal);
            localStorage.setItem('prepsharp-difficulty', difficulty);
            
            // Get toggle states
            const toggles = preferencesSection.querySelectorAll('.toggle-switch input');
            if (toggles.length >= 2) {
                const focusMode = toggles[0].checked;
                const aiRecommendations = toggles[1].checked;
                
                // Save toggle states to localStorage
                localStorage.setItem('prepsharp-focus-mode', focusMode);
                localStorage.setItem('prepsharp-ai-recommendations', aiRecommendations);
            }
            
            // Show success message
            if (typeof showToast === 'function') {
                showToast('Preferences saved successfully!');
            } else {
                alert('Preferences saved successfully!');
            }
        });
    }
    
    // Add click handler to Reset to Default button
    if (resetButton) {
        resetButton.addEventListener('click', function(e) {
            console.log('Reset to Default button clicked');
            
            // Reset theme
            const themeSelect = document.getElementById('theme');
            if (themeSelect) {
                themeSelect.value = 'light';
                
                // Apply theme
                if (typeof applyTheme === 'function') {
                    applyTheme('light');
                } else {
                    document.body.style.backgroundColor = '#f1f5f9';
                    document.body.style.color = '#1e293b';
                }
                
                localStorage.setItem('prepsharp-theme', 'light');
            }
            
            // Reset font size
            const fontSizeSelect = document.getElementById('fontSize');
            if (fontSizeSelect) {
                fontSizeSelect.value = 'medium';
                
                // Apply font size
                if (typeof applyFontSize === 'function') {
                    applyFontSize('medium');
                } else {
                    document.body.style.fontSize = '16px';
                }
                
                localStorage.setItem('prepsharp-font-size', 'medium');
            }
            
            // Reset study goal
            const studyGoalInput = document.getElementById('studyGoal');
            if (studyGoalInput) {
                studyGoalInput.value = '4';
                localStorage.setItem('prepsharp-study-goal', '4');
            }
            
            // Reset difficulty
            const difficultySelect = document.getElementById('difficulty');
            if (difficultySelect) {
                difficultySelect.value = 'medium';
                localStorage.setItem('prepsharp-difficulty', 'medium');
            }
            
            // Reset toggle states
            const toggles = preferencesSection.querySelectorAll('.toggle-switch input');
            if (toggles.length >= 2) {
                toggles[0].checked = true;
                toggles[1].checked = true;
                localStorage.setItem('prepsharp-focus-mode', true);
                localStorage.setItem('prepsharp-ai-recommendations', true);
            }
            
            // Show success message
            if (typeof showToast === 'function') {
                showToast('Preferences reset to default.');
            } else {
                alert('Preferences reset to default.');
            }
        });
    }
});