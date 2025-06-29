// Direct fix for pricing manager
document.addEventListener('DOMContentLoaded', function() {
    // Add direct event listener to pricing button
    const pricingBtn = document.getElementById('manage-pricing-btn');
    if (pricingBtn) {
        pricingBtn.onclick = function(e) {
            e.preventDefault();
            console.log("Pricing button clicked");
            
            // Create modal HTML
            const modalHTML = `
            <div class="modal fade" id="pricingModal" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog modal-xl">
                    <div class="modal-content">
                        <div class="modal-header bg-primary text-white">
                            <h5 class="modal-title"><i class="fas fa-tags me-2"></i> Manage Pricing Plans</h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="alert alert-info">
                                <i class="fas fa-info-circle me-2"></i> Changes to pricing plans will be reflected across the entire platform.
                            </div>
                            
                            <div class="row">
                                <div class="col-md-3">
                                    <div class="card">
                                        <div class="card-header bg-light">
                                            <h5 class="mb-0">Free Plan</h5>
                                        </div>
                                        <div class="card-body">
                                            <div class="mb-3">
                                                <label class="form-label">Price (₹)</label>
                                                <input type="number" class="form-control" value="0" readonly>
                                            </div>
                                            <div class="mb-3">
                                                <label class="form-label">Duration</label>
                                                <input type="text" class="form-control" id="free-duration" value="Forever">
                                            </div>
                                            <div class="mb-3">
                                                <label class="form-label">Features</label>
                                                <textarea class="form-control" id="free-features" rows="4">Limited access to practice papers
Basic performance tracking
Ad-supported experience</textarea>
                                                <small class="text-muted">One feature per line</small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-3">
                                    <div class="card">
                                        <div class="card-header bg-primary text-white">
                                            <h5 class="mb-0">Basic Plan</h5>
                                        </div>
                                        <div class="card-body">
                                            <div class="mb-3">
                                                <label class="form-label">Price (₹)</label>
                                                <input type="number" class="form-control" id="basic-price" value="199">
                                            </div>
                                            <div class="mb-3">
                                                <label class="form-label">Duration</label>
                                                <input type="text" class="form-control" id="basic-duration" value="1 Month">
                                            </div>
                                            <div class="mb-3">
                                                <label class="form-label">Features</label>
                                                <textarea class="form-control" id="basic-features" rows="4">Access to all basic papers
Detailed performance analytics
Ad-free experience
Email support</textarea>
                                                <small class="text-muted">One feature per line</small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-3">
                                    <div class="card">
                                        <div class="card-header bg-warning text-dark">
                                            <h5 class="mb-0">Standard Plan</h5>
                                        </div>
                                        <div class="card-body">
                                            <div class="mb-3">
                                                <label class="form-label">Price (₹)</label>
                                                <input type="number" class="form-control" id="standard-price" value="499">
                                            </div>
                                            <div class="mb-3">
                                                <label class="form-label">Duration</label>
                                                <input type="text" class="form-control" id="standard-duration" value="3 Months">
                                            </div>
                                            <div class="mb-3">
                                                <label class="form-label">Features</label>
                                                <textarea class="form-control" id="standard-features" rows="4">Access to all standard papers
Advanced performance analytics
Personalized study plan
Priority email support</textarea>
                                                <small class="text-muted">One feature per line</small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-3">
                                    <div class="card">
                                        <div class="card-header bg-purple text-white" style="background: linear-gradient(135deg, #8b5cf6, #6d28d9);">
                                            <h5 class="mb-0">Premium Plan</h5>
                                        </div>
                                        <div class="card-body">
                                            <div class="mb-3">
                                                <label class="form-label">Price (₹)</label>
                                                <input type="number" class="form-control" id="premium-price" value="999">
                                            </div>
                                            <div class="mb-3">
                                                <label class="form-label">Duration</label>
                                                <input type="text" class="form-control" id="premium-duration" value="6 Months">
                                            </div>
                                            <div class="mb-3">
                                                <label class="form-label">Features</label>
                                                <textarea class="form-control" id="premium-features" rows="4">Access to all premium papers
Comprehensive analytics dashboard
AI-powered study recommendations
Priority support with 24-hour response
Exclusive webinars and resources</textarea>
                                                <small class="text-muted">One feature per line</small>
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
            </div>`;
            
            // Add modal to body
            const modalContainer = document.createElement('div');
            modalContainer.innerHTML = modalHTML;
            document.body.appendChild(modalContainer);
            
            // Initialize and show modal
            const modal = new bootstrap.Modal(document.getElementById('pricingModal'));
            modal.show();
            
            // Save button functionality
            document.getElementById('save-pricing-btn').addEventListener('click', function() {
                // Show loading state
                this.disabled = true;
                this.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i> Saving...';
                
                // Get updated prices, durations and features
                const basicPrice = parseInt(document.getElementById('basic-price').value);
                const standardPrice = parseInt(document.getElementById('standard-price').value);
                const premiumPrice = parseInt(document.getElementById('premium-price').value);
                
                // Get durations
                const freeDuration = document.getElementById('free-duration').value;
                const basicDuration = document.getElementById('basic-duration').value;
                const standardDuration = document.getElementById('standard-duration').value;
                const premiumDuration = document.getElementById('premium-duration').value;
                
                // Get features (split by newlines)
                const freeFeatures = document.getElementById('free-features').value.split('\n').filter(f => f.trim() !== '');
                const basicFeatures = document.getElementById('basic-features').value.split('\n').filter(f => f.trim() !== '');
                const standardFeatures = document.getElementById('standard-features').value.split('\n').filter(f => f.trim() !== '');
                const premiumFeatures = document.getElementById('premium-features').value.split('\n').filter(f => f.trim() !== '');
                
                // Create plans object with the edited features and duration
                const plans = {
                    free: { 
                        price: 0, 
                        name: "Free", 
                        duration: freeDuration,
                        features: freeFeatures
                    },
                    basic: { 
                        price: basicPrice, 
                        name: "Basic", 
                        duration: basicDuration,
                        features: basicFeatures
                    },
                    standard: { 
                        price: standardPrice, 
                        name: "Standard", 
                        duration: standardDuration,
                        features: standardFeatures
                    },
                    premium: { 
                        price: premiumPrice, 
                        name: "Premium", 
                        duration: premiumDuration,
                        features: premiumFeatures
                    }
                };
                
                // Log the plans for debugging
                console.log("Saving plans:", plans);
                
                // Save to Firebase - using set with merge option to preserve other fields
                firebase.firestore().collection("pricing").doc("plans").set(plans, { merge: true })
                    .then(() => {
                        console.log("Plans saved successfully to Firebase");
                        // Show success message
                        this.innerHTML = '<i class="fas fa-check me-1"></i> Saved!';
                        this.classList.remove('btn-primary');
                        this.classList.add('btn-success');
                        
                        // Close modal after a delay
                        setTimeout(() => {
                            modal.hide();
                            alert('Pricing plans updated successfully!');
                        }, 1000);
                    })
                    .catch(error => {
                        console.error("Error saving pricing plans:", error);
                        this.disabled = false;
                        this.innerHTML = '<i class="fas fa-save me-1"></i> Save Changes';
                        alert('Error saving pricing plans. Please try again.');
                    });
            });
            
            // Clean up modal when hidden
            document.getElementById('pricingModal').addEventListener('hidden.bs.modal', function() {
                document.body.removeChild(modalContainer);
            });
        };
    }
});