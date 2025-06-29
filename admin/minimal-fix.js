// Minimal fix for image loading while preserving original layout
(function() {
    // Store the original loadImagesForCurrentQuestion function
    const originalLoadImages = window.loadImagesForCurrentQuestion;
    
    // Override with our fixed version
    window.loadImagesForCurrentQuestion = function(folderPath) {
        console.log("Loading images from folder:", folderPath);
        
        // Get the current question number (1-based)
        const questionNumber = window.currentQuestionIndex + 1;
        
        // Construct the image paths
        const questionImagePath = `${folderPath}/Question-${questionNumber}.png`;
        const optionAImagePath = `${folderPath}/Question-${questionNumber} Option-1.png`;
        const optionBImagePath = `${folderPath}/Question-${questionNumber} Option-2.png`;
        const optionCImagePath = `${folderPath}/Question-${questionNumber} Option-3.png`;
        const optionDImagePath = `${folderPath}/Question-${questionNumber} Option-4.png`;
        
        // Create and display images directly
        createAndDisplayImage(questionImagePath, 'question');
        createAndDisplayImage(optionAImagePath, 'option-a');
        createAndDisplayImage(optionBImagePath, 'option-b');
        createAndDisplayImage(optionCImagePath, 'option-c');
        createAndDisplayImage(optionDImagePath, 'option-d');
    };
    
    // Function to create and display an image
    function createAndDisplayImage(imagePath, type) {
        // Create image element
        const img = new Image();
        img.src = imagePath;
        img.style.maxWidth = '100%';
        img.style.border = '2px solid #4f46e5';
        img.style.borderRadius = '5px';
        
        // Handle image load
        img.onload = function() {
            console.log(`Image loaded: ${imagePath}`);
            
            if (type === 'question') {
                // Hide question text and label
                const questionText = document.getElementById('question-text');
                const questionTextLabel = document.querySelector('label[for="question-text"]');
                if (questionText) questionText.style.display = 'none';
                if (questionTextLabel) questionTextLabel.style.display = 'none';
                
                // Hide question image label and input
                const questionImageLabel = document.querySelector('label[for="question-image"]');
                const questionImageInput = document.getElementById('question-image').parentElement;
                if (questionImageLabel) questionImageLabel.style.display = 'none';
                if (questionImageInput) questionImageInput.style.display = 'none';
                
                // Add image to page
                const container = document.createElement('div');
                container.className = 'mb-3';
                container.appendChild(img);
                
                // Insert after the hidden elements
                if (questionText && questionText.parentElement) {
                    questionText.parentElement.insertBefore(container, questionText.nextSibling);
                }
            } else {
                // Get option letter (a, b, c, d)
                const optionLetter = type.split('-')[1];
                
                // Hide option text
                const optionText = document.getElementById(`option-${optionLetter}-text`);
                if (optionText) optionText.style.display = 'none';
                
                // Hide option image label and input
                const optionImageLabel = document.querySelector(`label[for="option-${optionLetter}-image"]`);
                const optionImageInput = document.getElementById(`option-${optionLetter}-image`);
                if (optionImageLabel) optionImageLabel.style.display = 'none';
                if (optionImageInput && optionImageInput.parentElement) {
                    optionImageInput.parentElement.style.display = 'none';
                }
                
                // Add image to page
                const container = document.createElement('div');
                container.className = 'mb-3';
                container.appendChild(img);
                
                // Find the option container
                const optionContainer = optionText ? optionText.closest('.option-container') : null;
                if (optionContainer) {
                    optionContainer.appendChild(container);
                }
            }
        };
        
        // Handle image load error
        img.onerror = function() {
            console.log(`Image not found: ${imagePath}`);
        };
    }
})();