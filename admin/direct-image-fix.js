// Direct fix for image display and capture buttons
(function() {
    // Function to directly fix images and hide capture buttons
    function directImageFix() {
        console.log("Running direct image fix");
        
        // Get current question
        const questionNumber = window.currentQuestionIndex + 1;
        const existingQuestion = window.existingQuestions?.[questionNumber];
        
        if (!existingQuestion) return;
        
        // Fix question image
        if (existingQuestion.imageUrl) {
            console.log("Found question image URL:", existingQuestion.imageUrl);
            
            // Get elements
            const questionImagePreview = document.getElementById('question-image-preview');
            const questionImagePreviewImg = document.getElementById('question-image-preview-img');
            const questionImageLabel = document.querySelector('label[for="question-image"]');
            const questionImageInput = document.getElementById('question-image');
            const captureQuestionBtn = document.getElementById('capture-question-btn');
            
            // Set image source and make visible
            if (questionImagePreviewImg) {
                questionImagePreviewImg.src = existingQuestion.imageUrl;
                questionImagePreviewImg.style.maxWidth = '100%';
                questionImagePreviewImg.style.maxHeight = '400px';
                questionImagePreviewImg.style.border = '2px solid #4f46e5';
                questionImagePreviewImg.style.borderRadius = '5px';
                questionImagePreviewImg.style.padding = '5px';
            }
            
            // Show preview container
            if (questionImagePreview) {
                questionImagePreview.style.display = 'block';
                questionImagePreview.style.maxWidth = '100%';
            }
            
            // Hide label, input and capture button
            if (questionImageLabel) questionImageLabel.style.display = 'none';
            if (questionImageInput) questionImageInput.parentElement.style.display = 'none';
            if (captureQuestionBtn) captureQuestionBtn.style.display = 'none';
            
            // Hide question text
            const questionTextLabel = document.querySelector('label[for="question-text"]');
            const questionText = document.getElementById('question-text');
            if (questionTextLabel) questionTextLabel.style.display = 'none';
            if (questionText) questionText.style.display = 'none';
        }
        
        // Fix option images
        if (existingQuestion.optionImages) {
            for (let i = 0; i < existingQuestion.optionImages.length; i++) {
                if (!existingQuestion.optionImages[i]) continue;
                
                const optionLetter = String.fromCharCode(97 + i); // a, b, c, d
                console.log(`Found option ${optionLetter.toUpperCase()} image URL:`, existingQuestion.optionImages[i]);
                
                // Get elements
                const optionImagePreview = document.getElementById(`option-${optionLetter}-image-preview`);
                const optionImagePreviewImg = document.getElementById(`option-${optionLetter}-image-preview-img`);
                const optionImageLabel = document.querySelector(`label[for="option-${optionLetter}-image"]`);
                const optionImageInput = document.getElementById(`option-${optionLetter}-image`);
                const optionCaptureBtn = document.querySelector(`.option-capture-btn[data-option="${optionLetter}"]`);
                
                // Set image source and make visible
                if (optionImagePreviewImg) {
                    optionImagePreviewImg.src = existingQuestion.optionImages[i];
                    optionImagePreviewImg.style.maxWidth = '100%';
                    optionImagePreviewImg.style.maxHeight = '200px';
                    optionImagePreviewImg.style.border = '2px solid #4f46e5';
                    optionImagePreviewImg.style.borderRadius = '5px';
                    optionImagePreviewImg.style.padding = '5px';
                }
                
                // Show preview container
                if (optionImagePreview) {
                    optionImagePreview.style.display = 'block';
                    optionImagePreview.style.maxWidth = '100%';
                }
                
                // Hide label, input and capture button
                if (optionImageLabel) optionImageLabel.style.display = 'none';
                if (optionImageInput) optionImageInput.parentElement.style.display = 'none';
                if (optionCaptureBtn) optionCaptureBtn.style.display = 'none';
                
                // Hide option text
                const optionText = document.getElementById(`option-${optionLetter}-text`);
                if (optionText) optionText.style.display = 'none';
            }
        }
    }
    
    // Run the fix on page load and after navigation
    window.addEventListener('load', function() {
        // Run after a delay to ensure everything is loaded
        setTimeout(directImageFix, 1000);
        
        // Override navigation functions
        const navFunctions = ['nextQuestion', 'prevQuestion', 'jumpToSection', 
                             'nextAdvancedQuestion', 'prevAdvancedQuestion', 'jumpToAdvancedSection'];
        
        navFunctions.forEach(funcName => {
            if (typeof window[funcName] === 'function') {
                const originalFunc = window[funcName];
                window[funcName] = function() {
                    originalFunc.apply(this, arguments);
                    setTimeout(directImageFix, 500);
                };
            }
        });
    });
    
    // Also run periodically to ensure it's applied
    setInterval(directImageFix, 2000);
})();