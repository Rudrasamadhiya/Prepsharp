// Simple PDF uploader for PrepSharp
const PDFUploader = {
  init: function() {
    // Create upload button
    const uploadContainer = document.createElement('div');
    uploadContainer.style.position = 'fixed';
    uploadContainer.style.top = '70px';
    uploadContainer.style.right = '20px';
    uploadContainer.style.zIndex = '999';
    uploadContainer.style.backgroundColor = 'rgba(255,255,255,0.9)';
    uploadContainer.style.padding = '10px';
    uploadContainer.style.borderRadius = '8px';
    uploadContainer.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
    uploadContainer.style.border = '2px solid #4caf50';
    
    const uploadBtn = document.createElement('button');
    uploadBtn.textContent = 'UPLOAD PDF FIRST';
    uploadBtn.style.padding = '10px 20px';
    uploadBtn.style.backgroundColor = '#4caf50';
    uploadBtn.style.color = 'white';
    uploadBtn.style.border = 'none';
    uploadBtn.style.borderRadius = '4px';
    uploadBtn.style.cursor = 'pointer';
    uploadBtn.style.fontWeight = 'bold';
    uploadBtn.style.fontSize = '16px';
    uploadBtn.style.width = '100%';
    
    const statusEl = document.createElement('div');
    statusEl.style.textAlign = 'center';
    statusEl.style.marginTop = '8px';
    statusEl.style.fontSize = '14px';
    statusEl.style.color = '#666';
    statusEl.style.fontWeight = 'bold';
    
    uploadContainer.appendChild(uploadBtn);
    uploadContainer.appendChild(statusEl);
    document.body.appendChild(uploadContainer);
    
    // Check if PDF is already loaded
    if (sessionStorage.getItem('prepsharp_pdf_loaded') === 'true') {
      const pdfName = localStorage.getItem('prepsharp_pdf_name');
      statusEl.textContent = pdfName ? `PDF loaded: ${pdfName}` : 'PDF loaded';
      statusEl.style.color = '#4caf50';
      uploadBtn.textContent = 'Change PDF';
    }
    
    // Add click event
    uploadBtn.addEventListener('click', function() {
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'application/pdf';
      
      fileInput.onchange = function(e) {
        if (e.target.files.length > 0) {
          const file = e.target.files[0];
          
          // Show loading status
          statusEl.textContent = 'Loading PDF...';
          statusEl.style.color = '#1976d2';
          
          // Create object URL for the PDF
          const pdfUrl = URL.createObjectURL(file);
          
          // Store in ScreenCapture object
          if (window.ScreenCapture) {
            window.ScreenCapture.pdfUrl = pdfUrl;
            window.ScreenCapture.pdfData = pdfUrl;
          }
          
          // Set session flag
          sessionStorage.setItem('prepsharp_pdf_loaded', 'true');
          localStorage.setItem('prepsharp_pdf_name', file.name);
          
          // Update UI
          statusEl.textContent = `PDF loaded: ${file.name}`;
          statusEl.style.color = '#4caf50';
          uploadBtn.textContent = 'Change PDF';
          
          alert('PDF uploaded successfully! You can now take screenshots from it.');
        }
      };
      
      fileInput.click();
    });
  }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  PDFUploader.init();
});