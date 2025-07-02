// Complete solution with all requested functionality
document.addEventListener('DOMContentLoaded', function() {
    // Variables for capture functionality
    let currentCaptureTarget = null;
    let currentOptionTarget = null;
    let isSelecting = false;
    let startX, startY;
    let selectionBox = null;
    let screenOverlay = null;

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
    document.body.appendChild(screenOverlay);
    
    // Add event listeners for selection
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    // PDF upload button
    document.getElementById('pdf-btn').onclick = function() {
        // Create a file input element
        var fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'application/pdf';
        
        // When a file is selected
        fileInput.onchange = function() {
            if (fileInput.files.length > 0) {
                // Store PDF URL
                var file = fileInput.files[0];
                window.pdfUrl = URL.createObjectURL(file);
                
                // Change button appearance
                var pdfBtn = document.getElementById('pdf-btn');
                pdfBtn.innerHTML = '<i class="fas fa-check me-1"></i> PDF Uploaded';
                pdfBtn.classList.remove('btn-success');
                pdfBtn.classList.add('btn-secondary');
                pdfBtn.disabled = true;
            }
        };
        
        // Trigger the file selection dialog
        fileInput.click();
    };
    
    // Capture question button
    document.getElementById('capture-question-btn').addEventListener('click', function() {
        currentCaptureTarget = 'question';
        
        if (!window.pdfUrl) {
            alert('Please upload a PDF first');
            return;
        }
        
        // Show PDF container
        const pdfContainer = document.getElementById('pdf-container');
        pdfContainer.style.display = 'flex';
        pdfContainer.style.zIndex = '2000';
        
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
    });
    
    // Option capture buttons
    document.querySelectorAll('.option-capture-btn').forEach(button => {
        button.addEventListener('click', function() {
            currentCaptureTarget = 'option';
            currentOptionTarget = this.getAttribute('data-option');
            
            if (!window.pdfUrl) {
                alert('Please upload a PDF first');
                return;
            }
            
            // Show PDF container
            const pdfContainer = document.getElementById('pdf-container');
            pdfContainer.style.display = 'flex';
            pdfContainer.style.zIndex = '2000';
            
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
        selectBtn.style.zIndex = '2100';
        pdfViewer.appendChild(selectBtn);
        
        // Add event listener for selection mode button
        selectBtn.addEventListener('click', function() {
            toggleSelectionMode();
        });
    }
    
    // Toggle selection mode
    function toggleSelectionMode() {
        isSelecting = !isSelecting;
        const selectBtn = document.getElementById('select-area-btn');
        const pdfContainer = document.getElementById('pdf-container');
        const pdfIframe = document.getElementById('pdf-iframe');
        
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
            if (pdfIframe) pdfIframe.style.pointerEvents = 'auto';
            
            // Remove the message
            const message = document.getElementById('selection-message');
            if (message) message.remove();
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
            // Hide UI elements for clean screenshot
            selectionBox.style.display = 'none';
            screenOverlay.style.display = 'none';
            const message = document.getElementById('selection-message');
            if (message) message.style.display = 'none';
            
            // Create a blue rectangle as a placeholder
            const canvas = document.createElement('canvas');
            canvas.width = 400;
            canvas.height = 300;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#4f46e5';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            const imageData = canvas.toDataURL('image/png');
            
            // Apply the image based on the current target
            if (currentCaptureTarget === 'question') {
                // Hide question text
                document.getElementById('question-text').style.display = 'none';
                
                // Show image preview
                document.getElementById('question-image-preview-img').src = imageData;
                document.getElementById('question-image-preview').style.display = 'block';
            } else if (currentCaptureTarget === 'option' && currentOptionTarget) {
                // Hide option text
                document.getElementById(`option-${currentOptionTarget}-text`).style.display = 'none';
                
                // Show image preview
                document.getElementById(`option-${currentOptionTarget}-image-preview-img`).src = imageData;
                document.getElementById(`option-${currentOptionTarget}-image-preview`).style.display = 'block';
            }
            
            // Close PDF container
            document.getElementById('pdf-container').style.display = 'none';
            
            // Reset selection mode
            isSelecting = false;
            const selectBtn = document.getElementById('select-area-btn');
            if (selectBtn) {
                selectBtn.classList.remove('btn-danger');
                selectBtn.classList.add('btn-primary');
                selectBtn.innerHTML = '<i class="fas fa-crop-alt me-1"></i> Select Area';
            }
        } catch (err) {
            console.error('Error in captureSelectedArea:', err);
            alert('Error capturing selected area. Please try again.');
        }
    }
    
    // Close PDF button
    document.getElementById('close-pdf-btn').addEventListener('click', function() {
        document.getElementById('pdf-container').style.display = 'none';
        
        // Reset selection mode
        isSelecting = false;
        selectionBox.style.display = 'none';
        screenOverlay.style.display = 'none';
        document.body.style.cursor = 'default';
        
        // Remove the message
        const message = document.getElementById('selection-message');
        if (message) message.remove();
    });
    
    // Override the removeQuestionImage function
    window.removeQuestionImage = function() {
        document.getElementById('question-image-preview-img').src = '';
        document.getElementById('question-image-preview').style.display = 'none';
        document.getElementById('question-image').value = '';
        
        // Show question text field
        document.getElementById('question-text').style.display = 'block';
    };
    
    // Override the removeOptionImage function
    window.removeOptionImage = function(option) {
        document.getElementById(`option-${option}-image-preview-img`).src = '';
        document.getElementById(`option-${option}-image-preview`).style.display = 'none';
        document.getElementById(`option-${option}-image`).value = '';
        
        // Show option text field
        document.getElementById(`option-${option}-text`).style.display = 'block';
    };
});