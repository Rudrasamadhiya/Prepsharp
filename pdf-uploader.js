// PDF Uploader and Screenshot Handler
const PDFUploader = {
    pdfViewer: null,
    captureArea: null,
    
    // Initialize the PDF viewer and capture area
    init: function() {
        // Create PDF viewer container
        this.pdfViewer = document.createElement('div');
        this.pdfViewer.id = 'pdf-viewer';
        this.pdfViewer.style.height = '80vh';
        this.pdfViewer.style.width = '100%';
        this.pdfViewer.style.border = '1px solid #ccc';
        this.pdfViewer.style.marginBottom = '10px';
        this.pdfViewer.style.display = 'none';
        
        // Create capture area
        this.captureArea = document.createElement('div');
        this.captureArea.id = 'capture-area';
        this.captureArea.style.height = '20vh';
        this.captureArea.style.width = '100%';
        this.captureArea.style.border = '1px dashed #ccc';
        this.captureArea.style.display = 'flex';
        this.captureArea.style.alignItems = 'center';
        this.captureArea.style.justifyContent = 'center';
        this.captureArea.style.flexDirection = 'column';
        this.captureArea.style.backgroundColor = '#f9f9f9';
        this.captureArea.style.display = 'none';
        
        // Add instructions
        const instructions = document.createElement('p');
        instructions.textContent = 'Press Ctrl+V to paste screenshot here';
        this.captureArea.appendChild(instructions);
        
        // Add to document
        document.body.appendChild(this.pdfViewer);
        document.body.appendChild(this.captureArea);
        
        // Set up paste event listener
        document.addEventListener('paste', this.handlePaste.bind(this));
    },
    
    // Open PDF file
    openPDF: function() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/pdf';
        
        input.onchange = (e) => {
            if (e.target.files.length > 0) {
                const file = e.target.files[0];
                const url = URL.createObjectURL(file);
                
                // Store PDF URL
                localStorage.setItem('pdfUrl', url);
                localStorage.setItem('pdfOpened', 'true');
                
                // Show PDF viewer and capture area
                this.showPDFViewer(url);
                
                // Update PDF button
                const pdfBtn = document.getElementById('pdf-btn');
                pdfBtn.textContent = 'PDF Opened';
                pdfBtn.style.backgroundColor = '#1976d2';
                
                // Show capture buttons
                document.querySelectorAll('.upload-btn').forEach(btn => {
                    btn.style.display = 'block';
                });
            }
        };
        
        input.click();
    },
    
    // Show PDF viewer
    showPDFViewer: function(url) {
        // Create iframe for PDF
        const iframe = document.createElement('iframe');
        iframe.src = url;
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = 'none';
        
        // Clear previous content
        this.pdfViewer.innerHTML = '';
        this.pdfViewer.appendChild(iframe);
        
        // Show PDF viewer and capture area
        this.pdfViewer.style.display = 'block';
        this.captureArea.style.display = 'flex';
        
        // Adjust main container
        const container = document.querySelector('.container');
        container.style.maxWidth = '100%';
        container.style.padding = '0 10px';
        
        // Hide the card temporarily
        const card = document.querySelector('.card');
        card.style.display = 'none';
        
        // Add close button
        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'Close PDF';
        closeBtn.className = 'btn';
        closeBtn.style.position = 'absolute';
        closeBtn.style.top = '10px';
        closeBtn.style.right = '10px';
        closeBtn.style.zIndex = '1000';
        
        closeBtn.addEventListener('click', () => {
            this.closePDFViewer();
        });
        
        this.pdfViewer.appendChild(closeBtn);
    },
    
    // Close PDF viewer
    closePDFViewer: function() {
        this.pdfViewer.style.display = 'none';
        this.captureArea.style.display = 'none';
        
        // Restore container and card
        const container = document.querySelector('.container');
        container.style.maxWidth = '800px';
        
        const card = document.querySelector('.card');
        card.style.display = 'block';
    },
    
    // Handle paste event
    handlePaste: function(e) {
        // Only process if capture area is visible
        if (this.captureArea.style.display !== 'flex') return;
        
        const items = e.clipboardData.items;
        
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                const blob = items[i].getAsFile();
                const reader = new FileReader();
                
                reader.onload = (event) => {
                    const imageData = event.target.result;
                    
                    // Create image preview
                    const img = document.createElement('img');
                    img.src = imageData;
                    img.style.maxWidth = '90%';
                    img.style.maxHeight = '80%';
                    
                    // Clear capture area and add image
                    this.captureArea.innerHTML = '';
                    this.captureArea.appendChild(img);
                    
                    // Add buttons
                    const buttonContainer = document.createElement('div');
                    buttonContainer.style.marginTop = '10px';
                    
                    // Use for question button
                    const useForQuestionBtn = document.createElement('button');
                    useForQuestionBtn.textContent = 'Use for Question';
                    useForQuestionBtn.className = 'btn';
                    useForQuestionBtn.style.marginRight = '10px';
                    
                    useForQuestionBtn.addEventListener('click', () => {
                        document.getElementById('question-image').src = imageData;
                        document.getElementById('question-image-container').classList.remove('hidden');
                        this.closePDFViewer();
                    });
                    
                    // Use for option button
                    const useForOptionBtn = document.createElement('button');
                    useForOptionBtn.textContent = 'Use for Option';
                    useForOptionBtn.className = 'btn secondary';
                    
                    useForOptionBtn.addEventListener('click', () => {
                        // Find first empty option
                        const options = ['a', 'b', 'c', 'd'];
                        let optionUsed = false;
                        
                        for (const letter of options) {
                            const optionInput = document.getElementById(`option-text-${letter}`);
                            if (!optionInput.value) {
                                optionInput.value = `[Image Option ${letter.toUpperCase()}]`;
                                
                                // Create or update option image container
                                let imgContainer = document.getElementById(`option-image-${letter}-container`);
                                if (!imgContainer) {
                                    imgContainer = document.createElement('div');
                                    imgContainer.id = `option-image-${letter}-container`;
                                    imgContainer.className = 'image-container';
                                    imgContainer.style.marginTop = '5px';
                                    
                                    const img = document.createElement('img');
                                    img.id = `option-image-${letter}`;
                                    img.style.maxWidth = '100%';
                                    img.style.maxHeight = '100px';
                                    
                                    const removeBtn = document.createElement('button');
                                    removeBtn.className = 'remove-btn';
                                    removeBtn.textContent = '×';
                                    removeBtn.onclick = function() {
                                        imgContainer.style.display = 'none';
                                        img.src = '';
                                        optionInput.value = '';
                                    };
                                    
                                    imgContainer.appendChild(img);
                                    imgContainer.appendChild(removeBtn);
                                    
                                    // Add after the option input
                                    optionInput.parentNode.appendChild(imgContainer);
                                }
                                
                                // Set image source
                                const optionImg = document.getElementById(`option-image-${letter}`);
                                optionImg.src = imageData;
                                imgContainer.style.display = 'block';
                                
                                optionUsed = true;
                                break;
                            }
                        }
                        
                        if (!optionUsed) {
                            alert('All options are already filled. Clear an option first.');
                        } else {
                            // Clear capture area
                            this.captureArea.innerHTML = '';
                            this.captureArea.appendChild(document.createElement('p')).textContent = 'Press Ctrl+V to paste screenshot here';
                        }
                    });
                    
                    // Cancel button
                    const cancelBtn = document.createElement('button');
                    cancelBtn.textContent = 'Cancel';
                    cancelBtn.className = 'btn';
                    cancelBtn.style.marginLeft = '10px';
                    cancelBtn.style.backgroundColor = '#f44336';
                    
                    cancelBtn.addEventListener('click', () => {
                        // Clear capture area
                        this.captureArea.innerHTML = '';
                        this.captureArea.appendChild(document.createElement('p')).textContent = 'Press Ctrl+V to paste screenshot here';
                    });
                    
                    buttonContainer.appendChild(useForQuestionBtn);
                    buttonContainer.appendChild(useForOptionBtn);
                    buttonContainer.appendChild(cancelBtn);
                    this.captureArea.appendChild(buttonContainer);
                    
                    break;
                };
                
                reader.readAsDataURL(blob);
                break;
            }
        }
    }
};