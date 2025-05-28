// Simple PDF uploader script
function openPdfUploader() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'application/pdf';
  
  input.onchange = function(e) {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      window.open(url, '_blank');
      
      const uploadBtn = document.getElementById('pdf-upload-btn');
      if (uploadBtn) {
        uploadBtn.textContent = 'PDF OPENED';
        uploadBtn.style.backgroundColor = '#1976d2';
      }
      
      alert('PDF opened in new tab. Use Win+Shift+S to capture screenshots, then click on a screenshot button and press Ctrl+V to paste.');
    }
  };
  
  input.click();
}