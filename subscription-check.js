// Client-side subscription check
function checkUserSubscription() {
  // Get user data from local storage
  const userDataStr = localStorage.getItem('userData');
  if (!userDataStr) {
    return false;
  }
  
  const userData = JSON.parse(userDataStr);
  
  // Check if user has active subscription flag
  if (userData.hasActiveSubscription) {
    return true;
  }
  
  // If no active subscription, fetch from server
  fetch(`/api/subscription/status/${userData.id}`)
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        // Update local storage with subscription status
        userData.hasActiveSubscription = data.hasActiveSubscription;
        if (data.hasActiveSubscription && data.subscription) {
          userData.currentSubscription = data.subscription;
        } else {
          delete userData.currentSubscription;
        }
        
        // Save updated user data
        localStorage.setItem('userData', JSON.stringify(userData));
        
        // If no subscription, redirect to subscription page
        if (!data.hasActiveSubscription && !window.location.pathname.includes('subscription.html')) {
          showSubscriptionPrompt();
        }
      }
    })
    .catch(error => {
      console.error('Error checking subscription status:', error);
    });
  
  return userData.hasActiveSubscription || false;
}

// Show subscription prompt
function showSubscriptionPrompt() {
  // Create modal element
  const modal = document.createElement('div');
  modal.style.position = 'fixed';
  modal.style.top = '0';
  modal.style.left = '0';
  modal.style.width = '100%';
  modal.style.height = '100%';
  modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
  modal.style.display = 'flex';
  modal.style.alignItems = 'center';
  modal.style.justifyContent = 'center';
  modal.style.zIndex = '9999';
  
  // Create modal content
  const modalContent = document.createElement('div');
  modalContent.style.backgroundColor = 'white';
  modalContent.style.padding = '30px';
  modalContent.style.borderRadius = '8px';
  modalContent.style.maxWidth = '500px';
  modalContent.style.width = '90%';
  modalContent.style.textAlign = 'center';
  
  // Add content
  modalContent.innerHTML = `
    <h2 style="color: #1976d2; margin-top: 0;">Subscription Required</h2>
    <p style="font-size: 16px; margin-bottom: 20px;">
      You need an active subscription to access premium content.
    </p>
    <div style="display: flex; justify-content: center; gap: 10px;">
      <button id="subscribe-btn" style="background-color: #1976d2; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer;">
        View Plans
      </button>
      <button id="close-modal-btn" style="background-color: #f1f1f1; color: #333; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer;">
        Later
      </button>
    </div>
  `;
  
  // Append modal content to modal
  modal.appendChild(modalContent);
  
  // Append modal to body
  document.body.appendChild(modal);
  
  // Add event listeners
  document.getElementById('subscribe-btn').addEventListener('click', function() {
    window.location.href = 'subscription.html';
  });
  
  document.getElementById('close-modal-btn').addEventListener('click', function() {
    document.body.removeChild(modal);
  });
}

// Export functions
window.checkUserSubscription = checkUserSubscription;
window.showSubscriptionPrompt = showSubscriptionPrompt;