// Fix for upload button
document.addEventListener('DOMContentLoaded', function() {
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
});