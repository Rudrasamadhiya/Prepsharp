// Variables for capture functionality
let currentCaptureTarget = null;
let currentOptionTarget = null;
let isSelecting = false;
let startX, startY;
let selectionBox = null;
let screenOverlay = null;

// PDF upload button
// Add a style to disable pointer events during selection
const style = document.createElement('style');
style.textContent = `
    body.selecting iframe {
        pointer-events: none !important;
    }
    body.selecting #pdf-viewer {
        pointer-events: none !important;
    }
`;
document.head.appendChild(style);

document.addEventListener('DOMContentLoaded', function() {
    // Create selection box element
    selectionBox = document.createElement('div');
    selectionBox.id = 'selection-box';
    selectionBox.style.position = 'fixed';
    selectionBox.style.border = '2px dashed #4f46e5';
    selectionBox.style.backgroundColor = 'transparent';
    selectionBox.style.display = 'none';
    selectionBox.style.pointerEvents = 'none';
    selectionBox.style.zIndex = '2500';
    document.body.appendChild(selectionBox);
    
    // Create screen overlay for snipping tool effect
    screenOverlay = document.createElement('div');
    screenOverlay.id = 'screen-overlay';
    screenOverlay.style.position = 'fixed';
    screenOverlay.style.top = '0';
    screenOverlay.style.left = '0';
    screenOverlay.style.width = '100vw';
    screenOverlay.style.height = '100vh';
    screenOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    screenOverlay.style.display = 'none';
    screenOverlay.style.zIndex = '2200';
    // Allow pointer events so we can interact with it
    screenOverlay.style.pointerEvents = 'auto';
    document.body.appendChild(screenOverlay);
    
    // Add event listeners to the overlay for selection
    screenOverlay.addEventListener('mousedown', handleMouseDown);
    screenOverlay.addEventListener('mousemove', handleMouseMove);
    screenOverlay.addEventListener('mouseup', handleMouseUp);

    // PDF upload button
    document.getElementById('pdf-btn').addEventListener('click', function() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/pdf';
        
        input.onchange = function(e) {
            if (e.target.files.length > 0) {
                const file = e.target.files[0];
                const url = URL.createObjectURL(file);
                
                // Store PDF URL in a global variable for later use
                window.pdfUrl = url;
                
                // Change button text to indicate PDF is uploaded
                const pdfBtn = document.getElementById('pdf-btn');
                pdfBtn.innerHTML = '<i class="fas fa-check me-1"></i> PDF Uploaded';
                pdfBtn.classList.remove('btn-success');
                pdfBtn.classList.add('btn-secondary');
                pdfBtn.disabled = true;
            }
        };
        
        input.click();
    });
    
    // Close PDF button
    document.getElementById('close-pdf-btn').addEventListener('click', function() {
        document.getElementById('pdf-container').style.display = 'none';
        resetSelectionMode();
    });
    
    // Capture buttons
    document.getElementById('capture-question-btn').addEventListener('click', function() {
        currentCaptureTarget = 'question';
        
        if (window.pdfUrl) {
            // Show PDF container
            const pdfContainer = document.getElementById('pdf-container');
            pdfContainer.style.display = 'flex';
            
            // Create iframe for PDF if it doesn't exist
            let pdfIframe = document.getElementById('pdf-iframe');
            if (!pdfIframe) {
                const pdfViewer = document.getElementById('pdf-viewer');
                pdfViewer.innerHTML = '';
                
                pdfIframe = document.createElement('iframe');
                pdfIframe.src = window.pdfUrl;
                pdfIframe.style.width = '100%';
                pdfIframe.style.height = '100%';
                pdfIframe.style.border = 'none';
                // Don't disable pointer events by default to allow scrolling
                pdfIframe.id = 'pdf-iframe';
                pdfViewer.appendChild(pdfIframe);
            }
            
            // Add select area button
            addSelectAreaButton();
        } else {
            // PDF is not uploaded, show alert
            alert('Please upload a PDF first by clicking the "Upload PDF" button.');
        }
    });
    
    // Option capture buttons
    document.querySelectorAll('.option-capture-btn').forEach(button => {
        button.addEventListener('click', function() {
            currentCaptureTarget = 'option';
            currentOptionTarget = this.getAttribute('data-option');
            
            if (window.pdfUrl) {
                // Show PDF container
                const pdfContainer = document.getElementById('pdf-container');
                pdfContainer.style.display = 'flex';
                
                // Create iframe for PDF if it doesn't exist
                let pdfIframe = document.getElementById('pdf-iframe');
                if (!pdfIframe) {
                    const pdfViewer = document.getElementById('pdf-viewer');
                    pdfViewer.innerHTML = '';
                    
                    pdfIframe = document.createElement('iframe');
                    pdfIframe.src = window.pdfUrl;
                    pdfIframe.style.width = '100%';
                    pdfIframe.style.height = '100%';
                    pdfIframe.style.border = 'none';
                    pdfIframe.id = 'pdf-iframe';
                    pdfViewer.appendChild(pdfIframe);
                }
                
                // Add select area button
                addSelectAreaButton();
            } else {
                // PDF is not uploaded, show alert
                alert('Please upload a PDF first by clicking the "Upload PDF" button.');
            }
        });
    });
    
    // Function to add select area button
    function addSelectAreaButton() {
        // Remove existing button if any
        const existingBtn = document.getElementById('select-area-btn');
        if (existingBtn) {
            existingBtn.remove();
        }
        
        // Add new button
        const pdfViewer = document.getElementById('pdf-viewer');
        const selectBtn = document.createElement('button');
        selectBtn.id = 'select-area-btn';
        selectBtn.className = 'btn btn-primary';
        selectBtn.innerHTML = '<i class="fas fa-crop-alt me-1"></i> Select Area';
        selectBtn.style.position = 'absolute';
        selectBtn.style.top = '10px';
        selectBtn.style.left = '10px';
        pdfViewer.appendChild(selectBtn);
        
        // Add event listener for selection mode button
        selectBtn.addEventListener('click', function() {
            toggleSelectionMode();
        });
    }
    
    // Function to show selection tools
    function showSelectionTools() {
        // Show screenshot area
        const screenshotArea = document.getElementById('screenshot-area');
        screenshotArea.style.display = 'flex';
        
        // Update instructions
        document.getElementById('paste-instructions').textContent = 'Click and drag to select an area';
        
        // Add selection mode button if it doesn't exist
        if (!document.getElementById('select-area-btn')) {
            const pdfViewer = document.getElementById('pdf-viewer');
            const selectBtn = document.createElement('button');
            selectBtn.id = 'select-area-btn';
            selectBtn.className = 'btn btn-primary';
            selectBtn.innerHTML = '<i class="fas fa-crop-alt me-1"></i> Select Area';
            selectBtn.style.position = 'absolute';
            selectBtn.style.top = '10px';
            selectBtn.style.left = '10px';
            pdfViewer.appendChild(selectBtn);
            
            // Add event listener for selection mode button
            selectBtn.addEventListener('click', function() {
                toggleSelectionMode();
            });
        }
        
        // Activate selection mode
        isSelecting = true;
        const selectBtn = document.getElementById('select-area-btn');
        if (selectBtn) {
            selectBtn.classList.remove('btn-primary');
            selectBtn.classList.add('btn-danger');
            selectBtn.innerHTML = '<i class="fas fa-times me-1"></i> Cancel Selection';
        }
        document.getElementById('pdf-viewer').style.cursor = 'crosshair';
    }
    
    // Use screenshot buttons
    document.getElementById('use-for-question-btn').addEventListener('click', function() {
        const imageData = document.getElementById('screenshot-preview').src;
        
        if (currentCaptureTarget === 'question') {
            document.getElementById('question-image-preview-img').src = imageData;
            document.getElementById('question-image-preview').style.display = 'block';
        } else if (currentCaptureTarget === 'option' && currentOptionTarget) {
            document.getElementById(`option-${currentOptionTarget}-image-preview-img`).src = imageData;
            document.getElementById(`option-${currentOptionTarget}-image-preview`).style.display = 'block';
        }
        
        // Reset screenshot area
        resetScreenshotArea();
        
        // Close PDF viewer
        document.getElementById('pdf-container').style.display = 'none';
        resetSelectionMode();
    });
    
    document.getElementById('use-for-option-btn').addEventListener('click', function() {
        const imageData = document.getElementById('screenshot-preview').src;
        
        // Find first empty option
        const options = ['a', 'b', 'c', 'd'];
        let optionUsed = false;
        
        for (const letter of options) {
            const optionPreview = document.getElementById(`option-${letter}-image-preview`);
            if (optionPreview && optionPreview.style.display === 'none') {
                document.getElementById(`option-${letter}-image-preview-img`).src = imageData;
                optionPreview.style.display = 'block';
                optionUsed = true;
                break;
            }
        }
        
        if (!optionUsed) {
            alert('All options already have images. Remove an image first.');
        }
        
        // Reset screenshot area
        resetScreenshotArea();
        
        // Close PDF viewer
        document.getElementById('pdf-container').style.display = 'none';
        resetSelectionMode();
    });
    
    document.getElementById('cancel-screenshot-btn').addEventListener('click', function() {
        resetScreenshotArea();
        resetSelectionMode();
    });
    
    // Add event listeners for area selection
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
});

