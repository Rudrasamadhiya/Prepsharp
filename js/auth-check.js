// Check if user is logged in and has premium subscription
(function() {
    const loggedInUser = localStorage.getItem('loggedInUser') || sessionStorage.getItem('loggedInUser');
    
    if (!loggedInUser) {
        // Not logged in, redirect to login page
        window.location.href = '../../login.html';
    } else {
        const userData = JSON.parse(loggedInUser);
        
        // Check if user has premium subscription
        if (userData.subscription !== 'premium') {
            // Not a premium user, redirect to basic dashboard
            window.location.href = '../../dashboards/basic/dashboard.html';
        } else {
            // Update user name and initials in the UI
            document.addEventListener('DOMContentLoaded', function() {
                const userNameElement = document.getElementById('loggedInUserName');
                const userInitialsElement = document.getElementById('userInitials');
                
                if (userNameElement && userData.name) {
                    userNameElement.textContent = userData.name;
                }
                
                if (userInitialsElement && userData.name) {
                    const initials = userData.name
                        .split(' ')
                        .map(part => part.charAt(0))
                        .join('')
                        .toUpperCase()
                        .substring(0, 2);
                    userInitialsElement.textContent = initials;
                }
                
                // Add logout functionality
                const logoutBtn = document.getElementById('logoutBtn');
                if (logoutBtn) {
                    logoutBtn.addEventListener('click', function(e) {
                        e.preventDefault();
                        localStorage.removeItem('loggedInUser');
                        sessionStorage.removeItem('loggedInUser');
                        window.location.href = '../../login.html';
                    });
                }
            });
        }
    }
})();