// Exam state
let currentQuestionIndex = 0;
let userAnswers = {};
let markedQuestions = {};
let examDuration = 3 * 60 * 60; // 3 hours in seconds
let timeRemaining = examDuration;
let timerInterval;

// DOM elements
const examTitle = document.getElementById('examTitle');
const examType = document.getElementById('examType');
const timerElement = document.getElementById('timer');
const questionNumber = document.getElementById('questionNumber');
const questionText = document.getElementById('questionText');
const questionImage = document.getElementById('questionImage');
const optionsList = document.getElementById('optionsList');
const questionPalette = document.getElementById('questionPalette');
const prevButton = document.getElementById('prevQuestion');
const nextButton = document.getElementById('nextQuestion');
const markButton = document.getElementById('markQuestion');
const clearButton = document.getElementById('clearResponse');
const submitButton = document.getElementById('submitExam');
const userName = document.getElementById('userName');
const userInitials = document.getElementById('userInitials');

// Modal elements
const submitModal = document.getElementById('submitModal');
const closeSubmitModal = document.getElementById('closeSubmitModal');
const cancelSubmit = document.getElementById('cancelSubmit');
const confirmSubmit = document.getElementById('confirmSubmit');

// Load user info
async function loadUserInfo() {
    const loggedInUser = localStorage.getItem('loggedInUser') || sessionStorage.getItem('loggedInUser');
    if (loggedInUser) {
        try {
            const userData = JSON.parse(loggedInUser);
            const userId = userData.email || userData.uid || 'default-user';
            const name = userData.name || userData.email || 'User';
            
            // Set initial values
            userName.textContent = name;
            const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
            userInitials.textContent = initials;
            
            // Try to get user data from Firebase
            if (window.db) {
                try {
                    const userDoc = await window.db.collection('users').doc(userId).get();
                    if (userDoc.exists) {
                        const firebaseUserData = userDoc.data();
                        if (firebaseUserData.name) {
                            userName.textContent = firebaseUserData.name;
                            const fbInitials = firebaseUserData.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
                            userInitials.textContent = fbInitials;
                        }
                    }
                } catch (error) {
                    console.log('Error getting user data from Firebase:', error);
                }
            }
        } catch (e) {
            console.error('Error parsing user data:', e);
        }
    }
}

// Start timer
function startTimer() {
    timerInterval = setInterval(() => {
        timeRemaining--;
        
        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            submitExam();
            return;
        }
        
        updateTimerDisplay();
        
        // Warning when 15 minutes remaining
        if (timeRemaining === 15 * 60) {
            alert('15 minutes remaining!');
        }
    }, 1000);
    
    updateTimerDisplay();
}

