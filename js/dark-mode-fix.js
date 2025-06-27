// Fix dark mode text visibility
document.addEventListener('DOMContentLoaded', function() {
    // Function to fix text visibility in dark mode
    function fixDarkModeTextVisibility() {
        console.log('Fixing theme text visibility');
        
        // Get current theme
        const isDarkMode = localStorage.getItem('prepsharp-theme') === 'dark';
        
        if (isDarkMode) {
            // Set high contrast text colors for dark mode
            const textElements = document.querySelectorAll('.notification-title, .settings-title, .settings-subtitle, .form-label, p, h1, h2, h3, h4, h5, h6, label');
            textElements.forEach(el => {
                el.style.color = '#ffffff';
            });
            
            // Set lighter color for secondary text
            const lightTextElements = document.querySelectorAll('.text-light, .notification-description, .detail-label');
            lightTextElements.forEach(el => {
                el.style.color = '#b0b0b0';
            });
            
            // Ensure form inputs have white text
            const formInputs = document.querySelectorAll('.form-input, .form-select');
            formInputs.forEach(input => {
                input.style.color = '#ffffff';
            });
            
            // Fix specific elements that might have color issues
            document.querySelectorAll('.btn-secondary').forEach(btn => {
                btn.style.color = '#ffffff';
            });
            
            // Add data-theme attribute to body for CSS targeting
            document.body.setAttribute('data-theme', 'dark');
        } else {
            // Light mode text colors
            const textElements = document.querySelectorAll('.notification-title, .settings-title, .settings-subtitle, .form-label, p, h1, h2, h3, h4, h5, h6, label');
            textElements.forEach(el => {
                el.style.color = '#1e293b';
            });
            
            // Set color for secondary text
            const lightTextElements = document.querySelectorAll('.text-light, .notification-description, .detail-label');
            lightTextElements.forEach(el => {
                el.style.color = '#64748b';
            });
            
            // Ensure form inputs have dark text
            const formInputs = document.querySelectorAll('.form-input, .form-select');
            formInputs.forEach(input => {
                input.style.color = '#1e293b';
            });
            
            // Fix specific elements
            document.querySelectorAll('.btn-secondary').forEach(btn => {
                btn.style.color = '#1e293b';
            });
            
            // Remove data-theme attribute
            document.body.removeAttribute('data-theme');
        }
    }
    }
    
    // Function to initialize theme
    function initializeTheme() {
        // Get saved theme
        const savedTheme = localStorage.getItem('prepsharp-theme') || 'light';
        console.log('Initializing theme:', savedTheme);
        
        // Set theme toggle state
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.checked = savedTheme === 'dark';
        }
        
        // Apply theme
        fixDarkModeTextVisibility();
    }
    
    // Run on page load
    initializeTheme();
    
    // Add event listener for theme toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        // Set initial state based on localStorage
        const savedTheme = localStorage.getItem('prepsharp-theme') || 'light';
        themeToggle.checked = savedTheme === 'dark';
        
        themeToggle.addEventListener('change', function() {
            // Set theme in localStorage
            const newTheme = this.checked ? 'dark' : 'light';
            localStorage.setItem('prepsharp-theme', newTheme);
            
            console.log('Theme changed to:', newTheme);
            
            // Fix text visibility immediately
            fixDarkModeTextVisibility();
            
            // Show toast notification
            if (typeof showToast === 'function') {
                showToast(`${newTheme.charAt(0).toUpperCase() + newTheme.slice(1)} mode activated`);
            }
        });
    }
    
    // Add event listener for save preferences button
    const savePreferencesBtn = document.querySelector('#preferences .btn-primary');
    if (savePreferencesBtn) {
        savePreferencesBtn.addEventListener('click', fixDarkModeTextVisibility);
    }
});