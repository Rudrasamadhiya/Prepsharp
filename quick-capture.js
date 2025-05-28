// PDF upload and screenshot capture utility
document.addEventListener('DOMContentLoaded', function() {
  // Create upload button
  const uploadBtn = document.createElement('button');
  uploadBtn.textContent = 'OPEN PDF';
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
        const url = URL.createObjectURL(file);
        window.open(url, '_blank');
        
        uploadBtn.textContent = 'PDF OPENED';
        uploadBtn.style.backgroundColor = '#1976d2';
        
        alert('PDF opened in new tab. Use Win+Shift+S to capture screenshots, then click on a screenshot button and press Ctrl+V to paste.');
      }
    };
    
    input.click();
  };
  
  // Replace screenshot buttons with paste handlers
  document.querySelectorAll('.upload-btn').forEach(function(btn) {
    btn.textContent = btn.textContent + ' (Ctrl+V)';
    
    btn.onclick = function() {
      alert('Press Ctrl+V to paste your screenshot');
      
      function handlePaste(e) {
        const items = e.clipboardData.items;
        
        for (let i = 0; i < items.length; i++) {
          if (items[i].type.indexOf('image') !== -1) {
            const blob = items[i].getAsFile();
            const reader = new FileReader();
            
            reader.onload = function(event) {
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
              } else if (btn.id.includes('section-')) {
                const section = btn.id.split('-')[1]; // section number
                targetImage = document.getElementById('section-' + section + '-image');
                targetContainer = document.getElementById('section-' + section + '-image-container');
              }
              
              // Set image and show container
              if (targetImage && targetContainer) {
                targetImage.src = event.target.result;
                if (targetContainer.classList) {
                  targetContainer.classList.remove('hidden');
                } else {
                  targetContainer.style.display = 'block';
                }
              }
              
              document.removeEventListener('paste', handlePaste);
            };
            
            reader.readAsDataURL(blob);
            break;
          }
        }
      }
      
      document.addEventListener('paste', handlePaste);
    };
  });
});