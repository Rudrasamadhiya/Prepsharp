// Simple capture function using native browser capabilities
document.addEventListener('DOMContentLoaded', function() {
    // Add a simple capture button to the PDF controls
    const pdfControls = document.querySelector('.pdf-controls');
    if (pdfControls) {
        const captureBtn = document.createElement('button');
        captureBtn.id = 'simple-capture-btn';
        captureBtn.className = 'btn btn-warning ms-2';
        captureBtn.innerHTML = '<i class="fas fa-camera"></i> Simple Capture';
        pdfControls.appendChild(captureBtn);
        
        // Add click handler
        captureBtn.onclick = function() {
            // Create a canvas element
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // Set canvas dimensions to match the PDF viewer
            const pdfViewer = document.getElementById('pdf-viewer');
            if (pdfViewer) {
                canvas.width = pdfViewer.clientWidth;
                canvas.height = pdfViewer.clientHeight;
                
                // Draw the PDF viewer content to the canvas
                ctx.drawImage(pdfViewer, 0, 0, canvas.width, canvas.height);
                
                try {
                    // Get the image data
                    const imageData = canvas.toDataURL('image/png');
                    
                    // Set the image to question preview
                    const previewImg = document.getElementById('question-image-preview-img');
                    const previewContainer = document.getElementById('question-image-preview');
                    
                    if (previewImg && previewContainer) {
                        previewImg.src = imageData;
                        previewContainer.style.display = 'block';
                    }
                    
                    // Close the PDF viewer
                    const pdfContainer = document.getElementById('pdf-container');
                    if (pdfContainer) {
                        pdfContainer.style.display = 'none';
                    }
                } catch (error) {
                    console.error('Error capturing:', error);
                    alert('Capture failed. Try using browser screenshot instead.');
                }
            }
        };
    }
    
    // Add instructions for manual screenshot
    const pdfContainer = document.getElementById('pdf-container');
    if (pdfContainer) {
        const instructions = document.createElement('div');
        instructions.style.position = 'absolute';
        instructions.style.bottom = '10px';
        instructions.style.left = '10px';
        instructions.style.backgroundColor = 'rgba(0,0,0,0.7)';
        instructions.style.color = 'white';
        instructions.style.padding = '10px';
        instructions.style.borderRadius = '5px';
        instructions.innerHTML = '<p><strong>Alternative method:</strong> Take a screenshot (PrtScn), then paste into question image.</p>';
        pdfContainer.appendChild(instructions);
    }
    
    // Enable pasting screenshots directly
    document.addEventListener('paste', function(e) {
        const items = (e.clipboardData || e.originalEvent.clipboardData).items;
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                const blob = items[i].getAsFile();
                const reader = new FileReader();
                reader.onload = function(event) {
                    // Set the image to question preview
                    const previewImg = document.getElementById('question-image-preview-img');
                    const previewContainer = document.getElementById('question-image-preview');
                    
                    if (previewImg && previewContainer) {
                        previewImg.src = event.target.result;
                        previewContainer.style.display = 'block';
                    }
                };
                reader.readAsDataURL(blob);
            }
        }
    });
});