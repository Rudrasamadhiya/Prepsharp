// Quick PDF capture script - minimal implementation
document.addEventListener('DOMContentLoaded', function() {
  // Create upload button
  const uploadBtn = document.createElement('button');
  uploadBtn.textContent = 'UPLOAD PDF';
  uploadBtn.style.position = 'fixed';
  uploadBtn.style.top = '70px';
  uploadBtn.style.right = '20px';
  uploadBtn.style.zIndex = '999';
  uploadBtn.style.padding = '10px 20px';
  uploadBtn.style.backgroundColor = '#4caf50';
  uploadBtn.style.color = 'white';
  uploadBtn.style.border = 'none';
  uploadBtn.style.borderRadius = '4px';
  uploadBtn.style.fontWeight = 'bold';
  
  document.body.appendChild(uploadBtn);
  
  // PDF URL
  let pdfUrl = null;
  
  // Upload handler
  uploadBtn.addEventListener('click', function() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'application/pdf';
    
    fileInput.onchange = function(e) {
      if (e.target.files.length > 0) {
        const file = e.target.files[0];
        pdfUrl = URL.createObjectURL(file);
        uploadBtn.textContent = 'PDF LOADED';
        uploadBtn.style.backgroundColor = '#1976d2';
      }
    };
    
    fileInput.click();
  });
  
  // Replace all screenshot buttons with direct handlers
  document.querySelectorAll('.upload-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      if (!pdfUrl) {
        alert('Please upload a PDF first');
        return;
      }
      
      // Create PDF viewer
      const overlay = document.createElement('div');
      overlay.style.position = 'fixed';
      overlay.style.top = '0';
      overlay.style.left = '0';
      overlay.style.width = '100%';
      overlay.style.height = '100%';
      overlay.style.backgroundColor = 'rgba(0,0,0,0.8)';
      overlay.style.zIndex = '9999';
      overlay.style.display = 'flex';
      overlay.style.flexDirection = 'column';
      
      // Create header
      const header = document.createElement('div');
      header.style.padding = '10px';
      header.style.backgroundColor = '#1976d2';
      header.style.color = 'white';
      header.style.display = 'flex';
      header.style.justifyContent = 'space-between';
      
      const title = document.createElement('h3');
      title.textContent = 'Take Screenshot';
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
      
      // Create iframe
      const iframe = document.createElement('iframe');
      iframe.src = pdfUrl;
      iframe.style.flex = '1';
      iframe.style.border = 'none';
      
      // Create capture button
      const captureBtn = document.createElement('button');
      captureBtn.textContent = 'Capture This Page';
      captureBtn.style.padding = '10px 20px';
      captureBtn.style.margin = '10px';
      captureBtn.style.backgroundColor = '#4caf50';
      captureBtn.style.color = 'white';
      captureBtn.style.border = 'none';
      captureBtn.style.borderRadius = '4px';
      
      // Add elements to overlay
      overlay.appendChild(header);
      overlay.appendChild(iframe);
      overlay.appendChild(captureBtn);
      document.body.appendChild(overlay);
      
      // Close button handler
      closeBtn.onclick = function() {
        document.body.removeChild(overlay);
      };
      
      // Capture button handler
      captureBtn.onclick = function() {
        try {
          const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
          
          html2canvas(iframeDoc.body).then(canvas => {
            // Get image data
            const imageData = canvas.toDataURL('image/png');
            
            // Find the target image element based on which button was clicked
            let targetImage;
            let targetContainer;
            
            if (btn.id === 'screenshot-question-btn') {
              targetImage = document.getElementById('question-image');
              targetContainer = document.getElementById('question-image-container');
            } else if (btn.id === 'screenshot-explanation-btn') {
              targetImage = document.getElementById('explanation-image');
              targetContainer = document.getElementById('explanation-image-container');
            } else if (btn.id.includes('option-')) {
              const option = btn.id.split('-')[2]; // Get a, b, c, or d
              targetImage = document.getElementById(`option-${option}-image`);
              targetContainer = document.getElementById(`option-${option}-image-container`);
            }
            
            // Set the image source and show the container
            if (targetImage && targetContainer) {
              targetImage.src = imageData;
              targetContainer.classList.remove('hidden');
            }
            
            // Close the overlay and return to add question page
            document.body.removeChild(overlay);
          }).catch(err => {
            console.error('Capture failed:', err);
            alert('Failed to capture screenshot');
          });
        } catch (err) {
          console.error('Error:', err);
          alert('Error accessing iframe content');
        }
      };
    });
  });
});