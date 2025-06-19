// Check if user is logged in, redirect to login page if not
(function() {
    // Check for logged in user in localStorage or sessionStorage
    const loggedInUser = localStorage.getItem('loggedInUser') || sessionStorage.getItem('loggedInUser');
    
    // If no user is logged in, redirect to login page
    if (!loggedInUser) {
        window.location.href = '../../login.html';
        return;
    }
    
    // Parse user data
    try {
        const userData = JSON.parse(loggedInUser);
        
        // Update user name and initials when DOM is loaded
        document.addEventListener('DOMContentLoaded', function() {
            // Set user name in the header
            const userNameElement = document.getElementById('loggedInUserName');
            if (userNameElement) {
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
                
                userNameElement.textContent = fullName;
                
                // Set user initials
                const userInitialsElement = document.getElementById('userInitials');
                if (userInitialsElement) {
                    const initials = getInitials(fullName);
                    userInitialsElement.textContent = initials;
                }
            }
        });
    } catch (error) {
        console.error('Error parsing user data:', error);
        // If there's an error with the user data, redirect to login
        window.location.href = '../../login.html';
    }
    
    // Function to get initials from name
    function getInitials(name) {
        return name
            .split(' ')
            .map(part => part.charAt(0))
            .join('')
            .toUpperCase()
            .substring(0, 2);
    }
})();