// Toggle selection mode
function toggleSelectionMode() {
    isSelecting = !isSelecting;
    const selectBtn = document.getElementById('select-area-btn');
    const pdfContainer = document.getElementById('pdf-container');
    
    if (isSelecting) {
        // Activate selection mode
        selectBtn.classList.remove('btn-primary');
        selectBtn.classList.add('btn-danger');
        selectBtn.innerHTML = '<i class="fas fa-times me-1"></i> Cancel Selection';
        document.body.style.cursor = 'crosshair';
        
        // Show the screen overlay for snipping tool effect
        screenOverlay.style.display = 'block';
        
        // Make sure overlay covers the entire screen
        screenOverlay.style.width = '100vw';
        screenOverlay.style.height = '100vh';
        
        // Hide screenshot area during selection
        document.getElementById('screenshot-area').style.display = 'none';
        
        // Make sure the PDF container is above the overlay
        pdfContainer.style.zIndex = '2300';
        
        // Add a message to guide the user
        const message = document.createElement('div');
        message.id = 'selection-message';
        message.style.position = 'fixed';
        message.style.top = '5px';
        message.style.left = '50%';
        message.style.transform = 'translateX(-50%)';
        message.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        message.style.color = 'white';
        message.style.padding = '8px 15px';
        message.style.borderRadius = '20px';
        message.style.zIndex = '2400';
        message.style.fontWeight = 'bold';
        message.textContent = 'Click and drag to select an area';
        document.body.appendChild(message);
    } else {
        // Deactivate selection mode
        selectBtn.classList.remove('btn-danger');
        selectBtn.classList.add('btn-primary');
        selectBtn.innerHTML = '<i class="fas fa-crop-alt me-1"></i> Select Area';
        document.body.style.cursor = 'default';
        
        // Hide the selection box and screen overlay
        selectionBox.style.display = 'none';
        screenOverlay.style.display = 'none';
        
        // Reset PDF container z-index
        pdfContainer.style.zIndex = '1000';
        
        // Remove the message
        const message = document.getElementById('selection-message');
        if (message) message.remove();
    }
}

