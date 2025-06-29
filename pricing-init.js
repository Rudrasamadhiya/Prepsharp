// Pricing Plans Initialization for Admin Dashboard
window.addEventListener('load', function() {
    // Add event listener to the pricing plans button
    const pricingBtn = document.getElementById('manage-pricing-btn');
    if (pricingBtn) {
        pricingBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Show loading effect
            const icon = this.querySelector('i');
            const originalIcon = icon.className;
            icon.className = 'fas fa-spinner fa-spin';
            
            // Reset icon after a short delay and show pricing manager
            setTimeout(() => {
                icon.className = originalIcon;
                showPricingManager();
            }, 300);
        });
    }
    
    // Add event listener for pricing option in reports modal
    document.addEventListener('click', function(e) {
        if (e.target && e.target.classList.contains('report-btn') && e.target.getAttribute('data-report') === 'pricing') {
            showPricingManager();
        }
    });
});