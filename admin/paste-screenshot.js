// Minimal screenshot paste support
document.addEventListener('DOMContentLoaded', function() {
    // Add instructions for manual screenshot
    const pdfContainer = document.getElementById('pdf-container');
    if (pdfContainer) {
        const instructions = document.createElement('div');
        instructions.style.position = 'absolute';
        instructions.style.top = '60px';
        instructions.style.left = '50%';
        instructions.style.transform = 'translateX(-50%)';
        instructions.style.backgroundColor = 'rgba(0,0,0,0.8)';
        instructions.style.color = 'white';
        instructions.style.padding = '15px';
        instructions.style.borderRadius = '5px';
        instructions.style.zIndex = '2001';
        instructions.style.textAlign = 'center';
        instructions.innerHTML = '<p style="margin:0"><strong>Take a screenshot</strong> (PrtScn), then <strong>paste (Ctrl+V)</strong> to add image</p>';
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
                    
                    // Close the PDF viewer if it's open
                    const pdfContainer = document.getElementById('pdf-container');
                    if (pdfContainer && pdfContainer.style.display !== 'none') {
                        pdfContainer.style.display = 'none';
                    }
                    
                    // Show success message
                    alert('Screenshot added successfully!');
                };
                reader.readAsDataURL(blob);
            }
        }
    });
});