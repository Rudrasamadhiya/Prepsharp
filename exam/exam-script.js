// Exam state
let currentQuestionIndex = 0;
let userAnswers = {};
let markedQuestions = {};
let visitedQuestions = {};
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
            const candidateId = userData.candidateId || document.getElementById('userId').textContent || 'JEE2024001234';
            
            // Set initial values
            userName.textContent = name;
            const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
            userInitials.textContent = initials;
            
            // Update watermark with candidate ID
            const watermarkText = document.getElementById('watermarkText');
            if (watermarkText) {
                watermarkText.textContent = candidateId;
            }
            
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
                        
                        // If user has a photo, use it
                        if (firebaseUserData.photo) {
                            userInitials.style.backgroundImage = `url(${firebaseUserData.photo})`;
                            userInitials.style.backgroundSize = 'cover';
                            userInitials.style.backgroundPosition = 'center';
                            userInitials.textContent = '';
                        }
                        
                        // If user has a candidate ID, update watermark
                        if (firebaseUserData.candidateId && watermarkText) {
                            watermarkText.textContent = firebaseUserData.candidateId;
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

// Start timer - legacy function kept for compatibility
// The actual timer functionality is now handled by the ExamTimer class
function startTimer() {
    // This function is kept for backward compatibility
    // The actual timer is initialized in timer-integration.js
    console.log('Legacy timer function called - using ExamTimer instead');
    
    // If ExamTimer is not available, fall back to the old timer
    if (!window.ExamTimer) {
        console.warn('ExamTimer not found, using legacy timer');
        legacyStartTimer();
    }
}

// Legacy timer function (kept as fallback)
function legacyStartTimer() {
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

// Update timer display - legacy function kept for compatibility
function updateTimerDisplay() {
    // This function is kept for backward compatibility
    // The actual timer display is handled by the ExamTimer class
    if (!window.examTimer) {
        const hours = Math.floor(timeRemaining / 3600);
        const minutes = Math.floor((timeRemaining % 3600) / 60);
        const seconds = timeRemaining % 60;
        
        timerElement.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
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

// Get current section index
function getCurrentSectionIndex() {
    const currentSection = document.getElementById('currentSection');
    if (!currentSection) return 0;
    
    const sectionText = currentSection.textContent.trim();
    const sectionTabs = document.querySelectorAll('.section-tab');
    
    for (let i = 0; i < sectionTabs.length; i++) {
        if (sectionTabs[i].textContent.trim() === sectionText) {
            return i;
        }
    }
    
    return 0;
}

// Get questions for current section
function getQuestionsForCurrentSection() {
    const sectionIndex = getCurrentSectionIndex();
    
    // If no questions loaded yet, return empty array
    if (questions.length === 0) return [];
    
    // Generic section pattern
    let startIndex, endIndex;
    
    switch(sectionIndex) {
        case 0: startIndex = 0; endIndex = 19; break;  // Physics Section 1
        case 1: startIndex = 20; endIndex = 24; break; // Physics Section 2
        case 2: startIndex = 25; endIndex = 44; break; // Chemistry Section 1
        case 3: startIndex = 45; endIndex = 49; break; // Chemistry Section 2
        case 4: startIndex = 50; endIndex = 69; break; // Mathematics Section 1
        case 5: startIndex = 70; endIndex = 74; break; // Mathematics Section 2
        default: startIndex = 0; endIndex = questions.length - 1;
    }
    
    // Make sure we don't exceed array bounds
    startIndex = Math.min(startIndex, questions.length - 1);
    endIndex = Math.min(endIndex, questions.length - 1);
    
    // Return section questions and their global indices
    const sectionQuestions = [];
    for (let i = startIndex; i <= endIndex; i++) {
        sectionQuestions.push({
            question: questions[i],
            globalIndex: i
        });
    }
    
    return sectionQuestions;
}

// Update question palette to show only current section questions
function updateQuestionPalette() {
    // Clear existing buttons
    if (questionPalette) {
        questionPalette.innerHTML = '';
        
        // If no questions loaded yet, show loading state
        if (questions.length === 0) {
            const loadingText = document.createElement('div');
            loadingText.className = 'palette-loading';
            loadingText.textContent = 'Loading questions...';
            questionPalette.appendChild(loadingText);
            return;
        }
        
        // Get questions for current section
        const sectionQuestions = getQuestionsForCurrentSection();
        
        if (sectionQuestions.length === 0) {
            const noQuestionsText = document.createElement('div');
            noQuestionsText.className = 'palette-loading';
            noQuestionsText.textContent = 'No questions in this section';
            questionPalette.appendChild(noQuestionsText);
            return;
        }
        
        // Create buttons for each question in the section
        sectionQuestions.forEach((item, sectionIndex) => {
            const globalIndex = item.globalIndex;
            
            const btn = document.createElement('div');
            btn.className = 'question-btn not-visited';
            if (globalIndex === currentQuestionIndex) {
                btn.classList.add('active');
            }
            
            // Add answered/marked/not-answered classes if applicable
            if (userAnswers[globalIndex]) {
                btn.classList.remove('not-visited');
                btn.classList.add(markedQuestions[globalIndex] ? 'answered-marked' : 'answered');
            } else if (markedQuestions[globalIndex]) {
                btn.classList.remove('not-visited');
                btn.classList.add('marked');
            } else if (visitedQuestions && visitedQuestions[globalIndex]) {
                // Mark as not-answered only if this specific question has been visited
                btn.classList.remove('not-visited');
                btn.classList.add('not-answered');
            }
            
            // Display section-specific number (starting from 1)
            btn.textContent = sectionIndex + 1;
            
            // Store global index as data attribute
            btn.dataset.globalIndex = globalIndex;
            
            btn.addEventListener('click', () => showQuestion(globalIndex));
            questionPalette.appendChild(btn);
        });
    }
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
        // Generic section pattern: 
        // Section 1: 0-19 (20 questions)
        // Section 2: 20-24 (5 questions)
        // Section 3: 25-44 (20 questions)
        // Section 4: 45-49 (5 questions)
        // Section 5: 50-69 (20 questions)
        // Section 6: 70-74 (5 questions)
        if (index < 20) {
            sectionIndex = 0; // Section 1
        } else if (index < 25) {
            sectionIndex = 1; // Section 2
        } else if (index < 45) {
            sectionIndex = 2; // Section 3
        } else if (index < 50) {
            sectionIndex = 3; // Section 4
        } else if (index < 70) {
            sectionIndex = 4; // Section 5
        } else {
            sectionIndex = 5; // Section 6
        }
    }
    
    // Make sure sectionIndex is valid
    sectionIndex = Math.min(sectionIndex, tabs.length - 1);
    
    // Update active tab
    tabs.forEach((tab, i) => {
        tab.classList.toggle('active', i === sectionIndex);
    });
    
    // Update current section display
    const currentSection = document.getElementById('currentSection');
    if (currentSection && tabs[sectionIndex]) {
        currentSection.textContent = tabs[sectionIndex].textContent;
    }
    
    // Update question palette to show only questions from this section
    updateQuestionPalette();
}

// Check if this is an advanced exam
function isAdvancedExam() {
    return window.location.pathname.includes('advanced');
}

// Get total question count
function getQuestionCount() {
    // If we have loaded questions from Firebase, use that count
    if (questions && questions.length > 0) {
        return questions.length;
    }
    
    // Otherwise use default counts
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
    
    // The actual submission to server is handled by the timer-integration.js
    // This function is now just responsible for UI feedback and redirection
    
    // Show submission message
    alert(`Exam submitted! Your score: ${score}/${getQuestionCount()}`);
    
    // Redirect to results page
    window.location.href = `../dashboards/free/practice-papers.html`;
}

// Global variables for questions
let questions = [];

// Load exam details and questions from Firebase
function loadExamDetails() {
    // Get the exam ID from URL parameters or use a default
    const urlParams = new URLSearchParams(window.location.search);
    const paperId = urlParams.get('paperId') || urlParams.get('id') || urlParams.get('examId') || 'jee-main---27-jan-shift-1-2024';
    
    // DOM elements
    const examTitle = document.getElementById('examTitle');
    const examType = document.getElementById('examType');
    const paperYear = document.getElementById('paperYear');
    const paperName = document.getElementById('paperName');
    
    // Fetch paper data
    if (window.db) {
        // Get the paper document
        window.db.collection('papers').doc(paperId).get()
            .then(paperDoc => {
                if (paperDoc.exists) {
                    const paperData = paperDoc.data();
                    
                    // Update exam type and title
                    if (examType) examType.textContent = paperData.type || 'JEE Main';
                    
                    // examTitle element has been removed from the HTML
                    
                    // Update year and paper name
                    if (paperYear) paperYear.textContent = paperData.year || '';
                    if (paperName) {
                        const paperNameText = `${paperData.day || ''} ${paperData.month || ''} ${paperData.shift || ''}`;
                        paperName.textContent = paperNameText.trim();
                    }
                    
                    // Update document title
                    document.title = paperData.name + ' - PrepSharp';
                    
                    // Now load questions
                    return loadQuestions(paperId);
                }
            })
            .catch(error => {
                console.error('Error loading paper details:', error);
            });
    }
}

// Load questions from Firebase
function loadQuestions(paperId) {
    console.log('Loading questions for paper:', paperId);
    
    // Initialize empty questions array
    questions = [];
    
    // Show loading state
    showLoadingState();
    
    // Load from Firebase
    window.db.collection('papers').doc(paperId).collection('questions').get()
        .then(snapshot => {
            if (!snapshot.empty) {
                // Process questions
                snapshot.forEach(doc => {
                    const questionData = doc.data();
                    questionData.id = doc.id;
                    questions.push(questionData);
                });
                
                // Sort questions by number or ID if available
                questions.sort((a, b) => {
                    const numA = a.number || parseInt(a.id) || 0;
                    const numB = b.number || parseInt(b.id) || 0;
                    return numA - numB;
                });
                
                console.log('Loaded', questions.length, 'questions from Firebase');
                
                // Display first question
                if (questions.length > 0) {
                    showQuestion(0);
                } else {
                    showNoQuestionsMessage();
                }
            } else {
                showNoQuestionsMessage();
            }
        })
        .catch(error => {
            console.error('Error loading questions:', error);
            showErrorMessage('Failed to load questions. Please try again.');
        });
}

// Show loading state
function showLoadingState() {
    // Update question number
    if (questionNumber) {
        questionNumber.textContent = 'Loading...';
    }
    
    // Update question text
    if (questionText) {
        questionText.innerHTML = '<div class="loading-spinner"></div><p>Loading questions...</p>';
        questionText.style.display = 'block';
    }
    
    // Hide question image
    if (questionImage) {
        questionImage.innerHTML = '';
        questionImage.style.display = 'none';
    }
    
    // Clear options
    if (optionsList) {
        optionsList.innerHTML = '';
    }
}

// Show no questions message
function showNoQuestionsMessage() {
    // Update question number
    if (questionNumber) {
        questionNumber.textContent = 'No Questions';
    }
    
    // Update question text
    if (questionText) {
        questionText.innerHTML = '<p>No questions are available for this exam.</p>';
        questionText.style.display = 'block';
    }
    
    // Hide question image
    if (questionImage) {
        questionImage.innerHTML = '';
        questionImage.style.display = 'none';
    }
    
    // Clear options
    if (optionsList) {
        optionsList.innerHTML = '';
    }
}

// Show error message
function showErrorMessage(message) {
    // Update question number
    if (questionNumber) {
        questionNumber.textContent = 'Error';
    }
    
    // Update question text
    if (questionText) {
        questionText.innerHTML = `<p class="error-message">${message}</p>`;
        questionText.style.display = 'block';
    }
    
    // Hide question image
    if (questionImage) {
        questionImage.innerHTML = '';
        questionImage.style.display = 'none';
    }
    
    // Clear options
    if (optionsList) {
        optionsList.innerHTML = '';
    }
}

// Override the showQuestion function to display Firebase questions
function showQuestion(index) {
    // Check if questions array is empty
    if (questions.length === 0) {
        showNoQuestionsMessage();
        return;
    }
    
    // Check if index is valid
    if (index < 0 || index >= questions.length) return;
    
    // Update current question index
    currentQuestionIndex = index;
    const question = questions[index];
    
    // Mark this specific question as visited
    visitedQuestions[index] = true;
    
    // Update the button status if it exists
    const questionBtn = document.querySelector(`.question-btn[data-global-index="${index}"]`);
    if (questionBtn && questionBtn.classList.contains('not-visited') && !userAnswers[index] && !markedQuestions[index]) {
        questionBtn.classList.remove('not-visited');
        questionBtn.classList.add('not-answered');
    }
    
    // Calculate section-specific question number
    const sectionIndex = getCurrentSectionIndex();
    let sectionStart;
    
    if (isAdvancedExam()) {
        sectionStart = sectionIndex * 9;
    } else {
        // Generic section pattern
        switch(sectionIndex) {
            case 0: sectionStart = 0; break;  // Section 1
            case 1: sectionStart = 20; break; // Section 2
            case 2: sectionStart = 25; break; // Section 3
            case 3: sectionStart = 45; break; // Section 4
            case 4: sectionStart = 50; break; // Section 5
            case 5: sectionStart = 70; break; // Section 6
            default: sectionStart = 0;
        }
    }
    
    // Calculate section-specific question number (starting from 1)
    const sectionQuestionNumber = index - sectionStart + 1;
    
    // Update question number display
    questionNumber.textContent = `Question No. ${sectionQuestionNumber}`;
    
    // Show question text and image if available
    if (question.text) {
        questionText.innerHTML = question.text;
        questionText.style.display = 'block';
    } else {
        questionText.innerHTML = `Question ${index + 1}`;
        questionText.style.display = 'block';
    }
    
    // Show question image if available
    if (question.imageUrl || question.questionImage) {
        const imgUrl = question.imageUrl || question.questionImage;
        questionImage.innerHTML = `<img src="${imgUrl}" alt="Question ${index + 1}" class="img-fluid">`;
        questionImage.style.display = 'block';
    } else {
        questionImage.innerHTML = '';
        questionImage.style.display = 'none';
    }
    
    // Update options
    optionsList.innerHTML = '';
    
    if (question.options && Array.isArray(question.options)) {
        const optionLabels = ['a', 'b', 'c', 'd'];
        question.options.forEach((option, i) => {
            if (i < optionLabels.length) {
                const optionItem = document.createElement('div');
                optionItem.className = 'option';
                
                const isSelected = userAnswers[index] === optionLabels[i];
                
                // Handle different option formats
                let optionText = '';
                let optionImageUrl = null;
                
                if (typeof option === 'string') {
                    // Check if it's a base64 image string
                    if (option.startsWith('data:image')) {
                        optionImageUrl = option;
                    } else {
                        optionText = option;
                    }
                } else if (typeof option === 'object') {
                    // Option could be {text: "...", imageUrl: "..."} or {text: "...", image: "..."}
                    optionText = option.text || '';
                    
                    // Check all possible image properties
                    optionImageUrl = option.imageUrl || option.image || option.base64 || null;
                }
                
                // If no image URL but we have optionImages in the question
                if (!optionImageUrl && question.optionImages && question.optionImages[i]) {
                    optionImageUrl = question.optionImages[i];
                }
                
                let optionHtml;
                
                // Get paper ID for image paths
                const paperId = new URLSearchParams(window.location.search).get('paperId') || 
                              new URLSearchParams(window.location.search).get('id') || 
                              new URLSearchParams(window.location.search).get('examId') || 
                              'jee-main---27-jan-shift-1-2024';
                
                // Create the option HTML
                optionHtml = `
                    <div class="option-wrapper ${isSelected ? 'selected' : ''}">
                        <input type="radio" name="q${index}" id="q${index}-${optionLabels[i]}" class="option-radio" ${isSelected ? 'checked' : ''}>
                        <label for="q${index}-${optionLabels[i]}" class="option-label">
                            <div class="option-text">${optionText}</div>
                        </label>
                    </div>
                `;
                
                // Add image if available
                if (optionImageUrl) {
                    optionHtml = `
                    <div class="option-image-wrapper ${isSelected ? 'selected' : ''}">
                        <input type="radio" name="q${index}" id="q${index}-${optionLabels[i]}" class="option-radio" ${isSelected ? 'checked' : ''}>
                        <div class="option-image-container">
                            <img src="${optionImageUrl}" alt="Option image" class="option-img" 
                                 onerror="this.onerror=null; this.src='/papers/${paperId}/questions/question-${index+1}/option-${optionLabels[i]}.png';">
                        </div>
                    </div>`;
                }
                
                optionItem.innerHTML = optionHtml;
                
                optionsList.appendChild(optionItem);
            }
        });
    }
    
    // Update question palette
    updateQuestionPalette();
    
    // Update mark button text if available
    if (markButton) {
        markButton.textContent = markedQuestions[index] ? 'Unmark & Next' : 'Mark for Review & Next';
    }
}

// These functions are already defined in the original code
// We'll use the existing event listeners instead

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Load user info
    loadUserInfo();
    
    // Load exam details and questions
    loadExamDetails();
    
    // Start timer
    startTimer();
    
    // Navigation buttons are already set up in the original code
    
    // Set up section tabs
    const sectionTabs = document.querySelectorAll('.section-tab');
    sectionTabs.forEach((tab, index) => {
        tab.addEventListener('click', () => {
            // Update active tab
            sectionTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Update current section display
            const currentSection = document.getElementById('currentSection');
            if (currentSection) {
                currentSection.textContent = tab.textContent;
            }
            
            // Show first question of this section
            let sectionStart;
            if (isAdvancedExam()) {
                sectionStart = index * 9;
            } else {
                // For JEE Mains with TCS iON pattern
                switch(index) {
                    case 0: sectionStart = 0; break;  // Section 1
                    case 1: sectionStart = 20; break; // Section 2
                    case 2: sectionStart = 25; break; // Section 3
                    case 3: sectionStart = 45; break; // Section 4
                    case 4: sectionStart = 50; break; // Section 5
                    case 5: sectionStart = 70; break; // Section 6
                    default: sectionStart = 0;
                }
            }
            
            // Make sure we don't exceed array bounds
            if (questions.length > 0) {
                sectionStart = Math.min(sectionStart, questions.length - 1);
                showQuestion(sectionStart);
            }
            
            // Update question palette to show only questions from this section
            updateQuestionPalette();
        });
    });
    
    // Question buttons are now created dynamically in updateQuestionPalette()
    
    // Set up radio buttons
    const radioButtons = document.querySelectorAll('.option-radio');
    radioButtons.forEach(radio => {
        radio.addEventListener('change', () => {
            if (radio.checked) {
                const questionId = radio.name.substring(1); // Remove 'q' prefix
                const option = radio.id.split('-')[1]; // Get option letter
                
                // Remove selected class from all options
                document.querySelectorAll('.option-wrapper.selected, .option-image-wrapper.selected').forEach(el => {
                    el.classList.remove('selected');
                });
                
                // Add selected class to the parent wrapper
                const wrapper = radio.closest('.option-wrapper') || radio.closest('.option-image-wrapper');
                if (wrapper) {
                    wrapper.classList.add('selected');
                }
                
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
        const examTypeText = isAdvancedExam() ? 'Advanced' : 'Main';
        alert(`Exam Instructions:\n\n1. The exam consists of multiple-choice questions.\n2. Each question has only one correct answer.\n3. There is no negative marking.\n4. You can mark questions for review and return to them later.\n5. Click "Submit" when you are done with the exam.`);
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