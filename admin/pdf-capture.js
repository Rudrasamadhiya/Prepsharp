// Simple PDF Upload and Capture
document.addEventListener('DOMContentLoaded', function() {
    const pdfBtn = document.getElementById('pdf-btn');
    const pdfContainer = document.getElementById('pdf-container');
    const pdfViewer = document.getElementById('pdf-viewer');
    const closePdfBtn = document.getElementById('close-pdf-btn');
    
    let pdfFile = null;
    let isUploading = false;
    
    // PDF Upload
    pdfBtn.addEventListener('click', function() {
        if (isUploading) return;
        
        if (pdfFile) {
            showPdfViewer();
            return;
        }
        
        isUploading = true;
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/pdf';
        
        input.onchange = function(e) {
            if (e.target.files[0]) {
                pdfFile = e.target.files[0];
                pdfBtn.innerHTML = '<i class="fas fa-file-pdf me-1"></i> PDF Uploaded';
                pdfBtn.classList.remove('btn-success');
                pdfBtn.classList.add('btn-primary');
            }
            isUploading = false;
        };
        
        input.click();
    });
    
    // Show PDF Viewer
    function showPdfViewer() {
        if (!pdfFile) return;
        
        pdfContainer.style.display = 'flex';
        const pdfUrl = URL.createObjectURL(pdfFile);
        pdfViewer.innerHTML = `<embed src="${pdfUrl}" type="application/pdf" width="100%" height="100%">`;
    }
    
    // Close PDF
    closePdfBtn.addEventListener('click', function() {
        pdfContainer.style.display = 'none';
    });
    
    // Capture buttons
    document.getElementById('capture-question-btn').addEventListener('click', function() {
        if (!pdfFile) {
            alert('Please upload a PDF first');
            return;
        }
        showPdfViewer();
    });
    
    document.querySelectorAll('.option-capture-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            if (!pdfFile) {
                alert('Please upload a PDF first');
                return;
            }
            showPdfViewer();
        });
    });
});