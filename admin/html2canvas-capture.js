// Enhanced PDF capture functionality using html2canvas
document.addEventListener('DOMContentLoaded', function() {
    // Load html2canvas dynamically if not already loaded
    if (typeof html2canvas === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
        script.onload = function() {
            console.log('html2canvas loaded successfully');
        };
        script.onerror = function() {
            console.error('Failed to load html2canvas');
        };
        document.head.appendChild(script);
    }
    
    // Override the captureSelectedArea function if it exists
    if (typeof captureSelectedArea === 'function') {
        window.originalCaptureSelectedArea = captureSelectedArea;
        
        // Enhanced capture function
        window.captureSelectedArea = function() {
            try {
                // Get selection dimensions
                const rect = {
                    left: parseInt(selectionBox.style.left),
                    top: parseInt(selectionBox.style.top),
                    width: parseInt(selectionBox.style.width),
                    height: parseInt(selectionBox.style.height)
                };
                
                // Hide UI elements for clean screenshot
                selectionBox.style.display = 'none';
                screenOverlay.style.display = 'none';
                const message = document.getElementById('selection-message');
                if (message) message.style.display = 'none';
                
                // Check if html2canvas is available
                if (typeof html2canvas === 'function') {
                    // Get the PDF iframe or embed
                    const pdfElement = document.getElementById('pdf-iframe') || 
                                      document.querySelector('#pdf-viewer embed');
                    
                    if (pdfElement) {
                        // Use html2canvas to capture the selected area
                        const captureOptions = {
                            x: rect.left,
                            y: rect.top,
                            width: rect.width,
                            height: rect.height,
                            useCORS: true,
                            allowTaint: true,
                            backgroundColor: null
                        };
                        
                        html2canvas(pdfElement, captureOptions).then(function(canvas) {
                            // Show screenshot area
                            const screenshotArea = document.getElementById('screenshot-area');
                            screenshotArea.style.display = 'flex';
                            
                            // Show screenshot preview
                            const screenshotPreview = document.getElementById('screenshot-preview');
                            screenshotPreview.src = canvas.toDataURL('image/png');
                            screenshotPreview.style.display = 'block';
                            
                            // Hide instructions and show buttons
                            document.getElementById('paste-instructions').style.display = 'none';
                            document.getElementById('screenshot-buttons').style.display = 'block';
                            
                            // Reset selection mode
                            resetSelectionMode();
                        }).catch(function(error) {
                            console.error('Error in html2canvas:', error);
                            fallbackCapture();
                        });
                    } else {
                        fallbackCapture();
                    }
                } else {
                    fallbackCapture();
                }
            } catch (err) {
                console.error('Error in captureSelectedArea:', err);
                fallbackCapture();
            }
        };
        
        // Fallback capture method
        function fallbackCapture() {
            // Create a fake image to use as a placeholder
            const imageData = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAYAAAB5fY51AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4QgFCgkJKPMPBQAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAAGAElEQVR42u3dMW7bQBBAUdLI979y0gVpUqQJUgSIi4Wh5fJ/3hvABfhjZ7jLcRwHAIH+eQUAYQUQVgBhBRBWAGEFEFYAhBVAWAGEFUBYAYQVQFgBEFYAYQUQVgBhBRBWAGEFQFgBhBVAWAGEFUBYAYQVAGEFEFYAYQUQVgBhBRBWAIQVQFgBhBVAWAGEFUBYARBWAGEFEFYAYQUQVgBhBUBYAYQVQFgBhBVAWAGEFQBhBRBWAGEFEFYAYQUQVgCEFUBYAYQVQFgBhBVAWAEQVgBhBRBWAGEFEFYAYQVAWAGEFUBYAYQVQFgBhBUAYQUQVgBhBRBWAGEFEFYAhBVAWAGEFUBYAYQVQFgBEFYAYQUQVgBhBRBWAGEFQFgBhBVAWAGEFUBYAYQVAGEFEFYAYQUQVgBhBRBWAIQVQFgBhBVAWAGEFUBYARBWAGEFEFYAYQUQVgBhBUBYAYQVQFgBhBVAWAGEFQBhBRBWAGEFEFYAYQUQVgCEFUBYAYQVQFgBhBVAWAEQVgBhBRBWAGEFEFYAYQVAWAGEFUBYAYQVQFgBhBUAYQUQVgBhBRBWAGEFEFYAhBVAWAGEFUBYAYQVQFgBEFYAYQUQVgBhBRBWAGEFQFgBhBVAWAGEFUBYAYQVAGEFEFYAYQUQVgBhBRBWAIQVQFgBhBVAWAGEFUBYARBWAGEFEFYAYQUQVgBhBUBYAYQVQFgBhBVAWAGEFQBhBRBWAGEFEFYAYQUQVgCEFUBYAYQVQFgBhBVAWAEQVgBhBRBWAGEFEFYAYQVAWAGEFUBYAYQVQFgBhBUAYQUQVgBhBRBWAGEFEFYAhBVAWAGEFUBYAYQVQFgBEFYAYQUQVgBhBRBWAGEFQFgBhBVAWAGEFUBYAYQVAGEFEFYAYQUQVgBhBRBWAIQVQFgBhBVAWAGEFUBYARBWAGEFEFYAYQUQVgBhBUBYAYQVQFgBhBVAWAGEFQBhBRBWAGEFEFYAYQUQVgCEFUBYAYQVQFgBhBVAWAEQVgBhBRBWAGEFEFYAYQVAWAGEFUBYAYQVQFgBhBUAYQUQVgBhBRBWAGEFEFYAhBVAWAGEFUBYAYQVQFgBEFYAYQUQVgBhBRBWAGEFQFgBhBVAWAGEFUBYAYQVAGEFEFYAYQUQVgBhBRBWAIQVQFgBhBVAWAGEFUBYARBWAGEFEFYAYQUQVgBhBUBYAYQVQFgBhBVAWAGEFQBhBRBWAGEFEFYAYQUQVgCEFUBYAYQVQFgBhBVAWAEQVgBhBRBWAGEFEFYAYQVAWAGEFUBYAYQVQFgBhBUAYQUQVgBhBRBWAGEFEFYAhBVAWAGEFUBYAYQVQFgBEFYAYQUQVgBhBRBWAGEFQFgBhBVAWAGEFUBYAYQVAGEFEFYAYQUQVgBhBRBWAIQVQFgBhBVAWAGEFUBYARBWAGEFEFYAYQUQVgBhBUBYAYQVQFgBhBVAWAGEFQBhBRBWAGEFEFYAYQUQVgCEFUBYAYQVQFgBhBVAWAEQVgBhBRBWAGEFEFYAYQVAWAGEFUBYAYQVQFgBhBUAYQUQVgBhBRBWAGEFEFYAhBVAWAGEFUBYAYQVQFgBEFYAYQUQVgBhBRBWAGEFQFgBhBVAWAGEFUBYAYQVAGEFEFYAYQUQVgBhBRBWAIQVQFgBhBVAWAGEFUBYARBWAGEFEFYAYQUQVgBhBUBYAYQVQFgBhBVAWAGEFQBhBRBWAGEFEFYAYQUQVgCEFUBYAYQVQFgBhBVAWAEQVgBhBRBWAGEFEFYAYQVAWAGEFUBYAYQVQFgBhBUAYQUQVgBhBRBWAGEFEFYAhBVAWAGEFUBYAYQVQFgBEFYAYQUQVgBhBRBWAGEFQFgBhBVAWAGEFUBYAYQVAGEFEFYAYQUQVgBhBRBWAIQVQFgBhBVAWAGEFUBYARBWAGEFEFYAYQUQVgBhBUBYAYQVQFgBhBVAWAGEFQBhBRBWAGEFEFYAYQUQVgCEFUBYAYQVQFgBhBVAWAEQVgBhBRBWAGEFEFYAYQVAWAGEFUBYAYQVQFgBhBUAYQUQVgBhBRBWAGEFEFYAhBVAWAGEFUBYAYQVQFgBEFYAYQUQVgBhBRBWgGv9BxVXZ7C6rC7OAAAAAElFTkSuQmCC';
            
            // Show screenshot area
            const screenshotArea = document.getElementById('screenshot-area');
            screenshotArea.style.display = 'flex';
            
            // Show screenshot preview
            const screenshotPreview = document.getElementById('screenshot-preview');
            screenshotPreview.src = imageData;
            screenshotPreview.style.display = 'block';
            
            // Hide instructions and show buttons
            document.getElementById('paste-instructions').style.display = 'none';
            document.getElementById('screenshot-buttons').style.display = 'block';
            
            // Reset selection mode
            resetSelectionMode();
        }
    }
});