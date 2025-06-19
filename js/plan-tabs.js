// Premium subscription display
document.addEventListener('DOMContentLoaded', function() {
    const subscriptionCard = document.querySelector('.subscription-card');
    if (!subscriptionCard) return;
    
    // Create visually enhanced layout
    subscriptionCard.innerHTML = `
        <div class="plan-wrapper">
            <!-- Left side: Current plan details -->
            <div class="current-plan">
                <div class="plan-glow"></div>
                <div class="plan-content">
                    <div class="plan-status">Current Plan</div>
                    <h3 class="plan-title" id="planTitle">Basic Plan</h3>
                    <div class="plan-price" id="planPrice">Free</div>
                    
                    <div class="divider"></div>
                    
                    <div class="features-list" id="featuresList">
                        <div class="feature-item"><i class="fas fa-check"></i> JEE Main & Advanced papers</div>
                        <div class="feature-item"><i class="fas fa-check"></i> Basic performance analytics</div>
                        <div class="feature-item"><i class="fas fa-check"></i> Limited question bank</div>
                        <div class="feature-item disabled"><i class="fas fa-times"></i> Advanced study planner</div>
                        <div class="feature-item disabled"><i class="fas fa-times"></i> Personalized recommendations</div>
                    </div>
                </div>
            </div>
            
            <!-- Right side: Upgrade options -->
            <div class="upgrade-options">
                <h3 class="upgrade-title">Upgrade Your Preparation</h3>
                <p class="upgrade-subtitle">Get access to premium features and boost your JEE score</p>
                
                <div class="plan-cards">
                    <!-- Standard Plan -->
                    <div class="plan-card" data-plan="standard">
                        <div class="card-header">
                            <h4>Standard</h4>
                            <div class="card-price">₹499<span>/month</span></div>
                        </div>
                        <div class="card-features">
                            <div class="card-feature"><i class="fas fa-check-circle"></i> Full question bank</div>
                            <div class="card-feature"><i class="fas fa-check-circle"></i> Advanced analytics</div>
                            <div class="card-feature"><i class="fas fa-check-circle"></i> Study planner</div>
                        </div>
                        <button class="select-plan-btn">Select Plan</button>
                    </div>
                    
                    <!-- Premium Plan -->
                    <div class="plan-card premium" data-plan="premium">
                        <div class="best-value">Best Value</div>
                        <div class="card-header">
                            <h4>Premium</h4>
                            <div class="card-price">₹999<span>/month</span></div>
                        </div>
                        <div class="card-features">
                            <div class="card-feature"><i class="fas fa-check-circle"></i> Everything in Standard</div>
                            <div class="card-feature"><i class="fas fa-check-circle"></i> AI recommendations</div>
                            <div class="card-feature"><i class="fas fa-check-circle"></i> Advanced study planner</div>
                        </div>
                        <button class="select-plan-btn premium-btn">Select Plan</button>
                    </div>
                </div>
                
                <button class="upgrade-btn" id="upgradeBtn">Upgrade Now</button>
            </div>
        </div>
    `;
    
    // Add enhanced styles
    const style = document.createElement('style');
    style.textContent = `
        .subscription-card {
            margin-top: 30px;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 15px 50px rgba(79, 70, 229, 0.15);
            position: relative;
        }
        
        .plan-wrapper {
            display: flex;
            min-height: 500px;
        }
        
        .current-plan {
            flex: 1;
            background: linear-gradient(135deg, #4338ca, #6366f1);
            color: white;
            position: relative;
            overflow: hidden;
        }
        
        .plan-glow {
            position: absolute;
            width: 300px;
            height: 300px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 50%;
            top: -100px;
            right: -100px;
            filter: blur(30px);
        }
        
        .plan-content {
            position: relative;
            padding: 40px;
            height: 100%;
            display: flex;
            flex-direction: column;
        }
        
        .plan-status {
            display: inline-block;
            background: rgba(255, 255, 255, 0.2);
            padding: 8px 16px;
            border-radius: 30px;
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 20px;
            backdrop-filter: blur(5px);
        }
        
        .plan-title {
            font-size: 32px;
            font-weight: 800;
            margin: 0 0 10px 0;
            letter-spacing: -0.5px;
        }
        
        .plan-price {
            font-size: 36px;
            font-weight: 700;
            margin-bottom: 30px;
        }
        
        .plan-price span {
            font-size: 18px;
            font-weight: 400;
            opacity: 0.8;
        }
        
        .divider {
            height: 1px;
            background: rgba(255, 255, 255, 0.2);
            margin: 10px 0 30px;
            width: 100%;
        }
        
        .features-list {
            display: flex;
            flex-direction: column;
            gap: 16px;
        }
        
        .feature-item {
            display: flex;
            align-items: center;
            font-size: 16px;
            font-weight: 500;
        }
        
        .feature-item.disabled {
            opacity: 0.6;
        }
        
        .feature-item i {
            width: 28px;
            height: 28px;
            background: rgba(255, 255, 255, 0.15);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 15px;
            font-size: 12px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        
        .upgrade-options {
            flex: 1.2;
            background: white;
            padding: 40px;
            display: flex;
            flex-direction: column;
        }
        
        .upgrade-title {
            font-size: 28px;
            font-weight: 800;
            color: #1e293b;
            margin: 0 0 10px 0;
            letter-spacing: -0.5px;
        }
        
        .upgrade-subtitle {
            color: #64748b;
            font-size: 16px;
            margin: 0 0 30px 0;
        }
        
        .plan-cards {
            display: flex;
            gap: 20px;
            margin-bottom: 30px;
        }
        
        .plan-card {
            flex: 1;
            background: #f8fafc;
            border-radius: 16px;
            padding: 25px;
            position: relative;
            transition: all 0.3s ease;
            border: 2px solid transparent;
        }
        
        .plan-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
            border-color: #6366f1;
        }
        
        .plan-card.premium {
            background: linear-gradient(135deg, #fef3c7, #fffbeb);
            border: 2px solid #f59e0b;
        }
        
        .plan-card.premium:hover {
            box-shadow: 0 15px 30px rgba(245, 158, 11, 0.15);
        }
        
        .best-value {
            position: absolute;
            top: -12px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(90deg, #f59e0b, #d97706);
            color: white;
            padding: 6px 16px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 600;
            white-space: nowrap;
            box-shadow: 0 5px 15px rgba(245, 158, 11, 0.3);
        }
        
        .card-header {
            text-align: center;
            margin-bottom: 20px;
        }
        
        .card-header h4 {
            font-size: 22px;
            font-weight: 700;
            margin: 0 0 10px 0;
            color: #1e293b;
        }
        
        .card-price {
            font-size: 28px;
            font-weight: 800;
            color: #4f46e5;
        }
        
        .plan-card.premium .card-price {
            color: #d97706;
        }
        
        .card-price span {
            font-size: 16px;
            font-weight: 400;
            color: #64748b;
        }
        
        .card-features {
            margin-bottom: 25px;
        }
        
        .card-feature {
            display: flex;
            align-items: center;
            margin-bottom: 12px;
            font-size: 15px;
            color: #334155;
        }
        
        .card-feature i {
            color: #10b981;
            margin-right: 10px;
            font-size: 16px;
        }
        
        .plan-card.premium .card-feature i {
            color: #d97706;
        }
        
        .select-plan-btn {
            width: 100%;
            background: #e2e8f0;
            color: #1e293b;
            border: none;
            padding: 12px;
            border-radius: 10px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .select-plan-btn:hover {
            background: #cbd5e1;
        }
        
        .premium-btn {
            background: #fef3c7;
            color: #d97706;
        }
        
        .premium-btn:hover {
            background: #fde68a;
        }
        
        .upgrade-btn {
            margin-top: auto;
            background: linear-gradient(135deg, #4f46e5, #6366f1);
            color: white;
            border: none;
            padding: 16px;
            border-radius: 12px;
            font-size: 18px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 10px 25px rgba(79, 70, 229, 0.25);
            letter-spacing: 0.5px;
        }
        
        .upgrade-btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 15px 35px rgba(79, 70, 229, 0.35);
        }
        
        @media (max-width: 768px) {
            .plan-wrapper {
                flex-direction: column;
            }
            
            .plan-cards {
                flex-direction: column;
            }
        }
    `;
    
    document.head.appendChild(style);
    
    // Plan data
    const planData = {
        basic: {
            title: "Basic Plan",
            price: "Free",
            features: [
                { text: "JEE Main & Advanced papers", enabled: true },
                { text: "Basic performance analytics", enabled: true },
                { text: "Limited question bank", enabled: true },
                { text: "Advanced study planner", enabled: false },
                { text: "Personalized recommendations", enabled: false }
            ]
        },
        standard: {
            title: "Standard Plan",
            price: "₹499<span>/month</span>",
            features: [
                { text: "JEE Main & Advanced papers", enabled: true },
                { text: "Advanced performance analytics", enabled: true },
                { text: "Full question bank", enabled: true },
                { text: "Basic study planner", enabled: true },
                { text: "Personalized recommendations", enabled: false }
            ]
        },
        premium: {
            title: "Premium Plan",
            price: "₹999<span>/month</span>",
            features: [
                { text: "JEE Main & Advanced papers", enabled: true },
                { text: "Advanced performance analytics", enabled: true },
                { text: "Full question bank", enabled: true },
                { text: "Advanced study planner", enabled: true },
                { text: "Personalized recommendations", enabled: true }
            ]
        }
    };
    
    // Add click handlers for plan cards
    const planCards = document.querySelectorAll('.plan-card');
    const selectBtns = document.querySelectorAll('.select-plan-btn');
    const planTitle = document.getElementById('planTitle');
    const planPrice = document.getElementById('planPrice');
    const featuresList = document.getElementById('featuresList');
    const upgradeBtn = document.getElementById('upgradeBtn');
    
    // Function to update plan details
    function updatePlanDetails(plan) {
        const data = planData[plan];
        
        // Update plan details
        planTitle.textContent = data.title;
        planPrice.innerHTML = data.price;
        
        // Update features
        let featuresHTML = '';
        data.features.forEach(feature => {
            const className = feature.enabled ? 'feature-item' : 'feature-item disabled';
            const icon = feature.enabled ? 'check' : 'times';
            featuresHTML += `<div class="${className}"><i class="fas fa-${icon}"></i> ${feature.text}</div>`;
        });
        featuresList.innerHTML = featuresHTML;
        
        // Update upgrade button
        upgradeBtn.textContent = `Upgrade to ${plan.charAt(0).toUpperCase() + plan.slice(1)}`;
    }
    
    // Add click handlers for select buttons
    selectBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const planCard = this.closest('.plan-card');
            const plan = planCard.getAttribute('data-plan');
            
            // Visual feedback
            planCards.forEach(card => card.classList.remove('selected'));
            planCard.classList.add('selected');
            
            // Update plan details
            updatePlanDetails(plan);
        });
    });
    
    // Add click handlers for plan cards
    planCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Don't trigger if clicking on the button
            if (e.target.tagName === 'BUTTON') return;
            
            const plan = this.getAttribute('data-plan');
            
            // Visual feedback
            planCards.forEach(c => c.classList.remove('selected'));
            this.classList.add('selected');
            
            // Update plan details
            updatePlanDetails(plan);
        });
    });
    
    // Set upgrade button click handler
    upgradeBtn.addEventListener('click', function() {
        const selectedPlan = document.querySelector('.plan-card.selected');
        const plan = selectedPlan ? selectedPlan.getAttribute('data-plan') : 'standard';
        alert(`Upgrading to ${plan} plan!`);
    });
});