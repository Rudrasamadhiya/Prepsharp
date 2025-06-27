// Premium Settings Additional Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Security section handlers
    setupSecurityHandlers();
    
    // Preferences section handlers
    setupPreferencesHandlers();
});

// Setup security section handlers
function setupSecurityHandlers() {
    // Password change form
    const passwordForm = document.querySelector('#security form');
    if (passwordForm) {
        passwordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const currentPassword = document.getElementById('currentPassword').value;
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            // Validate form
            if (!currentPassword) {
                showToast('Please enter your current password.', 'error');
                return;
            }
            
            if (!newPassword) {
                showToast('Please enter a new password.', 'error');
                return;
            }
            
            if (newPassword !== confirmPassword) {
                showToast('New passwords do not match.', 'error');
                return;
            }
            
            // Show loading state
            const submitBtn = passwordForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Updating...';
            submitBtn.disabled = true;
            
            // Simulate password update
            setTimeout(() => {
                // Reset form
                passwordForm.reset();
                
                // Reset button state
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                
                // Show success message
                showToast('Password updated successfully!');
            }, 1000);
        });
    }
    
    // Two-factor authentication button
    const manageTwoFactorBtn = document.querySelector('#security button:first-of-type');
    if (manageTwoFactorBtn) {
        manageTwoFactorBtn.addEventListener('click', function() {
            showToast('Two-factor authentication settings will be available soon.');
        });
    }
    
    // View active sessions button
    const viewSessionsBtn = document.querySelector('#security button:last-of-type');
    if (viewSessionsBtn) {
        viewSessionsBtn.addEventListener('click', function() {
            showToast('Active sessions feature will be available soon.');
        });
    }
}

// Setup preferences section handlers
function setupPreferencesHandlers() {
    // Theme selector
    const themeSelect = document.getElementById('theme');
    if (themeSelect) {
        themeSelect.addEventListener('change', function() {
            const theme = this.value;
            console.log('Theme changed to:', theme);
            applyTheme(theme);
            
            // Save theme preference to localStorage immediately
            localStorage.setItem('prepsharp-theme', theme);
            
            // Show toast notification
            showToast(`Theme changed to ${theme}.`);
        });
        
        // Load saved theme preference
        const savedTheme = localStorage.getItem('prepsharp-theme');
        if (savedTheme) {
            console.log('Loading saved theme:', savedTheme);
            themeSelect.value = savedTheme;
            // Theme will be applied by the DOMContentLoaded event
        }
    }
    
    // Font size selector
    const fontSizeSelect = document.getElementById('fontSize');
    if (fontSizeSelect) {
        fontSizeSelect.addEventListener('change', function() {
            const fontSize = this.value;
            console.log('Font size changed to:', fontSize);
            applyFontSize(fontSize);
            
            // Save font size preference to localStorage immediately
            localStorage.setItem('prepsharp-font-size', fontSize);
            
            // Show toast notification
            showToast(`Font size changed to ${fontSize}.`);
        });
        
        // Load saved font size preference
        const savedFontSize = localStorage.getItem('prepsharp-font-size');
        if (savedFontSize) {
            console.log('Loading saved font size:', savedFontSize);
            fontSizeSelect.value = savedFontSize;
            // Font size will be applied by the DOMContentLoaded event
        }
    }
    
    // Force apply theme and font size after a short delay
    setTimeout(() => {
        const theme = themeSelect ? themeSelect.value : 'light';
        const fontSize = fontSizeSelect ? fontSizeSelect.value : 'medium';
        console.log('Forcing theme and font size application:', theme, fontSize);
        applyTheme(theme);
        applyFontSize(fontSize);
    }, 500);
}
}

// Apply theme to the page
function applyTheme(theme) {
    // Apply theme directly to body
    if (theme === 'dark') {
        document.body.style.backgroundColor = '#0f172a';
        document.body.style.color = '#f8fafc';
        
        // Update sidebar
        const sidebar = document.querySelector('.sidebar');
        if (sidebar) {
            sidebar.style.backgroundColor = '#1e293b';
            sidebar.style.borderRight = '1px solid #334155';
        }
        
        // Update cards
        const cards = document.querySelectorAll('.settings-content, .settings-sidebar, .dashboard-card');
        cards.forEach(card => {
            card.style.backgroundColor = '#1e293b';
            card.style.color = '#f8fafc';
        });
        
        // Update form elements
        const formElements = document.querySelectorAll('.form-input, .form-select');
        formElements.forEach(el => {
            el.style.backgroundColor = '#1e293b';
            el.style.color = '#f8fafc';
            el.style.borderColor = '#334155';
        });
    } else {
        document.body.style.backgroundColor = '#f1f5f9';
        document.body.style.color = '#1e293b';
        
        // Update sidebar
        const sidebar = document.querySelector('.sidebar');
        if (sidebar) {
            sidebar.style.backgroundColor = '#ffffff';
            sidebar.style.borderRight = '1px solid #e2e8f0';
        }
        
        // Update cards
        const cards = document.querySelectorAll('.settings-content, .settings-sidebar, .dashboard-card');
        cards.forEach(card => {
            card.style.backgroundColor = '#ffffff';
            card.style.color = '#1e293b';
        });
        
        // Update form elements
        const formElements = document.querySelectorAll('.form-input, .form-select');
        formElements.forEach(el => {
            el.style.backgroundColor = '#ffffff';
            el.style.color = '#1e293b';
            el.style.borderColor = '#e2e8f0';
        });
    }
}

