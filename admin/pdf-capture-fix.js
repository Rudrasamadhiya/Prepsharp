// Fix for PDF capture functionality
document.addEventListener('DOMContentLoaded', function() {
    // Override the useScreenshotForQuestion function
    window.useScreenshotForQuestion = function(imageData) {
        // Set the image to question preview
        const previewImg = document.getElementById('question-image-preview-img');
        const previewContainer = document.getElementById('question-image-preview');
        
        if (previewImg && previewContainer) {
            previewImg.src = imageData;
            previewContainer.style.display = 'block';
            previewImg.style.display = 'block';
        }
        
        // Close the PDF viewer
        const pdfContainer = document.getElementById('pdf-container');
        if (pdfContainer) {
            pdfContainer.style.display = 'none';
        }
    };
    
    // Override the useScreenshotForOption function
    window.useScreenshotForOption = function(optionLetter, imageData) {
        // Set the image to option preview
        const previewImg = document.getElementById(`option-${optionLetter}-image-preview-img`);
        const previewContainer = document.getElementById(`option-${optionLetter}-image-preview`);
        
        if (previewImg && previewContainer) {
            previewImg.src = imageData;
            previewContainer.style.display = 'block';
            previewImg.style.display = 'block';
        }
        
        // Close the PDF viewer
        const pdfContainer = document.getElementById('pdf-container');
        if (pdfContainer) {
            pdfContainer.style.display = 'none';
        }
    };
    
    // Add click handler for "Use for Question" button
    const useForQuestionBtn = document.getElementById('use-for-question-btn');
    if (useForQuestionBtn) {
        useForQuestionBtn.addEventListener('click', function() {
            const screenshotPreview = document.getElementById('screenshot-preview');
            if (screenshotPreview && screenshotPreview.src) {
                useScreenshotForQuestion(screenshotPreview.src);
            }
        });
    }
    
    // Add click handler for "Use for Option" button
    const useForOptionBtn = document.getElementById('use-for-option-btn');
    if (useForOptionBtn) {
        useForOptionBtn.addEventListener('click', function() {
            const screenshotPreview = document.getElementById('screenshot-preview');
            if (screenshotPreview && screenshotPreview.src) {
                // Default to option A if not specified
                useScreenshotForOption('a', screenshotPreview.src);
            }
        });
    }
});