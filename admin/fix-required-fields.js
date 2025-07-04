// Fix required fields issue and remove bottom paste button
document.addEventListener('DOMContentLoaded', function() {
    // Fix for "Use for Question" button to bypass required field validation
    const useForQuestionBtn = document.getElementById('use-for-question-btn');
    if (useForQuestionBtn) {
        useForQuestionBtn.onclick = function() {
            const screenshotPreview = document.getElementById('screenshot-preview');
            if (screenshotPreview && screenshotPreview.src) {
                // Set the image to question preview
                const previewImg = document.getElementById('question-image-preview-img');
                const previewContainer = document.getElementById('question-image-preview');
                
                if (previewImg && previewContainer) {
                    previewImg.src = screenshotPreview.src;
                    previewContainer.style.display = 'block';
                    previewImg.style.display = 'block';
                }
                
                // Close the PDF viewer
                const pdfContainer = document.getElementById('pdf-container');
                if (pdfContainer) {
                    pdfContainer.style.display = 'none';
                }
                
                // Set default values for required fields if they're empty
                const requiredFields = [
                    'question-subject',
                    'question-chapter',
                    'question-difficulty'
                ];
                
                requiredFields.forEach(fieldId => {
                    const field = document.getElementById(fieldId);
                    if (field && !field.value) {
                        // Set default values
                        if (fieldId === 'question-subject') field.value = 'Physics';
                        if (fieldId === 'question-chapter') field.value = 'Mechanics';
                        if (fieldId === 'question-difficulty') field.value = 'Medium';
                    }
                });
            }
        };
    }
    
    // Remove the bottom paste button from PDF area
    const removeBottomPasteButton = function() {
        const screenshotPasteBtn = document.getElementById('screenshot-paste-btn');
        if (screenshotPasteBtn) {
            screenshotPasteBtn.remove();
        }
    };
    
    // Call immediately and also set a timeout to ensure it runs after other scripts
    removeBottomPasteButton();
    setTimeout(removeBottomPasteButton, 500);
});