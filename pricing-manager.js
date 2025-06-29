// Pricing Plans Manager for Admin Dashboard
// This file handles the pricing plans management functionality

// Function to show the pricing manager modal
window.showPricingManager = function() {
    // Load current pricing plans from Firebase
    loadPricingPlans().then(plans => {
        // Create modal HTML
        const modalHTML = createPricingModalHTML(plans);
        
        // Add modal to body
        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = modalHTML;
        document.body.appendChild(modalContainer);
        
        // Initialize and show modal
        const modal = new bootstrap.Modal(document.getElementById('pricingModal'));
        modal.show();
        
        // Set up event listeners
        setupPricingEventListeners();
        
        // Clean up modal when hidden
        document.getElementById('pricingModal').addEventListener('hidden.bs.modal', function() {
            document.body.removeChild(modalContainer);
        });
    });
}

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

// Function to create the pricing modal HTML
function createPricingModalHTML(plans) {
    // Create feature lists HTML
    const freeFeatures = plans.free.features.map(feature => `<li>${feature}</li>`).join('');
    const basicFeatures = plans.basic.features.map(feature => `<li>${feature}</li>`).join('');
    const standardFeatures = plans.standard.features.map(feature => `<li>${feature}</li>`).join('');
    const premiumFeatures = plans.premium.features.map(feature => `<li>${feature}</li>`).join('');
    
    return `
    <div class="modal fade" id="pricingModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-xl">
            <div class="modal-content">
                <div class="modal-header bg-gradient-blue text-white">
                    <h5 class="modal-title"><i class="fas fa-tags me-2"></i> Manage Pricing Plans</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="alert alert-info">
                        <i class="fas fa-info-circle me-2"></i> Changes to pricing plans will be reflected across the entire platform.
                    </div>
                    
                    <div class="row">
                        <!-- Free Plan -->
                        <div class="col-md-3">
                            <div class="card h-100">
                                <div class="card-header bg-light">
                                    <h5 class="mb-0">Free Plan</h5>
                                </div>
                                <div class="card-body">
                                    <div class="mb-3">
                                        <label class="form-label">Plan Name</label>
                                        <input type="text" class="form-control" id="free-name" value="${plans.free.name}">
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">Price (₹)</label>
                                        <input type="number" class="form-control" id="free-price" value="${plans.free.price}" readonly>
                                        <small class="text-muted">Free plan price cannot be changed</small>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">Duration</label>
                                        <input type="text" class="form-control" id="free-duration" value="${plans.free.duration}">
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">Features</label>
                                        <div class="feature-list-container border rounded p-2" style="max-height: 200px; overflow-y: auto;">
                                            <ul class="feature-list" id="free-features">
                                                ${freeFeatures}
                                            </ul>
                                        </div>
                                        <div class="input-group mt-2">
                                            <input type="text" class="form-control" id="free-new-feature" placeholder="Add feature">
                                            <button class="btn btn-outline-secondary add-feature-btn" type="button" data-plan="free">Add</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Basic Plan -->
                        <div class="col-md-3">
                            <div class="card h-100">
                                <div class="card-header bg-primary text-white">
                                    <h5 class="mb-0">Basic Plan</h5>
                                </div>
                                <div class="card-body">
                                    <div class="mb-3">
                                        <label class="form-label">Plan Name</label>
                                        <input type="text" class="form-control" id="basic-name" value="${plans.basic.name}">
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">Price (₹)</label>
                                        <input type="number" class="form-control" id="basic-price" value="${plans.basic.price}">
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">Duration</label>
                                        <input type="text" class="form-control" id="basic-duration" value="${plans.basic.duration}">
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">Features</label>
                                        <div class="feature-list-container border rounded p-2" style="max-height: 200px; overflow-y: auto;">
                                            <ul class="feature-list" id="basic-features">
                                                ${basicFeatures}
                                            </ul>
                                        </div>
                                        <div class="input-group mt-2">
                                            <input type="text" class="form-control" id="basic-new-feature" placeholder="Add feature">
                                            <button class="btn btn-outline-secondary add-feature-btn" type="button" data-plan="basic">Add</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Standard Plan -->
                        <div class="col-md-3">
                            <div class="card h-100">
                                <div class="card-header bg-warning text-dark">
                                    <h5 class="mb-0">Standard Plan</h5>
                                </div>
                                <div class="card-body">
                                    <div class="mb-3">
                                        <label class="form-label">Plan Name</label>
                                        <input type="text" class="form-control" id="standard-name" value="${plans.standard.name}">
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">Price (₹)</label>
                                        <input type="number" class="form-control" id="standard-price" value="${plans.standard.price}">
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">Duration</label>
                                        <input type="text" class="form-control" id="standard-duration" value="${plans.standard.duration}">
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">Features</label>
                                        <div class="feature-list-container border rounded p-2" style="max-height: 200px; overflow-y: auto;">
                                            <ul class="feature-list" id="standard-features">
                                                ${standardFeatures}
                                            </ul>
                                        </div>
                                        <div class="input-group mt-2">
                                            <input type="text" class="form-control" id="standard-new-feature" placeholder="Add feature">
                                            <button class="btn btn-outline-secondary add-feature-btn" type="button" data-plan="standard">Add</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Premium Plan -->
                        <div class="col-md-3">
                            <div class="card h-100">
                                <div class="card-header bg-purple text-white" style="background: linear-gradient(135deg, #8b5cf6, #6d28d9);">
                                    <h5 class="mb-0">Premium Plan</h5>
                                </div>
                                <div class="card-body">
                                    <div class="mb-3">
                                        <label class="form-label">Plan Name</label>
                                        <input type="text" class="form-control" id="premium-name" value="${plans.premium.name}">
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">Price (₹)</label>
                                        <input type="number" class="form-control" id="premium-price" value="${plans.premium.price}">
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">Duration</label>
                                        <input type="text" class="form-control" id="premium-duration" value="${plans.premium.duration}">
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">Features</label>
                                        <div class="feature-list-container border rounded p-2" style="max-height: 200px; overflow-y: auto;">
                                            <ul class="feature-list" id="premium-features">
                                                ${premiumFeatures}
                                            </ul>
                                        </div>
                                        <div class="input-group mt-2">
                                            <input type="text" class="form-control" id="premium-new-feature" placeholder="Add feature">
                                            <button class="btn btn-outline-secondary add-feature-btn" type="button" data-plan="premium">Add</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-primary" id="save-pricing-btn">
                        <i class="fas fa-save me-1"></i> Save Changes
                    </button>
                </div>
            </div>
        </div>
    </div>
    `;
}

