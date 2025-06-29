// Fix for image labels and loading
(function() {
    // Function to hide image labels and capture buttons when images are loaded
    function hideImageLabels() {
        // Hide question image label and capture button
        const questionImageLabel = document.querySelector('label[for="question-image"]');
        if (questionImageLabel) {
            questionImageLabel.style.display = 'none';
        }
        
        // Hide question image input container
        const questionImageContainer = document.querySelector('#question-image').parentElement;
        if (questionImageContainer) {
            questionImageContainer.style.display = 'none';
        }
        
        // Hide capture button for question
        const captureQuestionBtn = document.getElementById('capture-question-btn');
        if (captureQuestionBtn) {
            captureQuestionBtn.style.display = 'none';
        }
        
        // Hide option image labels
        const optionImageLabels = document.querySelectorAll('label[for^="option-"][for$="-image"]');
        optionImageLabels.forEach(label => {
            label.style.display = 'none';
        });
        
        // Hide option image input containers and capture buttons
        const optionImageContainers = document.querySelectorAll('input[id^="option-"][id$="-image"]');
        optionImageContainers.forEach(input => {
            const container = input.parentElement;
            if (container) {
                container.style.display = 'none';
            }
        });
        
        // Hide option capture buttons
        const optionCaptureButtons = document.querySelectorAll('.option-capture-btn');
        optionCaptureButtons.forEach(button => {
            button.style.display = 'none';
        });
    }
    
    // Override the updateCurrentQuestionWithExistingData function to hide labels
    const originalUpdateCurrentQuestionWithExistingData = window.updateCurrentQuestionWithExistingData;
    if (originalUpdateCurrentQuestionWithExistingData) {
        window.updateCurrentQuestionWithExistingData = function() {
            originalUpdateCurrentQuestionWithExistingData.apply(this, arguments);
            
            // Check if current question has images
            const questionNumber = window.currentQuestionIndex + 1;
            const existingQuestion = window.existingQuestions?.[questionNumber];
            
            if (existingQuestion && (existingQuestion.imageUrl || existingQuestion.optionImages)) {
                // Hide image labels after a short delay to ensure images are loaded
                setTimeout(hideImageLabels, 100);
            }
        };
    }
    
    // Fix image loading for existing questions
    function fixImageLoading() {
        const questionNumber = window.currentQuestionIndex + 1;
        const existingQuestion = window.existingQuestions?.[questionNumber];
        
        if (!existingQuestion) return;
        
        // Ensure chapter and difficulty are selected
        if (existingQuestion.chapter) {
            const chapterSelect = document.getElementById('question-chapter');
            if (chapterSelect && chapterSelect.value === '') {
                chapterSelect.value = existingQuestion.chapter;
            }
        }
        
        if (existingQuestion.difficulty) {
            const difficultySelect = document.getElementById('question-difficulty');
            if (difficultySelect && difficultySelect.value === '') {
                difficultySelect.value = existingQuestion.difficulty;
            }
        }
        
        // Fix question image
        if (existingQuestion.imageUrl) {
            const previewContainer = document.getElementById('question-image-preview');
            const previewImg = document.getElementById('question-image-preview-img');
            
            if (previewContainer && previewImg) {
                // Force reload the image
                previewImg.src = existingQuestion.imageUrl + '?t=' + new Date().getTime();
                previewContainer.style.display = 'block';
                
                // Make image larger and more visible
                previewImg.style.maxWidth = '100%';
                previewImg.style.maxHeight = '400px';
                previewImg.style.border = '1px solid #ddd';
                previewImg.style.borderRadius = '5px';
                previewImg.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
                
                // Hide question text area and label
                const questionTextLabel = document.querySelector('label[for="question-text"]');
                const questionText = document.getElementById('question-text');
                if (questionTextLabel) questionTextLabel.style.display = 'none';
                if (questionText) questionText.style.display = 'none';
                
                // Hide question image label and input
                hideImageLabels();
            }
        }
        
        // Fix option images
        if (existingQuestion.optionImages) {
            for (let i = 0; i < existingQuestion.optionImages.length; i++) {
                if (!existingQuestion.optionImages[i]) continue;
                
                const optionLetter = String.fromCharCode(97 + i); // a, b, c, d
                const previewContainer = document.getElementById(`option-${optionLetter}-image-preview`);
                const previewImg = document.getElementById(`option-${optionLetter}-image-preview-img`);
                
                if (previewContainer && previewImg) {
                    // Force reload the image
                    previewImg.src = existingQuestion.optionImages[i] + '?t=' + new Date().getTime();
                    previewContainer.style.display = 'block';
                    
                    // Make image larger and more visible
                    previewImg.style.maxWidth = '100%';
                    previewImg.style.maxHeight = '200px';
                    previewImg.style.border = '1px solid #ddd';
                    previewImg.style.borderRadius = '5px';
                    previewImg.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
                    
                    // Hide option text area
                    const optionText = document.getElementById(`option-${optionLetter}-text`);
                    if (optionText) optionText.style.display = 'none';
                }
            }
        }
    }
    
    // Call fixImageLoading when navigating
    const navigationFunctions = ['nextQuestion', 'prevQuestion', 'jumpToSection', 
                                'nextAdvancedQuestion', 'prevAdvancedQuestion', 'jumpToAdvancedSection'];
    
    navigationFunctions.forEach(funcName => {
        if (typeof window[funcName] === 'function') {
            const originalFunc = window[funcName];
            window[funcName] = function() {
                originalFunc.apply(this, arguments);
                setTimeout(fixImageLoading, 100);
            };
        }
    });
    
    // Initialize when the page loads
    window.addEventListener('load', function() {
        setTimeout(fixImageLoading, 2000);
    });
})();