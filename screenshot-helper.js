// Screenshot helper for PrepSharp
document.addEventListener('DOMContentLoaded', function() {
  // Add paste functionality to all screenshot buttons
  document.querySelectorAll('.upload-btn').forEach(function(btn) {
    if (!btn.textContent.includes('(Ctrl+V)')) {
      btn.textContent = btn.textContent + ' (Ctrl+V)';
    }
    
    btn.onclick = function() {
      // Check if PDF has been uploaded
      const pdfUploaded = localStorage.getItem('pdfUploaded') === 'true';
      const pdfUrl = localStorage.getItem('pdfUrl');
      
      if (!pdfUploaded) {
        alert('Please upload a PDF first using the UPLOAD PDF button in the header.');
        return;
      }
      
      // Focus on the PDF window if it exists
      const pdfWindow = window.open(pdfUrl, 'pdfWindow');
      if (pdfWindow) {
        pdfWindow.focus();
        alert('PDF window focused. Use Win+Shift+S to capture a screenshot, then press Ctrl+V here.');
      } else {
        alert('PDF window not found. Please upload the PDF again.');
        return;
      }
      
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