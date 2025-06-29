// Enhanced save/update question functionality
(function() {
    // Wait for the page to load
    window.addEventListener('load', function() {
        // Wait for the save function to be available
        setTimeout(function() {
            // Store the original saveQuestion function
            const originalSaveQuestion = window.saveQuestion;
            
            // Replace with our enhanced version that handles both save and update
            window.saveQuestion = function(examId) {
                // Get the current question number (1-based)
                const questionNumber = window.currentQuestionIndex + 1;
                
                // Check if this is an existing question
                const isExisting = window.existingQuestions && window.existingQuestions[questionNumber];
                
                // Get section info for current question based on exam type
                let sectionInfo;
                if (examId && examId.includes('jee-advanced')) {
                    sectionInfo = getAdvancedSectionInfo(questionNumber);
                } else {
                    sectionInfo = getSectionInfo(questionNumber);
                }
                
                // Get form values
                const questionType = document.getElementById('question-type').value;
                const subject = document.getElementById('question-subject').value;
                const chapter = document.getElementById('question-chapter').value;
                const questionText = document.getElementById('question-text').value;
                const difficulty = document.getElementById('question-difficulty').value;
                const marks = document.getElementById('question-marks').value;
                
                // Validate required fields
                if (!questionType || !subject || !chapter || !questionText || !difficulty) {
                    alert('Please fill in all required fields');
                    return;
                }
                
                // Disable save button
                const saveBtn = document.getElementById('save-question-btn');
                saveBtn.disabled = true;
                saveBtn.innerHTML = isExisting ? 
                    '<i class="fas fa-spinner fa-spin me-2"></i> Updating...' : 
                    '<i class="fas fa-spinner fa-spin me-2"></i> Saving...';
                
                // Clean up chapter name for ID (remove spaces, special chars)
                const cleanChapter = chapter.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
                const cleanSubject = subject.toLowerCase();
                const cleanType = questionType.replace('mcq-', '').toLowerCase();
                
                // Create question object
                let question = {
                    text: questionText,
                    type: questionType,
                    subject: subject,
                    chapter: chapter,
                    difficulty: difficulty,
                    marks: parseInt(marks) || 4,
                    examId: examId,
                    updatedAt: new Date().getTime(),
                    sectionName: sectionInfo ? sectionInfo.section : null
                };
                
                // If it's a new question, add createdAt
                if (!isExisting) {
                    question.createdAt = new Date().getTime();
                }
                
                // Add type-specific data
                if (questionType === 'mcq-single') {
                    const options = [
                        document.getElementById('option-a-text').value,
                        document.getElementById('option-b-text').value,
                        document.getElementById('option-c-text').value,
                        document.getElementById('option-d-text').value
                    ];
                    
                    // Check if all options are filled
                    if (options.some(opt => !opt.trim())) {
                        alert('Please fill in all options');
                        saveBtn.disabled = false;
                        saveBtn.innerHTML = isExisting ? 
                            '<i class="fas fa-edit me-2"></i> Update Question' : 
                            '<i class="fas fa-save me-2"></i> Save Question';
                        return;
                    }
                    
                    // Get correct option
                    const correctOption = document.querySelector('input[name="correct-option"]:checked');
                    if (!correctOption) {
                        alert('Please select the correct option');
                        saveBtn.disabled = false;
                        saveBtn.innerHTML = isExisting ? 
                            '<i class="fas fa-edit me-2"></i> Update Question' : 
                            '<i class="fas fa-save me-2"></i> Save Question';
                        return;
                    }
                    
                    question.options = options;
                    question.correctOption = parseInt(correctOption.value);
                } else if (questionType === 'mcq-multiple') {
                    const options = [
                        document.getElementById('multi-option-a-text').value,
                        document.getElementById('multi-option-b-text').value,
                        document.getElementById('multi-option-c-text').value,
                        document.getElementById('multi-option-d-text').value
                    ];
                    
                    // Check if all options are filled
                    if (options.some(opt => !opt.trim())) {
                        alert('Please fill in all options');
                        saveBtn.disabled = false;
                        saveBtn.innerHTML = isExisting ? 
                            '<i class="fas fa-edit me-2"></i> Update Question' : 
                            '<i class="fas fa-save me-2"></i> Save Question';
                        return;
                    }
                    
                    // Get correct options
                    const correctOptions = [
                        document.getElementById('multi-option-a-correct').checked,
                        document.getElementById('multi-option-b-correct').checked,
                        document.getElementById('multi-option-c-correct').checked,
                        document.getElementById('multi-option-d-correct').checked
                    ];
                    
                    // Check if at least one option is selected
                    if (!correctOptions.some(opt => opt)) {
                        alert('Please select at least one correct option');
                        saveBtn.disabled = false;
                        saveBtn.innerHTML = isExisting ? 
                            '<i class="fas fa-edit me-2"></i> Update Question' : 
                            '<i class="fas fa-save me-2"></i> Save Question';
                        return;
                    }
                    
                    question.options = options;
                    question.correctOptions = correctOptions;
                } else if (questionType === 'numerical') {
                    const answer = document.getElementById('numerical-value').value;
                    
                    if (!answer.trim()) {
                        alert('Please enter the correct numerical answer');
                        saveBtn.disabled = false;
                        saveBtn.innerHTML = isExisting ? 
                            '<i class="fas fa-edit me-2"></i> Update Question' : 
                            '<i class="fas fa-save me-2"></i> Save Question';
                        return;
                    }
                    
                    question.answer = answer;
                }
                
                // Preserve existing image URLs if available
                if (isExisting) {
                    if (window.existingQuestions[questionNumber].imageUrl) {
                        question.imageUrl = window.existingQuestions[questionNumber].imageUrl;
                    }
                    if (window.existingQuestions[questionNumber].optionImages) {
                        question.optionImages = window.existingQuestions[questionNumber].optionImages;
                    }
                }
                
                // Save to Firebase
                try {
                    if (window.db) {
                        // Create the question ID
                        const questionId = `${examId}-${cleanSubject}-${cleanChapter}-${cleanType}-${questionNumber}`;
                        
                        // Update the question object with the ID and question number
                        question.id = questionId;
                        question.questionNo = questionNumber;
                        
                        // Save or update the question
                        window.db.collection('papers').doc(examId).collection('questions').doc(questionId).set(question, { merge: true })
                            .then(() => {
                                // Update the existingQuestions cache
                                if (!window.existingQuestions) window.existingQuestions = {};
                                window.existingQuestions[questionNumber] = question;
                                
                                // Show success message
                                alert(isExisting ? 'Question updated successfully!' : 'Question saved successfully!');
                                
                                // Re-enable save button
                                saveBtn.disabled = false;
                                saveBtn.innerHTML = '<i class="fas fa-edit me-2"></i> Update Question';
                                saveBtn.classList.remove('btn-primary');
                                saveBtn.classList.add('btn-warning');
                                
                                // Auto-advance if checked
                                if (document.getElementById('auto-advance') && document.getElementById('auto-advance').checked) {
                                    // Move to next question
                                    if (examId && examId.includes('jee-advanced') && typeof nextAdvancedQuestion === 'function') {
                                        nextAdvancedQuestion();
                                    } else if (typeof nextQuestion === 'function') {
                                        nextQuestion();
                                    }
                                }
                            })
                            .catch(error => {
                                console.error('Error saving question:', error);
                                alert('Error saving question: ' + error.message);
                                saveBtn.disabled = false;
                                saveBtn.innerHTML = isExisting ? 
                                    '<i class="fas fa-edit me-2"></i> Update Question' : 
                                    '<i class="fas fa-save me-2"></i> Save Question';
                            });
                    } else {
                        // Fallback for when Firebase is not available
                        console.log('Firebase not initialized. Would save question to exam:', examId, question);
                        setTimeout(() => {
                            alert('Question would be ' + (isExisting ? 'updated' : 'added') + ' to ' + examId + ' (Firebase not available)');
                            
                            // Re-enable save button
                            saveBtn.disabled = false;
                            saveBtn.innerHTML = isExisting ? 
                                '<i class="fas fa-edit me-2"></i> Update Question' : 
                                '<i class="fas fa-save me-2"></i> Save Question';
                        }, 1000);
                    }
                } catch (error) {
                    console.error('Error in save process:', error);
                    alert('Error in save process: ' + error.message);
                    saveBtn.disabled = false;
                    saveBtn.innerHTML = isExisting ? 
                        '<i class="fas fa-edit me-2"></i> Update Question' : 
                        '<i class="fas fa-save me-2"></i> Save Question';
                }
            };
            
            console.log('Question editor functionality added');
        }, 1500);
    });
})();