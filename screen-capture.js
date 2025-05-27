// Simple PDF Screenshot Utility
const ScreenCapture = {
  pdfFile: null,
  pdfUrl: null,
  pdfData: null,
  
  init: function(callback) {
    // Check if we have stored PDF data
    const storedPdfData = localStorage.getItem('prepsharp_pdf');
    if (storedPdfData) {
      this.pdfData = storedPdfData;
      this.pdfUrl = storedPdfData;
      this.captureFromPDF(callback);
      return;
    }
    
    // Check if we have a stored PDF URL
    const storedPdfUrl = localStorage.getItem('prepsharp_pdf_url');
    if (storedPdfUrl) {
      this.pdfUrl = storedPdfUrl;
      this.captureFromPDF(callback);
      return;
    }
    
    // No PDF available, ask user to upload
    alert("Please upload a PDF first using the 'Upload PDF' button in the top right corner.");
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
    title.textContent = 'Select Area from PDF';
    title.style.margin = '0';
    
    const closeBtn = document.createElement('button');
    closeBtn.textContent = '×';
    closeBtn.style.background = 'none';
    closeBtn.style.border = 'none';
    closeBtn.style.color = 'white';
    closeBtn.style.fontSize = '24px';
    closeBtn.style.cursor = 'pointer';
    
    header.appendChild(title);
    header.appendChild(closeBtn);
    
    // Create content area
    const content = document.createElement('div');
    content.style.flex = '1';
    content.style.display = 'flex';
    content.style.flexDirection = 'column';
    content.style.position = 'relative';
    
    // Create iframe to display PDF
    const iframe = document.createElement('iframe');
    iframe.src = this.pdfUrl;
    iframe.style.flex = '1';
    iframe.style.border = 'none';
    iframe.id = 'pdf-iframe';
    
    // Create selection area
    const selectionArea = document.createElement('div');
    selectionArea.style.position = 'absolute';
    selectionArea.style.top = '0';
    selectionArea.style.left = '0';
    selectionArea.style.right = '0';
    selectionArea.style.bottom = '0';
    selectionArea.style.cursor = 'crosshair';
    
    // Create selection box
    const selectionBox = document.createElement('div');
    selectionBox.style.position = 'absolute';
    selectionBox.style.border = '2px dashed #4caf50';
    selectionBox.style.backgroundColor = 'rgba(76, 175, 80, 0.2)';
    selectionBox.style.display = 'none';
    
    // Create capture button
    const captureBtn = document.createElement('button');
    captureBtn.textContent = 'Capture Selected Area';
    captureBtn.style.position = 'absolute';
    captureBtn.style.bottom = '20px';
    captureBtn.style.right = '20px';
    captureBtn.style.padding = '10px 20px';
    captureBtn.style.backgroundColor = '#4caf50';
    captureBtn.style.color = 'white';
    captureBtn.style.border = 'none';
    captureBtn.style.borderRadius = '4px';
    captureBtn.style.cursor = 'pointer';
    captureBtn.style.display = 'none';
    
    // Add instructions
    const instructions = document.createElement('div');
    instructions.style.position = 'absolute';
    instructions.style.top = '10px';
    instructions.style.left = '10px';
    instructions.style.backgroundColor = 'rgba(0,0,0,0.7)';
    instructions.style.color = 'white';
    instructions.style.padding = '10px';
    instructions.style.borderRadius = '4px';
    instructions.style.fontSize = '14px';
    instructions.innerHTML = '<strong>Click and drag</strong> to select an area of the PDF';
    
    selectionArea.appendChild(selectionBox);
    selectionArea.appendChild(captureBtn);
    selectionArea.appendChild(instructions);
    
    content.appendChild(iframe);
    content.appendChild(selectionArea);
    
    // Add elements to container
    container.appendChild(header);
    container.appendChild(content);
    document.body.appendChild(container);
    
    // Variables for selection
    let isSelecting = false;
    let startX = 0;
    let startY = 0;
    let endX = 0;
    let endY = 0;
    
    // Selection events
    selectionArea.addEventListener('mousedown', (e) => {
      isSelecting = true;
      startX = e.clientX - selectionArea.getBoundingClientRect().left;
      startY = e.clientY - selectionArea.getBoundingClientRect().top;
      
      selectionBox.style.left = startX + 'px';
      selectionBox.style.top = startY + 'px';
      selectionBox.style.width = '0';
      selectionBox.style.height = '0';
      selectionBox.style.display = 'block';
      
      captureBtn.style.display = 'none';
    });
    
    selectionArea.addEventListener('mousemove', (e) => {
      if (!isSelecting) return;
      
      endX = e.clientX - selectionArea.getBoundingClientRect().left;
      endY = e.clientY - selectionArea.getBoundingClientRect().top;
      
      const width = Math.abs(endX - startX);
      const height = Math.abs(endY - startY);
      
      selectionBox.style.left = Math.min(startX, endX) + 'px';
      selectionBox.style.top = Math.min(startY, endY) + 'px';
      selectionBox.style.width = width + 'px';
      selectionBox.style.height = height + 'px';
    });
    
    selectionArea.addEventListener('mouseup', () => {
      if (!isSelecting) return;
      isSelecting = false;
      
      const width = Math.abs(endX - startX);
      const height = Math.abs(endY - startY);
      
      if (width > 10 && height > 10) {
        captureBtn.style.display = 'block';
        captureBtn.style.left = (Math.min(startX, endX) + width - captureBtn.offsetWidth) + 'px';
        captureBtn.style.top = (Math.min(startY, endY) + height + 10) + 'px';
      } else {
        selectionBox.style.display = 'none';
      }
    });
    
    // Capture button event
    captureBtn.addEventListener('click', () => {
      try {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Get selection dimensions
        const selLeft = parseInt(selectionBox.style.left);
        const selTop = parseInt(selectionBox.style.top);
        const selWidth = parseInt(selectionBox.style.width);
        const selHeight = parseInt(selectionBox.style.height);
        
        // Create temporary canvas for the iframe content
        html2canvas(iframeDoc.body, {
          backgroundColor: null,
          scale: 2 // Higher quality
        }).then(iframeCanvas => {
          // Set canvas size to selection size
          canvas.width = selWidth;
          canvas.height = selHeight;
          
          // Calculate scroll position
          const scrollX = iframe.contentWindow.scrollX || iframeDoc.documentElement.scrollLeft;
          const scrollY = iframe.contentWindow.scrollY || iframeDoc.documentElement.scrollTop;
          
          // Draw the selected portion to our canvas
          ctx.drawImage(
            iframeCanvas, 
            selLeft + scrollX, selTop + scrollY, // Source x, y
            selWidth, selHeight, // Source width, height
            0, 0, // Destination x, y
            selWidth, selHeight // Destination width, height
          );
          
          // Get the image data
          const imageDataUrl = canvas.toDataURL('image/png');
          
          // Remove container
          document.body.removeChild(container);
          
          // Call callback with image data
          callback(imageDataUrl);
        }).catch(err => {
          console.error('Capture failed:', err);
          alert('Failed to capture the selected area. Please try again.');
        });
      } catch (err) {
        console.error('Capture error:', err);
        alert('An error occurred while capturing. Please try again.');
      }
    });
    
    // Close button event
    closeBtn.onclick = () => {
      document.body.removeChild(container);
    };
    
    // Close on ESC key
    document.addEventListener('keydown', function escHandler(e) {
      if (e.key === 'Escape') {
        document.body.removeChild(container);
        document.removeEventListener('keydown', escHandler);
      }
    });
    
    // Wait for iframe to load
    iframe.onload = () => {
      // Add a small delay to ensure PDF is rendered
      setTimeout(() => {
        instructions.style.opacity = '1';
      }, 500);
    };
  }
};