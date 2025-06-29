// Direct fix to add the folder button
(function() {
    // Define the folder selection modal function directly here
    window.showFolderSelectionModal = function() {
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
                link.href = `file:///${folderPath.replace(/\\/g, '/')}`;
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
            loadImagesForCurrentQuestion(folderPath);
            
            // Hide the modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('folderSelectionModal'));
            if (modal) modal.hide();
        });
    }
    
    // Function to check folder for images
    function checkFolderForImages(folderPath) {
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
    
    // Function to load images for the current question
    window.loadImagesForCurrentQuestion = function(folderPath) {
        // Get the current question number (1-based)
        const questionNumber = window.currentQuestionIndex + 1;
        
        // Construct the image paths
        const questionImagePath = `${folderPath}/Question-${questionNumber}.png`;
        const optionAImagePath = `${folderPath}/Question-${questionNumber} Option-1.png`;
        const optionBImagePath = `${folderPath}/Question-${questionNumber} Option-2.png`;
        const optionCImagePath = `${folderPath}/Question-${questionNumber} Option-3.png`;
        const optionDImagePath = `${folderPath}/Question-${questionNumber} Option-4.png`;
        
        // Show loading indicator
        const saveBtn = document.getElementById('save-question-btn');
        const originalBtnText = saveBtn.innerHTML;
        saveBtn.disabled = true;
        saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i> Loading Images...';
        
        // Load question image
        loadImagePreview('question-image', 'question-image-preview', 'question-image-preview-img', questionImagePath);
        
        // Get the current question type
        const questionType = document.getElementById('question-type').value;
        
        // Load option images based on question type
        if (questionType === 'mcq-single') {
            // Load option images
            const optionALoaded = loadImagePreview('option-a-image', 'option-a-image-preview', 'option-a-image-preview-img', optionAImagePath);
            const optionBLoaded = loadImagePreview('option-b-image', 'option-b-image-preview', 'option-b-image-preview-img', optionBImagePath);
            const optionCLoaded = loadImagePreview('option-c-image', 'option-c-image-preview', 'option-c-image-preview-img', optionCImagePath);
            const optionDLoaded = loadImagePreview('option-d-image', 'option-d-image-preview', 'option-d-image-preview-img', optionDImagePath);
            
            // Hide option text areas
            hideOptionTextArea('option-a-text');
            hideOptionTextArea('option-b-text');
            hideOptionTextArea('option-c-text');
            hideOptionTextArea('option-d-text');
            
            // Show option selection area prominently
            const optionHeaders = document.querySelectorAll('.option-header');
            optionHeaders.forEach(header => {
                header.style.backgroundColor = '#f0f8ff';
                header.style.padding = '10px';
                header.style.borderRadius = '5px';
                header.style.border = '2px solid #e2e8f0';
            });
            
        } else if (questionType === 'mcq-multiple') {
            // Load option images
            const optionALoaded = loadImagePreview('multi-option-a-image', 'multi-option-a-image-preview', 'multi-option-a-image-preview-img', optionAImagePath);
            const optionBLoaded = loadImagePreview('multi-option-b-image', 'multi-option-b-image-preview', 'multi-option-b-image-preview-img', optionBImagePath);
            const optionCLoaded = loadImagePreview('multi-option-c-image', 'multi-option-c-image-preview', 'multi-option-c-image-preview-img', optionCImagePath);
            const optionDLoaded = loadImagePreview('multi-option-d-image', 'multi-option-d-image-preview', 'multi-option-d-image-preview-img', optionDImagePath);
            
            // Hide option text areas
            hideOptionTextArea('multi-option-a-text');
            hideOptionTextArea('multi-option-b-text');
            hideOptionTextArea('multi-option-c-text');
            hideOptionTextArea('multi-option-d-text');
            
            // Show option selection area prominently
            const optionHeaders = document.querySelectorAll('.option-header');
            optionHeaders.forEach(header => {
                header.style.backgroundColor = '#f0f8ff';
                header.style.padding = '10px';
                header.style.borderRadius = '5px';
                header.style.border = '2px solid #e2e8f0';
            });
        }
        
        // Re-enable save button
        setTimeout(() => {
            saveBtn.disabled = false;
            saveBtn.innerHTML = originalBtnText;
            
            // Auto-advance to next question if checked
            if (document.getElementById('auto-advance').checked) {
                setTimeout(() => {
                    if (window.currentQuestionIndex < getTotalQuestions() - 1) {
                        // Advance to next question
                        if (typeof nextAdvancedQuestion === 'function' && isJeeAdvanced(getExamId())) {
                            nextAdvancedQuestion();
                        } else if (typeof nextQuestion === 'function') {
                            nextQuestion();
                        }
                        
                        // Load images for the next question
                        loadImagesForCurrentQuestion(folderPath);
                    }
                }, 500);
            }
        }, 1000);
    };
    
    // Function to load an image preview
    function loadImagePreview(inputId, previewContainerId, previewImgId, imagePath) {
        const previewContainer = document.getElementById(previewContainerId);
        const previewImg = document.getElementById(previewImgId);
        const inputElement = document.getElementById(inputId);
        
        if (previewContainer && previewImg) {
            // Set the image source
            previewImg.src = imagePath;
            
            // Show the preview container
            previewContainer.style.display = 'block';
            
            // Handle image load error
            previewImg.onerror = function() {
                console.log(`Image not found: ${imagePath}`);
                previewContainer.style.display = 'none';
                return;
            };
            
            // Hide the input element
            if (inputElement) {
                inputElement.style.display = 'none';
                
                // If this is the question image, also hide the question text area
                if (inputId === 'question-image') {
                    const questionTextLabel = document.querySelector('label[for="question-text"]');
                    const questionText = document.getElementById('question-text');
                    
                    if (questionTextLabel) questionTextLabel.style.display = 'none';
                    if (questionText) questionText.style.display = 'none';
                }
            }
        }
    }
    
    // Function to hide option text area
    function hideOptionTextArea(id) {
        const textArea = document.getElementById(id);
        if (textArea) {
            textArea.style.display = 'none';
        }
    }
    
    // Helper function to get the total number of questions
    function getTotalQuestions() {
        if (typeof isJeeAdvanced === 'function' && isJeeAdvanced(getExamId()) && window.jeeAdvancedStructure) {
            return window.jeeAdvancedStructure.reduce((sum, section) => sum + section.count, 0);
        } else if (typeof totalJeeMainQuestions !== 'undefined') {
            return totalJeeMainQuestions;
        } else {
            return 75; // Default value
        }
    }
    
    // Helper function to get the exam ID from the URL
    function getExamId() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('examId') || 'exam-default';
    }
    
    // Helper function to check if exam is JEE Advanced
    function isJeeAdvanced(examId) {
        return examId && examId.includes('jee-advanced');
    }
    
    // Function to add the folder button
    function addFolderButton() {
        // Check if button already exists
        if (document.getElementById('folder-images-btn')) return;
        
        // Find the button container
        const topButtonGroup = document.querySelector('.top-navbar .d-flex.align-items-center');
        if (!topButtonGroup) return;
        
        // Create the button
        const folderButton = document.createElement('button');
        folderButton.id = 'folder-images-btn';
        folderButton.className = 'btn btn-info me-3';
        folderButton.innerHTML = '<i class="fas fa-folder-open me-1"></i> Load Images from Folder';
        folderButton.onclick = function() {
            if (typeof window.showFolderSelectionModal === 'function') {
                window.showFolderSelectionModal();
            } else {
                alert('Folder selection modal function not found');
            }
        };
        
        // Add the button to the container
        topButtonGroup.appendChild(folderButton);
        console.log('Folder button added');
    }
    
    // Try to add the button immediately
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(addFolderButton, 100);
    } else {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(addFolderButton, 100);
        });
    }
    
    // Also try after window load
    window.addEventListener('load', function() {
        setTimeout(addFolderButton, 500);
    });
    
    // Keep trying every second for 10 seconds
    let attempts = 0;
    const interval = setInterval(function() {
        addFolderButton();
        attempts++;
        if (attempts >= 10) clearInterval(interval);
    }, 1000);
})();