// Batch image loader - loads all images from main folder
document.addEventListener('DOMContentLoaded', function() {
    // Add a button to the top navbar
    const topNav = document.querySelector('.top-navbar .d-flex.align-items-center');
    if (topNav) {
        const btn = document.createElement('button');
        btn.className = 'btn btn-info me-3';
        btn.innerHTML = '<i class="fas fa-folder-open me-1"></i> Load All Images';
        btn.onclick = loadAllImages;
        topNav.appendChild(btn);
    }
    
    // Function to load all images from main folder
    function loadAllImages() {
        // Get main folder path from user
        const mainFolderPath = prompt("Enter main folder path (e.g., C:\\Users\\HP\\myproject\\jeeapp\\src\\webapp\\Prepsharp\\papers\\2024-1)");
        if (!mainFolderPath) return;
        
        // Define subject folders to check
        const subjectFolders = ['Physics', 'Chemistry', 'Maths'];
        
        // Show loading message
        alert("Starting to load images. This may take a moment.");
        
        // Load current question first
        loadCurrentQuestionImages(mainFolderPath, subjectFolders);
        
        // Ask if user wants to auto-advance through all questions
        if (confirm("Do you want to automatically load images for all questions?")) {
            // Start from question 1
            window.currentQuestionIndex = 0;
            loadAllQuestionsSequentially(mainFolderPath, subjectFolders);
        }
    }
    
    // Function to load images for current question
    function loadCurrentQuestionImages(mainFolderPath, subjectFolders) {
        const questionNumber = window.currentQuestionIndex + 1;
        console.log(`Loading images for question ${questionNumber}`);
        
        // Try each subject folder
        for (const subject of subjectFolders) {
            const folderPath = `${mainFolderPath}/${subject}`;
            
            // Check for question image
            const questionImagePath = `${folderPath}/Question-${questionNumber}.png`;
            tryLoadImage(questionImagePath, 'question', questionNumber);
            
            // Check for option images
            for (let i = 1; i <= 4; i++) {
                const optionImagePath = `${folderPath}/Question-${questionNumber} Option-${i}.png`;
                const optionLetter = String.fromCharCode(96 + i); // a, b, c, d
                tryLoadImage(optionImagePath, `option-${optionLetter}`, questionNumber);
            }
        }
    }
    
    // Function to try loading an image
    function tryLoadImage(path, type, questionNumber) {
        const img = new Image();
        img.src = path;
        
        img.onload = function() {
            console.log(`Found image: ${path}`);
            
            // If this is for the current question, display it
            if (window.currentQuestionIndex + 1 === questionNumber) {
                displayImage(img, type);
            }
        };
    }
    
    // Function to display an image
    function displayImage(img, type) {
        // Style the image
        img.style.maxWidth = '100%';
        img.style.border = '2px solid #4f46e5';
        img.style.borderRadius = '5px';
        img.style.marginBottom = '10px';
        
        if (type === 'question') {
            // Hide question text and label
            const qText = document.getElementById('question-text');
            const qLabel = document.querySelector('label[for="question-text"]');
            if (qText) qText.style.display = 'none';
            if (qLabel) qLabel.style.display = 'none';
            
            // Hide question image input and label
            const qImgInput = document.getElementById('question-image');
            const qImgLabel = document.querySelector('label[for="question-image"]');
            if (qImgInput && qImgInput.parentElement) qImgInput.parentElement.style.display = 'none';
            if (qImgLabel) qImgLabel.style.display = 'none';
            
            // Add question image to page
            const qContainer = document.createElement('div');
            qContainer.appendChild(img);
            const form = document.getElementById('question-form');
            if (form) form.insertBefore(qContainer, form.firstChild);
        } else {
            // Get option letter
            const optionLetter = type.split('-')[1];
            
            // Find option container (1-based index for nth-child)
            const optContainer = document.querySelector(`.option-container:nth-child(${optionLetter.charCodeAt(0) - 96})`);
            if (!optContainer) return;
            
            // Hide option text
            const optText = document.getElementById(`option-${optionLetter}-text`);
            if (optText) optText.style.display = 'none';
            
            // Hide option image input and label
            const optImgInput = document.getElementById(`option-${optionLetter}-image`);
            const optImgLabel = document.querySelector(`label[for="option-${optionLetter}-image"]`);
            if (optImgInput && optImgInput.parentElement) optImgInput.parentElement.style.display = 'none';
            if (optImgLabel) optImgLabel.style.display = 'none';
            
            // Add image to option container
            const container = document.createElement('div');
            container.appendChild(img);
            optContainer.appendChild(container);
        }
    }
    
    // Function to load all questions sequentially
    function loadAllQuestionsSequentially(mainFolderPath, subjectFolders) {
        // Get total questions
        let totalQuestions = 75; // Default
        if (typeof getTotalQuestions === 'function') {
            totalQuestions = getTotalQuestions();
        }
        
        let currentIndex = 0;
        
        function loadNext() {
            if (currentIndex >= totalQuestions) {
                alert("Finished loading all questions!");
                return;
            }
            
            // Set current question index
            window.currentQuestionIndex = currentIndex;
            
            // Update UI for current question
            if (typeof updateQuestionFields === 'function') {
                updateQuestionFields();
            }
            
            // Load images for current question
            loadCurrentQuestionImages(mainFolderPath, subjectFolders);
            
            // Move to next question
            currentIndex++;
            
            // Schedule next question load
            setTimeout(loadNext, 1000);
        }
        
        // Start loading
        loadNext();
    }
});