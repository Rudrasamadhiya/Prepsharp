// Firebase question loader - checks if questions exist and loads them
document.addEventListener('DOMContentLoaded', function() {
    // Get exam ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const examId = urlParams.get('examId') || 'default-exam';
    
    // Reference to Firebase
    let db;
    try {
        if (firebase && firebase.firestore) {
            db = firebase.firestore();
            console.log("Firebase connection established for question loading");
        }
    } catch (error) {
        console.error("Firebase not available:", error);
    }
    
    // Override updateQuestionFields to check Firebase first
    if (typeof updateQuestionFields === 'function') {
        const originalUpdateQuestionFields = updateQuestionFields;
        window.updateQuestionFields = function() {
            // Call original function first to set up the UI
            originalUpdateQuestionFields();
            
            // Then check if this question exists in Firebase
            if (db) {
                loadQuestionFromFirebase();
            }
        };
    }
    
    // Function to load question from Firebase
    function loadQuestionFromFirebase() {
        if (!db) return;
        
        // Show loading state
        const saveBtn = document.getElementById('save-question-btn');
        if (saveBtn) {
            saveBtn.disabled = true;
            saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i> Loading...';
        }
        
        // Get current question number (1-based)
        const questionNumber = (window.currentQuestionIndex || 0) + 1;
        
        // Get section info for current question
        let sectionInfo;
        if (typeof getSectionInfo === 'function') {
            sectionInfo = getSectionInfo(questionNumber);
        }
        
        // Get question type and subject based on section
        let questionType = 'mcq-single';
        let subject = 'Physics';
        
        if (sectionInfo) {
            if (sectionInfo.type === 'numerical') {
                questionType = 'numerical';
            }
            subject = sectionInfo.subject;
        }
        
        // Set the question type and subject in the form
        document.getElementById('question-type').value = questionType;
        document.getElementById('question-subject').value = subject;
        document.getElementById('subject-display').textContent = subject;
        
        // Toggle question fields based on type
        if (typeof toggleQuestionFields === 'function') {
            toggleQuestionFields();
        }
        
        // Query Firebase for this question
        db.collection('papers').doc(examId).collection('questions')
            .where('questionNo', '==', questionNumber)
            .limit(1)
            .get()
            .then(snapshot => {
                if (!snapshot.empty) {
                    // Question exists, load it
                    const questionData = snapshot.docs[0].data();
                    populateFormWithQuestion(questionData);
                    
                    // Update save button to edit button
                    if (saveBtn) {
                        saveBtn.disabled = false;
                        saveBtn.innerHTML = '<i class="fas fa-edit me-2"></i> Update Question';
                        saveBtn.classList.remove('btn-primary');
                        saveBtn.classList.add('btn-success');
                    }
                    
                    // Show message that question already exists
                    showQuestionExistsMessage(questionData.id || `Question ${questionNumber}`);
                    
                    console.log(`Question ${questionNumber} loaded from Firebase`);
                } else {
                    // Question doesn't exist, reset form
                    if (saveBtn) {
                        saveBtn.disabled = false;
                        saveBtn.innerHTML = '<i class="fas fa-save me-2"></i> Save Question';
                        saveBtn.classList.remove('btn-success');
                        saveBtn.classList.add('btn-primary');
                    }
                    
                    // Hide message if it exists
                    hideQuestionExistsMessage();
                    
                    console.log(`No existing question ${questionNumber} found`);
                }
            })
            .catch(error => {
                console.error("Error loading question:", error);
                
                // Reset save button
                if (saveBtn) {
                    saveBtn.disabled = false;
                    saveBtn.innerHTML = '<i class="fas fa-save me-2"></i> Save Question';
                }
                
                // Hide message if it exists
                hideQuestionExistsMessage();
            });
    }
    
    // Function to show message that question already exists
    function showQuestionExistsMessage(questionId) {
        // Remove existing message if any
        hideQuestionExistsMessage();
        
        // Create message element
        const messageDiv = document.createElement('div');
        messageDiv.id = 'question-exists-message';
        messageDiv.className = 'alert alert-info';
        messageDiv.style.marginBottom = '15px';
        messageDiv.innerHTML = `<i class="fas fa-info-circle me-2"></i> <strong>Question already added:</strong> ${questionId}`;
        
        // Insert at the top of the form
        const formElement = document.getElementById('question-form');
        if (formElement) {
            formElement.insertBefore(messageDiv, formElement.firstChild);
        }
    }
    
    // Function to hide question exists message
    function hideQuestionExistsMessage() {
        const existingMessage = document.getElementById('question-exists-message');
        if (existingMessage) {
            existingMessage.remove();
        }
    }
    }
    
    // Function to populate form with question data
    function populateFormWithQuestion(questionData) {
        // Set basic fields
        if (questionData.subject) {
            document.getElementById('question-subject').value = questionData.subject;
            document.getElementById('subject-display').textContent = questionData.subject;
        }
        
        if (questionData.chapter) {
            document.getElementById('question-chapter').value = questionData.chapter;
        }
        
        if (questionData.difficulty) {
            document.getElementById('question-difficulty').value = questionData.difficulty;
        }
        
        if (questionData.text) {
            document.getElementById('question-text').value = questionData.text;
        }
        
        if (questionData.marks) {
            document.getElementById('question-marks').value = questionData.marks;
        }
        
        // Set question type and toggle fields
        if (questionData.type) {
            document.getElementById('question-type').value = questionData.type;
            if (typeof toggleQuestionFields === 'function') {
                toggleQuestionFields();
            }
        }
        
        // Handle MCQ options
        if (questionData.type === 'mcq-single' && questionData.options) {
            const optionLetters = ['a', 'b', 'c', 'd'];
            
            optionLetters.forEach((letter, index) => {
                if (questionData.options[index]) {
                    document.getElementById(`option-${letter}-text`).value = questionData.options[index];
                }
            });
            
            // Set correct option
            if (typeof questionData.correctOption === 'number') {
                const correctRadio = document.querySelector(`input[name="correct-option"][value="${questionData.correctOption}"]`);
                if (correctRadio) correctRadio.checked = true;
            }
        }
        
        // Handle multiple correct options
        if (questionData.type === 'mcq-multiple' && questionData.options) {
            const optionLetters = ['a', 'b', 'c', 'd'];
            
            optionLetters.forEach((letter, index) => {
                if (questionData.options[index]) {
                    document.getElementById(`multi-option-${letter}-text`).value = questionData.options[index];
                }
                
                if (questionData.correctOptions && questionData.correctOptions[index]) {
                    document.getElementById(`multi-option-${letter}-correct`).checked = true;
                }
            });
        }
        
        // Handle numerical answer
        if (questionData.type === 'numerical' && questionData.answer) {
            document.getElementById('numerical-value').value = questionData.answer;
        }
    }
    
    // Override saveQuestion to update existing questions
    if (typeof saveQuestion === 'function') {
        const originalSaveQuestion = saveQuestion;
        window.saveQuestion = function(examId) {
            // Get current question number (1-based)
            const questionNumber = (window.currentQuestionIndex || 0) + 1;
            
            // Check if we're updating an existing question
            const saveBtn = document.getElementById('save-question-btn');
            const isUpdate = saveBtn && saveBtn.innerHTML.includes('Update');
            
            if (isUpdate && db) {
                // Find the existing question
                db.collection('papers').doc(examId).collection('questions')
                    .where('questionNo', '==', questionNumber)
                    .limit(1)
                    .get()
                    .then(snapshot => {
                        if (!snapshot.empty) {
                            // Get the question ID
                            const questionId = snapshot.docs[0].id;
                            
                            // Call original function but use the existing ID
                            // This is a hack since we don't have access to the internal logic
                            window.existingQuestionId = questionId;
                            originalSaveQuestion(examId);
                            
                            console.log(`Question ${questionNumber} updated with ID: ${questionId}`);
                        } else {
                            // No existing question, create new
                            originalSaveQuestion(examId);
                        }
                    })
                    .catch(error => {
                        console.error("Error checking existing question:", error);
                        originalSaveQuestion(examId);
                    });
                
                return; // Return early to prevent double call
            }
            
            // Normal save for new questions
            return originalSaveQuestion(examId);
        };
    }
    
    // Initial load of the current question
    if (db) {
        setTimeout(loadQuestionFromFirebase, 1000);
    }
});