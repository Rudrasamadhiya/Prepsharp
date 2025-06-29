// Fix for folder image loading and display
(function() {
    // Override the loadImagePreview function to ensure images are displayed
    window.loadImagePreview = function(inputId, previewContainerId, previewImgId, imagePath) {
        console.log(`Loading image: ${imagePath} for ${previewImgId}`);
        
        const previewContainer = document.getElementById(previewContainerId);
        const previewImg = document.getElementById(previewImgId);
        const inputElement = document.getElementById(inputId);
        
        if (previewContainer && previewImg) {
            // Set the image source
            previewImg.src = imagePath;
            
            // Show the preview container
            previewContainer.style.display = 'block';
            previewContainer.style.maxWidth = '100%';
            
            // Style the image
            previewImg.style.maxWidth = '100%';
            previewImg.style.border = '2px solid #4f46e5';
            previewImg.style.borderRadius = '5px';
            previewImg.style.padding = '5px';
            
            // Handle image load error
            previewImg.onerror = function() {
                console.log(`Image not found: ${imagePath}`);
                previewContainer.style.display = 'none';
                return false;
            };
            
            // Handle image load success
            previewImg.onload = function() {
                console.log(`Image loaded successfully: ${imagePath}`);
                
                // Hide the input element
                if (inputElement) {
                    inputElement.style.display = 'none';
                }
                
                // If this is the question image, also hide the question text area
                if (inputId === 'question-image') {
                    const questionTextLabel = document.querySelector('label[for="question-text"]');
                    const questionText = document.getElementById('question-text');
                    
                    if (questionTextLabel) questionTextLabel.style.display = 'none';
                    if (questionText) questionText.style.display = 'none';
                }
                
                // Hide the label
                const label = document.querySelector(`label[for="${inputId}"]`);
                if (label) label.style.display = 'none';
                
                // Hide capture button if it exists
                if (inputId === 'question-image') {
                    const captureBtn = document.getElementById('capture-question-btn');
                    if (captureBtn) captureBtn.style.display = 'none';
                } else {
                    const optionLetter = inputId.split('-')[1]; // e.g., 'a' from 'option-a-image'
                    const captureBtn = document.querySelector(`.option-capture-btn[data-option="${optionLetter}"]`);
                    if (captureBtn) captureBtn.style.display = 'none';
                }
                
                return true;
            };
        }
        
        return false;
    };
    
    // Override loadImagesForCurrentQuestion to ensure it works properly
    const originalLoadImagesForCurrentQuestion = window.loadImagesForCurrentQuestion;
    window.loadImagesForCurrentQuestion = function(folderPath) {
        console.log(`Loading images from folder: ${folderPath}`);
        
        // Get the current question number (1-based)
        const questionNumber = window.currentQuestionIndex + 1;
        
        // Construct the image paths
        const questionImagePath = `${folderPath}/Question-${questionNumber}.png`;
        const optionAImagePath = `${folderPath}/Question-${questionNumber} Option-1.png`;
        const optionBImagePath = `${folderPath}/Question-${questionNumber} Option-2.png`;
        const optionCImagePath = `${folderPath}/Question-${questionNumber} Option-3.png`;
        const optionDImagePath = `${folderPath}/Question-${questionNumber} Option-4.png`;
        
        console.log(`Question image path: ${questionImagePath}`);
        
        // Load question image
        loadImagePreview('question-image', 'question-image-preview', 'question-image-preview-img', questionImagePath);
        
        // Get the current question type
        const questionType = document.getElementById('question-type').value;
        
        // Load option images based on question type
        if (questionType === 'mcq-single') {
            loadImagePreview('option-a-image', 'option-a-image-preview', 'option-a-image-preview-img', optionAImagePath);
            loadImagePreview('option-b-image', 'option-b-image-preview', 'option-b-image-preview-img', optionBImagePath);
            loadImagePreview('option-c-image', 'option-c-image-preview', 'option-c-image-preview-img', optionCImagePath);
            loadImagePreview('option-d-image', 'option-d-image-preview', 'option-d-image-preview-img', optionDImagePath);
            
            // Hide option text areas
            document.getElementById('option-a-text').style.display = 'none';
            document.getElementById('option-b-text').style.display = 'none';
            document.getElementById('option-c-text').style.display = 'none';
            document.getElementById('option-d-text').style.display = 'none';
        } else if (questionType === 'mcq-multiple') {
            loadImagePreview('multi-option-a-image', 'multi-option-a-image-preview', 'multi-option-a-image-preview-img', optionAImagePath);
            loadImagePreview('multi-option-b-image', 'multi-option-b-image-preview', 'multi-option-b-image-preview-img', optionBImagePath);
            loadImagePreview('multi-option-c-image', 'multi-option-c-image-preview', 'multi-option-c-image-preview-img', optionCImagePath);
            loadImagePreview('multi-option-d-image', 'multi-option-d-image-preview', 'multi-option-d-image-preview-img', optionDImagePath);
            
            // Hide option text areas
            document.getElementById('multi-option-a-text').style.display = 'none';
            document.getElementById('multi-option-b-text').style.display = 'none';
            document.getElementById('multi-option-c-text').style.display = 'none';
            document.getElementById('multi-option-d-text').style.display = 'none';
        }
    };
})();