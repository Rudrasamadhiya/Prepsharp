// Direct fix for image display issues
document.addEventListener('DOMContentLoaded', function() {
    // Override the use for question button
    const useForQuestionBtn = document.getElementById('use-for-question-btn');
    if (useForQuestionBtn) {
        useForQuestionBtn.addEventListener('click', function() {
            // Get the image data
            const imageData = document.getElementById('screenshot-preview').src;
            
            // Set the image directly with inline styles
            const imgElement = document.getElementById('question-image-preview-img');
            imgElement.src = imageData;
            imgElement.style.display = 'block';
            imgElement.style.maxWidth = '100%';
            imgElement.style.height = 'auto';
            imgElement.style.border = '1px solid #ddd';
            imgElement.style.borderRadius = '5px';
            imgElement.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
            
            // Show the container
            document.getElementById('question-image-preview').style.display = 'block';
            
            // Hide the text field
            document.getElementById('question-text').style.display = 'none';
            
            // Hide the label and file input
            const label = document.querySelector('label[for="question-image"]');
            if (label) label.style.display = 'none';
            
            const fileInput = document.getElementById('question-image');
            if (fileInput && fileInput.parentElement) {
                fileInput.parentElement.style.display = 'none';
            }
            
            // Close PDF viewer
            document.getElementById('pdf-container').style.display = 'none';
        });
    }
});