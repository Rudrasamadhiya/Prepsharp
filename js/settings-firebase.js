// Settings Firebase Integration - Fixed Version
document.addEventListener('DOMContentLoaded', function() {
    // Get logged in user data
    const loggedInUser = localStorage.getItem('loggedInUser') || sessionStorage.getItem('loggedInUser');
    
    if (loggedInUser) {
        const userData = JSON.parse(loggedInUser);
        
        // Load user profile data
        loadUserProfile(userData);
        
        // Lock email field
        const emailField = document.getElementById('email');
        if (emailField) {
            emailField.readOnly = true;
            emailField.style.backgroundColor = '#f1f5f9';
            emailField.style.cursor = 'not-allowed';
        }
    }
});

// Load user profile data
function loadUserProfile(userData) {
    // Set user name in header
    const userNameElement = document.getElementById('loggedInUserName');
    if (userNameElement) {
        const fullName = `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || userData.name || userData.email.split('@')[0];
        userNameElement.textContent = fullName;
    }
    
    // Set user initials in header
    const userInitialsElement = document.getElementById('userInitials');
    if (userInitialsElement) {
        const fullName = `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || userData.name || userData.email.split('@')[0];
        const initials = getInitials(fullName);
        userInitialsElement.textContent = initials;
    }
    
    // Set profile initials
    const profileInitials = document.getElementById('profileInitials');
    if (profileInitials) {
        const fullName = `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || userData.name || userData.email.split('@')[0];
        const initials = getInitials(fullName);
        profileInitials.textContent = initials;
    }
    
    // Set form values
    document.getElementById('fullName').value = `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || userData.name || userData.email.split('@')[0];
    document.getElementById('email').value = userData.email || '';
    
    // Set phone number
    const phoneField = document.getElementById('phone');
    if (phoneField) {
        if (!userData.phone || userData.phone === '+91 9876543210') {
            phoneField.value = '-----------';
        } else {
            phoneField.value = userData.phone;
            
            // Lock phone field if it's a real number (not dashes)
            if (userData.phone !== '-----------') {
                phoneField.readOnly = true;
                phoneField.style.backgroundColor = '#f1f5f9';
                phoneField.style.cursor = 'not-allowed';
            }
        }
    }
    
    document.getElementById('school').value = userData.school || '';
    
    // Set exam year if available
    const examYearSelect = document.getElementById('examYear');
    if (examYearSelect) {
        // Default to 2026 if the value is not 2026 or 2027
        if (userData.examYear !== '2026' && userData.examYear !== '2027') {
            examYearSelect.value = '2026';
        } else {
            examYearSelect.value = userData.examYear;
        }
    }
    
    // Set profile photo if available
    if (userData.photoURL) {
        const avatarPreview = document.querySelector('.avatar-preview');
        if (avatarPreview) {
            avatarPreview.innerHTML = `<img src="${userData.photoURL}" alt="Profile Photo">`;
        }
    }
    
    // Setup form handlers
    setupFormHandlers();
    
    // Setup photo handlers
    setupPhotoHandlers();
}

// Setup form submission handlers
function setupFormHandlers() {
    // Profile form
    const profileForm = document.querySelector('#profile form');
    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const fullName = document.getElementById('fullName').value;
            const nameParts = fullName.split(' ');
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || '';
            
            const phone = document.getElementById('phone').value;
            const school = document.getElementById('school').value;
            const examYear = document.getElementById('examYear').value;
            
            // Show loading state
            const submitBtn = profileForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Saving...';
            submitBtn.disabled = true;
            
            // Update localStorage/sessionStorage
            const storage = localStorage.getItem('loggedInUser') ? localStorage : sessionStorage;
            const userData = JSON.parse(storage.getItem('loggedInUser'));
            
            userData.firstName = firstName;
            userData.lastName = lastName;
            
            // Only update phone if it's not already set and not dashes
            if (phone !== '-----------' && (!userData.phone || userData.phone === '-----------' || userData.phone === '+91 9876543210')) {
                userData.phone = phone;
            }
            
            userData.school = school;
            userData.examYear = examYear;
            
            // Save to localStorage/sessionStorage
            storage.setItem('loggedInUser', JSON.stringify(userData));
            
            // Update UI
            const userNameElement = document.getElementById('loggedInUserName');
            if (userNameElement) {
                userNameElement.textContent = fullName;
            }
            
            // Update initials
            const initials = getInitials(fullName);
            const userInitialsElement = document.getElementById('userInitials');
            if (userInitialsElement && !userInitialsElement.querySelector('img')) {
                userInitialsElement.textContent = initials;
            }
            
            const profileInitials = document.getElementById('profileInitials');
            if (profileInitials && !document.querySelector('.avatar-preview img')) {
                profileInitials.textContent = initials;
            }
            
            // Lock phone field if it was just set with a valid number
            if (phone !== '-----------' && (!userData.phone || userData.phone === '-----------' || userData.phone === '+91 9876543210')) {
                const phoneField = document.getElementById('phone');
                if (phoneField) {
                    phoneField.readOnly = true;
                    phoneField.style.backgroundColor = '#f1f5f9';
                    phoneField.style.cursor = 'not-allowed';
                }
            }
            
            // Reset button state after a short delay
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                
                // Show success message
                showToast('Profile updated successfully!');
            }, 500);
        });
    }
}

