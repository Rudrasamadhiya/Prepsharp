// Dashboard Loader Script
// This script loads custom dashboard configurations from localStorage if available

document.addEventListener('DOMContentLoaded', function() {
    // Check if there's a custom dashboard configuration
    const dashboardHTML = localStorage.getItem('dashboardHTML');
    const welcomeMessage = localStorage.getItem('dashboardWelcomeMessage');
    const theme = localStorage.getItem('dashboardTheme');
    
    if (dashboardHTML) {
        // Replace the exam categories with the custom HTML
        const container = document.querySelector('.container');
        
        // Find where to insert the custom HTML (after the welcome message)
        const welcomeDiv = document.querySelector('.welcome-message');
        if (welcomeDiv && welcomeDiv.nextElementSibling) {
            // Remove all existing categories
            let nextElement = welcomeDiv.nextElementSibling;
            while (nextElement) {
                const currentElement = nextElement;
                nextElement = nextElement.nextElementSibling;
                
                // If it's an h2 or exam-grid, remove it
                if (currentElement.tagName === 'H2' || currentElement.classList.contains('exam-grid')) {
                    container.removeChild(currentElement);
                }
            }
            
            // Insert the custom HTML
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = dashboardHTML;
            
            // Append each child of the temp div to the container
            while (tempDiv.firstChild) {
                container.appendChild(tempDiv.firstChild);
            }
        }
    }
    
    // Update welcome message if available
    if (welcomeMessage) {
        const welcomeP = document.querySelector('.welcome-message p');
        if (welcomeP) {
            welcomeP.textContent = welcomeMessage;
        }
    }
    
    // Apply theme if available
    if (theme && theme !== 'default') {
        const root = document.documentElement;
        
        switch (theme) {
            case 'green':
                root.style.setProperty('--primary-color', '#2e7d32');
                root.style.setProperty('--secondary-color', '#4caf50');
                root.style.setProperty('--accent-color', '#ff9800');
                break;
            case 'purple':
                root.style.setProperty('--primary-color', '#6a1b9a');
                root.style.setProperty('--secondary-color', '#9c27b0');
                root.style.setProperty('--accent-color', '#ff4081');
                break;
            case 'orange':
                root.style.setProperty('--primary-color', '#e65100');
                root.style.setProperty('--secondary-color', '#ff9800');
                root.style.setProperty('--accent-color', '#2196f3');
                break;
        }
    }
});