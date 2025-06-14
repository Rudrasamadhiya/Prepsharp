// This script fixes the registration redirection issue
// Include this script at the end of register.html

(function() {
    // Override the redirectToDashboard function to ensure it works correctly
    window.redirectToDashboard = function(subscription) {
        console.log('Fixed redirectToDashboard called with subscription:', subscription);
        
        try {
            // For all plans, go directly to dashboard for now
            let dashboardPath;
            
            // Make sure we're using the correct subscription value
            const actualSubscription = subscription ? subscription.trim().toLowerCase() : 'free';
            
            console.log('Processing subscription:', actualSubscription);
            
            // Determine the correct dashboard path based on subscription
            switch(actualSubscription) {
                case 'premium':
                    dashboardPath = 'dashboards/premium/dashboard.html';
                    break;
                case 'standard':
                    dashboardPath = 'dashboards/standard/dashboard.html';
                    break;
                case 'basic':
                    dashboardPath = 'dashboards/basic/dashboard.html';
                    break;
                case 'free':
                default:
                    dashboardPath = 'dashboards/basic/dashboard.html';
                    break;
            }
            
            console.log('Redirecting to dashboard:', dashboardPath);
            
            // Redirect to the appropriate dashboard
            window.location.href = dashboardPath;
        } catch (error) {
            console.error('Navigation error:', error);
            alert('An error occurred during navigation. Please try again.');
            // Fallback to basic dashboard
            window.location.href = 'dashboards/basic/dashboard.html';
        }
    };
    
    console.log('Registration fix script loaded');
})();