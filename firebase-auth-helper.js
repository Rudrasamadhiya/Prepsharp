// Firebase Auth Helper - Ensures consistent authentication domain
// Include this file after the main Firebase SDK in your HTML files

(function() {
  // Check if Firebase is loaded
  if (typeof firebase === 'undefined') {
    console.error('Firebase SDK not loaded. Please include Firebase SDK first.');
    return;
  }

  // Store the original signInWithRedirect method
  const originalSignInWithRedirect = firebase.auth.prototype.signInWithRedirect;
  
  // Override the signInWithRedirect method to always use custom domain
  firebase.auth.prototype.signInWithRedirect = function(provider) {
    // Set custom parameters for all providers
    if (provider && typeof provider.setCustomParameters === 'function') {
      provider.setCustomParameters({
        'auth_domain': 'prepsharp.in'
      });
    }
    
    // Call the original method
    return originalSignInWithRedirect.call(this, provider);
  };
  
  // Configure Firebase Auth globally
  firebase.auth().useDeviceLanguage();
  
  // Set persistence to local by default
  firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    .catch(error => {
      console.error('Error setting auth persistence:', error);
    });
    
  console.log('Firebase Auth Helper initialized with custom domain: prepsharp.in');
})();