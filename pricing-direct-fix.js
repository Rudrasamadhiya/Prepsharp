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
                
                // Get updated prices
                const basicPrice = parseInt(document.getElementById('basic-price').value);
                const standardPrice = parseInt(document.getElementById('standard-price').value);
                const premiumPrice = parseInt(document.getElementById('premium-price').value);
                
                // Create plans object
                const plans = {
                    free: { price: 0, name: "Free", duration: "Forever" },
                    basic: { price: basicPrice, name: "Basic", duration: "1 Month" },
                    standard: { price: standardPrice, name: "Standard", duration: "3 Months" },
                    premium: { price: premiumPrice, name: "Premium", duration: "6 Months" }
                };
                
                // Save to Firebase
                db.collection("pricing").doc("plans").set(plans)
                    .then(() => {
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