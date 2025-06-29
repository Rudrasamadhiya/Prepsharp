// Force images to display
(function() {
    // Create a style element to add custom CSS
    const style = document.createElement('style');
    style.textContent = `
        .force-image-container {
            margin: 15px 0;
            padding: 10px;
            border: 2px solid #4f46e5;
            border-radius: 8px;
            background-color: #f8f9fa;
        }
        .force-image-title {
            font-weight: bold;
            margin-bottom: 10px;
            color: #4f46e5;
        }
        .force-image {
            max-width: 100%;
            max-height: 400px;
            display: block;
            margin: 0 auto;
        }
    `;
    document.head.appendChild(style);

    // Function to force display images
    function forceDisplayImages() {
        // Get current question
        const questionNumber = window.currentQuestionIndex + 1;
        if (!window.existingQuestions || !window.existingQuestions[questionNumber]) return;
        
        const question = window.existingQuestions[questionNumber];
        
        // Clear any previous forced images
        const oldContainers = document.querySelectorAll('.force-image-container');
        oldContainers.forEach(container => container.remove());
        
        // Get the form container
        const form = document.getElementById('question-form');
        if (!form) return;
        
        // Create container for question image
        if (question.imageUrl) {
            const container = document.createElement('div');
            container.className = 'force-image-container';
            
            const title = document.createElement('div');
            title.className = 'force-image-title';
            title.textContent = 'Question Image';
            container.appendChild(title);
            
            const img = document.createElement('img');
            img.className = 'force-image';
            img.src = question.imageUrl;
            img.alt = 'Question Image';
            container.appendChild(img);
            
            // Insert at the top of the form
            form.insertBefore(container, form.firstChild);
            
            // Hide original question text area
            const questionText = document.getElementById('question-text');
            const questionTextLabel = document.querySelector('label[for="question-text"]');
            if (questionText) questionText.style.display = 'none';
            if (questionTextLabel) questionTextLabel.style.display = 'none';
        }
        
        // Create containers for option images
        if (question.optionImages && question.type === 'mcq-single') {
            const optionLetters = ['A', 'B', 'C', 'D'];
            
            for (let i = 0; i < question.optionImages.length; i++) {
                if (!question.optionImages[i]) continue;
                
                const container = document.createElement('div');
                container.className = 'force-image-container';
                
                const title = document.createElement('div');
                title.className = 'force-image-title';
                title.textContent = `Option ${optionLetters[i]} Image`;
                container.appendChild(title);
                
                const img = document.createElement('img');
                img.className = 'force-image';
                img.src = question.optionImages[i];
                img.alt = `Option ${optionLetters[i]} Image`;
                container.appendChild(img);
                
                // Find the option container to insert after
                const optionLetter = String.fromCharCode(97 + i); // a, b, c, d
                const optionContainer = document.querySelector(`.option-container:nth-child(${i+1})`);
                if (optionContainer) {
                    optionContainer.appendChild(container);
                    
                    // Hide original option text area
                    const optionText = document.getElementById(`option-${optionLetter}-text`);
                    if (optionText) optionText.style.display = 'none';
                }
            }
        }
        
        // Hide all image labels and inputs
        document.querySelectorAll('label[for$="-image"]').forEach(el => el.style.display = 'none');
        document.querySelectorAll('input[id$="-image"]').forEach(el => {
            if (el.parentElement) el.parentElement.style.display = 'none';
        });
        document.querySelectorAll('button[id$="-btn"]').forEach(el => {
            if (el.id.includes('capture')) el.style.display = 'none';
        });
    }
    
    // Run on page load and after navigation
    window.addEventListener('load', function() {
        // Add a button to force display images
        const header = document.querySelector('.card-header');
        if (header) {
            const button = document.createElement('button');
            button.className = 'btn btn-success ms-2';
            button.textContent = 'Show Images';
            button.onclick = forceDisplayImages;
            header.appendChild(button);
        }
        
        // Run after a delay
        setTimeout(forceDisplayImages, 2000);
        
        // Override navigation functions
        ['nextQuestion', 'prevQuestion', 'jumpToSection', 
         'nextAdvancedQuestion', 'prevAdvancedQuestion', 'jumpToAdvancedSection'].forEach(funcName => {
            if (typeof window[funcName] === 'function') {
                const originalFunc = window[funcName];
                window[funcName] = function() {
                    originalFunc.apply(this, arguments);
                    setTimeout(forceDisplayImages, 500);
                };
            }
        });
    });
})();