// Reset selection mode
function resetSelectionMode() {
    isSelecting = false;
    if (selectionBox) selectionBox.style.display = 'none';
    if (screenOverlay) screenOverlay.style.display = 'none';
    const pdfViewer = document.getElementById('pdf-viewer');
    if (pdfViewer) pdfViewer.style.cursor = 'default';
    
    // Reset select area button if it exists
    const selectBtn = document.getElementById('select-area-btn');
    if (selectBtn) {
        selectBtn.classList.remove('btn-danger');
        selectBtn.classList.add('btn-primary');
        selectBtn.innerHTML = '<i class="fas fa-crop-alt me-1"></i> Select Area';
    }
}

// Handle mouse down event
function handleMouseDown(e) {
    if (!isSelecting) return;
    
    // Start selection from anywhere when in selection mode
    startX = e.clientX;
    startY = e.clientY;
    
    selectionBox.style.left = startX + 'px';
    selectionBox.style.top = startY + 'px';
    selectionBox.style.width = '0px';
    selectionBox.style.height = '0px';
    selectionBox.style.display = 'block';
    
    // Add a class to the body to indicate selection is in progress
    document.body.classList.add('selecting');
    
    // Prevent default behavior to avoid text selection in the PDF
    e.preventDefault();
    e.stopPropagation();
    return false;
}

