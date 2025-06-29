// Function to show the folder selection modal
function showFolderSelectionModal() {
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
                        Select a folder containing question and option images. The folder should have images named in this format:
                        <ul>
                            <li><strong>Question-1.png</strong> - Question 1 image</li>
                            <li><strong>Question-1 Option-1.png</strong> - Question 1, Option A image</li>
                            <li><strong>Question-1 Option-2.png</strong> - Question 1, Option B image</li>
                            <li><strong>Question-1 Option-3.png</strong> - Question 1, Option C image</li>
                            <li><strong>Question-1 Option-4.png</strong> - Question 1, Option D image</li>
                        </ul>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Folder Path</label>
                        <div class="input-group">
                            <input type="text" class="form-control" id="folder-path" placeholder="e.g., C:\\Users\\HP\\myproject\\jeeapp\\src\\webapp\\Prepsharp\\papers\\2024-1\\Physics">
                            <button class="btn btn-outline-secondary" type="button" id="browse-folder-btn">Check Files</button>
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
                        <input class="form-check-input" type="checkbox" id="auto-advance" checked>
                        <label class="form-check-label" for="auto-advance">
                            Automatically advance to next question after loading images
                        </label>
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
    
    // Browse folder button click handler
    document.getElementById('browse-folder-btn').addEventListener('click', function() {
        const folderPath = document.getElementById('folder-path').value.trim();
        if (!folderPath) {
            alert('Please enter a folder path');
            return;
        }
        
        // Check folder for images
        checkFolderForImages(folderPath);
    });
    
    // Open folder button click handler
    document.getElementById('open-folder-btn').addEventListener('click', function() {
        const folderPath = document.getElementById('folder-path').value.trim();
        if (!folderPath) {
            alert('Please enter a folder path');
            return;
        }
        
        // Open the folder in Windows Explorer
        try {
            // Create a temporary link to open the folder
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
    
    // Load images button click handler
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
        
        modal.hide();
    });
    
    // Show modal
    modal.show();
}

// Function to check folder for images
function checkFolderForImages(folderPath) {
    // Show loading state
    const imageList = document.getElementById('image-list');
    imageList.innerHTML = '<li class="list-group-item text-center"><div class="spinner-border spinner-border-sm text-primary" role="status"></div> Scanning folder...</li>';
    document.getElementById('folder-contents').style.display = 'block';
    
    // Use fetch to call a server-side script that lists files
    // For demo purposes, we'll simulate finding files
    setTimeout(() => {
        // Simulate scanning the folder
        const files = simulateFolderScan(folderPath);
        
        // Display the files
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
function loadImagesForCurrentQuestion(folderPath) {
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
    
    // Load question image and save to Firebase
    loadAndSaveImage(questionImagePath, 'question', questionNumber, 0)
        .then(questionImageUrl => {
            if (questionImageUrl) {
                // Display the image
                loadImagePreview('question-image', 'question-image-preview', 'question-image-preview-img', questionImageUrl);
                
                // Get the current question type
                const questionType = document.getElementById('question-type').value;
                
                // Load option images based on question type
                const promises = [];
                
                if (questionType === 'mcq-single') {
                    // Load and save option images
                    promises.push(loadAndSaveImage(optionAImagePath, 'option', questionNumber, 1)
                        .then(url => url && loadImagePreview('option-a-image', 'option-a-image-preview', 'option-a-image-preview-img', url)));
                    promises.push(loadAndSaveImage(optionBImagePath, 'option', questionNumber, 2)
                        .then(url => url && loadImagePreview('option-b-image', 'option-b-image-preview', 'option-b-image-preview-img', url)));
                    promises.push(loadAndSaveImage(optionCImagePath, 'option', questionNumber, 3)
                        .then(url => url && loadImagePreview('option-c-image', 'option-c-image-preview', 'option-c-image-preview-img', url)));
                    promises.push(loadAndSaveImage(optionDImagePath, 'option', questionNumber, 4)
                        .then(url => url && loadImagePreview('option-d-image', 'option-d-image-preview', 'option-d-image-preview-img', url)));
                    
                    // Hide option text areas
                    hideOptionTextArea('option-a-text');
                    hideOptionTextArea('option-b-text');
                    hideOptionTextArea('option-c-text');
                    hideOptionTextArea('option-d-text');
                } else if (questionType === 'mcq-multiple') {
                    // Load and save option images for multiple choice
                    promises.push(loadAndSaveImage(optionAImagePath, 'option', questionNumber, 1)
                        .then(url => url && loadImagePreview('multi-option-a-image', 'multi-option-a-image-preview', 'multi-option-a-image-preview-img', url)));
                    promises.push(loadAndSaveImage(optionBImagePath, 'option', questionNumber, 2)
                        .then(url => url && loadImagePreview('multi-option-b-image', 'multi-option-b-image-preview', 'multi-option-b-image-preview-img', url)));
                    promises.push(loadAndSaveImage(optionCImagePath, 'option', questionNumber, 3)
                        .then(url => url && loadImagePreview('multi-option-c-image', 'multi-option-c-image-preview', 'multi-option-c-image-preview-img', url)));
                    promises.push(loadAndSaveImage(optionDImagePath, 'option', questionNumber, 4)
                        .then(url => url && loadImagePreview('multi-option-d-image', 'multi-option-d-image-preview', 'multi-option-d-image-preview-img', url)));
                    
                    // Hide option text areas
                    hideOptionTextArea('multi-option-a-text');
                    hideOptionTextArea('multi-option-b-text');
                    hideOptionTextArea('multi-option-c-text');
                    hideOptionTextArea('multi-option-d-text');
                }
                
                // Wait for all option images to load
                Promise.all(promises)
                    .then(() => {
                        // Re-enable save button
                        saveBtn.disabled = false;
                        saveBtn.innerHTML = originalBtnText;
                        
                        // Auto-advance to next question if checked
                        if (document.getElementById('auto-advance').checked) {
                            // Wait a moment to allow images to load
                            setTimeout(() => {
                                if (window.currentQuestionIndex < getTotalQuestions() - 1) {
                                    // Advance to next question
                                    if (isJeeAdvanced(getExamId())) {
                                        nextAdvancedQuestion();
                                    } else {
                                        nextQuestion();
                                    }
                                    
                                    // Load images for the next question
                                    loadImagesForCurrentQuestion(folderPath);
                                }
                            }, 500);
                        }
                    });
            } else {
                // Re-enable save button if question image not found
                saveBtn.disabled = false;
                saveBtn.innerHTML = originalBtnText;
                alert('Question image not found. Please check the folder path.');
            }
        })
        .catch(error => {
            console.error('Error loading images:', error);
            saveBtn.disabled = false;
            saveBtn.innerHTML = originalBtnText;
            alert('Error loading images: ' + error.message);
        });
}

// Function to load and save an image to Firebase
async function loadAndSaveImage(imagePath, type, questionNumber, optionNumber = 0) {
    try {
        // Create a new image element to load the image
        const img = new Image();
        
        // Create a promise that resolves when the image loads or errors
        const imageLoadPromise = new Promise((resolve, reject) => {
            img.onload = () => resolve(img);
            img.onerror = () => resolve(null); // Resolve with null if image not found
            img.src = imagePath;
        });
        
        // Wait for the image to load
        const loadedImg = await imageLoadPromise;
        if (!loadedImg) return null; // Image not found
        
        // Get the exam ID
        const examId = getExamId();
        
        // Create a canvas to convert the image to a data URL
        const canvas = document.createElement('canvas');
        canvas.width = loadedImg.width;
        canvas.height = loadedImg.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(loadedImg, 0, 0);
        
        // Convert the image to a data URL
        const dataUrl = canvas.toDataURL('image/png');
        
        // Save the image to Firebase if available
        if (window.firebase && firebase.storage) {
            // Create a reference to the storage location
            const storageRef = firebase.storage().ref();
            const imageRef = storageRef.child(`questions/${examId}/q${questionNumber}${optionNumber > 0 ? `-opt${optionNumber}` : ''}.png`);
            
            // Convert data URL to blob
            const response = await fetch(dataUrl);
            const blob = await response.blob();
            
            // Upload the image
            const snapshot = await imageRef.put(blob);
            
            // Get the download URL
            const url = await snapshot.ref.getDownloadURL();
            
            // Save the URL to the question data in Firestore
            if (window.db) {
                const questionRef = db.collection('papers').doc(examId).collection('questions');
                
                // Query for existing question
                const querySnapshot = await questionRef.where('questionNo', '==', questionNumber).get();
                
                if (!querySnapshot.empty) {
                    // Update existing question
                    const questionDoc = querySnapshot.docs[0];
                    const questionData = questionDoc.data();
                    
                    if (type === 'question') {
                        questionData.imageUrl = url;
                    } else if (type === 'option') {
                        if (!questionData.optionImages) questionData.optionImages = [];
                        questionData.optionImages[optionNumber - 1] = url;
                    }
                    
                    await questionRef.doc(questionDoc.id).update(questionData);
                }
            }
            
            return url;
        } else {
            // If Firebase is not available, just return the data URL
            return dataUrl;
        }
    } catch (error) {
        console.error('Error saving image:', error);
        return null;
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
    
    // Auto-advance to next question if checked
    if (document.getElementById('auto-advance').checked) {
        // Wait a moment to allow images to load
        setTimeout(() => {
            if (window.currentQuestionIndex < getTotalQuestions() - 1) {
                // Advance to next question
                if (isJeeAdvanced(getExamId())) {
                    nextAdvancedQuestion();
                } else {
                    nextQuestion();
                }
                
                // Load images for the next question
                loadImagesForCurrentQuestion(folderPath);
            }
        }, 500);
    }
}

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

// Helper function to get the total number of questions
function getTotalQuestions() {
    if (isJeeAdvanced(getExamId())) {
        return window.jeeAdvancedStructure.reduce((sum, section) => sum + section.count, 0);
    } else {
        return totalJeeMainQuestions;
    }
}

// Helper function to get the exam ID from the URL
function getExamId() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('examId') || 'exam-default';
}

// Add a button to the UI to show the folder selection modal
function addFolderSelectionButton() {
    const topButtonGroup = document.querySelector('.top-navbar .d-flex.align-items-center');
    if (topButtonGroup) {
        // Check if button already exists
        if (document.getElementById('folder-images-btn')) return;
        
        const folderButton = document.createElement('button');
        folderButton.id = 'folder-images-btn';
        folderButton.className = 'btn btn-info me-3';
        folderButton.innerHTML = '<i class="fas fa-folder-open me-1"></i> Load Images from Folder';
        folderButton.onclick = showFolderSelectionModal;
        
        // Insert before the PDF button
        const pdfButton = document.getElementById('pdf-btn');
        if (pdfButton) {
            topButtonGroup.insertBefore(folderButton, pdfButton);
        } else {
            // If PDF button not found, just append to the group
            topButtonGroup.appendChild(folderButton);
        }
    }
}

// Initialize the folder selection button when the page loads
document.addEventListener('DOMContentLoaded', function() {
    addFolderSelectionButton();
});

// Also add the button when the page fully loads
window.addEventListener('load', function() {
    // Add the button again after a short delay to ensure it's added for all exam types
    setTimeout(addFolderSelectionButton, 1000);
});