// Setup photo change handlers
function setupPhotoHandlers() {
    const changePhotoBtn = document.querySelector('.avatar-upload button:first-child');
    const removePhotoBtn = document.querySelector('.avatar-upload button:last-child');
    
    if (changePhotoBtn) {
        changePhotoBtn.addEventListener('click', function() {
            // Create a file input element
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'image/*';
            fileInput.style.display = 'none';
            document.body.appendChild(fileInput);
            
            // Trigger file selection
            fileInput.click();
            
            // Handle file selection
            fileInput.addEventListener('change', function() {
                if (fileInput.files && fileInput.files[0]) {
                    const file = fileInput.files[0];
                    
                    // Read file as data URL
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        const photoURL = e.target.result;
                        
                        // Update avatar preview
                        const avatarPreview = document.querySelector('.avatar-preview');
                        if (avatarPreview) {
                            avatarPreview.innerHTML = `<img src="${photoURL}" alt="Profile Photo">`;
                        }
                        
                        // Update header avatar
                        const userInitialsElement = document.getElementById('userInitials');
                        if (userInitialsElement) {
                            userInitialsElement.innerHTML = `<img src="${photoURL}" alt="Profile" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`;
                        }
                        
                        // Update localStorage/sessionStorage
                        const storage = localStorage.getItem('loggedInUser') ? localStorage : sessionStorage;
                        const userData = JSON.parse(storage.getItem('loggedInUser'));
                        userData.photoURL = photoURL;
                        storage.setItem('loggedInUser', JSON.stringify(userData));
                        
                        showToast('Profile photo updated!');
                    };
                    reader.readAsDataURL(file);
                }
                
                // Remove the file input
                document.body.removeChild(fileInput);
            });
        });
    }
    
    if (removePhotoBtn) {
        removePhotoBtn.addEventListener('click', function() {
            // Get user name from form
            const fullName = document.getElementById('fullName').value;
            const initials = getInitials(fullName);
            
            // Update avatar preview
            const avatarPreview = document.querySelector('.avatar-preview');
            if (avatarPreview) {
                avatarPreview.innerHTML = `<div class="avatar-initials" id="profileInitials" style="width: 100%; height: 100%; font-size: 36px;">${initials}</div>`;
            }
            
            // Update header avatar
            const userInitialsElement = document.getElementById('userInitials');
            if (userInitialsElement) {
                userInitialsElement.textContent = initials;
            }
            
            // Update localStorage/sessionStorage
            const storage = localStorage.getItem('loggedInUser') ? localStorage : sessionStorage;
            const userData = JSON.parse(storage.getItem('loggedInUser'));
            delete userData.photoURL;
            storage.setItem('loggedInUser', JSON.stringify(userData));
            
            showToast('Profile photo removed!');
        });
    }
}

// Get initials from name
function getInitials(name) {
    return name
        .split(' ')
        .map(part => part.charAt(0))
        .join('')
        .toUpperCase()
        .substring(0, 2) || 'U';
}

// Show toast message
function showToast(message) {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'settings-toast';
    toast.textContent = message;
    
    // Add toast styles
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.right = '20px';
    toast.style.backgroundColor = '#4f46e5';
    toast.style.color = 'white';
    toast.style.padding = '12px 20px';
    toast.style.borderRadius = '8px';
    toast.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.2)';
    toast.style.zIndex = '9999';
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
    toast.style.transition = 'all 0.3s ease';
    
    // Add to document
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(-20px)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}