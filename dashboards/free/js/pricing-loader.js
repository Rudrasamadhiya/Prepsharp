// Firebase Pricing Plans Loader for Free Dashboard
document.addEventListener('DOMContentLoaded', function() {
    // Check if Firebase is initialized
    if (typeof firebase !== 'undefined' && firebase.firestore) {
        // Load pricing plans
        loadPricingPlans();
    } else {
        console.error("Firebase not initialized");
    }
    
    // Update the pricing text in the upgrade banner directly
    updateUpgradeBannerPrice();
});

// Function to load pricing plans from Firebase
function loadPricingPlans() {
    // Try to get pricing plans from Firestore
    firebase.firestore().collection("pricing").doc("plans").get()
        .then((doc) => {
            if (doc.exists) {
                updatePricingUI(doc.data());
            } else {
                console.log("No pricing plans found in Firebase, using defaults");
                updatePricingUI(getDefaultPlans());
            }
        })
        .catch((error) => {
            console.error("Error loading pricing plans:", error);
            updatePricingUI(getDefaultPlans());
        });
}

// Default pricing plans
function getDefaultPlans() {
    return {
        free: {
            name: "Free",
            price: 0,
            duration: "Forever",
            features: [
                "Limited access to practice papers",
                "Basic performance tracking",
                "Ad-supported experience"
            ]
        },
        basic: {
            name: "Basic",
            price: 199,
            duration: "1 Month",
            features: [
                "Access to all basic papers",
                "Detailed performance analytics",
                "Ad-free experience",
                "Email support"
            ]
        },
        standard: {
            name: "Standard",
            price: 499,
            duration: "3 Months",
            features: [
                "Access to all standard papers",
                "Advanced performance analytics",
                "Personalized study plan",
                "Priority email support"
            ]
        },
        premium: {
            name: "Premium",
            price: 999,
            duration: "6 Months",
            features: [
                "Access to all premium papers",
                "Comprehensive analytics dashboard",
                "AI-powered study recommendations",
                "Priority support with 24-hour response",
                "Exclusive webinars and resources"
            ]
        }
    };
}

// Update pricing UI elements in the dashboard
function updatePricingUI(plans) {
    // Update any pricing references in the dashboard
    updateUpgradeBannerPrice(plans);
}

// Update the upgrade banner price directly
function updateUpgradeBannerPrice(plans) {
    // Find the upgrade banner price text
    const upgradeBannerElements = document.querySelectorAll('div[style*="color: rgba(255, 255, 255, 0.9); font-size: 16px; margin-bottom: 15px;"]');
    
    if (upgradeBannerElements.length > 0) {
        const basicPrice = plans && plans.basic ? plans.basic.price : 199;
        upgradeBannerElements.forEach(element => {
            element.textContent = `Starting at ₹${basicPrice}/month`;
        });
    }
}