// Simple authentication check script
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const loggedInUser = localStorage.getItem('loggedInUser') || sessionStorage.getItem('loggedInUser');
    
    if (!loggedInUser) {
        // User is not logged in, redirect to login page
        window.location.href = '../../login.html';
    }
});