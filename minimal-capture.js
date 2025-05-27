// Minimal PDF capture script
let pdfUrl = null;

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

// Upload handler
uploadBtn.onclick = function() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'application/pdf';
  
  input.onchange = function(e) {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      pdfUrl = URL.createObjectURL(file);
      uploadBtn.textContent = 'PDF LOADED';
      uploadBtn.style.backgroundColor = '#1976d2';
    }
  };
  
  input.click();
};

// Replace screenshot buttons
document.querySelectorAll('.upload-btn').forEach(function(btn) {
  btn.onclick = function() {
    if (!pdfUrl) {
      alert('Please upload a PDF first');
      return;
    }
    
    // Create viewer
    const viewer = document.createElement('div');
    viewer.style.position = 'fixed';
    viewer.style.top = '0';
    viewer.style.left = '0';
    viewer.style.width = '100%';
    viewer.style.height = '100%';
    viewer.style.backgroundColor = 'rgba(0,0,0,0.8)';
    viewer.style.zIndex = '9999';
    viewer.style.display = 'flex';
    viewer.style.flexDirection = 'column';
    
    // Create header
    const header = document.createElement('div');
    header.style.padding = '10px';
    header.style.backgroundColor = '#1976d2';
    header.style.color = 'white';
    header.style.display = 'flex';
    header.style.justifyContent = 'space-between';
    
    const title = document.createElement('h3');
    title.textContent = 'Click on PDF to capture';
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
    
    // Add elements
    viewer.appendChild(header);
    viewer.appendChild(iframe);
    document.body.appendChild(viewer);
    
    // Close button
    closeBtn.onclick = function() {
      document.body.removeChild(viewer);
    };
    
    // Wait for iframe to load
    iframe.onload = function() {
      // Create click overlay
      const overlay = document.createElement('div');
      overlay.style.position = 'absolute';
      overlay.style.top = '0';
      overlay.style.left = '0';
      overlay.style.right = '0';
      overlay.style.bottom = '0';
      overlay.style.cursor = 'pointer';
      iframe.parentNode.appendChild(overlay);
      
      // Click to capture
      overlay.onclick = function() {
        try {
          const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
          
          html2canvas(iframeDoc.body).then(function(canvas) {
            // Get image data
            const imageData = canvas.toDataURL('image/png');
            
            // Find target elements
            let targetImage, targetContainer;
            
            if (btn.id === 'screenshot-question-btn') {
              targetImage = document.getElementById('question-image');
              targetContainer = document.getElementById('question-image-container');
            } else if (btn.id === 'screenshot-explanation-btn') {
              targetImage = document.getElementById('explanation-image');
              targetContainer = document.getElementById('explanation-image-container');
            } else if (btn.id.includes('option-')) {
              const option = btn.id.split('-')[2]; // a, b, c, d
              targetImage = document.getElementById('option-' + option + '-image');
              targetContainer = document.getElementById('option-' + option + '-image-container');
            }
            
            // Set image and show container
            if (targetImage && targetContainer) {
              targetImage.src = imageData;
              targetContainer.classList.remove('hidden');
            }
            
            // Close viewer
            document.body.removeChild(viewer);
          }).catch(function(err) {
            console.error('Capture failed:', err);
            alert('Failed to capture screenshot');
          });
        } catch (err) {
          console.error('Error:', err);
          alert('Error accessing iframe content');
        }
      };
    };
  };
});