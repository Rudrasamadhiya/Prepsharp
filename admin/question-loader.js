// Load existing questions and enable editing
(function() {
    // Function to load existing questions for the current exam
    async function loadExistingQuestions(examId) {
        if (!window.db) return;
        
        try {
            // Get all questions for this exam
            const snapshot = await db.collection('papers').doc(examId).collection('questions').get();
            
            if (snapshot.empty) {
                console.log('No existing questions found');
                return;
            }
            
            // Store questions by question number
            window.existingQuestions = {};
            snapshot.forEach(doc => {
                const question = doc.data();
                if (question.questionNo) {
                    window.existingQuestions[question.questionNo] = question;
                }
            });
            
            console.log(`Loaded ${Object.keys(window.existingQuestions).length} existing questions`);
            
            // Update the current question with existing data if available
            updateCurrentQuestionWithExistingData();
            
            // Override navigation functions to update form when navigating
            overrideNavigationFunctions();
        } catch (error) {
            console.error('Error loading existing questions:', error);
        }
    }
    
    // Function to update the current form with existing question data
    function updateCurrentQuestionWithExistingData() {
        const questionNumber = window.currentQuestionIndex + 1;
        const existingQuestion = window.existingQuestions?.[questionNumber];
        
        if (!existingQuestion) {
            // No existing question, set save mode
            setSaveMode();
            return;
        }
        
        // Set edit mode
        setEditMode(existingQuestion);
    }
    
    // Function to set the form in save mode (new question)
    function setSaveMode() {
        const saveBtn = document.getElementById('save-question-btn');
        if (saveBtn) {
            saveBtn.innerHTML = '<i class="fas fa-save me-2"></i> Save Question';
            saveBtn.classList.remove('btn-warning');
            saveBtn.classList.add('btn-primary');
        }
    }
    
    // Function to set the form in edit mode (existing question)
    function setEditMode(question) {
        // Update form fields with existing data
        document.getElementById('question-text').value = question.text || '';
        document.getElementById('question-subject').value = question.subject || 'Physics';
        document.getElementById('question-chapter').value = question.chapter || '';
        document.getElementById('question-difficulty').value = question.difficulty || 'Medium';
        document.getElementById('question-marks').value = question.marks || 4;
        
        // Update chapters dropdown
        updateChapters(question.subject);
        
        // Set question type and toggle fields
        document.getElementById('question-type').value = question.type || 'mcq-single';
        toggleQuestionFields();
        
        // Fill in options based on question type
        if (question.type === 'mcq-single' && question.options) {
            document.getElementById('option-a-text').value = question.options[0] || '';
            document.getElementById('option-b-text').value = question.options[1] || '';
            document.getElementById('option-c-text').value = question.options[2] || '';
            document.getElementById('option-d-text').value = question.options[3] || '';
            
            // Set correct option
            if (typeof question.correctOption === 'number') {
                const radioId = ['option-a-correct', 'option-b-correct', 'option-c-correct', 'option-d-correct'][question.correctOption];
                document.getElementById(radioId).checked = true;
            }
        } else if (question.type === 'mcq-multiple' && question.options && question.correctOptions) {
            document.getElementById('multi-option-a-text').value = question.options[0] || '';
            document.getElementById('multi-option-b-text').value = question.options[1] || '';
            document.getElementById('multi-option-c-text').value = question.options[2] || '';
            document.getElementById('multi-option-d-text').value = question.options[3] || '';
            
            // Set correct options
            document.getElementById('multi-option-a-correct').checked = question.correctOptions[0] || false;
            document.getElementById('multi-option-b-correct').checked = question.correctOptions[1] || false;
            document.getElementById('multi-option-c-correct').checked = question.correctOptions[2] || false;
            document.getElementById('multi-option-d-correct').checked = question.correctOptions[3] || false;
        } else if (question.type === 'numerical') {
            document.getElementById('numerical-value').value = question.answer || '';
        }
        
        // Load images if available
        if (question.imageUrl) {
            const previewContainer = document.getElementById('question-image-preview');
            const previewImg = document.getElementById('question-image-preview-img');
            if (previewContainer && previewImg) {
                previewImg.src = question.imageUrl;
                previewContainer.style.display = 'block';
                
                // Hide question text area
                const questionTextLabel = document.querySelector('label[for="question-text"]');
                const questionText = document.getElementById('question-text');
                if (questionTextLabel) questionTextLabel.style.display = 'none';
                if (questionText) questionText.style.display = 'none';
            }
        }
        
        // Load option images if available
        if (question.optionImages && question.type === 'mcq-single') {
            for (let i = 0; i < question.optionImages.length; i++) {
                if (!question.optionImages[i]) continue;
                
                const optionLetter = String.fromCharCode(97 + i); // a, b, c, d
                const previewContainer = document.getElementById(`option-${optionLetter}-image-preview`);
                const previewImg = document.getElementById(`option-${optionLetter}-image-preview-img`);
                
                if (previewContainer && previewImg) {
                    previewImg.src = question.optionImages[i];
                    previewContainer.style.display = 'block';
                    
                    // Hide option text area
                    const optionText = document.getElementById(`option-${optionLetter}-text`);
                    if (optionText) optionText.style.display = 'none';
                }
            }
        }
        
        // Change save button to edit button
        const saveBtn = document.getElementById('save-question-btn');
        if (saveBtn) {
            saveBtn.innerHTML = '<i class="fas fa-edit me-2"></i> Update Question';
            saveBtn.classList.remove('btn-primary');
            saveBtn.classList.add('btn-warning');
        }
    }
    
    // Override navigation functions to update form when navigating
    function overrideNavigationFunctions() {
        // Store original functions
        const originalNextQuestion = window.nextQuestion;
        const originalPrevQuestion = window.prevQuestion;
        const originalJumpToSection = window.jumpToSection;
        
        // Override nextQuestion
        if (typeof originalNextQuestion === 'function') {
            window.nextQuestion = function() {
                originalNextQuestion.apply(this, arguments);
                updateCurrentQuestionWithExistingData();
            };
        }
        
        // Override prevQuestion
        if (typeof originalPrevQuestion === 'function') {
            window.prevQuestion = function() {
                originalPrevQuestion.apply(this, arguments);
                updateCurrentQuestionWithExistingData();
            };
        }
        
        // Override jumpToSection
        if (typeof originalJumpToSection === 'function') {
            window.jumpToSection = function() {
                originalJumpToSection.apply(this, arguments);
                updateCurrentQuestionWithExistingData();
            };
        }
        
        // Also override JEE Advanced navigation functions if they exist
        if (typeof window.nextAdvancedQuestion === 'function') {
            const originalNextAdvanced = window.nextAdvancedQuestion;
            window.nextAdvancedQuestion = function() {
                originalNextAdvanced.apply(this, arguments);
                updateCurrentQuestionWithExistingData();
            };
        }
        
        if (typeof window.prevAdvancedQuestion === 'function') {
            const originalPrevAdvanced = window.prevAdvancedQuestion;
            window.prevAdvancedQuestion = function() {
                originalPrevAdvanced.apply(this, arguments);
                updateCurrentQuestionWithExistingData();
            };
        }
        
        if (typeof window.jumpToAdvancedSection === 'function') {
            const originalJumpAdvanced = window.jumpToAdvancedSection;
            window.jumpToAdvancedSection = function() {
                originalJumpAdvanced.apply(this, arguments);
                updateCurrentQuestionWithExistingData();
            };
        }
    }
    
    // Initialize when the page loads
    window.addEventListener('load', function() {
        setTimeout(function() {
            const urlParams = new URLSearchParams(window.location.search);
            const examId = urlParams.get('examId');
            
            if (examId) {
                loadExistingQuestions(examId);
            }
        }, 1500);
    });
})();