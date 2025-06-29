// Final fix for folder opening and image loading
(function() {
    // Function to directly load images
    function directLoadImages(folderPath) {
        console.log("Loading images from:", folderPath);
        
        // Get current question number
        const questionNumber = window.currentQuestionIndex + 1;
        
        // Construct image paths
        const questionImagePath = `${folderPath}/Question-${questionNumber}.png`;
        const optionAImagePath = `${folderPath}/Question-${questionNumber} Option-1.png`;
        const optionBImagePath = `${folderPath}/Question-${questionNumber} Option-2.png`;
        const optionCImagePath = `${folderPath}/Question-${questionNumber} Option-3.png`;
        const optionDImagePath = `${folderPath}/Question-${questionNumber} Option-4.png`;
        
        // Load images
        loadImage(questionImagePath, 'question');
        loadImage(optionAImagePath, 'option-a');
        loadImage(optionBImagePath, 'option-b');
        loadImage(optionCImagePath, 'option-c');
        loadImage(optionDImagePath, 'option-d');
    }
    
    // Function to load an image
    function loadImage(src, type) {
        const img = new Image();
        img.src = src;
        
        img.onload = function() {
            console.log(`Image loaded: ${src}`);
            displayImage(img, type);
        };
        
        img.onerror = function() {
            console.log(`Image not found: ${src}`);
        };
    }
    
    // Function to display an image
    function displayImage(img, type) {
        // Style the image
        img.style.maxWidth = '100%';
        img.style.border = '2px solid #4f46e5';
        img.style.borderRadius = '5px';
        img.style.marginTop = '10px';
        
        // Create container
        const container = document.createElement('div');
        container.appendChild(img);
        
        if (type === 'question') {
            // Hide question text
            const questionText = document.getElementById('question-text');
            if (questionText) questionText.style.display = 'none';
            
            // Hide question text label
            const questionTextLabel = document.querySelector('label[for="question-text"]');
            if (questionTextLabel) questionTextLabel.style.display = 'none';
            
            // Hide question image label and input
            const questionImageLabel = document.querySelector('label[for="question-image"]');
            if (questionImageLabel) questionImageLabel.style.display = 'none';
            
            const questionImageInput = document.getElementById('question-image');
            if (questionImageInput && questionImageInput.parentElement) {
                questionImageInput.parentElement.style.display = 'none';
            }
            
            // Add to page
            const form = document.getElementById('question-form');
            if (form) {
                form.insertBefore(container, form.firstChild);
            }
        } else {
            // Get option letter
            const optionLetter = type.split('-')[1];
            
            // Hide option text
            const optionText = document.getElementById(`option-${optionLetter}-text`);
            if (optionText) optionText.style.display = 'none';
            
            // Hide option image label and input
            const optionImageLabel = document.querySelector(`label[for="option-${optionLetter}-image"]`);
            if (optionImageLabel) optionImageLabel.style.display = 'none';
            
            const optionImageInput = document.getElementById(`option-${optionLetter}-image`);
            if (optionImageInput && optionImageInput.parentElement) {
                optionImageInput.parentElement.style.display = 'none';
            }
            
            // Find option container
            const optionContainer = document.querySelector(`.option-container:nth-of-type(${optionLetter.charCodeAt(0) - 96})`);
            if (optionContainer) {
                optionContainer.appendChild(container);
            }
        }
    }
    
    // Add button to page
    window.addEventListener('load', function() {
        // Add folder button
        const topButtonGroup = document.querySelector('.top-navbar .d-flex.align-items-center');
        if (topButtonGroup) {
            const button = document.createElement('button');
            button.className = 'btn btn-info me-3';
            button.innerHTML = '<i class="fas fa-folder-open me-1"></i> Load Images';
            button.onclick = function() {
                // Prompt for folder path
                const folderPath = prompt('Enter folder path (e.g., C:\\Users\\HP\\myproject\\jeeapp\\src\\webapp\\Prepsharp\\papers\\2024-1\\Physics)');
                if (folderPath) {
                    directLoadImages(folderPath);
                }
            };
            
            topButtonGroup.appendChild(button);
        }
    });
})();