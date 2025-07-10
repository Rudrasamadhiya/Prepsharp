// Add admin link to practice papers page
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is admin
    function isAdmin() {
        const loggedInUser = localStorage.getItem('loggedInUser') || sessionStorage.getItem('loggedInUser');
        if (loggedInUser) {
            try {
                const userData = JSON.parse(loggedInUser);
                return userData.isAdmin === true;
            } catch (e) {
                return false;
            }
        }
        return false;
    }
    
    // Add admin link to sidebar if user is admin
    if (isAdmin()) {
        const sidebarNav = document.querySelector('.sidebar-nav ul');
        if (sidebarNav) {
            const adminLi = document.createElement('li');
            adminLi.innerHTML = `
                <a href="../../manage-exams.html"><i class="fas fa-cogs"></i> <span>Admin Panel</span></a>
            `;
            sidebarNav.appendChild(adminLi);
        }
    }
});