// Modified auth-check.js for testing - no login required
(function() {
    // Set default user data for testing
    const testUserData = {
        name: 'Test User',
        email: 'test@example.com',
        subscription: 'free'
    };
    
    // Store test user in localStorage for consistency
    if (!localStorage.getItem('loggedInUser')) {
        localStorage.setItem('loggedInUser', JSON.stringify(testUserData));
    }
    
    // Update user name and initials in the UI
    document.addEventListener('DOMContentLoaded', function() {
        const userNameElement = document.getElementById('loggedInUserName');
        const userInitialsElement = document.getElementById('userInitials');
        
        if (userNameElement) {
            userNameElement.textContent = 'Test User';
        }
        
        if (userInitialsElement) {
            userInitialsElement.textContent = 'TU';
        }
        
        // Add logout functionality (just shows alert for testing)
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function(e) {
                e.preventDefault();
                alert('Logout clicked - In a real app, this would log you out');
            });
        }
    });
})();