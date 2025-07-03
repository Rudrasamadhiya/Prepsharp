// PDF Upload and Capture Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const pdfBtn = document.getElementById('pdf-btn');
    const pdfContainer = document.getElementById('pdf-container');
    const pdfViewer = document.getElementById('pdf-viewer');
    const closePdfBtn = document.getElementById('close-pdf-btn');
    const screenshotArea = document.getElementById('screenshot-area');
    const pasteInstructions = document.getElementById('paste-instructions');
    const screenshotPreview = document.getElementById('screenshot-preview');
    const screenshotButtons = document.getElementById('screenshot-buttons');
    const useForQuestionBtn = document.getElementById('use-for-question-btn');
    const useForOptionBtn = document.getElementById('use-for-option-btn');
    const cancelScreenshotBtn = document.getElementById('cancel-screenshot-btn');
    
    // Current target for capture (question or option)
    let captureTarget = null;
    let captureOptionId = null;
    let pdfFile = null;
    
    // PDF Upload Button
    pdfBtn.addEventListener('click', function() {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'application/pdf';
        fileInput.style.display = 'none';
        document.body.appendChild(fileInput);
        
        fileInput.addEventListener('change', function(e) {
            if (e.target.files.length > 0) {
                pdfFile = e.target.files[0];
                pdfBtn.innerHTML = '<i class="fas fa-file-pdf me-1"></i> PDF Uploaded';
                pdfBtn.classList.remove('btn-success');
                pdfBtn.classList.add('btn-primary');
                document.body.removeChild(fileInput);
            }
        });
        
        fileInput.click();
    });
    
    // Capture Button for Question
    document.getElementById('capture-question-btn').addEventListener('click', function() {
        if (!pdfFile) {
            alert('Please upload a PDF file first');
            return;
        }
        
        captureTarget = 'question';
        captureOptionId = null;
        showPdfViewer();
    });
    
    // Capture Buttons for Options
    document.querySelectorAll('.option-capture-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            if (!pdfFile) {
                alert('Please upload a PDF file first');
                return;
            }
            
            captureTarget = 'option';
            captureOptionId = this.dataset.option;
            showPdfViewer();
        });
    });
    
    // Show PDF Viewer
    function showPdfViewer() {
        pdfContainer.style.display = 'flex';
        
        // Create a URL for the PDF file
        const pdfUrl = URL.createObjectURL(pdfFile);
        
        // Create a Select Area button
        const selectAreaBtn = document.createElement('button');
        selectAreaBtn.id = 'select-area-btn';
        selectAreaBtn.className = 'btn btn-primary';
        selectAreaBtn.style.position = 'absolute';
        selectAreaBtn.style.top = '10px';
        selectAreaBtn.style.left = '10px';
        selectAreaBtn.style.zIndex = '1001';
        selectAreaBtn.innerHTML = 'Select Area';
        pdfContainer.appendChild(selectAreaBtn);
        
        // Load PDF in the viewer
        pdfViewer.innerHTML = `<embed src="${pdfUrl}" type="application/pdf" width="100%" height="100%">`;
        
        // Select Area Button
        selectAreaBtn.addEventListener('click', function() {
            // Create overlay
            const overlay = document.createElement('div');
            overlay.id = 'selection-overlay';
            overlay.style.position = 'absolute';
            overlay.style.top = '0';
            overlay.style.left = '0';
            overlay.style.width = '100%';
            overlay.style.height = '100%';
            overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
            overlay.style.zIndex = '1002';
            overlay.style.cursor = 'crosshair';
            pdfContainer.appendChild(overlay);
            
            // Show instructions
            pasteInstructions.textContent = 'Click and drag to select an area';
            screenshotArea.style.display = 'flex';
            
            // Variables for selection
            let isSelecting = false;
            let startX, startY;
            let selectionBox = null;
            
            // Mouse down event
            overlay.addEventListener('mousedown', function(e) {
                isSelecting = true;
                startX = e.clientX;
                startY = e.clientY;
                
                // Create selection box
                selectionBox = document.createElement('div');
                selectionBox.style.position = 'absolute';
                selectionBox.style.border = '2px dashed blue';
                selectionBox.style.backgroundColor = 'transparent';
                selectionBox.style.zIndex = '1003';
                selectionBox.style.left = startX + 'px';
                selectionBox.style.top = startY + 'px';
                overlay.appendChild(selectionBox);
            });
            
            // Mouse move event
            overlay.addEventListener('mousemove', function(e) {
                if (!isSelecting) return;
                
                const width = e.clientX - startX;
                const height = e.clientY - startY;
                
                selectionBox.style.width = Math.abs(width) + 'px';
                selectionBox.style.height = Math.abs(height) + 'px';
                selectionBox.style.left = (width < 0 ? e.clientX : startX) + 'px';
                selectionBox.style.top = (height < 0 ? e.clientY : startY) + 'px';
            });
            
            // Mouse up event
            overlay.addEventListener('mouseup', function(e) {
                if (!isSelecting) return;
                isSelecting = false;
                
                // Capture the selected area
                const width = Math.abs(e.clientX - startX);
                const height = Math.abs(e.clientY - startY);
                const left = Math.min(startX, e.clientX);
                const top = Math.min(startY, e.clientY);
                
                // Create canvas for capturing
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                
                // Get the PDF embed element
                const pdfEmbed = pdfViewer.querySelector('embed');
                
                // Use html2canvas or similar library to capture the area
                // For this implementation, we'll simulate the capture
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, width, height);
                ctx.fillStyle = '#000000';
                ctx.font = '14px Arial';
                ctx.fillText('Captured Area', 10, 20);
                
                // Show the captured image
                screenshotPreview.src = canvas.toDataURL();
                screenshotPreview.style.display = 'block';
                screenshotButtons.style.display = 'block';
                
                // Remove overlay and selection box
                overlay.remove();
                selectAreaBtn.remove();
            });
        });
    }
    
    // Close PDF Button
    closePdfBtn.addEventListener('click', function() {
        pdfContainer.style.display = 'none';
        screenshotArea.style.display = 'none';
        screenshotPreview.style.display = 'none';
        screenshotButtons.style.display = 'none';
        
        // Remove select area button if it exists
        const selectAreaBtn = document.getElementById('select-area-btn');
        if (selectAreaBtn) selectAreaBtn.remove();
        
        // Remove overlay if it exists
        const overlay = document.getElementById('selection-overlay');
        if (overlay) overlay.remove();
    });
    
    // Use for Question Button
    useForQuestionBtn.addEventListener('click', function() {
        if (captureTarget === 'question') {
            // Hide text field, label, and file input, then show image
            document.getElementById('question-text').style.display = 'none';
            
            // Use helper function if available, otherwise try direct selectors
            if (typeof hideQuestionImageElements === 'function') {
                hideQuestionImageElements();
            } else {
                try {
                    document.querySelector('label[for="question-image"]').style.display = 'none';
                    document.querySelector('.d-flex:has(#question-image)').style.display = 'none';
                } catch (e) {
                    console.log('Selector not supported, using fallback');
                    const fileInput = document.getElementById('question-image');
                    if (fileInput && fileInput.parentElement) {
                        fileInput.parentElement.style.display = 'none';
                    }
                }
            }
            
            // Ensure image is displayed properly
            document.getElementById('question-image-preview').style.display = 'block';
            document.getElementById('question-image-preview-img').src = screenshotPreview.src;
            document.getElementById('question-image-preview-img').style.display = 'block';
            document.getElementById('question-image-preview-img').style.maxWidth = '100%';
        }
        
        // Close PDF viewer
        pdfContainer.style.display = 'none';
        screenshotArea.style.display = 'none';
        screenshotPreview.style.display = 'none';
        screenshotButtons.style.display = 'none';
    });
    
    // Use for Option Button
    useForOptionBtn.addEventListener('click', function() {
        if (captureTarget === 'option' && captureOptionId) {
            // Hide option text field and show image
            document.getElementById(`option-${captureOptionId}-text`).style.display = 'none';
            document.getElementById(`option-${captureOptionId}-image-preview`).style.display = 'block';
            document.getElementById(`option-${captureOptionId}-image-preview-img`).src = screenshotPreview.src;
        }
        
        // Close PDF viewer
        pdfContainer.style.display = 'none';
        screenshotArea.style.display = 'none';
        screenshotPreview.style.display = 'none';
        screenshotButtons.style.display = 'none';
    });
    
    // Cancel Screenshot Button
    cancelScreenshotBtn.addEventListener('click', function() {
        screenshotPreview.style.display = 'none';
        screenshotButtons.style.display = 'none';
        pasteInstructions.textContent = 'Click and drag to select an area';
    });
    
    // Remove Question Image
    window.removeQuestionImage = function() {
        // Keep question text visible and just hide the image
        document.getElementById('question-image-preview').style.display = 'none';
        document.getElementById('question-image-preview-img').src = '';
    };
    
    // Remove Option Image
    window.removeOptionImage = function(optionId) {
        document.getElementById(`option-${optionId}-text`).style.display = 'block';
        document.getElementById(`option-${optionId}-image-preview`).style.display = 'none';
        document.getElementById(`option-${optionId}-image-preview-img`).src = '';
    };
});