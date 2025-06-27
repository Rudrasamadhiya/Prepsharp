// Premium Subscription Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get subscription elements
    const cancelSubscriptionBtn = document.getElementById('cancelSubscriptionBtn');
    const updatePaymentBtn = document.getElementById('updatePaymentBtn');
    
    // Load subscription data from localStorage/sessionStorage
    loadSubscriptionData();
    
    // Setup subscription handlers
    if (cancelSubscriptionBtn) {
        cancelSubscriptionBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to cancel your Premium subscription? You will lose access to premium features at the end of your billing period.')) {
                showToast('Subscription cancellation request submitted. You will receive a confirmation email shortly.');
            }
        });
    }
    
    if (updatePaymentBtn) {
        updatePaymentBtn.addEventListener('click', function() {
            const paymentMethod = document.getElementById('paymentMethod').value;
            
            if (paymentMethod === 'add-new') {
                // Simulate adding a new payment method
                showToast('Payment method update feature will be available soon.');
            } else {
                showToast('Payment method updated successfully!');
            }
        });
    }
});

// Load subscription data
function loadSubscriptionData() {
    // Get logged in user data
    const loggedInUser = localStorage.getItem('loggedInUser') || sessionStorage.getItem('loggedInUser');
    
    if (loggedInUser) {
        const userData = JSON.parse(loggedInUser);
        
        // Set subscription data if available
        if (userData.subscription) {
            const startDateElement = document.getElementById('subscriptionStartDate');
            const nextBillingElement = document.getElementById('subscriptionNextBilling');
            const statusElement = document.getElementById('subscriptionStatus');
            const priceElement = document.getElementById('subscriptionPrice');
            
            if (startDateElement && userData.subscription.startDate) {
                startDateElement.textContent = userData.subscription.startDate;
            }
            
            if (nextBillingElement && userData.subscription.nextBilling) {
                nextBillingElement.textContent = userData.subscription.nextBilling;
            }
            
            if (statusElement && userData.subscription.status) {
                statusElement.textContent = userData.subscription.status;
            }
            
            if (priceElement && userData.subscription.price) {
                priceElement.textContent = userData.subscription.price;
            }
        } else {
            // Set default subscription data for premium users
            const today = new Date();
            const startDate = formatDate(today);
            
            // Next billing date is 3 months from now
            const nextBillingDate = new Date(today);
            nextBillingDate.setMonth(nextBillingDate.getMonth() + 3);
            const nextBilling = formatDate(nextBillingDate);
            
            // Create subscription object
            const subscription = {
                plan: 'Premium',
                startDate: startDate,
                nextBilling: nextBilling,
                status: 'Active',
                price: '₹999/month'
            };
            
            // Update user data
            userData.subscription = subscription;
            
            // Save to localStorage/sessionStorage
            const storage = localStorage.getItem('loggedInUser') ? localStorage : sessionStorage;
            storage.setItem('loggedInUser', JSON.stringify(userData));
            
            // Update UI
            const startDateElement = document.getElementById('subscriptionStartDate');
            const nextBillingElement = document.getElementById('subscriptionNextBilling');
            const statusElement = document.getElementById('subscriptionStatus');
            const priceElement = document.getElementById('subscriptionPrice');
            
            if (startDateElement) startDateElement.textContent = startDate;
            if (nextBillingElement) nextBillingElement.textContent = nextBilling;
            if (statusElement) statusElement.textContent = 'Active';
            if (priceElement) priceElement.textContent = '₹999/month';
        }
    }
}

// Format date as Month DD, YYYY
function formatDate(date) {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    
    return `${month} ${day}, ${year}`;
}