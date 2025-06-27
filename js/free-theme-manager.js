// Theme manager for free dashboard
document.addEventListener('DOMContentLoaded', function() {
    // Apply theme from localStorage
    applyThemeFromStorage();
    
    // Handle font size select
    const fontSizeSelect = document.getElementById('fontSize');
    if (fontSizeSelect) {
        fontSizeSelect.addEventListener('change', function() {
            localStorage.setItem('fontSize', this.value);
            applyFontSize();
            showToast(`Font size changed to ${this.value}`);
        });
    }
    
    // Find theme toggle on settings page
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        // Set initial state
        themeToggle.checked = localStorage.getItem('theme') === 'dark';
        
        // Add change listener
        themeToggle.addEventListener('change', function() {
            const isDark = this.checked;
            setTheme(isDark ? 'dark' : 'light');
            
            // Show toast notification
            showToast(`${isDark ? 'Dark' : 'Light'} mode activated`);
        });
    }
    
    // Find theme buttons in settings page
    const saveBtn = document.querySelector('#preferences .btn-primary');
    const resetBtn = document.querySelector('#preferences .btn-secondary');
    
    if (saveBtn) {
        saveBtn.addEventListener('click', function() {
            const isDark = themeToggle && themeToggle.checked;
            setTheme(isDark ? 'dark' : 'light');
        });
    }
    
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            if (themeToggle) themeToggle.checked = false;
            setTheme('light');
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

// Function to show toast notification
function showToast(message) {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.right = '20px';
    toast.style.backgroundColor = '#10b981';
    toast.style.color = 'white';
    toast.style.padding = '10px 20px';
    toast.style.borderRadius = '4px';
    toast.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
    toast.style.zIndex = '9999';
    toast.style.transition = 'all 0.3s ease';
    toast.style.opacity = '0';
    
    document.body.appendChild(toast);
    
    // Fade in
    setTimeout(() => {
        toast.style.opacity = '1';
    }, 10);
    
    // Fade out and remove
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

// Function to apply theme from localStorage
function applyThemeFromStorage() {
    const isDarkMode = localStorage.getItem('theme') === 'dark';
    
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
    
    // Apply font size
    applyFontSize();
}

// Function to apply font size
function applyFontSize() {
    const fontSize = localStorage.getItem('fontSize') || 'medium';
    
    // Remove all font size classes
    document.body.classList.remove('font-size-small', 'font-size-medium', 'font-size-large');
    
    // Add the selected font size class
    document.body.classList.add(`font-size-${fontSize}`);
    
    // Update the select element if it exists
    const fontSizeSelect = document.getElementById('fontSize');
    if (fontSizeSelect) {
        fontSizeSelect.value = fontSize;
    }
}