// New capture implementation
document.addEventListener('DOMContentLoaded', function() {
    // Add capture button to PDF viewer
    const pdfControls = document.querySelector('.pdf-controls');
    if (pdfControls) {
        const captureBtn = document.createElement('button');
        captureBtn.id = 'new-capture-btn';
        captureBtn.className = 'btn btn-primary ms-2';
        captureBtn.textContent = 'Capture Screen';
        pdfControls.appendChild(captureBtn);
        
        // Add click handler for new capture button
        captureBtn.onclick = function() {
            captureScreen();
        };
    }
    
    // New capture function
    function captureScreen() {
        // Get the PDF viewer element
        const pdfViewer = document.getElementById('pdf-viewer');
        if (!pdfViewer) {
            alert('PDF viewer not found');
            return;
        }
        
        // Use html2canvas to capture the PDF viewer
        html2canvas(pdfViewer).then(function(canvas) {
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
            
            // Alert success
            alert('Image captured successfully!');
        }).catch(function(error) {
            console.error('Error capturing screen:', error);
            alert('Error capturing screen. Please try again.');
        });
    }
});