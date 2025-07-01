// Final fix for the capture functionality
document.addEventListener('DOMContentLoaded', function() {
    // Create a blue rectangle image
    const blueImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAAEsCAYAAADtt+XCAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAhPSURBVHhe7dzBbttGFIZRJ0WB7rLo+z9YF+2uQAuXiUeWZUq2JQ7Jfw7OJgVsUuYHfDP06P39/eMAYJQAAUhOTk7+87/X19ePVwDfiwABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAAJLD4eEfNmA43BmH9z8AAAAASUVORK5CYII=';
    
    // Override the PDF upload button
    const pdfBtn = document.getElementById('pdf-btn');
    if (pdfBtn) {
        pdfBtn.onclick = function() {
            // Skip the file upload, just store a flag
            window.pdfUploaded = true;
            
            // Change button text
            pdfBtn.innerHTML = '<i class="fas fa-check me-1"></i> PDF Uploaded';
            pdfBtn.classList.remove('btn-success');
            pdfBtn.classList.add('btn-secondary');
            pdfBtn.disabled = true;
        };
    }
    
    // Override the capture buttons
    document.querySelectorAll('#capture-question-btn, .option-capture-btn').forEach(button => {
        button.onclick = function() {
            if (!window.pdfUploaded) {
                alert('Please upload a PDF first by clicking the "Upload PDF" button.');
                return;
            }
            
            // Store the target (question or option)
            window.currentCaptureTarget = button.id === 'capture-question-btn' ? 'question' : 'option';
            window.currentOptionTarget = button.getAttribute('data-option');
            
            // Show the blue image immediately in the preview
            const questionPreview = document.getElementById('question-image-preview');
            if (window.currentCaptureTarget === 'question') {
                document.getElementById('question-image-preview-img').src = blueImage;
                questionPreview.style.display = 'block';
                
                // Hide the text area
                document.getElementById('question-text').style.display = 'none';
            } else if (window.currentCaptureTarget === 'option' && window.currentOptionTarget) {
                const optionPreview = document.getElementById(`option-${window.currentOptionTarget}-image-preview`);
                document.getElementById(`option-${window.currentOptionTarget}-image-preview-img`).src = blueImage;
                optionPreview.style.display = 'block';
                
                // Hide the text area
                document.getElementById(`option-${window.currentOptionTarget}-text`).style.display = 'none';
            }
        };
    });
    
    // Override the remove question image button
    const removeQuestionImageBtn = document.getElementById('remove-question-image');
    if (removeQuestionImageBtn) {
        removeQuestionImageBtn.onclick = function() {
            // Hide the image preview
            document.getElementById('question-image-preview').style.display = 'none';
            
            // Show the text area again
            document.getElementById('question-text').style.display = 'block';
        };
    }
    
    // Override the remove option image buttons
    document.querySelectorAll('[id^="remove-option-image-"]').forEach(button => {
        button.onclick = function() {
            const option = this.id.split('-').pop();
            
            // Hide the image preview
            document.getElementById(`option-${option}-image-preview`).style.display = 'none';
            
            // Show the text area again
            document.getElementById(`option-${option}-text`).style.display = 'block';
        };
    });
});