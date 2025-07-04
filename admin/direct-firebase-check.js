// Direct Firebase check for existing questions
document.addEventListener('DOMContentLoaded', function() {
    // Get exam ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const examId = urlParams.get('examId') || 'default-exam';
    
    // Initialize Firebase if not already initialized
    let db;
    try {
        if (!firebase.apps.length) {
            firebase.initializeApp({
                apiKey: "AIzaSyCtkee-Lv8lEMestaSVJxx7yvKB-lBygPQ",
                authDomain: "prepsharp-c91fd.firebaseapp.com",
                projectId: "prepsharp-c91fd",
                storageBucket: "prepsharp-c91fd.firebasestorage.app",
                messagingSenderId: "688294848433",
                appId: "1:688294848433:web:dd93fc6d61d62392473f90",
                measurementId: "G-LLJSLMXMNY"
            });
        }
        db = firebase.firestore();
        console.log("Firebase initialized for direct check");
    } catch (error) {
        console.error("Firebase initialization error:", error);
    }
    
    // Function to check if a question exists
    function checkQuestionExists(questionNumber) {
        if (!db) return;
        
        // Ensure questionNumber is a valid number
        questionNumber = parseInt(questionNumber) || 1;
        if (isNaN(questionNumber)) questionNumber = 1;
        
        // Show loading message
        showMessage('Checking if question exists...', 'info');
        
        // Query Firebase for this question by ID pattern
        // Get all questions and filter by ID pattern
        db.collection('papers').doc(examId).collection('questions')
            .get()
            .then(snapshot => {
                // Look for a question with matching ID pattern or question number
                const idPattern = `${examId}-question-${questionNumber}`;
                
                // Find questions that match the pattern or have matching questionNo
                const matchingQuestions = snapshot.docs.filter(doc => {
                    const id = doc.id;
                    const data = doc.data();
                    return id === idPattern || data.questionNo === questionNumber;
                });
                
                if (matchingQuestions.length > 0) {
                    // Question exists
                    const questionData = matchingQuestions[0].data();
                    const questionId = questionData.id || matchingQuestions[0].id;
                    
                    // Show success message
                    showMessage(`Question already added: ${questionId}`, 'success');
                    
                    // Update save button
                    const saveBtn = document.getElementById('save-question-btn');
                    if (saveBtn) {
                        saveBtn.innerHTML = '<i class="fas fa-edit me-2"></i> Update Question';
                        saveBtn.classList.remove('btn-primary');
                        saveBtn.classList.add('btn-success');
                    }
                    
                    // Populate form with question data
                    populateForm(questionData);
                } else {
                    // Try with questionNo field as fallback
                    const questionNoMatches = snapshot.docs.filter(doc => {
                        const data = doc.data();
                        return data.questionNo === questionNumber;
                    });
                    
                    if (questionNoMatches.length > 0) {
                        // Question exists with matching questionNo
                        const questionData = questionNoMatches[0].data();
                        const questionId = questionData.id || questionNoMatches[0].id;
                        
                        // Show success message
                        showMessage(`Question already added: ${questionId}`, 'success');
                        
                        // Update save button
                        const saveBtn = document.getElementById('save-question-btn');
                        if (saveBtn) {
                            saveBtn.innerHTML = '<i class="fas fa-edit me-2"></i> Update Question';
                            saveBtn.classList.remove('btn-primary');
                            saveBtn.classList.add('btn-success');
                        }
                        
                        // Populate form with question data
                        populateForm(questionData);
                    } else {
                        // Question doesn't exist
                        showMessage(`Question ${questionNumber} not found. You can add it now.`, 'warning');
                        
                        // Reset save button
                        const saveBtn = document.getElementById('save-question-btn');
                        if (saveBtn) {
                            saveBtn.innerHTML = '<i class="fas fa-save me-2"></i> Save Question';
                            saveBtn.classList.remove('btn-success');
                            saveBtn.classList.add('btn-primary');
                        }
                    }
                }
            })
            .catch(error => {
                console.error("Error checking question:", error);
                showMessage('Error checking question. Please try again.', 'danger');
            });
    }
    
    // Function to show message
    function showMessage(text, type) {
        // Remove existing message
        const existingMessage = document.getElementById('firebase-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create message element
        const messageDiv = document.createElement('div');
        messageDiv.id = 'firebase-message';
        messageDiv.className = `alert alert-${type}`;
        messageDiv.style.marginBottom = '15px';
        messageDiv.innerHTML = `<i class="fas fa-info-circle me-2"></i> ${text}`;
        
        // Insert at the top of the form
        const formElement = document.getElementById('question-form');
        if (formElement) {
            formElement.insertBefore(messageDiv, formElement.firstChild);
        }
    }
    
    // Function to populate form with question data
    function populateForm(data) {
        // Set basic fields
        if (data.subject) {
            document.getElementById('question-subject').value = data.subject;
            document.getElementById('subject-display').textContent = data.subject;
        }
        
        if (data.chapter) {
            document.getElementById('question-chapter').value = data.chapter;
        }
        
        if (data.difficulty) {
            document.getElementById('question-difficulty').value = data.difficulty;
        }
        
        if (data.text) {
            document.getElementById('question-text').value = data.text;
        }
        
        if (data.marks) {
            document.getElementById('question-marks').value = data.marks;
        }
        
        // Set question type and toggle fields
        if (data.type) {
            document.getElementById('question-type').value = data.type;
            if (typeof toggleQuestionFields === 'function') {
                toggleQuestionFields();
            }
        }
        
        // Handle MCQ options
        if (data.type === 'mcq-single' && data.options) {
            const optionLetters = ['a', 'b', 'c', 'd'];
            
            optionLetters.forEach((letter, index) => {
                if (data.options[index]) {
                    document.getElementById(`option-${letter}-text`).value = data.options[index];
                }
            });
            
            // Set correct option
            if (typeof data.correctOption === 'number') {
                const correctRadio = document.querySelector(`input[name="correct-option"][value="${data.correctOption}"]`);
                if (correctRadio) correctRadio.checked = true;
            }
        }
    }
    
    // Check when navigation buttons are clicked
    const prevBtn = document.getElementById('prev-question-btn');
    const nextBtn = document.getElementById('next-question-btn');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            // Wait for navigation to complete
            setTimeout(() => {
                // Get current question number from display
                const questionNumberEl = document.getElementById('question-number');
                if (questionNumberEl && questionNumberEl.textContent) {
                    const match = questionNumberEl.textContent.match(/Question (\d+)/);
                    if (match && match[1]) {
                        checkQuestionExists(parseInt(match[1]));
                        return;
                    }
                }
                
                // Fallback
                checkQuestionExists(window.currentQuestionIndex + 1);
            }, 500);
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            // Wait for navigation to complete
            setTimeout(() => {
                // Get current question number from display
                const questionNumberEl = document.getElementById('question-number');
                if (questionNumberEl && questionNumberEl.textContent) {
                    const match = questionNumberEl.textContent.match(/Question (\d+)/);
                    if (match && match[1]) {
                        checkQuestionExists(parseInt(match[1]));
                        return;
                    }
                }
                
                // Fallback
                checkQuestionExists(window.currentQuestionIndex + 1);
            }, 500);
        });
    }
    
    // Check section navigation buttons
    const sectionBtns = document.querySelectorAll('.section-btn');
    sectionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Wait for navigation to complete
            setTimeout(() => {
                // Get current question number from display
                const questionNumberEl = document.getElementById('question-number');
                if (questionNumberEl && questionNumberEl.textContent) {
                    const match = questionNumberEl.textContent.match(/Question (\d+)/);
                    if (match && match[1]) {
                        checkQuestionExists(parseInt(match[1]));
                        return;
                    }
                }
                
                // Fallback
                checkQuestionExists(window.currentQuestionIndex + 1);
            }, 500);
        });
    });
    
    // Add a direct check button
    const cardHeader = document.querySelector('.card-header');
    if (cardHeader) {
        const checkBtn = document.createElement('button');
        checkBtn.className = 'btn btn-info btn-sm ms-2';
        checkBtn.innerHTML = '<i class="fas fa-search"></i> Check Firebase';
        checkBtn.onclick = function() {
            // Get current question number from display
            const questionNumberEl = document.getElementById('question-number');
            if (questionNumberEl && questionNumberEl.textContent) {
                const match = questionNumberEl.textContent.match(/Question (\d+)/);
                if (match && match[1]) {
                    checkQuestionExists(parseInt(match[1]));
                    return;
                }
            }
            
            // Fallback
            checkQuestionExists(window.currentQuestionIndex + 1);
        };
        
        // Add to header
        const headerBtns = cardHeader.querySelector('div');
        if (headerBtns) {
            headerBtns.appendChild(checkBtn);
        } else {
            cardHeader.appendChild(checkBtn);
        }
    }
    
    // Initial check
    setTimeout(() => {
        // Get current question index from window or DOM
        let currentIndex = 0;
        if (typeof window.currentQuestionIndex !== 'undefined') {
            currentIndex = window.currentQuestionIndex;
        } else {
            // Try to get from question number display
            const questionNumberEl = document.getElementById('question-number');
            if (questionNumberEl && questionNumberEl.textContent) {
                const match = questionNumberEl.textContent.match(/Question (\d+)/);
                if (match && match[1]) {
                    currentIndex = parseInt(match[1]) - 1;
                }
            }
        }
        
        // Check with proper question number
        checkQuestionExists(currentIndex + 1);
    }, 1000);
});