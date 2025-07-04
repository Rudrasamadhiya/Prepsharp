// Add a paste button to make it easier to paste screenshots
document.addEventListener('DOMContentLoaded', function() {
    // Add a paste button next to the Snipping Tool button
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                for (let i = 0; i < mutation.addedNodes.length; i++) {
                    const node = mutation.addedNodes[i];
                    // Check if this is the Snipping Tool button (previously Select Area)
                    if (node.id === 'select-area-btn' || 
                        (node.tagName === 'BUTTON' && node.innerText && 
                         (node.innerText.toLowerCase().includes('select area') || 
                          node.innerText.toLowerCase().includes('snipping tool')))) {
                        
                        // Create paste button if it doesn't exist yet
                        if (!document.getElementById('paste-button')) {
                            const pasteBtn = document.createElement('button');
                            pasteBtn.id = 'paste-button';
                            pasteBtn.className = 'btn btn-info';
                            pasteBtn.innerHTML = '<i class="fas fa-paste"></i> Paste';
                            pasteBtn.style.position = 'absolute';
                            pasteBtn.style.top = '10px';
                            pasteBtn.style.left = (node.offsetLeft + node.offsetWidth + 10) + 'px';
                            pasteBtn.style.zIndex = '1001';
                            
                            // Add click handler to trigger paste
                            pasteBtn.onclick = function() {
                                // Create a paste event
                                navigator.clipboard.read().then(clipboardItems => {
                                    for (const clipboardItem of clipboardItems) {
                                        for (const type of clipboardItem.types) {
                                            if (type.startsWith('image/')) {
                                                clipboardItem.getType(type).then(blob => {
                                                    const reader = new FileReader();
                                                    reader.onload = function(e) {
                                                        // Get the screenshot preview element
                                                        const screenshotPreview = document.getElementById('screenshot-preview');
                                                        const screenshotButtons = document.getElementById('screenshot-buttons');
                                                        
                                                        if (screenshotPreview && screenshotButtons) {
                                                            // Show the pasted image in the preview
                                                            screenshotPreview.src = e.target.result;
                                                            screenshotPreview.style.display = 'block';
                                                            screenshotButtons.style.display = 'block';
                                                            
                                                            // Hide paste instructions
                                                            const pasteInstructions = document.getElementById('paste-instructions');
                                                            if (pasteInstructions) {
                                                                pasteInstructions.style.display = 'none';
                                                            }
                                                        }
                                                    };
                                                    reader.readAsDataURL(blob);
                                                });
                                                return;
                                            }
                                        }
                                    }
                                    alert("No image found in clipboard. Take a screenshot first.");
                                }).catch(err => {
                                    console.error("Failed to read clipboard:", err);
                                    alert("Please press Ctrl+V to paste your screenshot");
                                });
                            };
                            
                            // Add to container
                            node.parentNode.appendChild(pasteBtn);
                        }
                    }
                }
            }
        });
    });
    
    // Start observing the document
    observer.observe(document.body, { childList: true, subtree: true });
    
    // Add a paste button to the screenshot area as well
    const screenshotArea = document.getElementById('screenshot-area');
    if (screenshotArea) {
        const pasteBtn = document.createElement('button');
        pasteBtn.id = 'screenshot-paste-btn';
        pasteBtn.className = 'btn btn-info mt-2';
        pasteBtn.innerHTML = '<i class="fas fa-paste"></i> Paste Screenshot';
        
        // Add click handler
        pasteBtn.onclick = function() {
            // Trigger paste event
            document.execCommand('paste');
        };
        
        // Insert before the screenshot buttons
        const screenshotButtons = document.getElementById('screenshot-buttons');
        if (screenshotButtons) {
            screenshotArea.insertBefore(pasteBtn, screenshotButtons);
        } else {
            screenshotArea.appendChild(pasteBtn);
        }
    }
});