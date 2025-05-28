// Direct screenshot capture on webpage
document.addEventListener('DOMContentLoaded', function() {
  // Add direct capture functionality to all screenshot buttons
  document.querySelectorAll('.upload-btn').forEach(function(btn) {
    btn.textContent = btn.textContent.replace('Take Screenshot', 'Capture Area');
    
    btn.onclick = function() {
      // Create a selection area for screenshot
      const selection = document.createElement('div');
      selection.style.position = 'fixed';
      selection.style.border = '2px dashed #1976d2';
      selection.style.backgroundColor = 'rgba(25, 118, 210, 0.1)';
      selection.style.zIndex = '9999';
      selection.style.display = 'none';
      document.body.appendChild(selection);
      
      // Variables to track selection
      let isSelecting = false;
      let startX, startY;
      
      // Show instructions
      alert('Click and drag to select an area of the screen to capture');
      
      // Mouse down event - start selection
      document.addEventListener('mousedown', startSelection);
      
      function startSelection(e) {
        isSelecting = true;
        startX = e.clientX;
        startY = e.clientY;
        selection.style.left = startX + 'px';
        selection.style.top = startY + 'px';
        selection.style.width = '0px';
        selection.style.height = '0px';
        selection.style.display = 'block';
        
        document.addEventListener('mousemove', updateSelection);
        document.addEventListener('mouseup', endSelection);
        
        // Prevent default behavior
        e.preventDefault();
      }
      
      function updateSelection(e) {
        if (!isSelecting) return;
        
        const width = e.clientX - startX;
        const height = e.clientY - startY;
        
        if (width > 0) {
          selection.style.width = width + 'px';
        } else {
          selection.style.left = e.clientX + 'px';
          selection.style.width = (startX - e.clientX) + 'px';
        }
        
        if (height > 0) {
          selection.style.height = height + 'px';
        } else {
          selection.style.top = e.clientY + 'px';
          selection.style.height = (startY - e.clientY) + 'px';
        }
      }
      
      function endSelection(e) {
        isSelecting = false;
        document.removeEventListener('mousemove', updateSelection);
        document.removeEventListener('mouseup', endSelection);
        document.removeEventListener('mousedown', startSelection);
        
        // Get selection coordinates
        const rect = selection.getBoundingClientRect();
        
        // Remove selection element
        document.body.removeChild(selection);
        
        // Capture the selected area
        html2canvas(document.body, {
          x: window.scrollX + rect.left,
          y: window.scrollY + rect.top,
          width: rect.width,
          height: rect.height,
          scrollX: 0,
          scrollY: 0,
          windowWidth: document.documentElement.offsetWidth,
          windowHeight: document.documentElement.offsetHeight
        }).then(canvas => {
          // Find target elements based on button ID
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
            targetImage.src = canvas.toDataURL();
            if (targetContainer.classList) {
              targetContainer.classList.remove('hidden');
            } else {
              targetContainer.style.display = 'block';
            }
          }
        });
      }
    };
  });
});