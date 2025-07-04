// Direct fix to replace Select Area button with Snipping Tool functionality
document.addEventListener('DOMContentLoaded', function() {
    // Override the showPdfViewer function to modify the Select Area button
    const originalShowPdfViewer = window.showPdfViewer;
    
    if (typeof originalShowPdfViewer === 'function') {
        window.showPdfViewer = function() {
            // Call the original function first
            originalShowPdfViewer.apply(this, arguments);
            
            // Find the Select Area button that was just created
            setTimeout(function() {
                const selectAreaBtn = document.getElementById('select-area-btn');
                if (selectAreaBtn) {
                    // Replace its click handler
                    selectAreaBtn.removeEventListener('click', selectAreaBtn.onclick);
                    selectAreaBtn.onclick = function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        
                        // Try to open Snipping Tool
                        try {
                            const link = document.createElement('a');
                            link.href = "ms-screenclip:";
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                        } catch (e) {
                            console.error("Failed to open Snipping Tool:", e);
                            alert("Please press Win+Shift+S to open Snipping Tool");
                        }
                        
                        // Show paste instructions
                        const pasteInstructions = document.getElementById('paste-instructions');
                        const screenshotArea = document.getElementById('screenshot-area');
                        if (pasteInstructions && screenshotArea) {
                            pasteInstructions.textContent = 'Take a screenshot, then press Ctrl+V to paste';
                            screenshotArea.style.display = 'flex';
                        }
                        
                        return false;
                    };
                    
                    // Update button text
                    selectAreaBtn.innerHTML = '<i class="fas fa-cut"></i> Snipping Tool';
                }
            }, 100);
        };
    } else {
        // If the original function isn't available, create a direct observer
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                    for (let i = 0; i < mutation.addedNodes.length; i++) {
                        const node = mutation.addedNodes[i];
                        if (node.id === 'select-area-btn' || 
                            (node.tagName === 'BUTTON' && node.innerText && 
                             node.innerText.toLowerCase().includes('select area'))) {
                            
                            // Replace the button's click handler
                            node.onclick = function(e) {
                                e.preventDefault();
                                e.stopPropagation();
                                
                                // Try to open Snipping Tool
                                try {
                                    const link = document.createElement('a');
                                    link.href = "ms-screenclip:";
                                    document.body.appendChild(link);
                                    link.click();
                                    document.body.removeChild(link);
                                } catch (e) {
                                    console.error("Failed to open Snipping Tool:", e);
                                    alert("Please press Win+Shift+S to open Snipping Tool");
                                }
                                
                                // Show paste instructions
                                const pasteInstructions = document.getElementById('paste-instructions');
                                const screenshotArea = document.getElementById('screenshot-area');
                                if (pasteInstructions && screenshotArea) {
                                    pasteInstructions.textContent = 'Take a screenshot, then press Ctrl+V to paste';
                                    screenshotArea.style.display = 'flex';
                                }
                                
                                return false;
                            };
                            
                            // Update button text
                            node.innerHTML = '<i class="fas fa-cut"></i> Snipping Tool';
                        }
                    }
                }
            });
        });
        
        // Start observing the document
        observer.observe(document.body, { childList: true, subtree: true });
    }
    
    // Enable pasting screenshots directly
    document.addEventListener('paste', function(e) {
        const items = (e.clipboardData || e.originalEvent.clipboardData).items;
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                const blob = items[i].getAsFile();
                const reader = new FileReader();
                reader.onload = function(event) {
                    // Get the screenshot preview element
                    const screenshotPreview = document.getElementById('screenshot-preview');
                    const screenshotButtons = document.getElementById('screenshot-buttons');
                    
                    if (screenshotPreview && screenshotButtons) {
                        // Show the pasted image in the preview
                        screenshotPreview.src = event.target.result;
                        screenshotPreview.style.display = 'block';
                        screenshotButtons.style.display = 'block';
                        
                        // Hide paste instructions
                        const pasteInstructions = document.getElementById('paste-instructions');
                        if (pasteInstructions) {
                            pasteInstructions.style.display = 'none';
                        }
                    } else {
                        // Direct paste to question image if preview not available
                        const previewImg = document.getElementById('question-image-preview-img');
                        const previewContainer = document.getElementById('question-image-preview');
                        
                        if (previewImg && previewContainer) {
                            previewImg.src = event.target.result;
                            previewContainer.style.display = 'block';
                        }
                    }
                };
                reader.readAsDataURL(blob);
            }
        }
    });
});