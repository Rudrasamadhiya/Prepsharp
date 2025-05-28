// Simple paste-from-clipboard script
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
  
  // Upload handler
  uploadBtn.onclick = function() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/pdf';
    
    input.onchange = function(e) {
      if (e.target.files.length > 0) {
        const file = e.target.files[0];
        const url = URL.createObjectURL(file);
        
        // Open PDF in new window
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
      // Create paste instructions
      const instructions = document.createElement('div');
      instructions.style.position = 'fixed';
      instructions.style.top = '50%';
      instructions.style.left = '50%';
      instructions.style.transform = 'translate(-50%, -50%)';
      instructions.style.backgroundColor = 'white';
      instructions.style.padding = '20px';
      instructions.style.borderRadius = '8px';
      instructions.style.boxShadow = '0 0 10px rgba(0,0,0,0.3)';
      instructions.style.zIndex = '9999';
      instructions.style.textAlign = 'center';
      
      instructions.innerHTML = '<h3>Paste Screenshot</h3>' +
                              '<p>Press Ctrl+V to paste your screenshot</p>' +
                              '<p>(Press Escape to cancel)</p>';
      
      document.body.appendChild(instructions);
      
      // Handle paste event
      function handlePaste(e) {
        const items = e.clipboardData.items;
        
        for (let i = 0; i < items.length; i++) {
          if (items[i].type.indexOf('image') !== -1) {
            // Get image from clipboard
            const blob = items[i].getAsFile();
            const reader = new FileReader();
            
            reader.onload = function(event) {
              const imageData = event.target.result;
              
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
              
              // Remove instructions and event listener
              document.body.removeChild(instructions);
              document.removeEventListener('paste', handlePaste);
              document.removeEventListener('keydown', handleEscape);
            };
            
            reader.readAsDataURL(blob);
            break;
          }
        }
      }
      
      // Handle escape key
      function handleEscape(e) {
        if (e.key === 'Escape') {
          document.body.removeChild(instructions);
          document.removeEventListener('paste', handlePaste);
          document.removeEventListener('keydown', handleEscape);
        }
      }
      
      // Add event listeners
      document.addEventListener('paste', handlePaste);
      document.addEventListener('keydown', handleEscape);
    };
  });
});