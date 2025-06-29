// Pricing Plans Management
function showPricingManager() {
    // Fetch current pricing plans from Firestore
    db.collection("pricing").doc("plans").get()
        .then((doc) => {
            let plans;
            if (doc.exists) {
                plans = doc.data();
            } else {
                // Default plans if none exist
                plans = {
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
            
            // Create the pricing manager modal
            createPricingModal(plans);
        })
        .catch((error) => {
            console.error("Error fetching pricing plans:", error);
            alert("Failed to load pricing plans. Please try again.");
        });
}

// Function to create the pricing manager modal
function createPricingModal(plans) {
    // Create tabs for each plan
    const tabsHTML = Object.keys(plans).map((planId, index) => {
        return `<button class="nav-link ${index === 0 ? 'active' : ''}" 
                    id="${planId}-tab" 
                    data-bs-toggle="tab" 
                    data-bs-target="#${planId}-pane" 
                    type="button" 
                    role="tab">
                    ${plans[planId].name}
                </button>`;
    }).join('');
    
    // Create tab content for each plan
    const tabContentHTML = Object.keys(plans).map((planId, index) => {
        const plan = plans[planId];
        const featuresHTML = plan.features.map((feature, i) => {
            return `<div class="input-group mb-2">
                        <input type="text" class="form-control feature-input" value="${feature}">
                        <button class="btn btn-outline-danger remove-feature" type="button">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>`;
        }).join('');
        
        return `<div class="tab-pane fade ${index === 0 ? 'show active' : ''}" 
                    id="${planId}-pane" 
                    role="tabpanel" 
                    tabindex="0">
                    <div class="row mb-3">
                        <div class="col-md-6">
                            <label class="form-label">Plan Name</label>
                            <input type="text" class="form-control" id="${planId}-name" value="${plan.name}">
                        </div>
                        <div class="col-md-3">
                            <label class="form-label">Price (₹)</label>
                            <input type="number" class="form-control" id="${planId}-price" value="${plan.price}">
                        </div>
                        <div class="col-md-3">
                            <label class="form-label">Duration</label>
                            <input type="text" class="form-control" id="${planId}-duration" value="${plan.duration}">
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Features</label>
                        <div id="${planId}-features">
                            ${featuresHTML}
                        </div>
                        <button class="btn btn-sm btn-outline-primary mt-2 add-feature" data-plan="${planId}">
                            <i class="fas fa-plus"></i> Add Feature
                        </button>
                    </div>
                </div>`;
    }).join('');
    
    // Create the modal HTML
    const modalHTML = `
        <div class="modal fade" id="pricingModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header bg-gradient-blue text-white">
                        <h5 class="modal-title">Manage Pricing Plans</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <nav>
                            <div class="nav nav-tabs" id="plan-tabs" role="tablist">
                                ${tabsHTML}
                            </div>
                        </nav>
                        <div class="tab-content p-3 border border-top-0 rounded-bottom" id="plan-content">
                            ${tabContentHTML}
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" id="save-pricing">Save Changes</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to body
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalHTML;
    document.body.appendChild(modalContainer);
    
    // Initialize and show modal
    const modal = new bootstrap.Modal(document.getElementById('pricingModal'));
    modal.show();
    
    // Add event listeners for feature buttons
    document.querySelectorAll('.add-feature').forEach(button => {
        button.addEventListener('click', function() {
            const planId = this.getAttribute('data-plan');
            const featuresContainer = document.getElementById(`${planId}-features`);
            
            const newFeatureDiv = document.createElement('div');
            newFeatureDiv.className = 'input-group mb-2';
            newFeatureDiv.innerHTML = `
                <input type="text" class="form-control feature-input" value="New feature">
                <button class="btn btn-outline-danger remove-feature" type="button">
                    <i class="fas fa-times"></i>
                </button>
            `;
            
            featuresContainer.appendChild(newFeatureDiv);
            
            // Add event listener to the new remove button
            newFeatureDiv.querySelector('.remove-feature').addEventListener('click', function() {
                this.closest('.input-group').remove();
            });
        });
    });
    
    // Add event listeners for existing remove feature buttons
    document.querySelectorAll('.remove-feature').forEach(button => {
        button.addEventListener('click', function() {
            this.closest('.input-group').remove();
        });
    });
    
    // Save button event listener
    document.getElementById('save-pricing').addEventListener('click', function() {
        // Collect updated plan data
        const updatedPlans = {};
        
        Object.keys(plans).forEach(planId => {
            const nameInput = document.getElementById(`${planId}-name`);
            const priceInput = document.getElementById(`${planId}-price`);
            const durationInput = document.getElementById(`${planId}-duration`);
            const featureInputs = document.querySelectorAll(`#${planId}-features .feature-input`);
            
            const features = [];
            featureInputs.forEach(input => {
                if (input.value.trim()) {
                    features.push(input.value.trim());
                }
            });
            
            updatedPlans[planId] = {
                name: nameInput.value.trim(),
                price: parseInt(priceInput.value) || 0,
                duration: durationInput.value.trim(),
                features: features
            };
        });
        
        // Save to Firestore
        db.collection("pricing").doc("plans").set(updatedPlans)
            .then(() => {
                alert("Pricing plans updated successfully!");
                modal.hide();
            })
            .catch((error) => {
                console.error("Error updating pricing plans:", error);
                alert("Failed to update pricing plans. Please try again.");
            });
    });
    
    // Clean up modal when hidden
    document.getElementById('pricingModal').addEventListener('hidden.bs.modal', function() {
        document.body.removeChild(modalContainer);
    });
}