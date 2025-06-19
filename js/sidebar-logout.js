// Add logout button to sidebar
document.addEventListener('DOMContentLoaded', function() {
    // Find the sidebar navigation
    const sidebarNav = document.querySelector('.sidebar-nav ul');
    
    if (sidebarNav) {
        // Create logout list item
        const logoutItem = document.createElement('li');
        logoutItem.className = 'logout-item';
        
        // Create logout link
        const logoutLink = document.createElement('a');
        logoutLink.href = '#';
        logoutLink.innerHTML = '<i class="fas fa-sign-out-alt"></i> Logout';
        
        // Add click event to handle logout
        logoutLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Clear user data from storage
            localStorage.removeItem('loggedInUser');
            sessionStorage.removeItem('loggedInUser');
            
            // Redirect to login page
            window.location.href = '../../login.html';
        });
        
        // Add link to list item
        logoutItem.appendChild(logoutLink);
        
        // Add list item to sidebar
        sidebarNav.appendChild(logoutItem);
        
        // Add some styling
        const style = document.createElement('style');
        style.textContent = `
            .sidebar-nav .logout-item {
                margin-top: 20px;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
                padding-top: 20px;
            }
            
            .sidebar-nav .logout-item a {
                color: #ef4444 !important;
            }
            
            .sidebar-nav .logout-item a:hover {
                background-color: rgba(239, 68, 68, 0.1) !important;
            }
            
            .sidebar-nav .logout-item a i {
                color: #ef4444 !important;
            }
        `;
        document.head.appendChild(style);
    }
});