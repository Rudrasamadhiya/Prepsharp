// Quick fix for image display issues
document.addEventListener('DOMContentLoaded', function() {
    // Fix for "Use for Question" button
    const useForQuestionBtn = document.getElementById('use-for-question-btn');
    if (useForQuestionBtn) {
        useForQuestionBtn.addEventListener('click', function() {
            const screenshotPreview = document.getElementById('screenshot-preview');
            if (screenshotPreview && screenshotPreview.src) {
                // Set the image to question preview
                const previewImg = document.getElementById('question-image-preview-img');
                const previewContainer = document.getElementById('question-image-preview');
                
                if (previewImg && previewContainer) {
                    previewImg.src = screenshotPreview.src;
                    previewContainer.style.display = 'block';
                }
            }
        });
    }
});