// Handle mouse move event
function handleMouseMove(e) {
    if (!isSelecting || selectionBox.style.display !== 'block') return;
    
    const width = e.clientX - startX;
    const height = e.clientY - startY;
    
    selectionBox.style.width = Math.abs(width) + 'px';
    selectionBox.style.height = Math.abs(height) + 'px';
    selectionBox.style.left = (width < 0 ? e.clientX : startX) + 'px';
    selectionBox.style.top = (height < 0 ? e.clientY : startY) + 'px';
    
    // Prevent default behavior
    e.preventDefault();
    e.stopPropagation();
    return false;
}

// Handle mouse up event
function handleMouseUp(e) {
    if (!isSelecting || selectionBox.style.display !== 'block') return;
    
    // Remove the selecting class
    document.body.classList.remove('selecting');
    
    // Get selection dimensions
    const width = parseInt(selectionBox.style.width);
    const height = parseInt(selectionBox.style.height);
    
    // Only capture if selection has size
    if (width > 10 && height > 10) {
        captureSelectedArea();
    } else {
        // Reset selection box if too small
        selectionBox.style.display = 'none';
    }
    
    // Prevent default behavior
    e.preventDefault();
    e.stopPropagation();
    return false;
}

// Capture the selected area
function captureSelectedArea() {
    try {
        // Hide the selection box and overlay temporarily for the screenshot
        const selectionBoxDisplay = selectionBox.style.display;
        const overlayDisplay = screenOverlay.style.display;
        selectionBox.style.display = 'none';
        screenOverlay.style.display = 'none';
        
        // Remove any selection message
        const message = document.getElementById('selection-message');
        if (message) message.style.display = 'none';
        
        // Get selection dimensions
        const rect = {
            left: parseInt(selectionBox.style.left),
            top: parseInt(selectionBox.style.top),
            width: parseInt(selectionBox.style.width),
            height: parseInt(selectionBox.style.height)
        };
        
        // Use the simpler html2canvas approach
        html2canvas(document.documentElement, {
            windowWidth: document.documentElement.offsetWidth,
            windowHeight: document.documentElement.offsetHeight,
            allowTaint: true,
            useCORS: true,
            logging: false
        }).then(canvas => {
            // Create a new canvas for the cropped area
            const croppedCanvas = document.createElement('canvas');
            croppedCanvas.width = rect.width;
            croppedCanvas.height = rect.height;
            const ctx = croppedCanvas.getContext('2d');
            
            // Draw only the selected portion
            ctx.drawImage(canvas, rect.left, rect.top, rect.width, rect.height, 0, 0, rect.width, rect.height);
            
            // Convert canvas to image data
            const imageData = croppedCanvas.toDataURL('image/png');
            
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
        }).catch(err => {
            console.error('Error capturing area:', err);
            alert('Error capturing selected area. Please try again.');
            
            // Restore selection box and overlay if there's an error
            selectionBox.style.display = selectionBoxDisplay;
            screenOverlay.style.display = overlayDisplay;
            if (message) message.style.display = 'block';
        });
    } catch (err) {
        console.error('Error in captureSelectedArea:', err);
        alert('Error capturing selected area. Please try again.');
    }
}

// Helper function to reset screenshot area
function resetScreenshotArea() {
    document.getElementById('screenshot-preview').style.display = 'none';
    document.getElementById('screenshot-preview').src = '';
    document.getElementById('paste-instructions').style.display = 'block';
    document.getElementById('screenshot-buttons').style.display = 'none';
}

// Function to remove question image
function removeQuestionImage() {
    document.getElementById('question-image-preview-img').src = '';
    document.getElementById('question-image-preview').style.display = 'none';
    document.getElementById('question-image').value = '';
}

// Function to remove option image
function removeOptionImage(option) {
    document.getElementById(`option-${option}-image-preview-img`).src = '';
    document.getElementById(`option-${option}-image-preview`).style.display = 'none';
    document.getElementById(`option-${option}-image`).value = '';
}