// Apply font size to the page
function applyFontSize(fontSize) {
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
}
    
    // Study goal input
    const studyGoalInput = document.getElementById('studyGoal');
    if (studyGoalInput) {
        // Validate input to allow only numbers
        studyGoalInput.addEventListener('input', function() {
            this.value = this.value.replace(/[^0-9]/g, '');
        });
    }
    
    // Save preferences button - using direct selector for better targeting
    document.addEventListener('click', function(e) {
        // Check if the clicked element is the Save Preferences button
        if (e.target && e.target.matches('#preferences .btn-primary')) {
            console.log('Save Preferences button clicked');
            
            // Get preferences values
            const theme = document.getElementById('theme').value;
            const fontSize = document.getElementById('fontSize').value;
            const studyGoal = document.getElementById('studyGoal').value;
            const difficulty = document.getElementById('difficulty').value;
            
            console.log('Saving preferences:', { theme, fontSize, studyGoal, difficulty });
            
            // Apply theme and font size immediately
            applyTheme(theme);
            applyFontSize(fontSize);
            
            // Save preferences to localStorage
            localStorage.setItem('prepsharp-theme', theme);
            localStorage.setItem('prepsharp-font-size', fontSize);
            localStorage.setItem('prepsharp-study-goal', studyGoal);
            localStorage.setItem('prepsharp-difficulty', difficulty);
            
            // Get toggle states
            const focusMode = document.querySelector('#preferences .toggle-switch:first-of-type input').checked;
            const aiRecommendations = document.querySelector('#preferences .toggle-switch:last-of-type input').checked;
            
            // Save toggle states to localStorage
            localStorage.setItem('prepsharp-focus-mode', focusMode);
            localStorage.setItem('prepsharp-ai-recommendations', aiRecommendations);
            
            // Show success message
            showToast('Preferences saved successfully!');
        }
        
        // Check if the clicked element is the Reset to Default button
        if (e.target && e.target.matches('#preferences .btn-secondary')) {
            console.log('Reset to Default button clicked');
            
            // Reset theme
            document.getElementById('theme').value = 'light';
            applyTheme('light');
            localStorage.setItem('prepsharp-theme', 'light');
            
            // Reset font size
            document.getElementById('fontSize').value = 'medium';
            applyFontSize('medium');
            localStorage.setItem('prepsharp-font-size', 'medium');
            
            // Reset study goal
            document.getElementById('studyGoal').value = '4';
            localStorage.setItem('prepsharp-study-goal', '4');
            
            // Reset difficulty
            document.getElementById('difficulty').value = 'medium';
            localStorage.setItem('prepsharp-difficulty', 'medium');
            
            // Reset toggle states
            document.querySelector('#preferences .toggle-switch:first-of-type input').checked = true;
            document.querySelector('#preferences .toggle-switch:last-of-type input').checked = true;
            localStorage.setItem('prepsharp-focus-mode', true);
            localStorage.setItem('prepsharp-ai-recommendations', true);
            
            // Show success message
            showToast('Preferences reset to default.');
        }
    });
    
    // Load saved preferences
    loadSavedPreferences();
}

// Load saved preferences
function loadSavedPreferences() {
    // Load theme
    const savedTheme = localStorage.getItem('prepsharp-theme');
    if (savedTheme && document.getElementById('theme')) {
        document.getElementById('theme').value = savedTheme;
        applyTheme(savedTheme);
    }
    
    // Load font size
    const savedFontSize = localStorage.getItem('prepsharp-font-size');
    if (savedFontSize && document.getElementById('fontSize')) {
        document.getElementById('fontSize').value = savedFontSize;
        applyFontSize(savedFontSize);
    }
    
    // Load study goal
    const savedStudyGoal = localStorage.getItem('prepsharp-study-goal');
    if (savedStudyGoal && document.getElementById('studyGoal')) {
        document.getElementById('studyGoal').value = savedStudyGoal;
    }
    
    // Load difficulty
    const savedDifficulty = localStorage.getItem('prepsharp-difficulty');
    if (savedDifficulty && document.getElementById('difficulty')) {
        document.getElementById('difficulty').value = savedDifficulty;
    }
    
    // Load focus mode
    const savedFocusMode = localStorage.getItem('prepsharp-focus-mode');
    if (savedFocusMode !== null && document.querySelector('#preferences .toggle-switch:first-of-type input')) {
        document.querySelector('#preferences .toggle-switch:first-of-type input').checked = savedFocusMode === 'true';
    }
    
    // Load AI recommendations
    const savedAiRecommendations = localStorage.getItem('prepsharp-ai-recommendations');
    if (savedAiRecommendations !== null && document.querySelector('#preferences .toggle-switch:last-of-type input')) {
        document.querySelector('#preferences .toggle-switch:last-of-type input').checked = savedAiRecommendations === 'true';
    }
}