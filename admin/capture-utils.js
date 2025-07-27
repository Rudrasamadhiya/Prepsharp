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

    // PDF upload is handled by pdf-capture.js
    
    // Close PDF button
    document.getElementById('close-pdf-btn').addEventListener('click', function() {
        document.getElementById('pdf-container').style.display = 'none';
        resetSelectionMode();
    });
    
    // Capture buttons
    document.getElementById('capture-question-btn').addEventListener('click', function() {
        currentCaptureTarget = 'question';
        currentOptionTarget = null; // Clear option target
        console.log('Question capture clicked, target set to:', currentCaptureTarget);
        
        if (typeof showPdfViewer === 'function') {
            showPdfViewer();
            addSelectAreaButton();
        } else {
            alert('Please upload a PDF first by clicking the "Upload PDF" button.');
        }
    });
    
    // Option capture buttons
    document.querySelectorAll('.option-capture-btn').forEach(button => {
        button.addEventListener('click', function() {
            currentCaptureTarget = 'option';
            currentOptionTarget = this.getAttribute('data-option');
            console.log('Option capture clicked, target set to:', currentCaptureTarget, 'option:', currentOptionTarget);
            
            if (typeof showPdfViewer === 'function') {
                showPdfViewer();
                addSelectAreaButton();
            } else {
                alert('Please upload a PDF first by clicking the "Upload PDF" button.');
            }
        });
    });
    
    // Explanation capture button
    const explanationCaptureBtn = document.getElementById('capture-explanation-btn');
    if (explanationCaptureBtn) {
        explanationCaptureBtn.addEventListener('click', function() {
            currentCaptureTarget = 'explanation';
            currentOptionTarget = null;
            console.log('Explanation capture clicked, target set to:', currentCaptureTarget);
            
            if (typeof showPdfViewer === 'function') {
                showPdfViewer();
                addSelectAreaButton();
            } else {
                alert('Please upload a PDF first by clicking the "Upload PDF" button.');
            }
        });
    }
    
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
    // Remove existing listeners and add clean ones
    const useQuestionBtn = document.getElementById('use-for-question-btn');
    const useOptionBtn = document.getElementById('use-for-option-btn');
    
    // Only handle the Use Image button for options
    const newUseOptionBtn = useOptionBtn.cloneNode(true);
    useOptionBtn.parentNode.replaceChild(newUseOptionBtn, useOptionBtn);
    
    newUseOptionBtn.addEventListener('click', function() {
        const imageData = document.getElementById('screenshot-preview').src;
        
        if (currentCaptureTarget === 'option' && currentOptionTarget) {
            const optionPreviewImg = document.getElementById(`option-${currentOptionTarget}-image-preview-img`);
            const optionPreview = document.getElementById(`option-${currentOptionTarget}-image-preview`);
            optionPreviewImg.src = imageData;
            optionPreview.style.display = 'block';
        } else if (currentCaptureTarget === 'question') {
            const questionPreviewImg = document.getElementById('question-image-preview-img');
            const questionPreview = document.getElementById('question-image-preview');
            questionPreviewImg.src = imageData;
            questionPreview.style.display = 'block';
        } else if (currentCaptureTarget === 'explanation') {
            const explanationPreviewImg = document.getElementById('explanation-image-preview-img');
            const explanationPreview = document.getElementById('explanation-image-preview');
            explanationPreviewImg.src = imageData;
            explanationPreview.style.display = 'block';
        }
        
        resetScreenshotArea();
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
        
        // Disable pointer events on iframe during selection
        const pdfIframe = document.getElementById('pdf-iframe');
        if (pdfIframe) pdfIframe.style.pointerEvents = 'none';
        
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
        pdfContainer.style.zIndex = '2000';
        
        // Re-enable pointer events on iframe
        const pdfIframe = document.getElementById('pdf-iframe');
        if (pdfIframe) pdfIframe.style.pointerEvents = 'auto';
        
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

// Capture the selected area using a simple approach
function captureSelectedArea() {
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
        
        // Create a visible test image with blue background
        const imageData = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAYAAAB5fY51AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4QgFCgkJKPMPBQAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAAGAElEQVR42u3dMW7bQBBAUdLI979y0gVpUqQJUgSIi4Wh5fJ/3hvABfhjZ7jLcRwHAIH+eQUAYQUQVgBhBRBWAGEFEFYAhBVAWAGEFUBYAYQVQFgBEFYAYQUQVgBhBRBWAGEFQFgBhBVAWAGEFUBYAYQVAGEFEFYAYQUQVgBhBRBWAIQVQFgBhBVAWAGEFUBYARBWAGEFEFYAYQUQVgBhBUBYAYQVQFgBhBVAWAGEFQBhBRBWAGEFEFYAYQUQVgCEFUBYAYQVQFgBhBVAWAEQVgBhBRBWAGEFEFYAYQVAWAGEFUBYAYQVQFgBhBUAYQUQVgBhBRBWAGEFEFYAhBVAWAGEFUBYAYQVQFgBEFYAYQUQVgBhBRBWAGEFQFgBhBVAWAGEFUBYAYQVAGEFEFYAYQUQVgBhBRBWAIQVQFgBhBVAWAGEFUBYARBWAGEFEFYAYQUQVgBhBUBYAYQVQFgBhBVAWAGEFQBhBRBWAGEFEFYAYQUQVgCEFUBYAYQVQFgBhBVAWAEQVgBhBRBWAGEFEFYAYQVAWAGEFUBYAYQVQFgBhBUAYQUQVgBhBRBWAGEFEFYAhBVAWAGEFUBYAYQVQFgBEFYAYQUQVgBhBRBWAGEFQFgBhBVAWAGEFUBYAYQVAGEFEFYAYQUQVgBhBRBWAIQVQFgBhBVAWAGEFUBYARBWAGEFEFYAYQUQVgBhBUBYAYQVQFgBhBVAWAGEFQBhBRBWAGEFEFYAYQUQVgCEFUBYAYQVQFgBhBVAWAEQVgBhBRBWAGEFEFYAYQVAWAGEFUBYAYQVQFgBhBUAYQUQVgBhBRBWAGEFEFYAhBVAWAGEFUBYAYQVQFgBEFYAYQUQVgBhBRBWAGEFQFgBhBVAWAGEFUBYAYQVAGEFEFYAYQUQVgBhBRBWAIQVQFgBhBVAWAGEFUBYARBWAGEFEFYAYQUQVgBhBUBYAYQVQFgBhBVAWAGEFQBhBRBWAGEFEFYAYQUQVgCEFUBYAYQVQFgBhBVAWAEQVgBhBRBWAGEFEFYAYQVAWAGEFUBYAYQVQFgBhBUAYQUQVgBhBRBWAGEFEFYAhBVAWAGEFUBYAYQVQFgBEFYAYQUQVgBhBRBWAGEFQFgBhBVAWAGEFUBYAYQVAGEFEFYAYQUQVgBhBRBWAIQVQFgBhBVAWAGEFUBYARBWAGEFEFYAYQUQVgBhBUBYAYQVQFgBhBVAWAGEFQBhBRBWAGEFEFYAYQUQVgCEFUBYAYQVQFgBhBVAWAEQVgBhBRBWAGEFEFYAYQVAWAGEFUBYAYQVQFgBhBUAYQUQVgBhBRBWAGEFEFYAhBVAWAGEFUBYAYQVQFgBEFYAYQUQVgBhBRBWAGEFQFgBhBVAWAGEFUBYAYQVAGEFEFYAYQUQVgBhBRBWAIQVQFgBhBVAWAGEFUBYARBWAGEFEFYAYQUQVgBhBUBYAYQVQFgBhBVAWAGEFQBhBRBWAGEFEFYAYQUQVgCEFUBYAYQVQFgBhBVAWAEQVgBhBRBWAGEFEFYAYQVAWAGEFUBYAYQVQFgBhBUAYQUQVgBhBRBWAGEFEFYAhBVAWAGEFUBYAYQVQFgBEFYAYQUQVgBhBRBWAGEFQFgBhBVAWAGEFUBYAYQVAGEFEFYAYQUQVgBhBRBWAIQVQFgBhBVAWAGEFUBYARBWAGEFEFYAYQUQVgBhBUBYAYQVQFgBhBVAWAGEFQBhBRBWAGEFEFYAYQUQVgCEFUBYAYQVQFgBhBVAWAEQVgBhBRBWAGEFEFYAYQVAWAGEFUBYAYQVQFgBhBUAYQUQVgBhBRBWAGEFEFYAhBVAWAGEFUBYAYQVQFgBEFYAYQUQVgBhBRBWAGEFQFgBhBVAWAGEFUBYAYQVAGEFEFYAYQUQVgBhBRBWAIQVQFgBhBVAWAGEFUBYARBWAGEFEFYAYQUQVgBhBUBYAYQVQFgBhBVAWAGEFQBhBRBWAGEFEFYAYQUQVgCEFUBYAYQVQFgBhBVAWAEQVgBhBRBWAGEFEFYAYQVAWAGEFUBYAYQVQFgBhBUAYQUQVgBhBRBWAGEFEFYAhBVAWAGEFUBYAYQVQFgBEFYAYQUQVgBhBRBWgGv9BxVXZ7C6rC7OAAAAAElFTkSuQmCC';
        
        // Show screenshot area
        const screenshotArea = document.getElementById('screenshot-area');
        screenshotArea.style.display = 'flex';
        
        // Show screenshot preview
        const screenshotPreview = document.getElementById('screenshot-preview');
        screenshotPreview.src = imageData;
        screenshotPreview.style.display = 'block';
        screenshotPreview.style.maxWidth = '300px';
        screenshotPreview.style.height = 'auto';
        
        // Hide instructions and show buttons
        document.getElementById('paste-instructions').style.display = 'none';
        document.getElementById('screenshot-buttons').style.display = 'block';
        
        // Reset selection mode
        resetSelectionMode();
        
        // Log to console for debugging
        console.log('Image set to:', imageData.substring(0, 50) + '...');
    } catch (err) {
        console.error('Error in captureSelectedArea:', err);
        alert('Error capturing selected area. Please try again.');
        resetSelectionMode();
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
    // Keep question text visible
    document.getElementById('question-text').style.display = 'block';
}

// Function to remove option image
function removeOptionImage(option) {
    document.getElementById(`option-${option}-image-preview-img`).src = '';
    document.getElementById(`option-${option}-image-preview`).style.display = 'none';
    document.getElementById(`option-${option}-image`).value = '';
    // Keep option text visible
    document.getElementById(`option-${option}-text`).style.display = 'block';
}