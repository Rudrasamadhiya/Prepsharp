// Direct image loader that bypasses all existing code
(function() {
    // Function to directly load and display images
    function directLoadImages(folderPath) {
        console.log("Direct loading images from: " + folderPath);
        
        // Get current question number
        const questionNumber = window.currentQuestionIndex + 1;
        
        // Construct image paths
        const questionImagePath = `${folderPath}/Question-${questionNumber}.png`;
        const optionAImagePath = `${folderPath}/Question-${questionNumber} Option-1.png`;
        const optionBImagePath = `${folderPath}/Question-${questionNumber} Option-2.png`;
        const optionCImagePath = `${folderPath}/Question-${questionNumber} Option-3.png`;
        const optionDImagePath = `${folderPath}/Question-${questionNumber} Option-4.png`;
        
        // Create and display question image
        displayImage(questionImagePath, "question-image", true);
        
        // Create and display option images
        displayImage(optionAImagePath, "option-a", false);
        displayImage(optionBImagePath, "option-b", false);
        displayImage(optionCImagePath, "option-c", false);
        displayImage(optionDImagePath, "option-d", false);
    }
    
    // Function to display an image
    function displayImage(imagePath, targetId, isQuestion) {
        // Create image element
        const img = document.createElement('img');
        img.src = imagePath;
        img.style.maxWidth = '100%';
        img.style.border = '2px solid #4f46e5';
        img.style.borderRadius = '5px';
        img.style.padding = '5px';
        img.style.marginBottom = '10px';
        
        // Create container
        const container = document.createElement('div');
        container.className = 'direct-image-container';
        container.style.marginBottom = '15px';
        container.appendChild(img);
        
        // Find target element
        let targetElement;
        if (isQuestion) {
            // For question image
            targetElement = document.getElementById('question-text');
            if (targetElement) {
                // Hide question text
                targetElement.style.display = 'none';
                
                // Hide question text label
                const label = document.querySelector('label[for="question-text"]');
                if (label) label.style.display = 'none';
                
                // Hide question image label and input
                const imageLabel = document.querySelector('label[for="question-image"]');
                if (imageLabel) imageLabel.style.display = 'none';
                
                const imageInput = document.getElementById('question-image');
                if (imageInput && imageInput.parentElement) {
                    imageInput.parentElement.style.display = 'none';
                }
                
                // Insert image after the hidden text area
                if (targetElement.parentElement) {
                    targetElement.parentElement.insertBefore(container, targetElement.nextSibling);
                }
            }
        } else {
            // For option images
            targetElement = document.getElementById(`option-${targetId}-text`);
            if (targetElement) {
                // Hide option text
                targetElement.style.display = 'none';
                
                // Hide option image label and input
                const imageLabel = document.querySelector(`label[for="option-${targetId}-image"]`);
                if (imageLabel) imageLabel.style.display = 'none';
                
                const imageInput = document.getElementById(`option-${targetId}-image`);
                if (imageInput && imageInput.parentElement) {
                    imageInput.parentElement.style.display = 'none';
                }
                
                // Insert image after the hidden text area
                if (targetElement.parentElement) {
                    targetElement.parentElement.insertBefore(container, targetElement.nextSibling);
                }
            }
        }
        
        // Handle image load error
        img.onerror = function() {
            console.log(`Image not found: ${imagePath}`);
            container.remove();
        };
    }
    
    // Override the folder selection modal
    window.showFolderSelectionModal = function() {
        // Create modal HTML
        const modalHTML = `
        <div class="modal fade" id="folderSelectionModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title">Select Images Folder</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <label class="form-label">Folder Path</label>
                            <input type="text" class="form-control" id="direct-folder-path" 
                                placeholder="e.g., C:\\Users\\HP\\myproject\\jeeapp\\src\\webapp\\Prepsharp\\papers\\2024-1\\Physics">
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" id="direct-load-btn">Load Images</button>
                    </div>
                </div>
            </div>
        </div>`;
        
        // Add modal to body
        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = modalHTML;
        document.body.appendChild(modalContainer);
        
        // Initialize modal
        const modal = new bootstrap.Modal(document.getElementById('folderSelectionModal'));
        
        // Set default folder path if available
        const savedPath = localStorage.getItem('lastImageFolderPath');
        if (savedPath) {
            document.getElementById('direct-folder-path').value = savedPath;
        }
        
        // Set up load button
        document.getElementById('direct-load-btn').addEventListener('click', function() {
            const folderPath = document.getElementById('direct-folder-path').value.trim();
            if (!folderPath) {
                alert('Please enter a folder path');
                return;
            }
            
            // Save the folder path for next time
            localStorage.setItem('lastImageFolderPath', folderPath);
            
            // Load images
            directLoadImages(folderPath);
            
            // Hide modal
            modal.hide();
        });
        
        // Show modal
        modal.show();
    };
    
    // Add button to page
    window.addEventListener('load', function() {
        const topButtonGroup = document.querySelector('.top-navbar .d-flex.align-items-center');
        if (topButtonGroup) {
            const button = document.createElement('button');
            button.className = 'btn btn-info me-3';
            button.innerHTML = '<i class="fas fa-folder-open me-1"></i> Load Images';
            button.onclick = window.showFolderSelectionModal;
            
            // Add to page
            topButtonGroup.appendChild(button);
        }
    });
})();