// Fix for save button getting stuck
document.addEventListener('DOMContentLoaded', function() {
    // Add a direct save button that bypasses image uploads
    const saveBtn = document.getElementById('save-question-btn');
    if (saveBtn) {
        // Create a backup save button
        const directSaveBtn = document.createElement('button');
        directSaveBtn.type = 'button';
        directSaveBtn.className = 'btn btn-warning ms-2';
        directSaveBtn.innerHTML = '<i class="fas fa-bolt me-2"></i> Direct Save';
        directSaveBtn.style.display = 'none'; // Hide initially
        
        // Add click handler that calls the original saveQuestion directly
        directSaveBtn.onclick = function() {
            if (typeof window.originalSaveQuestion === 'function') {
                // Get exam ID from URL
                const urlParams = new URLSearchParams(window.location.search);
                const examId = urlParams.get('examId') || 'default-exam';
                
                // Call original save function directly
                window.originalSaveQuestion(examId);
            } else {
                alert('Original save function not available. Please refresh the page.');
            }
        };
        
        // Insert after the save button
        saveBtn.parentNode.insertBefore(directSaveBtn, saveBtn.nextSibling);
        
        // Show direct save button if save button is disabled for too long
        saveBtn.addEventListener('click', function() {
            if (this.disabled) return;
            
            // If save button gets disabled, start a timer
            const checkInterval = setInterval(function() {
                if (saveBtn.disabled) {
                    // After 5 seconds, show the direct save button
                    setTimeout(function() {
                        if (saveBtn.disabled) {
                            directSaveBtn.style.display = 'inline-block';
                        }
                    }, 5000);
                } else {
                    // If save button is re-enabled, hide direct save and clear interval
                    directSaveBtn.style.display = 'none';
                    clearInterval(checkInterval);
                }
            }, 1000);
        });
    }
    
    // Store original saveQuestion function when it's overridden
    if (typeof saveQuestion === 'function' && !window.originalSaveQuestion) {
        window.originalSaveQuestion = saveQuestion;
    }
    
    // Add global error handler for unhandled promise rejections
    window.addEventListener('unhandledrejection', function(event) {
        console.error('Unhandled promise rejection:', event.reason);
        
        // Re-enable save button if it's stuck
        const saveBtn = document.getElementById('save-question-btn');
        if (saveBtn && saveBtn.disabled) {
            saveBtn.disabled = false;
            saveBtn.innerHTML = '<i class="fas fa-save me-2"></i> Save Question';
            alert('An error occurred during save. Please try again or use Direct Save button.');
        }
    });
});