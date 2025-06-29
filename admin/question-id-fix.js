// Function to fix question IDs to follow the correct format
(function() {
    // Wait for the page to load
    window.addEventListener('load', function() {
        // Wait for the save function to be available
        setTimeout(function() {
            // Store the original saveQuestion function
            const originalSaveQuestion = window.saveQuestion;
            
            // Replace with our enhanced version
            window.saveQuestion = function(examId) {
                // Get the current question number (1-based)
                const questionNumber = window.currentQuestionIndex + 1;
                
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
                saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i> Saving...';
                
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
                    createdAt: new Date().getTime(),
                    sectionName: sectionInfo ? sectionInfo.section : null
                };
                
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
                        saveBtn.innerHTML = '<i class="fas fa-save me-2"></i> Save Question';
                        return;
                    }
                    
                    // Get correct option
                    const correctOption = document.querySelector('input[name="correct-option"]:checked');
                    if (!correctOption) {
                        alert('Please select the correct option');
                        saveBtn.disabled = false;
                        saveBtn.innerHTML = '<i class="fas fa-save me-2"></i> Save Question';
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
                        saveBtn.innerHTML = '<i class="fas fa-save me-2"></i> Save Question';
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
                        saveBtn.innerHTML = '<i class="fas fa-save me-2"></i> Save Question';
                        return;
                    }
                    
                    question.options = options;
                    question.correctOptions = correctOptions;
                } else if (questionType === 'numerical') {
                    const answer = document.getElementById('numerical-value').value;
                    
                    if (!answer.trim()) {
                        alert('Please enter the correct numerical answer');
                        saveBtn.disabled = false;
                        saveBtn.innerHTML = '<i class="fas fa-save me-2"></i> Save Question';
                        return;
                    }
                    
                    question.answer = answer;
                } else if (questionType === 'match-list') {
                    // Handle match list questions if needed
                    alert('Match list questions are not fully implemented yet');
                    saveBtn.disabled = false;
                    saveBtn.innerHTML = '<i class="fas fa-save me-2"></i> Save Question';
                    return;
                }
                
                // Save to Firebase
                try {
                    if (window.db) {
                        // Get question count directly
                        window.db.collection('papers').doc(examId).collection('questions').get()
                            .then(snapshot => {
                                // Use the current question number from the section
                                const questionNo = questionNumber;
                                
                                // Create the final question ID with the format:
                                // paperId-subject-chapter-type-questionNo
                                const finalQuestionId = `${examId}-${cleanSubject}-${cleanChapter}-${cleanType}-${questionNo}`;
                                
                                // Update the question object with the final ID
                                question.id = finalQuestionId;
                                question.questionNo = questionNo;
                                
                                console.log('Saving question with ID:', finalQuestionId);
                                
                                // Save the question to the paper's questions subcollection
                                return window.db.collection('papers').doc(examId).collection('questions').doc(finalQuestionId).set(question);
                            })
                            .then(() => {
                                // Show success message with question ID
                                alert('Question added successfully!\n\nQuestion ID: ' + question.id);
                                
                                // Get image previews
                                const questionImagePreview = document.getElementById('question-image-preview');
                                const optionImagePreviews = [
                                    document.getElementById('option-a-image-preview'),
                                    document.getElementById('option-b-image-preview'),
                                    document.getElementById('option-c-image-preview'),
                                    document.getElementById('option-d-image-preview')
                                ];
                                
                                // Reset form but keep subject and chapter
                                const currentSubject = document.getElementById('question-subject').value;
                                const currentChapter = document.getElementById('question-chapter').value;
                                document.getElementById('question-form').reset();
                                document.getElementById('question-subject').value = currentSubject;
                                document.getElementById('question-chapter').value = currentChapter;
                                
                                // Hide image previews
                                if (questionImagePreview) questionImagePreview.style.display = 'none';
                                optionImagePreviews.forEach(preview => {
                                    if (preview) preview.style.display = 'none';
                                });
                                
                                // Show question text area again
                                const questionTextLabel = document.querySelector('label[for="question-text"]');
                                const questionText = document.getElementById('question-text');
                                if (questionTextLabel) questionTextLabel.style.display = '';
                                if (questionText) questionText.style.display = '';
                                
                                // Show file inputs again
                                const questionImage = document.getElementById('question-image');
                                if (questionImage) questionImage.style.display = '';
                                
                                // Re-enable save button
                                saveBtn.disabled = false;
                                saveBtn.innerHTML = '<i class="fas fa-save me-2"></i> Save Question';
                                
                                // Update fields for the next question
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
                                saveBtn.innerHTML = '<i class="fas fa-save me-2"></i> Save Question';
                            });
                    } else {
                        // Fallback for when Firebase is not available
                        console.log('Firebase not initialized. Would save question to exam:', examId, question);
                        setTimeout(() => {
                            alert('Question would be added to ' + examId + ' (Firebase not available)');
                            document.getElementById('question-form').reset();
                            
                            // Re-enable save button
                            saveBtn.disabled = false;
                            saveBtn.innerHTML = '<i class="fas fa-save me-2"></i> Save Question';
                        }, 1000);
                    }
                } catch (error) {
                    console.error('Error in save process:', error);
                    alert('Error in save process: ' + error.message);
                    saveBtn.disabled = false;
                    saveBtn.innerHTML = '<i class="fas fa-save me-2"></i> Save Question';
                }
            };
            
            console.log('Question ID format fixed');
        }, 1000);
    });
})();