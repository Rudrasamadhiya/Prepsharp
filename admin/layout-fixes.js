// JavaScript layout improvements
document.addEventListener('DOMContentLoaded', function() {
    // Add our custom CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'layout-enhancement.css';
    document.head.appendChild(link);
    
    // Fix PDF container layout
    const pdfContainer = document.getElementById('pdf-container');
    if (pdfContainer) {
        // Center the PDF viewer better
        const pdfViewer = document.getElementById('pdf-viewer');
        if (pdfViewer) {
            pdfViewer.style.margin = '20px auto';
            pdfViewer.style.maxWidth = '90%';
        }
        
        // Improve screenshot area
        const screenshotArea = document.getElementById('screenshot-area');
        if (screenshotArea) {
            screenshotArea.style.padding = '20px';
            screenshotArea.style.display = 'flex';
            screenshotArea.style.flexDirection = 'column';
            screenshotArea.style.alignItems = 'center';
        }
        
        // Style the buttons in the screenshot area
        const screenshotButtons = document.getElementById('screenshot-buttons');
        if (screenshotButtons) {
            screenshotButtons.style.marginTop = '15px';
            screenshotButtons.style.display = 'flex';
            screenshotButtons.style.gap = '10px';
            
            // Style individual buttons
            const buttons = screenshotButtons.querySelectorAll('button');
            buttons.forEach(button => {
                button.style.margin = '0 5px';
                button.style.minWidth = '120px';
            });
        }
    }
    
    // Improve question image preview
    const questionPreview = document.getElementById('question-image-preview');
    if (questionPreview) {
        questionPreview.style.maxWidth = '100%';
        questionPreview.style.margin = '15px auto';
        
        // Add a title to the preview
        const title = document.createElement('div');
        title.className = 'preview-title';
        title.style.fontWeight = 'bold';
        title.style.marginBottom = '10px';
        title.style.color = '#4f46e5';
        title.textContent = 'Question Image Preview';
        
        questionPreview.insertBefore(title, questionPreview.firstChild);
    }
    
    // Improve option containers
    const optionContainers = document.querySelectorAll('.option-container');
    optionContainers.forEach((container, index) => {
        // Add subtle hover effect
        container.style.transition = 'all 0.2s ease';
        container.addEventListener('mouseenter', function() {
            this.style.backgroundColor = '#f1f5f9';
        });
        container.addEventListener('mouseleave', function() {
            this.style.backgroundColor = '#f8fafc';
        });
    });
});