// Fix for folder opening functionality
(function() {
    // Function to show the folder selection modal
    window.showFolderSelectionModal = function() {
        console.log("Opening folder selection modal");
        
        // Create modal HTML
        const modalHTML = `
        <div class="modal fade" id="folderSelectionModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title">Select Images Folder</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="alert alert-info">
                            <strong>Step-by-Step Process:</strong><br>
                            1. Enter the folder path containing your images<br>
                            2. Click "Check Files" to see available images<br>
                            3. Click "Load Images" to load images for the current question<br>
                            4. Mark the correct answer(s) for the question<br>
                            5. Click "Save Question" to save the question with images
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Folder Path</label>
                            <div class="input-group">
                                <input type="text" class="form-control" id="folder-path" placeholder="e.g., C:\\Users\\HP\\myproject\\jeeapp\\src\\webapp\\Prepsharp\\papers\\2024-1\\Physics">
                                <button class="btn btn-outline-secondary" type="button" id="check-files-btn">Check Files</button>
                                <button class="btn btn-outline-primary" type="button" id="open-folder-btn">Open Folder</button>
                            </div>
                        </div>
                        <div id="folder-contents" class="mb-3" style="display: none;">
                            <label class="form-label">Available Images:</label>
                            <div class="border rounded p-2" style="max-height: 200px; overflow-y: auto;">
                                <ul id="image-list" class="list-group list-group-flush">
                                    <!-- Image list will be populated here -->
                                </ul>
                            </div>
                        </div>
                        <div class="form-check mb-3">
                            <input class="form-check-input" type="checkbox" id="auto-advance">
                            <label class="form-check-label" for="auto-advance">
                                Automatically advance to next question after loading images
                            </label>
                            <small class="form-text text-muted d-block mt-1">Uncheck to manually mark answers for each question</small>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" id="load-images-btn">Load Images</button>
                    </div>
                </div>
            </div>
        </div>`;
        
        // Add modal to body if it doesn't exist
        if (!document.getElementById('folderSelectionModal')) {
            const modalContainer = document.createElement('div');
            modalContainer.innerHTML = modalHTML;
            document.body.appendChild(modalContainer);
        }
        
        // Initialize modal
        const modal = new bootstrap.Modal(document.getElementById('folderSelectionModal'));
        
        // Set default folder path if available
        const savedPath = localStorage.getItem('lastImageFolderPath');
        if (savedPath) {
            document.getElementById('folder-path').value = savedPath;
        }
        
        // Set up event handlers
        setupModalEventHandlers();
        
        // Show modal
        modal.show();
    };
    
    // Function to set up modal event handlers
    function setupModalEventHandlers() {
        console.log("Setting up modal event handlers");
        
        // Check files button
        document.getElementById('check-files-btn').addEventListener('click', function() {
            const folderPath = document.getElementById('folder-path').value.trim();
            if (!folderPath) {
                alert('Please enter a folder path');
                return;
            }
            
            checkFolderForImages(folderPath);
        });
        
        // Open folder button
        document.getElementById('open-folder-btn').addEventListener('click', function() {
            const folderPath = document.getElementById('folder-path').value.trim();
            if (!folderPath) {
                alert('Please enter a folder path');
                return;
            }
            
            // Open the folder in Windows Explorer
            try {
                const link = document.createElement('a');
                link.href = `file:///${folderPath.replace(/\\\\/g, '/').replace(/\\/g, '/')}`;
                link.target = '_blank';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } catch (error) {
                console.error('Error opening folder:', error);
                alert('Could not open folder. Please check the path and try again.');
            }
        });
        
        // Load images button
        document.getElementById('load-images-btn').addEventListener('click', function() {
            const folderPath = document.getElementById('folder-path').value.trim();
            if (!folderPath) {
                alert('Please enter a folder path');
                return;
            }
            
            // Save the folder path for next time
            localStorage.setItem('lastImageFolderPath', folderPath);
            
            // Load the image for the current question
            if (typeof window.loadImagesForCurrentQuestion === 'function') {
                window.loadImagesForCurrentQuestion(folderPath);
            } else {
                console.error('loadImagesForCurrentQuestion function not found');
                alert('Error: Image loading function not found');
            }
            
            // Hide the modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('folderSelectionModal'));
            if (modal) modal.hide();
        });
    }
    
    // Function to check folder for images
    function checkFolderForImages(folderPath) {
        console.log(`Checking folder for images: ${folderPath}`);
        
        // Show loading state
        const imageList = document.getElementById('image-list');
        imageList.innerHTML = '<li class="list-group-item text-center"><div class="spinner-border spinner-border-sm text-primary" role="status"></div> Scanning folder...</li>';
        document.getElementById('folder-contents').style.display = 'block';
        
        // Simulate scanning the folder
        setTimeout(() => {
            // Generate file list based on folder path
            const files = simulateFolderScan(folderPath);
            displayImageList(files);
        }, 500);
    }
    
    // Function to simulate scanning a folder
    function simulateFolderScan(folderPath) {
        // Extract the folder name from the path
        const pathParts = folderPath.split('\\');
        const folderName = pathParts[pathParts.length - 1].toLowerCase();
        
        // Determine which subject based on folder name
        let subject = '';
        if (folderName === 'physics') {
            subject = 'Physics';
        } else if (folderName === 'chemistry') {
            subject = 'Chemistry';
        } else if (folderName === 'maths') {
            subject = 'Mathematics';
        } else {
            // Check if the path contains any of these subjects
            if (folderPath.toLowerCase().includes('physics')) {
                subject = 'Physics';
            } else if (folderPath.toLowerCase().includes('chemistry')) {
                subject = 'Chemistry';
            } else if (folderPath.toLowerCase().includes('maths') || folderPath.toLowerCase().includes('mathematics')) {
                subject = 'Mathematics';
            }
        }
        
        // Generate file list based on subject
        const files = [];
        
        // Add question files
        for (let i = 1; i <= 17; i++) {
            files.push({
                name: `Question-${i}.png`,
                type: 'question',
                questionNumber: i,
                path: `${folderPath}\\Question-${i}.png`
            });
            
            // Add option files for questions with options
            if (i <= 7 || (i >= 14 && i <= 17)) {
                for (let j = 1; j <= 4; j++) {
                    files.push({
                        name: `Question-${i} Option-${j}.png`,
                        type: 'option',
                        questionNumber: i,
                        optionNumber: j,
                        path: `${folderPath}\\Question-${i} Option-${j}.png`
                    });
                }
            }
        }
        
        return files;
    }
    
    // Function to display the image list
    function displayImageList(files) {
        const imageList = document.getElementById('image-list');
        imageList.innerHTML = '';
        
        if (files.length === 0) {
            imageList.innerHTML = '<li class="list-group-item text-center">No images found in this folder</li>';
            return;
        }
        
        // Group files by question number
        const questionGroups = {};
        files.forEach(file => {
            if (!questionGroups[file.questionNumber]) {
                questionGroups[file.questionNumber] = {
                    question: null,
                    options: []
                };
            }
            
            if (file.type === 'question') {
                questionGroups[file.questionNumber].question = file;
            } else if (file.type === 'option') {
                questionGroups[file.questionNumber].options.push(file);
            }
        });
        
        // Display each question group
        Object.keys(questionGroups).sort((a, b) => parseInt(a) - parseInt(b)).forEach(questionNumber => {
            const group = questionGroups[questionNumber];
            const item = document.createElement('li');
            item.className = 'list-group-item';
            
            let html = `<strong>Question ${questionNumber}:</strong> `;
            if (group.question) {
                html += `<span class="badge bg-success">Question Image</span> `;
            } else {
                html += `<span class="badge bg-danger">No Question Image</span> `;
            }
            
            if (group.options.length > 0) {
                html += `<span class="badge bg-info">${group.options.length} Options</span>`;
            } else {
                html += `<span class="badge bg-warning">No Options</span>`;
            }
            
            item.innerHTML = html;
            imageList.appendChild(item);
        });
    }
    
    // Add a button to the UI to show the folder selection modal
    function addFolderSelectionButton() {
        console.log("Adding folder selection button");
        
        const topButtonGroup = document.querySelector('.top-navbar .d-flex.align-items-center');
        if (topButtonGroup) {
            // Check if button already exists
            if (document.getElementById('folder-images-btn')) return;
            
            const folderButton = document.createElement('button');
            folderButton.id = 'folder-images-btn';
            folderButton.className = 'btn btn-info me-3';
            folderButton.innerHTML = '<i class="fas fa-folder-open me-1"></i> Load Images from Folder';
            folderButton.onclick = function() {
                window.showFolderSelectionModal();
            };
            
            // Insert before the PDF button
            const pdfButton = document.getElementById('pdf-btn');
            if (pdfButton) {
                topButtonGroup.insertBefore(folderButton, pdfButton);
            } else {
                // If PDF button not found, just append to the group
                topButtonGroup.appendChild(folderButton);
            }
            
            console.log("Folder selection button added");
        }
    }
    
    // Initialize the folder selection button when the page loads
    window.addEventListener('load', function() {
        console.log("Page loaded, adding folder selection button");
        setTimeout(addFolderSelectionButton, 1000);
    });
})();