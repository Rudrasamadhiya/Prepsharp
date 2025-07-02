// Original functionality restored
// Hide loading message immediately
document.getElementById('loading-container').style.display = 'none';
document.getElementById('add-question-form').style.display = 'block';

document.addEventListener('DOMContentLoaded', function() {
    
    // Variables for capture functionality
    let currentCaptureTarget = null;
    let currentOptionTarget = null;
    
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
                pdfIframe.id = 'pdf-iframe';
                pdfViewer.appendChild(pdfIframe);
            }
            
            // Show screenshot area
            document.getElementById('screenshot-area').style.display = 'flex';
            document.getElementById('paste-instructions').style.display = 'block';
            document.getElementById('screenshot-preview').style.display = 'none';
            document.getElementById('screenshot-buttons').style.display = 'none';
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
                
                // Show screenshot area
                document.getElementById('screenshot-area').style.display = 'flex';
                document.getElementById('paste-instructions').style.display = 'block';
                document.getElementById('screenshot-preview').style.display = 'none';
                document.getElementById('screenshot-buttons').style.display = 'none';
            } else {
                // PDF is not uploaded, show alert
                alert('Please upload a PDF first by clicking the "Upload PDF" button.');
            }
        });
    });
    
    // Handle paste events
    document.addEventListener('paste', function(e) {
        // Only process if PDF container is visible
        if (document.getElementById('pdf-container').style.display !== 'flex') return;
        
        const items = e.clipboardData.items;
        
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                const blob = items[i].getAsFile();
                const reader = new FileReader();
                
                reader.onload = function(event) {
                    const imageData = event.target.result;
                    
                    // Show screenshot preview
                    const screenshotPreview = document.getElementById('screenshot-preview');
                    screenshotPreview.src = imageData;
                    screenshotPreview.style.display = 'block';
                    
                    // Hide instructions and show buttons
                    document.getElementById('paste-instructions').style.display = 'none';
                    document.getElementById('screenshot-buttons').style.display = 'block';
                };
                
                reader.readAsDataURL(blob);
                break;
            }
        }
    });
    
    // Use screenshot buttons
    document.getElementById('use-for-question-btn').addEventListener('click', function() {
        const imageData = document.getElementById('screenshot-preview').src;
        
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
        
        // Reset screenshot area
        resetScreenshotArea();
        
        // Close PDF viewer
        document.getElementById('pdf-container').style.display = 'none';
    });
    
    document.getElementById('use-for-option-btn').addEventListener('click', function() {
        const imageData = document.getElementById('screenshot-preview').src;
        
        // Find first empty option
        const options = ['a', 'b', 'c', 'd'];
        let optionUsed = false;
        
        for (const letter of options) {
            const optionPreview = document.getElementById(`option-${letter}-image-preview`);
            if (optionPreview && optionPreview.style.display === 'none') {
                // Hide option text
                document.getElementById(`option-${letter}-text`).style.display = 'none';
                
                // Show image preview
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
    });
    
    document.getElementById('cancel-screenshot-btn').addEventListener('click', function() {
        resetScreenshotArea();
    });
    
    // Helper function to reset screenshot area
    function resetScreenshotArea() {
        document.getElementById('screenshot-preview').style.display = 'none';
        document.getElementById('screenshot-preview').src = '';
        document.getElementById('paste-instructions').style.display = 'block';
        document.getElementById('screenshot-buttons').style.display = 'none';
    }
    
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
    
    // For testing - simulate a paste event with a blue image
    window.simulatePaste = function() {
        // Create a blue image
        const canvas = document.createElement('canvas');
        canvas.width = 400;
        canvas.height = 300;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#4f46e5';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Show screenshot preview
        const screenshotPreview = document.getElementById('screenshot-preview');
        screenshotPreview.src = canvas.toDataURL('image/png');
        screenshotPreview.style.display = 'block';
        
        // Hide instructions and show buttons
        document.getElementById('paste-instructions').style.display = 'none';
        document.getElementById('screenshot-buttons').style.display = 'block';
    };
    
    // Add a button to simulate paste for testing
    const screenshotArea = document.getElementById('screenshot-area');
    const simulateBtn = document.createElement('button');
    simulateBtn.textContent = 'Simulate Paste';
    simulateBtn.className = 'btn btn-sm btn-secondary mt-2';
    simulateBtn.onclick = window.simulatePaste;
    screenshotArea.appendChild(simulateBtn);
});