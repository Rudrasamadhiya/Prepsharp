// Simple PDF Screenshot Utility
const ScreenCapture = {
  pdfFile: null,
  pdfUrl: null,
  
  init: function(callback) {
    // Check if we have a stored PDF URL
    const storedPdfUrl = localStorage.getItem('prepsharp_pdf_url');
    if (storedPdfUrl) {
      this.pdfUrl = storedPdfUrl;
    }
    
    if (!this.pdfUrl) {
      this.uploadPDF(callback);
    } else {
      this.captureFromPDF(callback);
    }
  },
  
  uploadPDF: function(callback) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/pdf';
    
    input.onchange = (e) => {
      if (e.target.files.length > 0) {
        this.pdfFile = e.target.files[0];
        
        // Create object URL
        this.pdfUrl = URL.createObjectURL(this.pdfFile);
        
        // Store URL in localStorage
        localStorage.setItem('prepsharp_pdf_url', this.pdfUrl);
        
        // Proceed to capture
        this.captureFromPDF(callback);
      }
    };
    
    input.click();
  },
  
  captureFromPDF: function(callback) {
    // Create screen capture UI
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.backgroundColor = 'rgba(0,0,0,0.8)';
    container.style.zIndex = '9999';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    
    // Create header
    const header = document.createElement('div');
    header.style.padding = '10px';
    header.style.backgroundColor = '#1976d2';
    header.style.color = 'white';
    header.style.display = 'flex';
    header.style.justifyContent = 'space-between';
    header.style.alignItems = 'center';
    
    const title = document.createElement('h3');
    title.textContent = 'Take Screenshot from PDF';
    title.style.margin = '0';
    
    const instructions = document.createElement('span');
    instructions.textContent = 'Use your system screenshot tool (Win+Shift+S) to capture, then paste with Ctrl+V';
    instructions.style.fontSize = '14px';
    instructions.style.marginLeft = '20px';
    
    const closeBtn = document.createElement('button');
    closeBtn.textContent = '×';
    closeBtn.style.background = 'none';
    closeBtn.style.border = 'none';
    closeBtn.style.color = 'white';
    closeBtn.style.fontSize = '24px';
    closeBtn.style.cursor = 'pointer';
    
    header.appendChild(title);
    header.appendChild(instructions);
    header.appendChild(closeBtn);
    
    // Create content area
    const content = document.createElement('div');
    content.style.flex = '1';
    content.style.display = 'flex';
    content.style.flexDirection = 'column';
    
    // Create iframe to display PDF
    const iframe = document.createElement('iframe');
    iframe.src = this.pdfUrl;
    iframe.style.flex = '1';
    iframe.style.border = 'none';
    
    // Create paste area
    const pasteArea = document.createElement('div');
    pasteArea.style.padding = '15px';
    pasteArea.style.backgroundColor = '#f5f5f5';
    pasteArea.style.textAlign = 'center';
    pasteArea.style.borderTop = '1px solid #ddd';
    
    const pasteInstructions = document.createElement('p');
    pasteInstructions.textContent = 'After taking a screenshot, press Ctrl+V here to paste it';
    pasteInstructions.style.margin = '0 0 10px 0';
    
    const pasteBox = document.createElement('div');
    pasteBox.style.width = '100%';
    pasteBox.style.height = '100px';
    pasteBox.style.border = '2px dashed #ccc';
    pasteBox.style.backgroundColor = '#fff';
    pasteBox.style.display = 'flex';
    pasteBox.style.alignItems = 'center';
    pasteBox.style.justifyContent = 'center';
    pasteBox.textContent = 'Paste screenshot here (Ctrl+V)';
    pasteBox.style.cursor = 'pointer';
    
    pasteArea.appendChild(pasteInstructions);
    pasteArea.appendChild(pasteBox);
    
    content.appendChild(iframe);
    content.appendChild(pasteArea);
    
    // Add elements to container
    container.appendChild(header);
    container.appendChild(content);
    document.body.appendChild(container);
    
    // Close button event
    closeBtn.onclick = () => {
      document.body.removeChild(container);
    };
    
    // Make paste area focusable
    pasteBox.tabIndex = 0;
    
    // Focus paste area when clicked
    pasteBox.onclick = () => {
      pasteBox.focus();
    };
    
    // Handle paste events
    pasteBox.addEventListener('paste', (e) => {
      e.preventDefault();
      
      const items = e.clipboardData.items;
      
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const blob = items[i].getAsFile();
          const reader = new FileReader();
          
          reader.onload = (e) => {
            const imageDataUrl = e.target.result;
            
            // Remove container
            document.body.removeChild(container);
            
            // Call callback with image data
            callback(imageDataUrl);
          };
          
          reader.readAsDataURL(blob);
          return;
        }
      }
      
      // No image found in clipboard
      pasteBox.textContent = 'No image found in clipboard. Try copying an image first.';
      pasteBox.style.color = 'red';
      
      setTimeout(() => {
        pasteBox.textContent = 'Paste screenshot here (Ctrl+V)';
        pasteBox.style.color = 'inherit';
      }, 2000);
    });
    
    // Close on ESC key
    document.addEventListener('keydown', function escHandler(e) {
      if (e.key === 'Escape') {
        document.body.removeChild(container);
        document.removeEventListener('keydown', escHandler);
      }
    });
  }
};