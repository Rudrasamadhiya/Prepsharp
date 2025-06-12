// Authentication and subscription management

// Check if user is logged in
function isLoggedIn() {
    return localStorage.getItem('loggedInUser') !== null || sessionStorage.getItem('loggedInUser') !== null;
}

// Get current user data
function getCurrentUser() {
    const localUser = localStorage.getItem('loggedInUser');
    const sessionUser = sessionStorage.getItem('loggedInUser');
    
    if (localUser) {
        return JSON.parse(localUser);
    } else if (sessionUser) {
        return JSON.parse(sessionUser);
    }
    
    return null;
}

// Get user subscription
function getUserSubscription() {
    const user = getCurrentUser();
    return user ? user.subscription : null;
}

// Update user subscription
function updateUserSubscription(subscription) {
    const user = getCurrentUser();
    
    if (user) {
        user.subscription = subscription;
        
        // Update in localStorage if present there
        if (localStorage.getItem('loggedInUser')) {
            localStorage.setItem('loggedInUser', JSON.stringify(user));
        }
        
        // Update in sessionStorage if present there
        if (sessionStorage.getItem('loggedInUser')) {
            sessionStorage.setItem('loggedInUser', JSON.stringify(user));
        }
        
        // Update in users array
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userIndex = users.findIndex(u => u.email === user.email);
        
        if (userIndex !== -1) {
            users[userIndex].subscription = subscription;
            localStorage.setItem('users', JSON.stringify(users));
        }
        
        return true;
    }
    
    return false;
}

// Logout user
function logout() {
    localStorage.removeItem('loggedInUser');
    sessionStorage.removeItem('loggedInUser');
    window.location.href = '/login.html';
}

// Redirect to appropriate dashboard based on subscription
function redirectToDashboard(subscription) {
    switch(subscription) {
        case 'premium':
            window.location.href = '/dashboards/premium/dashboard.html';
            break;
        case 'standard':
            window.location.href = '/dashboards/standard/dashboard.html';
            break;
        case 'basic':
        default:
            window.location.href = '/dashboards/basic/dashboard.html';
            break;
    }
}

// Check authentication on restricted pages
function checkAuth() {
    if (!isLoggedIn()) {
        window.location.href = '/login.html';
    }
}

// Check subscription level for page access
function checkSubscription(requiredLevel) {
    const subscription = getUserSubscription();
    
    if (!subscription) {
        window.location.href = '/login.html';
        return false;
    }
    
    // Define subscription levels and their hierarchy
    const levels = {
        'basic': 1,
        'standard': 2,
        'premium': 3
    };
    
    // Check if user's subscription level is sufficient
    if (levels[subscription] < levels[requiredLevel]) {
        alert(`This feature requires a ${requiredLevel} subscription. Please upgrade your plan.`);
        return false;
    }
    
    return true;
}

// Add logout functionality to all dashboard pages
document.addEventListener('DOMContentLoaded', function() {
    // Add logout button event listener if it exists
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
    
    // Display user name if element exists
    const userNameElement = document.querySelector('.user-name');
    if (userNameElement) {
        const user = getCurrentUser();
        if (user && user.firstName) {
            userNameElement.textContent = `${user.firstName} ${user.lastName || ''}`;
        }
    }
    
    // Check authentication on dashboard pages
    if (window.location.pathname.includes('/dashboards/')) {
        checkAuth();
    }
});