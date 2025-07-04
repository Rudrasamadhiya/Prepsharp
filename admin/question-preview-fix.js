// Fix specifically for question image preview
document.addEventListener('DOMContentLoaded', function() {
    // Fix for pasting directly to question preview
    document.addEventListener('paste', function(e) {
        const items = (e.clipboardData || e.originalEvent.clipboardData).items;
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                const blob = items[i].getAsFile();
                const reader = new FileReader();
                reader.onload = function(event) {
                    // Always set to question preview regardless of context
                    const previewImg = document.getElementById('question-image-preview-img');
                    const previewContainer = document.getElementById('question-image-preview');
                    
                    if (previewImg && previewContainer) {
                        previewImg.src = event.target.result;
                        previewContainer.style.display = 'block';
                        previewImg.style.display = 'block';
                        
                        // Force image to be visible
                        setTimeout(function() {
                            previewImg.style.display = 'block';
                            previewContainer.style.display = 'block';
                            previewImg.style.maxWidth = '100%';
                            previewImg.style.height = 'auto';
                        }, 100);
                    }
                };
                reader.readAsDataURL(blob);
                break;
            }
        }
    });
    
    // Override the useScreenshotForQuestion function
    window.useScreenshotForQuestion = function(imageData) {
        const previewImg = document.getElementById('question-image-preview-img');
        const previewContainer = document.getElementById('question-image-preview');
        
        if (previewImg && previewContainer) {
            previewImg.src = imageData;
            previewContainer.style.display = 'block';
            previewImg.style.display = 'block';
        }
        
        // Close the PDF viewer if it's open
        const pdfContainer = document.getElementById('pdf-container');
        if (pdfContainer) {
            pdfContainer.style.display = 'none';
        }
    };
    
    // Add a direct paste button for question
    const questionImageInput = document.getElementById('question-image');
    if (questionImageInput && questionImageInput.parentElement) {
        const pasteBtn = document.createElement('button');
        pasteBtn.type = 'button';
        pasteBtn.className = 'btn btn-info ms-2';
        pasteBtn.innerHTML = '<i class="fas fa-paste"></i> Paste';
        
        // Add click handler
        pasteBtn.onclick = function() {
            // Alert user to paste
            alert('Press Ctrl+V to paste an image from clipboard');
            
            // Focus on the document to receive paste event
            document.body.focus();
        };
        
        // Add button next to the file input
        questionImageInput.parentElement.appendChild(pasteBtn);
    }
    
    // Fix for "Use for Question" button in screenshot area
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
            }
        };
    }
});