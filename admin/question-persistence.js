// Question persistence and edit functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get exam ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const examId = urlParams.get('examId') || 'default-exam';
    
    // Override saveQuestion to store in localStorage
    if (typeof saveQuestion === 'function') {
        const originalSaveQuestion = saveQuestion;
        window.saveQuestion = function(examId) {
            // Get current question index
            const currentIndex = window.currentQuestionIndex || 0;
            
            // Save the current form state to localStorage
            saveQuestionState(currentIndex);
            
            // Call the original function
            const result = originalSaveQuestion(examId);
            
            // Change save button to edit button
            updateSaveButtonToEdit();
            
            return result;
        };
    }
    
    // Function to save question state
    function saveQuestionState(index) {
        // Get form values
        const questionData = {
            subject: document.getElementById('question-subject').value,
            chapter: document.getElementById('question-chapter').value,
            difficulty: document.getElementById('question-difficulty').value,
            text: document.getElementById('question-text').value,
            marks: document.getElementById('question-marks').value,
            type: document.getElementById('question-type').value,
            questionImageSrc: document.getElementById('question-image-preview-img').src,
            hasQuestionImage: document.getElementById('question-image-preview').style.display !== 'none',
            timestamp: new Date().getTime()
        };
        
        // Get option data if it's an MCQ
        if (questionData.type === 'mcq-single') {
            questionData.options = [];
            const optionLetters = ['a', 'b', 'c', 'd'];
            
            optionLetters.forEach(letter => {
                const optionText = document.getElementById(`option-${letter}-text`).value;
                const optionImageSrc = document.getElementById(`option-${letter}-image-preview-img`).src;
                const hasOptionImage = document.getElementById(`option-${letter}-image-preview`).style.display !== 'none';
                const isCorrect = document.getElementById(`option-${letter}-correct`).checked;
                
                questionData.options.push({
                    text: optionText,
                    imageSrc: optionImageSrc,
                    hasImage: hasOptionImage,
                    isCorrect: isCorrect
                });
            });
        }
        
        // Save to localStorage
        const storageKey = `exam-${examId}-question-${index}`;
        localStorage.setItem(storageKey, JSON.stringify(questionData));
    }
    
    // Function to load question state
    function loadQuestionState(index) {
        const storageKey = `exam-${examId}-question-${index}`;
        const savedData = localStorage.getItem(storageKey);
        
        if (savedData) {
            const questionData = JSON.parse(savedData);
            
            // Set form values
            document.getElementById('question-subject').value = questionData.subject || '';
            document.getElementById('question-chapter').value = questionData.chapter || '';
            document.getElementById('question-difficulty').value = questionData.difficulty || '';
            document.getElementById('question-text').value = questionData.text || '';
            document.getElementById('question-marks').value = questionData.marks || '4';
            document.getElementById('question-type').value = questionData.type || 'mcq-single';
            
            // Toggle question fields based on type
            if (typeof toggleQuestionFields === 'function') {
                toggleQuestionFields();
            }
            
            // Set question image if it exists
            if (questionData.hasQuestionImage && questionData.questionImageSrc) {
                document.getElementById('question-image-preview-img').src = questionData.questionImageSrc;
                document.getElementById('question-image-preview').style.display = 'block';
            } else {
                document.getElementById('question-image-preview').style.display = 'none';
            }
            
            // Set option data if it's an MCQ
            if (questionData.type === 'mcq-single' && questionData.options) {
                const optionLetters = ['a', 'b', 'c', 'd'];
                
                optionLetters.forEach((letter, i) => {
                    if (questionData.options[i]) {
                        document.getElementById(`option-${letter}-text`).value = questionData.options[i].text || '';
                        
                        if (questionData.options[i].hasImage && questionData.options[i].imageSrc) {
                            document.getElementById(`option-${letter}-image-preview-img`).src = questionData.options[i].imageSrc;
                            document.getElementById(`option-${letter}-image-preview`).style.display = 'block';
                        } else {
                            document.getElementById(`option-${letter}-image-preview`).style.display = 'none';
                        }
                        
                        document.getElementById(`option-${letter}-correct`).checked = questionData.options[i].isCorrect;
                    }
                });
            }
            
            // Change save button to edit button
            updateSaveButtonToEdit();
            
            return true;
        }
        
        return false;
    }
    
    // Function to update save button to edit button
    function updateSaveButtonToEdit() {
        const saveBtn = document.getElementById('save-question-btn');
        if (saveBtn) {
            saveBtn.innerHTML = '<i class="fas fa-edit me-2"></i> Update Question';
            saveBtn.classList.remove('btn-primary');
            saveBtn.classList.add('btn-success');
        }
    }
    
    // Function to reset save button
    function resetSaveButton() {
        const saveBtn = document.getElementById('save-question-btn');
        if (saveBtn) {
            saveBtn.innerHTML = '<i class="fas fa-save me-2"></i> Save Question';
            saveBtn.classList.remove('btn-success');
            saveBtn.classList.add('btn-primary');
        }
    }
    
    // Override navigation functions to save current state before navigating
    if (typeof nextQuestion === 'function') {
        const originalNextQuestion = nextQuestion;
        window.nextQuestion = function() {
            // Save current question state
            saveQuestionState(window.currentQuestionIndex || 0);
            
            // Call original function
            originalNextQuestion();
            
            // Load state for new question
            setTimeout(() => {
                loadQuestionState(window.currentQuestionIndex || 0) || resetSaveButton();
            }, 100);
        };
    }
    
    if (typeof prevQuestion === 'function') {
        const originalPrevQuestion = prevQuestion;
        window.prevQuestion = function() {
            // Save current question state
            saveQuestionState(window.currentQuestionIndex || 0);
            
            // Call original function
            originalPrevQuestion();
            
            // Load state for new question
            setTimeout(() => {
                loadQuestionState(window.currentQuestionIndex || 0) || resetSaveButton();
            }, 100);
        };
    }
    
    // Load question state on page load
    setTimeout(() => {
        loadQuestionState(window.currentQuestionIndex || 0) || resetSaveButton();
    }, 500);
});