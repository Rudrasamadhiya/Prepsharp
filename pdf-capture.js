// Simple PDF screenshot utility
const PDFCapture = {
    pdfWindow: null,
    currentCallback: null,
    
    // Open PDF file
    openPDF: function() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/pdf';
        
        input.onchange = function(e) {
            if (e.target.files.length > 0) {
                const file = e.target.files[0];
                const url = URL.createObjectURL(file);
                
                // Store PDF URL
                localStorage.setItem('pdfUrl', url);
                
                // Open PDF in a new window
                PDFCapture.pdfWindow = window.open(url, 'pdfWindow', 'width=800,height=600');
                
                // Show capture buttons
                document.querySelectorAll('.upload-btn').forEach(btn => {
                    btn.style.display = 'block';
                });
                
                // Update PDF button
                const pdfBtn = document.getElementById('pdf-btn');
                pdfBtn.textContent = 'PDF Opened';
                pdfBtn.style.backgroundColor = '#1976d2';
            }
        };
        
        input.click();
    },
    
    // Capture screenshot
    capture: function(callback) {
        // Store callback
        this.currentCallback = callback;
        
        // Focus PDF window
        if (this.pdfWindow && !this.pdfWindow.closed) {
            this.pdfWindow.focus();
            
            // Show instructions
            alert('Use Win+Shift+S to capture a screenshot from the PDF, then press Ctrl+V to paste it here.');
            
            // Set up paste event listener
            document.addEventListener('paste', this.handlePaste);
        } else {
            alert('Please open a PDF first');
        }
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
                    if (PDFCapture.currentCallback) {
                        PDFCapture.currentCallback(event.target.result);
                        
                        // Remove paste event listener
                        document.removeEventListener('paste', PDFCapture.handlePaste);
                    }
                };
                
                reader.readAsDataURL(blob);
                break;
            }
        }
    }
};