// Direct PDF capture utility
const ScreenCapture = {
    pdfWindow: null,
    currentCallback: null,
    
    // Initialize capture process
    init: function(callback) {
        // Store callback
        this.currentCallback = callback;
        
        // Check if PDF is opened
        if (localStorage.getItem('pdfUploaded') !== 'true') {
            alert('Please upload a PDF first');
            return;
        }
        
        // Try to focus PDF window or open a new one if closed
        const pdfUrl = localStorage.getItem('pdfUrl');
        if (!pdfUrl) {
            alert('PDF not found. Please upload a PDF first.');
            return;
        }
        
        // Focus or open PDF window
        if (!this.pdfWindow || this.pdfWindow.closed) {
            this.pdfWindow = window.open(pdfUrl, 'pdfWindow');
        } else {
            this.pdfWindow.focus();
        }
        
        // Show instructions
        alert('Use Win+Shift+S to capture a screenshot from the PDF, then press Ctrl+V to paste it here.');
        
        // Set up paste event listener
        document.addEventListener('paste', this.handlePaste);
    },
    
    // Handle paste event
    handlePaste: function(e) {
        const items = e.clipboardData.items;
        
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                const blob = items[i].getAsFile();
                const reader = new FileReader();
                
                reader.onload = function(event) {
                    // Call the callback with the image data
                    if (ScreenCapture.currentCallback) {
                        ScreenCapture.currentCallback(event.target.result);
                        
                        // Remove paste event listener
                        document.removeEventListener('paste', ScreenCapture.handlePaste);
                    }
                };
                
                reader.readAsDataURL(blob);
                break;
            }
        }
    }
};