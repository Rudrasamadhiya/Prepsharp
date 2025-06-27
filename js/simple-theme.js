// Simple theme toggle script
document.addEventListener('DOMContentLoaded', function() {
    // Get elements
    const themeToggle = document.getElementById('themeToggle');
    const saveBtn = document.querySelector('#preferences .btn-primary');
    const resetBtn = document.querySelector('#preferences .btn-secondary');
    
    // Add event listeners to buttons
    if (saveBtn) {
        saveBtn.addEventListener('click', function() {
            // Save current settings
            const isDark = themeToggle ? themeToggle.checked : false;
            const fontSize = document.getElementById('fontSize') ? document.getElementById('fontSize').value : 'medium';
            
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            localStorage.setItem('fontSize', fontSize);
            
            alert('Preferences saved successfully!');
        });
    }
    
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            // Reset to defaults
            if (themeToggle) themeToggle.checked = false;
            if (document.getElementById('fontSize')) document.getElementById('fontSize').value = 'medium';
            
            localStorage.setItem('theme', 'light');
            localStorage.setItem('fontSize', 'medium');
            
            applyTheme(false);
            applyFontSize('medium');
            
            alert('Preferences reset to default!');
        });
    }
    
    // Function to apply theme
    function applyTheme(isDark) {
        if (isDark) {
            // Add dark-mode class to body
            document.body.classList.add('dark-mode');
            
            // Set sidebar background color
            const sidebar = document.querySelector('.sidebar');
            if (sidebar) {
                sidebar.style.background = 'linear-gradient(to bottom, #1a1a1a, #121212)';
                sidebar.style.borderRight = '1px solid #333333';
            }
            
            // Directly set text colors for immediate effect
            document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, label, span, a, div, .notification-title, .settings-title, .settings-subtitle, .form-label, .detail-value').forEach(el => {
                el.style.color = '#ffffff';
            });
            
            document.querySelectorAll('.notification-description, .detail-label, .text-light').forEach(el => {
                el.style.color = '#b0b0b0';
            });
        } else {
            // Remove dark-mode class from body
            document.body.classList.remove('dark-mode');
            
            // Reset sidebar background color
            const sidebar = document.querySelector('.sidebar');
            if (sidebar) {
                sidebar.style.backgroundColor = '#ffffff';
                sidebar.style.borderRight = '1px solid #e2e8f0';
            }
            
            // Reset text colors
            document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, label, span, a, div, .notification-title, .settings-title, .settings-subtitle, .form-label, .detail-value').forEach(el => {
                el.style.color = '#1e293b';
            });
            
            document.querySelectorAll('.notification-description, .detail-label, .text-light').forEach(el => {
                el.style.color = '#64748b';
            });
        }
    }
    
    // Handle font size
    const fontSizeSelect = document.getElementById('fontSize');
    if (fontSizeSelect) {
        fontSizeSelect.addEventListener('change', function() {
            const fontSize = this.value;
            applyFontSize(fontSize);
            localStorage.setItem('fontSize', fontSize);
        });
        
        // Set initial font size
        const savedFontSize = localStorage.getItem('fontSize') || 'medium';
        fontSizeSelect.value = savedFontSize;
        applyFontSize(savedFontSize);
    }
    
    // Function to apply font size
    function applyFontSize(size) {
        let pixelSize = '16px';
        switch (size) {
            case 'small': pixelSize = '14px'; break;
            case 'large': pixelSize = '18px'; break;
        }
        document.body.style.fontSize = pixelSize;
    }
    
    // Set initial theme
    const isDarkMode = localStorage.getItem('theme') === 'dark';
    if (themeToggle) themeToggle.checked = isDarkMode;
    applyTheme(isDarkMode);
    
    // Add event listener to theme toggle
    if (themeToggle) {
        themeToggle.addEventListener('change', function() {
            const isDark = this.checked;
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            applyTheme(isDark);
            alert(isDark ? 'Dark mode activated' : 'Light mode activated');
        });
    }
});