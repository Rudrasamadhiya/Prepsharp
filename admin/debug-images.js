// Debug script to check and fix image display issues
(function() {
    // Function to log and fix image issues
    function debugImages() {
        console.log("DEBUG: Running image debug");
        
        // Check if existingQuestions is available
        if (!window.existingQuestions) {
            console.log("DEBUG: No existing questions found");
            return;
        }
        
        // Log all existing questions
        console.log("DEBUG: Existing questions:", window.existingQuestions);
        
        // Get current question
        const questionNumber = window.currentQuestionIndex + 1;
        const existingQuestion = window.existingQuestions[questionNumber];
        
        console.log(`DEBUG: Current question number: ${questionNumber}`);
        console.log("DEBUG: Current question data:", existingQuestion);
        
        if (!existingQuestion) {
            console.log("DEBUG: No data for current question");
            return;
        }
        
        // Check for question image
        if (existingQuestion.imageUrl) {
            console.log("DEBUG: Question image URL:", existingQuestion.imageUrl);
            
            // Force display the image
            const img = document.createElement('img');
            img.src = existingQuestion.imageUrl;
            img.style.maxWidth = '100%';
            img.style.border = '3px solid red';
            img.style.padding = '10px';
            img.style.marginBottom = '20px';
            
            // Add to page
            const container = document.querySelector('.card-body');
            if (container) {
                // Create a header
                const header = document.createElement('h4');
                header.textContent = 'DEBUG: Question Image';
                header.style.color = 'red';
                
                // Insert at the top
                container.insertBefore(header, container.firstChild);
                container.insertBefore(img, container.firstChild.nextSibling);
                
                console.log("DEBUG: Inserted question image");
            }
        } else {
            console.log("DEBUG: No question image URL found");
        }
        
        // Check for option images
        if (existingQuestion.optionImages && existingQuestion.optionImages.length > 0) {
            console.log("DEBUG: Option images:", existingQuestion.optionImages);
            
            // Create option images container
            const optionsContainer = document.createElement('div');
            optionsContainer.style.marginBottom = '20px';
            
            // Add header
            const header = document.createElement('h4');
            header.textContent = 'DEBUG: Option Images';
            header.style.color = 'red';
            optionsContainer.appendChild(header);
            
            // Add each option image
            existingQuestion.optionImages.forEach((url, index) => {
                if (!url) return;
                
                const optionLetter = String.fromCharCode(65 + index); // A, B, C, D
                
                const optionHeader = document.createElement('h5');
                optionHeader.textContent = `Option ${optionLetter}`;
                optionHeader.style.color = 'blue';
                optionsContainer.appendChild(optionHeader);
                
                const img = document.createElement('img');
                img.src = url;
                img.style.maxWidth = '100%';
                img.style.border = '2px solid blue';
                img.style.padding = '5px';
                img.style.marginBottom = '10px';
                optionsContainer.appendChild(img);
                
                console.log(`DEBUG: Added option ${optionLetter} image`);
            });
            
            // Add to page
            const container = document.querySelector('.card-body');
            if (container) {
                container.insertBefore(optionsContainer, container.firstChild.nextSibling.nextSibling);
            }
        } else {
            console.log("DEBUG: No option images found");
        }
        
        // Direct fix for existing image elements
        const questionImagePreview = document.getElementById('question-image-preview');
        const questionImagePreviewImg = document.getElementById('question-image-preview-img');
        
        if (questionImagePreview && questionImagePreviewImg && existingQuestion.imageUrl) {
            questionImagePreviewImg.src = existingQuestion.imageUrl;
            questionImagePreview.style.display = 'block';
            questionImagePreview.style.maxWidth = '100%';
            questionImagePreviewImg.style.border = '3px solid green';
            
            console.log("DEBUG: Fixed question image preview");
        }
        
        // Fix option image previews
        if (existingQuestion.optionImages) {
            for (let i = 0; i < existingQuestion.optionImages.length; i++) {
                if (!existingQuestion.optionImages[i]) continue;
                
                const optionLetter = String.fromCharCode(97 + i); // a, b, c, d
                const optionImagePreview = document.getElementById(`option-${optionLetter}-image-preview`);
                const optionImagePreviewImg = document.getElementById(`option-${optionLetter}-image-preview-img`);
                
                if (optionImagePreview && optionImagePreviewImg) {
                    optionImagePreviewImg.src = existingQuestion.optionImages[i];
                    optionImagePreview.style.display = 'block';
                    optionImagePreview.style.maxWidth = '100%';
                    optionImagePreviewImg.style.border = '3px solid green';
                    
                    console.log(`DEBUG: Fixed option ${optionLetter.toUpperCase()} image preview`);
                }
            }
        }
    }
    
    // Run debug on page load
    window.addEventListener('load', function() {
        setTimeout(debugImages, 2000);
    });
    
    // Add a debug button
    setTimeout(function() {
        const container = document.querySelector('.card-header');
        if (container) {
            const debugButton = document.createElement('button');
            debugButton.className = 'btn btn-danger ms-2';
            debugButton.textContent = 'Debug Images';
            debugButton.onclick = debugImages;
            
            container.appendChild(debugButton);
            console.log("DEBUG: Added debug button");
        }
    }, 1000);
})();