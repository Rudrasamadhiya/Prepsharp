// Script to add a button that opens Windows Snipping Tool
document.addEventListener('DOMContentLoaded', function() {
    // Add a button to the PDF controls
    const pdfControls = document.querySelector('.pdf-controls');
    if (pdfControls) {
        const snippingBtn = document.createElement('button');
        snippingBtn.id = 'snipping-tool-btn';
        snippingBtn.className = 'btn btn-primary ms-2';
        snippingBtn.innerHTML = '<i class="fas fa-cut"></i> Snipping Tool';
        pdfControls.appendChild(snippingBtn);
        
        // Add click handler to open Snipping Tool
        snippingBtn.onclick = function() {
            // Try to open Snipping Tool using ActiveX (works only in IE)
            try {
                const shell = new ActiveXObject("WScript.Shell");
                shell.Run("snippingtool");
                return;
            } catch (e) {
                console.log("ActiveX not supported");
            }
            
            // Alternative approach - create a temporary link to ms-screenclip:
            try {
                const link = document.createElement('a');
                link.href = "ms-screenclip:";
                link.style.display = 'none';
                document.body.appendChild(link);
                link.click();
                setTimeout(() => {
                    document.body.removeChild(link);
                }, 100);
            } catch (e) {
                console.error("Failed to open Snipping Tool:", e);
                alert("Please press Win+Shift+S to open Snipping Tool manually");
            }
        };
    }
    
    // Enable pasting screenshots directly
    document.addEventListener('paste', function(e) {
        const items = (e.clipboardData || e.originalEvent.clipboardData).items;
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                const blob = items[i].getAsFile();
                const reader = new FileReader();
                reader.onload = function(event) {
                    // Set the image to question preview
                    const previewImg = document.getElementById('question-image-preview-img');
                    const previewContainer = document.getElementById('question-image-preview');
                    
                    if (previewImg && previewContainer) {
                        previewImg.src = event.target.result;
                        previewContainer.style.display = 'block';
                    }
                };
                reader.readAsDataURL(blob);
            }
        }
    });
});