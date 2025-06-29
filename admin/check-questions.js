// Check if questions are being loaded correctly
(function() {
    // Function to directly load questions from Firebase
    async function loadQuestionsDirectly() {
        // Get exam ID from URL
        const urlParams = new URLSearchParams(window.location.search);
        const examId = urlParams.get('examId');
        
        if (!examId) {
            showStatus('No exam ID found in URL');
            return;
        }
        
        showStatus(`Loading questions for exam: ${examId}...`);
        
        try {
            // Check if Firebase is initialized
            if (!window.firebase || !window.firebase.firestore) {
                showStatus('Firebase is not initialized', true);
                return;
            }
            
            // Get questions from Firebase
            const db = firebase.firestore();
            const snapshot = await db.collection('papers').doc(examId).collection('questions').get();
            
            if (snapshot.empty) {
                showStatus(`No questions found for exam: ${examId}`, true);
                return;
            }
            
            // Store questions
            const questions = {};
            snapshot.forEach(doc => {
                const question = doc.data();
                if (question.questionNo) {
                    questions[question.questionNo] = question;
                }
            });
            
            // Store in global variable
            window.existingQuestions = questions;
            
            // Show success message
            showStatus(`Loaded ${Object.keys(questions).length} questions successfully`, false);
            
            // Show question list
            showQuestionList(questions);
            
            // Update current question
            updateCurrentQuestion();
        } catch (error) {
            showStatus(`Error loading questions: ${error.message}`, true);
            console.error('Error loading questions:', error);
        }
    }
    
    // Function to show status message
    function showStatus(message, isError = false) {
        // Create or get status container
        let statusContainer = document.getElementById('question-status');
        if (!statusContainer) {
            statusContainer = document.createElement('div');
            statusContainer.id = 'question-status';
            statusContainer.style.padding = '10px';
            statusContainer.style.margin = '10px 0';
            statusContainer.style.borderRadius = '5px';
            
            // Add to page
            const form = document.getElementById('question-form');
            if (form) {
                form.insertBefore(statusContainer, form.firstChild);
            }
        }
        
        // Set style based on error status
        statusContainer.style.backgroundColor = isError ? '#f8d7da' : '#d4edda';
        statusContainer.style.border = isError ? '1px solid #f5c6cb' : '1px solid #c3e6cb';
        statusContainer.style.color = isError ? '#721c24' : '#155724';
        
        // Set message
        statusContainer.textContent = message;
    }
    
    // Function to show question list
    function showQuestionList(questions) {
        // Create container
        const container = document.createElement('div');
        container.style.padding = '10px';
        container.style.margin = '10px 0';
        container.style.backgroundColor = '#f8f9fa';
        container.style.border = '1px solid #dee2e6';
        container.style.borderRadius = '5px';
        
        // Add header
        const header = document.createElement('h5');
        header.textContent = 'Available Questions';
        container.appendChild(header);
        
        // Add question list
        const list = document.createElement('ul');
        Object.keys(questions).sort((a, b) => parseInt(a) - parseInt(b)).forEach(questionNo => {
            const question = questions[questionNo];
            const item = document.createElement('li');
            
            // Create link to load question
            const link = document.createElement('a');
            link.href = '#';
            link.textContent = `Question ${questionNo}: ${question.subject} - ${question.chapter} (${question.type})`;
            link.onclick = function(e) {
                e.preventDefault();
                window.currentQuestionIndex = parseInt(questionNo) - 1;
                updateCurrentQuestion();
            };
            
            // Add image indicators
            if (question.imageUrl) {
                const imgIcon = document.createElement('span');
                imgIcon.textContent = ' 📷';
                imgIcon.title = 'Has question image';
                link.appendChild(imgIcon);
            }
            
            if (question.optionImages && question.optionImages.some(url => url)) {
                const optIcon = document.createElement('span');
                optIcon.textContent = ' 🖼️';
                optIcon.title = 'Has option images';
                link.appendChild(optIcon);
            }
            
            item.appendChild(link);
            list.appendChild(item);
        });
        container.appendChild(list);
        
        // Add to page
        const form = document.getElementById('question-form');
        if (form) {
            form.insertBefore(container, form.firstChild);
        }
    }
    
    // Function to update current question display
    function updateCurrentQuestion() {
        const questionNo = window.currentQuestionIndex + 1;
        const question = window.existingQuestions?.[questionNo];
        
        if (!question) {
            showStatus(`No data found for question ${questionNo}`, true);
            return;
        }
        
        showStatus(`Loaded question ${questionNo}: ${question.subject} - ${question.chapter}`);
        
        // Display question data
        document.getElementById('question-subject').value = question.subject || '';
        document.getElementById('question-chapter').value = question.chapter || '';
        document.getElementById('question-difficulty').value = question.difficulty || '';
        document.getElementById('question-text').value = question.text || '';
        document.getElementById('question-marks').value = question.marks || 4;
        
        // Display question image if available
        if (question.imageUrl) {
            // Create image container
            const imgContainer = document.createElement('div');
            imgContainer.style.margin = '15px 0';
            imgContainer.style.padding = '10px';
            imgContainer.style.border = '1px solid #4f46e5';
            imgContainer.style.borderRadius = '5px';
            
            // Add image
            const img = document.createElement('img');
            img.src = question.imageUrl;
            img.style.maxWidth = '100%';
            img.style.display = 'block';
            img.style.margin = '0 auto';
            imgContainer.appendChild(img);
            
            // Add to page
            const questionTextArea = document.getElementById('question-text');
            if (questionTextArea && questionTextArea.parentNode) {
                questionTextArea.parentNode.insertBefore(imgContainer, questionTextArea.nextSibling);
            }
        }
    }
    
    // Add button to load questions
    window.addEventListener('load', function() {
        setTimeout(function() {
            const header = document.querySelector('.card-header');
            if (header) {
                const button = document.createElement('button');
                button.className = 'btn btn-primary ms-2';
                button.textContent = 'Load Questions';
                button.onclick = loadQuestionsDirectly;
                header.appendChild(button);
            }
        }, 1000);
    });
})();