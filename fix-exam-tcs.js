// Fix for exam-tcs.html
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the exam-tcs.html page with an ID parameter
    const urlParams = new URLSearchParams(window.location.search);
    const paperId = urlParams.get('id');
    
    if (paperId) {
        console.log("Loading paper:", paperId);
        
        // Load paper data directly
        fetch(`db/papers.json`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to load paper data');
                }
                return response.json();
            })
            .then(papers => {
                console.log("Papers loaded:", papers);
                const paper = papers.find(p => p.id === paperId);
                
                if (!paper) {
                    throw new Error(`Paper with ID ${paperId} not found`);
                }
                
                // Update paper title and information
                document.querySelector('.top-strip').textContent = paper.name;
                document.querySelector('.paper-indicator').textContent = `Paper ${paper.paperNumber}`;
                
                // Load first question
                if (paper.questions && paper.questions.length > 0) {
                    displayQuestion(paper.questions[0], paper);
                }
            })
            .catch(error => {
                console.error('Error loading paper:', error);
                alert('Failed to load exam paper. Please try again.');
            });
    }
    
    // Function to display a question
    function displayQuestion(question, paper) {
        console.log("Displaying question:", question);
        
        const questionDisplay = document.getElementById('question-display');
        if (!questionDisplay) return;
        
        // Update question number
        const questionNumberElement = questionDisplay.querySelector('.question-number');
        if (questionNumberElement) {
            questionNumberElement.textContent = `Question No. ${question.number}`;
        }
        
        // Update question content
        const questionContent = questionDisplay.querySelector('.question-content');
        if (!questionContent) return;
        
        const questionText = questionContent.querySelector('.question-text');
        if (!questionText) return;
        
        // Clear previous content
        questionText.innerHTML = '';
        
        // Add question image if available
        if (question.imagePath) {
            const img = document.createElement('img');
            img.src = question.imagePath;
            img.alt = `Question ${question.number}`;
            img.className = 'question-image';
            img.onerror = function() {
                console.error("Failed to load image:", question.imagePath);
                this.src = 'assets/images/image-placeholder.png';
            };
            questionText.appendChild(img);
        } else {
            questionText.innerHTML = '<p>Question text will appear here.</p>';
        }
        
        // Update options
        const optionsContainer = questionContent.querySelector('.options');
        if (!optionsContainer) return;
        
        optionsContainer.innerHTML = '';
        
        if (question.options && question.options.length > 0) {
            question.options.forEach((option, index) => {
                const optionDiv = document.createElement('div');
                optionDiv.className = 'option';
                
                const inputType = question.type === 'Multiple Correct Options' ? 'checkbox' : 'radio';
                const inputId = `q${question.number}-${option.label.toLowerCase()}`;
                
                optionDiv.innerHTML = `
                    <input type="${inputType}" name="q${question.number}" id="${inputId}" class="option-radio">
                    <label for="${inputId}" class="option-label">
                        <div class="option-letter">${option.label})</div>
                        <div class="option-text">
                            ${option.imagePath ? `<img src="${option.imagePath}" alt="Option ${option.label}" onerror="this.src='assets/images/option-placeholder.png';">` : ''}
                        </div>
                    </label>
                `;
                
                optionsContainer.appendChild(optionDiv);
            });
        } else if (question.type === 'Non-Negative Integer') {
            const inputDiv = document.createElement('div');
            inputDiv.className = 'integer-input';
            inputDiv.innerHTML = `
                <label for="q${question.number}-integer">Enter your answer (non-negative integer):</label>
                <input type="number" min="0" step="1" id="q${question.number}-integer" name="q${question.number}">
            `;
            optionsContainer.appendChild(inputDiv);
        }
    }
});