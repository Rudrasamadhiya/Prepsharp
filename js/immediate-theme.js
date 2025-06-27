// Immediate theme application
(function() {
    // Get saved theme
    const savedTheme = localStorage.getItem('prepsharp-theme') || 'light';
    
    // Apply basic theme immediately
    if (savedTheme === 'dark') {
        document.body.style.backgroundColor = '#121212';
        document.body.style.color = '#ffffff';
        document.body.setAttribute('data-theme', 'dark');
    } else {
        document.body.style.backgroundColor = '#f1f5f9';
        document.body.style.color = '#1e293b';
        document.body.removeAttribute('data-theme');
    }
})();