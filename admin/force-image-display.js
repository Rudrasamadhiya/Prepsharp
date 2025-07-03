// Force image display fix
(function() {
    // Apply fix immediately and also after DOM loads
    fixImageDisplay();
    document.addEventListener('DOMContentLoaded', fixImageDisplay);
    
    // Add fix to window object so it can be called from anywhere
    window.forceImageDisplay = fixImageDisplay;
    
    function fixImageDisplay() {
        // Force all image previews to be visible
        setTimeout(function() {
            // Fix for screenshot preview
            const screenshotPreview = document.getElementById('screenshot-preview');
            if (screenshotPreview) {
                screenshotPreview.style.display = 'block';
                screenshotPreview.style.maxWidth = '100%';
                screenshotPreview.style.height = 'auto';
                screenshotPreview.style.border = '2px solid #4f46e5';
            }
            
            // Fix for question image preview
            const questionPreviewImg = document.getElementById('question-image-preview-img');
            const questionPreviewContainer = document.getElementById('question-image-preview');
            if (questionPreviewImg && questionPreviewContainer) {
                questionPreviewContainer.style.display = 'block';
                questionPreviewImg.style.display = 'block';
            }
            
            // Fix for option image previews
            ['a', 'b', 'c', 'd'].forEach(letter => {
                const optionPreviewImg = document.getElementById(`option-${letter}-image-preview-img`);
                const optionPreviewContainer = document.getElementById(`option-${letter}-image-preview`);
                if (optionPreviewImg && optionPreviewContainer) {
                    optionPreviewContainer.style.display = 'block';
                    optionPreviewImg.style.display = 'block';
                }
            });
        }, 500);
    }
    
    // Override the useScreenshotForQuestion function
    const originalUseForQuestion = window.useScreenshotForQuestion;
    window.useScreenshotForQuestion = function(imageData) {
        if (originalUseForQuestion) {
            originalUseForQuestion(imageData);
        }
        
        // Force display the image
        const previewImg = document.getElementById('question-image-preview-img');
        const previewContainer = document.getElementById('question-image-preview');
        if (previewImg && previewContainer) {
            previewImg.src = imageData;
            previewContainer.style.display = 'block';
            previewImg.style.display = 'block';
        }
        
        // Call our fix
        fixImageDisplay();
    };
})();