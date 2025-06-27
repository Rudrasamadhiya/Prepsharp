// Theme toggle for all pages
document.addEventListener('DOMContentLoaded', function() {
    // Apply theme from localStorage
    applyThemeFromStorage();
    
    // Find theme toggle on settings page
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        // Set initial state
        themeToggle.checked = localStorage.getItem('theme') === 'dark';
        
        // Add change listener
        themeToggle.addEventListener('change', function() {
            const isDark = this.checked;
            setTheme(isDark ? 'dark' : 'light');
        });
    }
    
    // Find theme buttons in settings page
    const saveBtn = document.querySelector('#preferences .btn-primary');
    const resetBtn = document.querySelector('#preferences .btn-secondary');
    
    if (saveBtn) {
        saveBtn.addEventListener('click', function() {
            const isDark = themeToggle && themeToggle.checked;
            setTheme(isDark ? 'dark' : 'light');
            alert('Preferences saved!');
        });
    }
    
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            if (themeToggle) themeToggle.checked = false;
            setTheme('light');
            alert('Preferences reset!');
        });
    }
});

// Function to set theme and save to localStorage
function setTheme(theme) {
    // Save to localStorage
    localStorage.setItem('theme', theme);
    
    // Apply theme
    applyThemeFromStorage();
}

// Function to apply theme from localStorage
function applyThemeFromStorage() {
    const isDarkMode = localStorage.getItem('theme') === 'dark';
    
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
}