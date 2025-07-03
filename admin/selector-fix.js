// Fix for browsers that don't support :has() selector
document.addEventListener('DOMContentLoaded', function() {
    // Helper function to hide question image elements
    window.hideQuestionImageElements = function() {
        // Hide the label
        const label = document.querySelector('label[for="question-image"]');
        if (label) label.style.display = 'none';
        
        // Find and hide the file input container
        const fileInput = document.getElementById('question-image');
        if (fileInput && fileInput.parentElement) {
            let parent = fileInput.parentElement;
            if (parent.classList.contains('d-flex')) {
                parent.style.display = 'none';
            }
        }
    };
    
    // Helper function to hide option image elements
    window.hideOptionImageElements = function(optionId) {
        // Hide the label
        const label = document.querySelector(`label[for="option-${optionId}-image"]`);
        if (label) label.style.display = 'none';
        
        // Find and hide the file input container
        const fileInput = document.getElementById(`option-${optionId}-image`);
        if (fileInput && fileInput.parentElement) {
            let parent = fileInput.parentElement;
            if (parent.classList.contains('d-flex')) {
                parent.style.display = 'none';
            }
        }
    };
});