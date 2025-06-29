// Pricing Plans Manager
// This file loads pricing plans from Firebase and updates them across the site

// Function to load pricing plans from Firebase
function loadPricingPlans() {
    return new Promise((resolve, reject) => {
        // Try to get pricing plans from Firestore
        db.collection("pricing").doc("plans").get()
            .then((doc) => {
                if (doc.exists) {
                    resolve(doc.data());
                } else {
                    console.log("No pricing plans found in Firebase, using defaults");
                    resolve(getDefaultPlans());
                }
            })
            .catch((error) => {
                console.error("Error loading pricing plans:", error);
                resolve(getDefaultPlans());
            });
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

// Update pricing on subscription page
function updateSubscriptionPage(plans) {
    // Check if we're on the subscription page
    const pricingCards = document.querySelectorAll('.pricing-card');
    if (pricingCards.length > 0) {
        // Basic plan
        if (plans.basic) {
            const basicCard = document.getElementById('basic-card');
            if (basicCard) {
                basicCard.querySelector('.pricing-price').innerHTML = `₹${plans.basic.price} <span>/${plans.basic.duration.toLowerCase()}</span>`;
                updateFeatures(basicCard, plans.basic.features);
            }
        }
        
        // Standard plan
        if (plans.standard) {
            const standardCard = document.getElementById('standard-card');
            if (standardCard) {
                standardCard.querySelector('.pricing-price').innerHTML = `₹${plans.standard.price} <span>/${plans.standard.duration.toLowerCase()}</span>`;
                updateFeatures(standardCard, plans.standard.features);
            }
        }
        
        // Premium plan
        if (plans.premium) {
            const premiumCard = document.getElementById('premium-card');
            if (premiumCard) {
                premiumCard.querySelector('.pricing-price').innerHTML = `₹${plans.premium.price} <span>/${plans.premium.duration.toLowerCase()}</span>`;
                updateFeatures(premiumCard, plans.premium.features);
            }
        }
    }
}

// Update pricing on index page
function updateIndexPage(plans) {
    // Check if we're on the index page
    const planCards = document.querySelectorAll('.plan-card');
    if (planCards.length > 0) {
        planCards.forEach((card, index) => {
            const planType = ['free', 'basic', 'standard', 'premium'][index];
            const plan = plans[planType];
            
            if (plan) {
                // Update price and duration
                const priceElement = card.querySelector('.plan-price');
                if (priceElement) {
                    if (plan.price === 0) {
                        priceElement.innerHTML = `₹${plan.price} <span>/month</span>`;
                    } else {
                        const duration = plan.duration.toLowerCase();
                        const durationText = duration === '1 month' ? '/month' : 
                                           duration === '3 months' ? '/quarter' : 
                                           duration === '6 months' ? '/half-year' : '/year';
                        priceElement.innerHTML = `₹${plan.price} <span>${durationText}</span>`;
                    }
                }
                
                // Update features
                const featuresElement = card.querySelector('.plan-features');
                if (featuresElement && plan.features) {
                    featuresElement.innerHTML = '';
                    plan.features.forEach(feature => {
                        const li = document.createElement('li');
                        li.textContent = feature;
                        featuresElement.appendChild(li);
                    });
                }
            }
        });
    }
}

// Update features list
function updateFeatures(card, features) {
    const featuresList = card.querySelector('.pricing-features');
    if (featuresList && features) {
        featuresList.innerHTML = '';
        features.forEach(feature => {
            const li = document.createElement('li');
            li.innerHTML = `<i class="fas fa-check"></i> ${feature}`;
            featuresList.appendChild(li);
        });
    }
}

// Update payment page
function updatePaymentPage(plans) {
    // Check if we're on the payment page
    const planNameElement = document.getElementById('plan-name');
    if (planNameElement) {
        // Get subscription type from URL
        const urlParams = new URLSearchParams(window.location.search);
        const subscription = urlParams.get('subscription');
        
        if (subscription && plans[subscription]) {
            const plan = plans[subscription];
            
            // Update plan name
            planNameElement.textContent = plan.name;
            
            // Update price
            const planPriceElement = document.getElementById('plan-price');
            if (planPriceElement) {
                planPriceElement.textContent = `₹${plan.price}`;
            }
            
            // Calculate tax (18% GST)
            const tax = Math.round(plan.price * 0.18);
            const taxElement = document.getElementById('tax-amount');
            if (taxElement) {
                taxElement.textContent = `₹${tax}`;
            }
            
            // Calculate total
            const total = plan.price + tax;
            const totalElement = document.getElementById('total-amount');
            if (totalElement) {
                totalElement.textContent = `₹${total}`;
            }
        }
    }
}

// Initialize pricing plans
document.addEventListener('DOMContentLoaded', function() {
    // Check if Firebase is initialized
    if (typeof firebase !== 'undefined' && firebase.firestore) {
        // Load pricing plans
        loadPricingPlans().then(plans => {
            // Update pricing on current page
            updateSubscriptionPage(plans);
            updateIndexPage(plans);
            updatePaymentPage(plans);
        });
    } else {
        console.error("Firebase not initialized");
    }
});