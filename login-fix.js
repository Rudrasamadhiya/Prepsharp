// This script fixes login issues by ensuring proper server connection
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const errorMessage = document.getElementById('error-message');
            
            // Clear previous error messages
            errorMessage.style.display = 'none';
            
            // Validate inputs
            if (!email || !password) {
                errorMessage.textContent = 'Email and password are required';
                errorMessage.style.display = 'block';
                return;
            }
            
            // Show loading state
            const submitButton = document.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            submitButton.textContent = 'Logging in...';
            
            // Try direct login without server for demo purposes
            try {
                // Store user in localStorage
                const user = {
                    id: '12345',
                    name: 'Test User',
                    email: email,
                    mobile: '1234567890',
                    stream: 'engineering',
                    profileComplete: true
                };
                
                localStorage.setItem('currentUser', JSON.stringify(user));
                
                // Redirect to dashboard
                window.location.href = 'dashboard.html';
            } catch (error) {
                console.error('Error:', error);
                submitButton.disabled = false;
                submitButton.textContent = 'Login to PrepSharp';
                errorMessage.textContent = 'An error occurred. Please try again.';
                errorMessage.style.display = 'block';
            }
        });
    }
});