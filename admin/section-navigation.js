// Current question index (0-based)
let currentQuestionIndex = 0;

// Function to update form fields based on current question index
function updateQuestionFields() {
    // Get 1-based question number
    const questionNumber = currentQuestionIndex + 1;
    console.log('updateQuestionFields called with questionNumber:', questionNumber, 'currentQuestionIndex:', currentQuestionIndex);
    
    // Get section info for current question
    const sectionInfo = getSectionInfo(questionNumber);
    
    if (!sectionInfo) return;
    
    // Update section and question display
    document.getElementById('question-number').textContent = `Question ${questionNumber} of ${totalJeeMainQuestions}`;
    document.getElementById('section-name').textContent = sectionInfo.section;
    
    // Set subject (hidden) and update subject display
    document.getElementById('question-subject').value = sectionInfo.subject;
    document.getElementById('subject-display').textContent = sectionInfo.subject;
    
    // Set question type and toggle fields
    document.getElementById('question-type').value = sectionInfo.type;
    toggleQuestionFields();
    
    // Update chapters dropdown
    updateChapters(sectionInfo.subject);
    
    // Highlight current section button
    highlightCurrentSection();
}

// Function to navigate to next question
function nextQuestion() {
    if (currentQuestionIndex < totalJeeMainQuestions - 1) {
        currentQuestionIndex++;
        updateQuestionFields();
        
        // Load existing question data for the new question
        const urlParams = new URLSearchParams(window.location.search);
        const examId = urlParams.get('examId');
        if (examId) {
            loadExistingQuestion(examId, currentQuestionIndex + 1);
        }
        
        // Keep the subject and type set
        const sectionInfo = getSectionInfo(currentQuestionIndex + 1);
        document.getElementById('question-subject').value = sectionInfo.subject;
        document.getElementById('question-type').value = sectionInfo.type;
    }
}

// Function to navigate to previous question
function prevQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        updateQuestionFields();
        
        // Load existing question data for the new question
        const urlParams = new URLSearchParams(window.location.search);
        const examId = urlParams.get('examId');
        if (examId) {
            loadExistingQuestion(examId, currentQuestionIndex + 1);
        }
        
        // Keep the subject and type set
        const sectionInfo = getSectionInfo(currentQuestionIndex + 1);
        document.getElementById('question-subject').value = sectionInfo.subject;
        document.getElementById('question-type').value = sectionInfo.type;
    }
}

// Function to jump to a specific section
function jumpToSection(sectionIndex) {
    // Calculate the starting question index for the section
    let questionIndex = 0;
    for (let i = 0; i < sectionIndex; i++) {
        questionIndex += jeeMainStructure[i].count;
    }
    
    currentQuestionIndex = questionIndex;
    updateQuestionFields();
    document.getElementById('question-form').reset();
    
    return false; // Prevent default link behavior
}

// Function to highlight the current section button
function highlightCurrentSection() {
    // Get current section index
    let sectionIndex = 0;
    let questionCount = 0;
    
    for (let i = 0; i < jeeMainStructure.length; i++) {
        questionCount += jeeMainStructure[i].count;
        if (currentQuestionIndex + 1 <= questionCount) {
            sectionIndex = i;
            break;
        }
    }
    
    // Remove active class from all section buttons
    const sectionButtons = document.querySelectorAll('.section-btn');
    sectionButtons.forEach(btn => btn.classList.remove('active'));
    
    // Add active class to current section button
    if (sectionButtons[sectionIndex]) {
        sectionButtons[sectionIndex].classList.add('active');
    }
}