// Update timer display
function updateTimerDisplay() {
    const hours = Math.floor(timeRemaining / 3600);
    const minutes = Math.floor((timeRemaining % 3600) / 60);
    const seconds = timeRemaining % 60;
    
    timerElement.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Select option
function selectOption(questionIndex, option) {
    userAnswers[questionIndex] = option;
    updateQuestionPalette();
}

// Clear response
function clearResponse() {
    delete userAnswers[currentQuestionIndex];
    
    // Uncheck all radio buttons
    const radioButtons = document.querySelectorAll(`input[name="q${currentQuestionIndex}"]`);
    radioButtons.forEach(radio => {
        radio.checked = false;
    });
    
    updateQuestionPalette();
}

// Mark/unmark question
function toggleMarkQuestion() {
    markedQuestions[currentQuestionIndex] = !markedQuestions[currentQuestionIndex];
    updateQuestionPalette();
    
    // Go to next question if available
    if (currentQuestionIndex < getQuestionCount() - 1) {
        showQuestion(currentQuestionIndex + 1);
    }
}

// Show question
function showQuestion(index) {
    if (index < 0 || index >= getQuestionCount()) return;
    
    // Update current question index
    currentQuestionIndex = index;
    
    // Update question number
    questionNumber.textContent = `Question No. ${index + 1}`;
    
    // Update question palette
    updateQuestionPalette();
    
    // Update mark button text
    markButton.textContent = markedQuestions[index] ? 'Unmark & Next' : 'Mark for Review & Next';
    
    // Update section tabs if needed
    updateActiveSectionTab(index);
}

// Update question palette
function updateQuestionPalette() {
    const questionBtns = questionPalette.querySelectorAll('.question-btn');
    
    questionBtns.forEach((btn, i) => {
        // Remove active class from all buttons
        btn.classList.remove('active');
        
        // Add active class to current question
        if (i === currentQuestionIndex) {
            btn.classList.add('active');
        }
    });
}

// Update active section tab based on question index
function updateActiveSectionTab(index) {
    const tabs = document.querySelectorAll('.section-tab');
    if (tabs.length <= 1) return;
    
    let sectionIndex;
    if (isAdvancedExam()) {
        // 6 sections with 9 questions each
        sectionIndex = Math.floor(index / 9);
    } else {
        // For JEE Mains with TCS iON pattern: 
        // Section 1s have 20 questions each, Section 2s have 5 questions each
        // Physics Section 1: 0-19 (20 questions)
        // Physics Section 2: 20-24 (5 questions)
        // Chemistry Section 1: 25-44 (20 questions)
        // Chemistry Section 2: 45-49 (5 questions)
        // Mathematics Section 1: 50-69 (20 questions)
        // Mathematics Section 2: 70-74 (5 questions)
        if (index < 20) {
            sectionIndex = 0; // Physics Section 1
        } else if (index < 25) {
            sectionIndex = 1; // Physics Section 2
        } else if (index < 45) {
            sectionIndex = 2; // Chemistry Section 1
        } else if (index < 50) {
            sectionIndex = 3; // Chemistry Section 2
        } else if (index < 70) {
            sectionIndex = 4; // Mathematics Section 1
        } else {
            sectionIndex = 5; // Mathematics Section 2
        }
    }
    
    // Update active tab
    tabs.forEach((tab, i) => {
        tab.classList.toggle('active', i === sectionIndex);
    });
    
    // Update current section display
    const currentSection = document.getElementById('currentSection');
    if (currentSection && tabs[sectionIndex]) {
        currentSection.textContent = tabs[sectionIndex].textContent;
    }
}

// Check if this is an advanced exam
function isAdvancedExam() {
    return window.location.pathname.includes('advanced');
}

// Get total question count
function getQuestionCount() {
    if (isAdvancedExam()) {
        return 54; // JEE Advanced has 54 questions
    } else {
        return 75; // JEE Main has 75 questions (3 subjects, each with 20+5 questions)
    }
}

// Show submit confirmation
function showSubmitConfirmation() {
    const answeredCount = Object.keys(userAnswers).length;
    const totalQuestions = getQuestionCount();
    
    document.getElementById('summaryText').textContent = `You have answered ${answeredCount} out of ${totalQuestions} questions.`;
    submitModal.classList.add('active');
}

// Submit exam
function submitExam() {
    clearInterval(timerInterval);
    
    // Calculate score (in a real exam, this would be done on the server)
    let score = Math.floor(Math.random() * getQuestionCount() * 0.8); // Random score for demo
    
    // In a real implementation, we would save the result to the server
    alert(`Exam submitted! Your score: ${score}/${getQuestionCount()}`);
    
    // Redirect to results page
    window.location.href = `../dashboards/free/practice-papers.html`;
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Load user info
    loadUserInfo();
    
    // Start timer
    startTimer();
    
    // Set up section tabs
    const sectionTabs = document.querySelectorAll('.section-tab');
    sectionTabs.forEach((tab, index) => {
        tab.addEventListener('click', () => {
            // Update active tab
            sectionTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Update current section display
            const currentSection = document.getElementById('currentSection');
            currentSection.textContent = tab.textContent;
            
            // Show first question of this section
            let sectionStart;
            if (isAdvancedExam()) {
                sectionStart = index * 9;
            } else {
                // For JEE Mains with TCS iON pattern
                switch(index) {
                    case 0: sectionStart = 0; break;  // Physics Section 1
                    case 1: sectionStart = 20; break; // Physics Section 2
                    case 2: sectionStart = 25; break; // Chemistry Section 1
                    case 3: sectionStart = 45; break; // Chemistry Section 2
                    case 4: sectionStart = 50; break; // Mathematics Section 1
                    case 5: sectionStart = 70; break; // Mathematics Section 2
                    default: sectionStart = 0;
                }
            }
            showQuestion(sectionStart);
        });
    });
    
    // Set up question buttons
    const questionBtns = document.querySelectorAll('.question-btn');
    questionBtns.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            showQuestion(index);
        });
    });
    
    // Set up radio buttons
    const radioButtons = document.querySelectorAll('.option-radio');
    radioButtons.forEach(radio => {
        radio.addEventListener('change', () => {
            if (radio.checked) {
                const questionId = radio.name.substring(1); // Remove 'q' prefix
                const option = radio.id.split('-')[1]; // Get option letter
                selectOption(parseInt(questionId), option);
            }
        });
    });
    
    // Navigation buttons
    prevButton.addEventListener('click', () => {
        if (currentQuestionIndex > 0) {
            showQuestion(currentQuestionIndex - 1);
        }
    });
    
    nextButton.addEventListener('click', () => {
        if (currentQuestionIndex < getQuestionCount() - 1) {
            showQuestion(currentQuestionIndex + 1);
        }
    });
    
    // Mark button
    markButton.addEventListener('click', toggleMarkQuestion);
    
    // Clear button
    clearButton.addEventListener('click', clearResponse);
    
    // Submit button
    submitButton.addEventListener('click', showSubmitConfirmation);
    
    // View instructions button
    document.getElementById('viewInstructions').addEventListener('click', () => {
        const examTypeText = isAdvancedExam() ? 'JEE Advanced' : 'JEE Main';
        alert(`${examTypeText} Exam Instructions:\n\n1. The exam consists of multiple-choice questions.\n2. Each question has only one correct answer.\n3. There is no negative marking.\n4. You can mark questions for review and return to them later.\n5. Click "Submit" when you are done with the exam.`);
    });
    
    // Question Paper button (if exists)
    const viewPaperBtn = document.getElementById('viewPaper');
    if (viewPaperBtn) {
        viewPaperBtn.addEventListener('click', () => {
            alert('Question Paper View:\n\nThis would show a full view of all questions in the exam paper.');
        });
    }
    
    // Modal close buttons
    closeSubmitModal.addEventListener('click', () => {
        submitModal.classList.remove('active');
    });
    
    cancelSubmit.addEventListener('click', () => {
        submitModal.classList.remove('active');
    });
    
    confirmSubmit.addEventListener('click', submitExam);
    
    // Close modal when clicking outside
    submitModal.addEventListener('click', (e) => {
        if (e.target === submitModal) {
            submitModal.classList.remove('active');
        }
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Prevent keyboard shortcuts during input focus
        if (document.activeElement.tagName === 'INPUT') return;
        
        if (e.key === 'ArrowLeft' || e.key === 'p' || e.key === 'P') {
            // Previous question
            if (currentQuestionIndex > 0) {
                showQuestion(currentQuestionIndex - 1);
            }
        } else if (e.key === 'ArrowRight' || e.key === 'n' || e.key === 'N') {
            // Next question
            if (currentQuestionIndex < getQuestionCount() - 1) {
                showQuestion(currentQuestionIndex + 1);
            }
        } else if (e.key === 'm' || e.key === 'M') {
            // Mark for review
            toggleMarkQuestion();
        } else if (e.key === 'c' || e.key === 'C') {
            // Clear response
            clearResponse();
        } else if (e.key >= '1' && e.key <= '4') {
            // Select option (1-4 for A-D)
            const optionIndex = parseInt(e.key) - 1;
            const optionLabels = ['a', 'b', 'c', 'd'];
            if (optionIndex >= 0 && optionIndex < 4) {
                selectOption(currentQuestionIndex, optionLabels[optionIndex]);
                const radioInput = document.getElementById(`q${currentQuestionIndex}-${optionLabels[optionIndex]}`);
                if (radioInput) radioInput.checked = true;
            }
        }
    });
});