// PDF Viewer and Screenshot Utility
const PDFViewer = {
  pdfData: null,
  currentPage: 1,
  totalPages: 1,
  scale: 1.0,
  
  // Initialize the PDF viewer
  init: function() {
    // Create PDF viewer container if it doesn't exist
    if (!document.getElementById('pdf-viewer-container')) {
      this.createViewerUI();
    }
    
    // Hide the viewer initially
    this.hideViewer();
    
    // Add upload button to the page
    this.addUploadButton();
  },
  
  // Create the PDF viewer UI
  createViewerUI: function() {
    const container = document.createElement('div');
    container.id = 'pdf-viewer-container';
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    container.style.zIndex = '9999';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.alignItems = 'center';
    container.style.justifyContent = 'center';
    
    // Create header with controls
    const header = document.createElement('div');
    header.style.width = '100%';
    header.style.padding = '10px';
    header.style.backgroundColor = '#1976d2';
    header.style.color = 'white';
    header.style.display = 'flex';
    header.style.justifyContent = 'space-between';
    header.style.alignItems = 'center';
    
    // Page navigation
    const pageControls = document.createElement('div');
    
    const prevBtn = document.createElement('button');
    prevBtn.textContent = '< Prev';
    prevBtn.style.marginRight = '10px';
    prevBtn.style.padding = '5px 10px';
    prevBtn.style.backgroundColor = '#42a5f5';
    prevBtn.style.border = 'none';
    prevBtn.style.borderRadius = '4px';
    prevBtn.style.color = 'white';
    prevBtn.style.cursor = 'pointer';
    prevBtn.onclick = () => this.prevPage();
    
    const pageInfo = document.createElement('span');
    pageInfo.id = 'pdf-page-info';
    pageInfo.textContent = 'Page 1 of 1';
    pageInfo.style.margin = '0 10px';
    
    const nextBtn = document.createElement('button');
    nextBtn.textContent = 'Next >';
    nextBtn.style.marginLeft = '10px';
    nextBtn.style.padding = '5px 10px';
    nextBtn.style.backgroundColor = '#42a5f5';
    nextBtn.style.border = 'none';
    nextBtn.style.borderRadius = '4px';
    nextBtn.style.color = 'white';
    nextBtn.style.cursor = 'pointer';
    nextBtn.onclick = () => this.nextPage();
    
    pageControls.appendChild(prevBtn);
    pageControls.appendChild(pageInfo);
    pageControls.appendChild(nextBtn);
    
    // Zoom controls
    const zoomControls = document.createElement('div');
    
    const zoomOutBtn = document.createElement('button');
    zoomOutBtn.textContent = '−';
    zoomOutBtn.style.padding = '5px 10px';
    zoomOutBtn.style.backgroundColor = '#42a5f5';
    zoomOutBtn.style.border = 'none';
    zoomOutBtn.style.borderRadius = '4px';
    zoomOutBtn.style.color = 'white';
    zoomOutBtn.style.cursor = 'pointer';
    zoomOutBtn.onclick = () => this.zoomOut();
    
    const zoomInfo = document.createElement('span');
    zoomInfo.id = 'pdf-zoom-info';
    zoomInfo.textContent = '100%';
    zoomInfo.style.margin = '0 10px';
    
    const zoomInBtn = document.createElement('button');
    zoomInBtn.textContent = '+';
    zoomInBtn.style.padding = '5px 10px';
    zoomInBtn.style.backgroundColor = '#42a5f5';
    zoomInBtn.style.border = 'none';
    zoomInBtn.style.borderRadius = '4px';
    zoomInBtn.style.color = 'white';
    zoomInBtn.style.cursor = 'pointer';
    zoomInBtn.onclick = () => this.zoomIn();
    
    zoomControls.appendChild(zoomOutBtn);
    zoomControls.appendChild(zoomInfo);
    zoomControls.appendChild(zoomInBtn);
    
    // Close button
    const closeBtn = document.createElement('button');
    closeBtn.textContent = '✕';
    closeBtn.style.padding = '5px 10px';
    closeBtn.style.backgroundColor = '#f44336';
    closeBtn.style.border = 'none';
    closeBtn.style.borderRadius = '4px';
    closeBtn.style.color = 'white';
    closeBtn.style.cursor = 'pointer';
    closeBtn.onclick = () => this.hideViewer();
    
    header.appendChild(pageControls);
    header.appendChild(zoomControls);
    header.appendChild(closeBtn);
    
    // Create content area
    const content = document.createElement('div');
    content.style.position = 'relative';
    content.style.flex = '1';
    content.style.width = '100%';
    content.style.overflow = 'auto';
    content.style.backgroundColor = '#f5f5f5';
    
    // Canvas for PDF rendering
    const canvas = document.createElement('canvas');
    canvas.id = 'pdf-canvas';
    canvas.style.display = 'block';
    canvas.style.margin = '20px auto';
    canvas.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
    
    content.appendChild(canvas);
    
    // Selection overlay for screenshots
    const overlay = document.createElement('div');
    overlay.id = 'pdf-selection-overlay';
    overlay.style.position = 'absolute';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.cursor = 'crosshair';
    overlay.style.zIndex = '1';
    
    content.appendChild(overlay);
    
    // Add elements to container
    container.appendChild(header);
    container.appendChild(content);
    
    // Add to body
    document.body.appendChild(container);
    
    // Set up selection functionality
    this.setupSelectionCapture();
  },
  
  // Add PDF upload button to the page
  addUploadButton: function() {
    // Check if we already have a PDF upload button
    if (document.getElementById('pdf-upload-btn')) {
      return;
    }
    
    // Create upload button container
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '10px';
    container.style.right = '10px';
    container.style.zIndex = '999';
    
    // Create upload button
    const uploadBtn = document.createElement('button');
    uploadBtn.id = 'pdf-upload-btn';
    uploadBtn.textContent = 'Upload PDF';
    uploadBtn.style.padding = '8px 16px';
    uploadBtn.style.backgroundColor = '#4caf50';
    uploadBtn.style.color = 'white';
    uploadBtn.style.border = 'none';
    uploadBtn.style.borderRadius = '4px';
    uploadBtn.style.cursor = 'pointer';
    
    // Add click event
    uploadBtn.addEventListener('click', () => {
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'application/pdf';
      fileInput.style.display = 'none';
      
      fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          this.loadPDF(file);
        }
      });
      
      document.body.appendChild(fileInput);
      fileInput.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(fileInput);
      }, 1000);
    });
    
    container.appendChild(uploadBtn);
    document.body.appendChild(container);
  },
  
  // Load a PDF file
  loadPDF: function(file) {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      this.pdfData = e.target.result;
      
      // Store PDF data in localStorage for persistence
      try {
        localStorage.setItem('lastUploadedPDF', this.pdfData);
      } catch (err) {
        console.warn('Could not save PDF to localStorage (likely too large)');
      }
      
      // Render the PDF
      this.renderPDF();
      
      // Show the viewer
      this.showViewer();
    };
    
    reader.readAsDataURL(file);
  },
  
  // Render the current PDF page
  renderPDF: function() {
    if (!this.pdfData) {
      return;
    }
    
    const canvas = document.getElementById('pdf-canvas');
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Create image from PDF data
    const img = new Image();
    img.onload = () => {
      // Set canvas dimensions
      canvas.width = img.width * this.scale;
      canvas.height = img.height * this.scale;
      
      // Draw image
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      // Update page info
      document.getElementById('pdf-page-info').textContent = `Page ${this.currentPage} of ${this.totalPages}`;
      document.getElementById('pdf-zoom-info').textContent = `${Math.round(this.scale * 100)}%`;
    };
    
    img.src = this.pdfData;
  },
  
  // Set up selection capture functionality
  setupSelectionCapture: function() {
    const overlay = document.getElementById('pdf-selection-overlay');
    const canvas = document.getElementById('pdf-canvas');
    
    let isSelecting = false;
    let startX, startY;
    let selectionBox = null;
    
    // Mouse down - start selection
    overlay.addEventListener('mousedown', (e) => {
      isSelecting = true;
      
      // Get position relative to the canvas
      const rect = canvas.getBoundingClientRect();
      startX = e.clientX - rect.left;
      startY = e.clientY - rect.top;
      
      // Remove any existing selection box
      if (selectionBox) {
        overlay.removeChild(selectionBox);
      }
      
      // Create new selection box
      selectionBox = document.createElement('div');
      selectionBox.style.position = 'absolute';
      selectionBox.style.border = '2px dashed #00BFFF';
      selectionBox.style.backgroundColor = 'rgba(0, 191, 255, 0.2)';
      selectionBox.style.pointerEvents = 'none';
      
      overlay.appendChild(selectionBox);
    });
    
    // Mouse move - update selection
    overlay.addEventListener('mousemove', (e) => {
      if (!isSelecting) return;
      
      const rect = canvas.getBoundingClientRect();
      const currentX = e.clientX - rect.left;
      const currentY = e.clientY - rect.top;
      
      // Calculate selection dimensions
      const left = Math.min(startX, currentX);
      const top = Math.min(startY, currentY);
      const width = Math.abs(currentX - startX);
      const height = Math.abs(currentY - startY);
      
      // Update selection box
      selectionBox.style.left = left + 'px';
      selectionBox.style.top = top + 'px';
      selectionBox.style.width = width + 'px';
      selectionBox.style.height = height + 'px';
    });
    
    // Mouse up - end selection and capture
    overlay.addEventListener('mouseup', (e) => {
      if (!isSelecting) return;
      isSelecting = false;
      
      const rect = canvas.getBoundingClientRect();
      const endX = e.clientX - rect.left;
      const endY = e.clientY - rect.top;
      
      // Calculate selection dimensions
      const left = Math.min(startX, endX);
      const top = Math.min(startY, endY);
      const width = Math.abs(endX - startX);
      const height = Math.abs(endY - startY);
      
      // Capture the selection if it's large enough
      if (width > 10 && height > 10) {
        this.captureSelection(left, top, width, height);
      }
      
      // Remove selection box
      if (selectionBox) {
        overlay.removeChild(selectionBox);
        selectionBox = null;
      }
    });
  },
  
  // Capture the selected area of the PDF
  captureSelection: function(x, y, width, height) {
    const canvas = document.getElementById('pdf-canvas');
    const captureCanvas = document.createElement('canvas');
    captureCanvas.width = width;
    captureCanvas.height = height;
    
    const ctx = captureCanvas.getContext('2d');
    ctx.drawImage(canvas, x, y, width, height, 0, 0, width, height);
    
    // Convert to data URL
    const dataURL = captureCanvas.toDataURL('image/png');
    
    // Hide the viewer
    this.hideViewer();
    
    // Call the active screenshot callback if available
    if (this.activeCallback) {
      this.activeCallback(dataURL);
      this.activeCallback = null;
    }
  },
  
  // Show the PDF viewer
  showViewer: function() {
    const container = document.getElementById('pdf-viewer-container');
    if (container) {
      container.style.display = 'flex';
    }
  },
  
  // Hide the PDF viewer
  hideViewer: function() {
    const container = document.getElementById('pdf-viewer-container');
    if (container) {
      container.style.display = 'none';
    }
  },
  
  // Navigate to the previous page
  prevPage: function() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.renderPDF();
    }
  },
  
  // Navigate to the next page
  nextPage: function() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.renderPDF();
    }
  },
  
  // Zoom in
  zoomIn: function() {
    this.scale *= 1.2;
    this.renderPDF();
  },
  
  // Zoom out
  zoomOut: function() {
    this.scale /= 1.2;
    this.renderPDF();
  },
  
  // Take a screenshot from the PDF
  takeScreenshot: function(callback) {
    // Store the callback
    this.activeCallback = callback;
    
    // Check if we have a PDF loaded
    if (!this.pdfData) {
      // Try to load from localStorage
      const savedPDF = localStorage.getItem('lastUploadedPDF');
      if (savedPDF) {
        this.pdfData = savedPDF;
        this.renderPDF();
        this.showViewer();
      } else {
        // No PDF loaded, show upload prompt
        alert('Please upload a PDF first');
        
        // Create a file input
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'application/pdf';
        fileInput.style.display = 'none';
        
        fileInput.addEventListener('change', (e) => {
          const file = e.target.files[0];
          if (file) {
            this.loadPDF(file);
          }
        });
        
        document.body.appendChild(fileInput);
        fileInput.click();
        
        // Clean up
        setTimeout(() => {
          document.body.removeChild(fileInput);
        }, 1000);
      }
    } else {
      // We have a PDF, show the viewer
      this.showViewer();
    }
  }
};

// Initialize the PDF viewer when the page loads
document.addEventListener('DOMContentLoaded', () => {
  PDFViewer.init();
});