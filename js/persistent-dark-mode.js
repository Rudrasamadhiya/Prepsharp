// Persistent dark mode script
(function() {
    // Check if dark mode is enabled in localStorage
    const isDarkMode = localStorage.getItem('theme') === 'dark';
    
    // Apply dark mode if enabled
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
    }
    
    // Add event listener to update theme when localStorage changes
    window.addEventListener('storage', function(e) {
        if (e.key === 'theme') {
            if (e.newValue === 'dark') {
                document.body.classList.add('dark-mode');
            } else {
                document.body.classList.remove('dark-mode');
            }
        }
    });
})();