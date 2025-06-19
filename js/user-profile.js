// User Profile Handler
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in, redirect to login page if not
    const loggedInUser = localStorage.getItem('loggedInUser') || sessionStorage.getItem('loggedInUser');
    
    if (!loggedInUser) {
        window.location.href = '../../login.html';
        return;
    }
    
    // Get user profile elements
    const userNameElement = document.getElementById('loggedInUserName');
    const userInitialsElement = document.getElementById('userInitials');
    
    if (loggedInUser && userNameElement && userInitialsElement) {
        const userData = JSON.parse(loggedInUser);
        let fullName = '';
        
        // Prioritize firstName/lastName if available
        if (userData.firstName || userData.lastName) {
            fullName = `${userData.firstName || ''} ${userData.lastName || ''}`.trim();
        } 
        // If name fields aren't available, try the name property
        else if (userData.name) {
            fullName = userData.name;
        }
        // Last resort: use email but without the domain part
        else if (userData.email) {
            fullName = userData.email.split('@')[0];
        }
        
        // Set the user name
        userNameElement.textContent = fullName;
        
        // Generate and set initials
        const initials = getInitials(fullName);
        userInitialsElement.textContent = initials;
    }
});

// Function to get initials from name
function getInitials(name) {
    return name
        .split(' ')
        .map(part => part.charAt(0))
        .join('')
        .toUpperCase()
        .substring(0, 2);
}