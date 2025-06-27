// Bypass authentication check for premium features
(function() {
    // Create mock user data with premium subscription
    const mockUserData = {
        name: "Test User",
        subscription: "premium"
    };
    
    // Store mock user data in localStorage if not already present
    if (!localStorage.getItem('loggedInUser')) {
        localStorage.setItem('loggedInUser', JSON.stringify(mockUserData));
    }
    
    // Update UI elements
    document.addEventListener('DOMContentLoaded', function() {
        const userNameElement = document.getElementById('loggedInUserName');
        const userInitialsElement = document.getElementById('userInitials');
        
        if (userNameElement) {
            userNameElement.textContent = mockUserData.name;
        }
        
        if (userInitialsElement) {
            userInitialsElement.textContent = "TU";
        }
    });
})();