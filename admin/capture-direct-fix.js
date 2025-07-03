// Direct fix for image capture
document.addEventListener('DOMContentLoaded', function() {
    // Add click handler for screenshot buttons
    const useForQuestionBtn = document.getElementById('use-for-question-btn');
    if (useForQuestionBtn) {
        useForQuestionBtn.onclick = function() {
            const screenshotImg = document.getElementById('screenshot-preview');
            if (screenshotImg && screenshotImg.src) {
                // Directly set the image source
                const questionImg = document.getElementById('question-image-preview-img');
                const questionContainer = document.getElementById('question-image-preview');
                
                if (questionImg && questionContainer) {
                    questionImg.src = screenshotImg.src;
                    questionContainer.style.display = 'block';
                    
                    // Close PDF viewer
                    const pdfContainer = document.getElementById('pdf-container');
                    if (pdfContainer) {
                        pdfContainer.style.display = 'none';
                    }
                }
            }
        };
    }
    
    // Fix for html2canvas capture
    const originalHtml2canvas = window.html2canvas;
    if (originalHtml2canvas) {
        window.html2canvas = function(element, options) {
            return originalHtml2canvas(element, options).then(function(canvas) {
                // Log the canvas data to verify it's working
                console.log("Canvas captured successfully");
                return canvas;
            });
        };
    }
    
    // Override the captureSelectedArea function
    if (typeof captureSelectedArea === 'function') {
        const originalCapture = window.captureSelectedArea;
        window.captureSelectedArea = function() {
            try {
                // Get the PDF viewer element
                const pdfViewer = document.getElementById('pdf-viewer');
                if (!pdfViewer) {
                    console.error("PDF viewer not found");
                    return originalCapture();
                }
                
                // Use html2canvas directly
                html2canvas(pdfViewer).then(function(canvas) {
                    // Show screenshot area
                    const screenshotArea = document.getElementById('screenshot-area');
                    screenshotArea.style.display = 'flex';
                    
                    // Show screenshot preview with the canvas data
                    const screenshotPreview = document.getElementById('screenshot-preview');
                    screenshotPreview.src = canvas.toDataURL('image/png');
                    screenshotPreview.style.display = 'block';
                    
                    // Hide instructions and show buttons
                    document.getElementById('paste-instructions').style.display = 'none';
                    document.getElementById('screenshot-buttons').style.display = 'block';
                }).catch(function(error) {
                    console.error("html2canvas error:", error);
                    originalCapture();
                });
            } catch (error) {
                console.error("Capture error:", error);
                originalCapture();
            }
        };
    }
});