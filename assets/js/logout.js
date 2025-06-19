// Handle logout functionality
document.addEventListener('DOMContentLoaded', function() {
    // Find all logout links
    const logoutLinks = document.querySelectorAll('a[href*="logout"]');
    
    logoutLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Clear user data from storage
            localStorage.removeItem('loggedInUser');
            sessionStorage.removeItem('loggedInUser');
            
            // Redirect to login page
            window.location.href = '../../login.html';
        });
    });
});