// Function to set up event listeners for the pricing modal
function setupPricingEventListeners() {
    // Add feature buttons
    document.querySelectorAll('.add-feature-btn').forEach(button => {
        button.addEventListener('click', function() {
            const plan = this.getAttribute('data-plan');
            const input = document.getElementById(`${plan}-new-feature`);
            const feature = input.value.trim();
            
            if (feature) {
                const featureList = document.getElementById(`${plan}-features`);
                const li = document.createElement('li');
                li.innerHTML = `${feature} <button type="button" class="btn btn-sm text-danger remove-feature" style="padding: 0 5px; background: none; border: none;">&times;</button>`;
                featureList.appendChild(li);
                input.value = '';
                
                // Add event listener to remove button
                li.querySelector('.remove-feature').addEventListener('click', function() {
                    li.remove();
                });
            }
        });
    });
    
    // Add event listeners to existing remove buttons
    document.querySelectorAll('.feature-list li').forEach(li => {
        // Add remove button to each feature
        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'btn btn-sm text-danger remove-feature';
        removeBtn.style = 'padding: 0 5px; background: none; border: none;';
        removeBtn.innerHTML = '&times;';
        removeBtn.addEventListener('click', function() {
            li.remove();
        });
        
        li.appendChild(document.createTextNode(' '));
        li.appendChild(removeBtn);
    });
    
    // Save button
    document.getElementById('save-pricing-btn').addEventListener('click', function() {
        // Show loading state
        this.disabled = true;
        this.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i> Saving...';
        
        // Get updated plans
        const updatedPlans = {
            free: {
                name: document.getElementById('free-name').value,
                price: 0, // Always 0 for free plan
                duration: document.getElementById('free-duration').value,
                features: Array.from(document.getElementById('free-features').children).map(li => li.textContent.replace('×', '').trim())
            },
            basic: {
                name: document.getElementById('basic-name').value,
                price: parseInt(document.getElementById('basic-price').value),
                duration: document.getElementById('basic-duration').value,
                features: Array.from(document.getElementById('basic-features').children).map(li => li.textContent.replace('×', '').trim())
            },
            standard: {
                name: document.getElementById('standard-name').value,
                price: parseInt(document.getElementById('standard-price').value),
                duration: document.getElementById('standard-duration').value,
                features: Array.from(document.getElementById('standard-features').children).map(li => li.textContent.replace('×', '').trim())
            },
            premium: {
                name: document.getElementById('premium-name').value,
                price: parseInt(document.getElementById('premium-price').value),
                duration: document.getElementById('premium-duration').value,
                features: Array.from(document.getElementById('premium-features').children).map(li => li.textContent.replace('×', '').trim())
            }
        };
        
        // Save to Firebase
        db.collection("pricing").doc("plans").set(updatedPlans)
            .then(() => {
                // Show success message
                const saveBtn = document.getElementById('save-pricing-btn');
                saveBtn.innerHTML = '<i class="fas fa-check me-1"></i> Saved!';
                saveBtn.classList.remove('btn-primary');
                saveBtn.classList.add('btn-success');
                
                // Close modal after a delay
                setTimeout(() => {
                    const modal = bootstrap.Modal.getInstance(document.getElementById('pricingModal'));
                    modal.hide();
                    
                    // Show success toast
                    showToast('Pricing plans updated successfully!', 'success');
                }, 1000);
            })
            .catch(error => {
                console.error("Error saving pricing plans:", error);
                
                // Show error state
                const saveBtn = document.getElementById('save-pricing-btn');
                saveBtn.disabled = false;
                saveBtn.innerHTML = '<i class="fas fa-save me-1"></i> Save Changes';
                
                // Show error toast
                showToast('Error saving pricing plans. Please try again.', 'error');
            });
    });
}

// Function to show toast notification
function showToast(message, type = 'info') {
    // Create toast container if it doesn't exist
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
        document.body.appendChild(toastContainer);
    }
    
    // Create toast element
    const toastId = 'toast-' + Date.now();
    const toastHTML = `
        <div id="${toastId}" class="toast align-items-center text-white bg-${type === 'error' ? 'danger' : type}" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="d-flex">
                <div class="toast-body">
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        </div>
    `;
    
    // Add toast to container
    toastContainer.innerHTML += toastHTML;
    
    // Initialize and show toast
    const toastElement = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastElement, { autohide: true, delay: 3000 });
    toast.show();
    
    // Remove toast after it's hidden
    toastElement.addEventListener('hidden.bs.toast', function() {
        toastElement.remove();
    });
}