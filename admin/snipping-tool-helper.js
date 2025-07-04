// Helper for using Windows Snipping Tool
document.addEventListener('DOMContentLoaded', function() {
    // Add a button to the PDF controls
    const pdfControls = document.querySelector('.pdf-controls');
    if (pdfControls) {
        const snippingBtn = document.createElement('button');
        snippingBtn.id = 'snipping-tool-btn';
        snippingBtn.className = 'btn btn-primary ms-2';
        snippingBtn.innerHTML = '<i class="fas fa-cut"></i> Snipping Tool';
        pdfControls.appendChild(snippingBtn);
        
        // Add click handler
        snippingBtn.onclick = function() {
            // Show instructions overlay
            showSnippingInstructions();
        };
    }
    
    // Function to show snipping tool instructions
    function showSnippingInstructions() {
        // Create overlay
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0,0,0,0.8)';
        overlay.style.zIndex = '3000';
        overlay.style.display = 'flex';
        overlay.style.flexDirection = 'column';
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';
        overlay.style.color = 'white';
        overlay.style.textAlign = 'center';
        
        // Add instructions
        overlay.innerHTML = `
            <h3>Take a Screenshot</h3>
            <p>1. Press <kbd style="background:#333;padding:5px;border-radius:3px">Win + Shift + S</kbd> to open Snipping Tool</p>
            <p>2. Select the area you want to capture</p>
            <p>3. Return to this page and press <kbd style="background:#333;padding:5px;border-radius:3px">Ctrl + V</kbd> to paste</p>
            <button id="close-instructions" class="btn btn-light mt-3">I'll do it now</button>
        `;
        
        document.body.appendChild(overlay);
        
        // Add close button handler
        document.getElementById('close-instructions').onclick = function() {
            document.body.removeChild(overlay);
        };
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
                    
                    // Close the PDF viewer if it's open
                    const pdfContainer = document.getElementById('pdf-container');
                    if (pdfContainer && pdfContainer.style.display !== 'none') {
                        pdfContainer.style.display = 'none';
                    }
                };
                reader.readAsDataURL(blob);
            }
        }
    });
});