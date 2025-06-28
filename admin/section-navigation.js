// JEE Main paper structure
const jeeMainStructure = [];

// Physics Section 1 (MCQ) - 20 questions
for (let i = 0; i < 20; i++) {
    jeeMainStructure.push({ subject: 'Physics', type: 'mcq-single', section: 'Physics - Section 1 (MCQ)' });
}

// Physics Section 2 (Numerical) - 5 questions
for (let i = 0; i < 5; i++) {
    jeeMainStructure.push({ subject: 'Physics', type: 'numerical', section: 'Physics - Section 2 (Numerical)' });
}

// Chemistry Section 1 (MCQ) - 20 questions
for (let i = 0; i < 20; i++) {
    jeeMainStructure.push({ subject: 'Chemistry', type: 'mcq-single', section: 'Chemistry - Section 1 (MCQ)' });
}

// Chemistry Section 2 (Numerical) - 5 questions
for (let i = 0; i < 5; i++) {
    jeeMainStructure.push({ subject: 'Chemistry', type: 'numerical', section: 'Chemistry - Section 2 (Numerical)' });
}

// Mathematics Section 1 (MCQ) - 20 questions
for (let i = 0; i < 20; i++) {
    jeeMainStructure.push({ subject: 'Mathematics', type: 'mcq-single', section: 'Mathematics - Section 1 (MCQ)' });
}

// Mathematics Section 2 (Numerical) - 5 questions
for (let i = 0; i < 5; i++) {
    jeeMainStructure.push({ subject: 'Mathematics', type: 'numerical', section: 'Mathematics - Section 2 (Numerical)' });
}

// Current question index
let currentQuestionIndex = 0;

// Function to update fields based on current question index
function updateQuestionFields(index) {
    // Determine which structure to use based on exam type
    const examType = document.getElementById('exam-type').value;
    const structure = examType === 'jee-advanced' ? jeeAdvancedStructure : jeeMainStructure;
    
    if (index < 0 || index >= structure.length) return;
    
    const questionData = structure[index];
    currentQuestionIndex = index;
    
    // Update question number and section
    document.getElementById('question-number').textContent = index + 1;
    document.getElementById('current-section').textContent = questionData.section;
    
    // Set hidden fields
    document.getElementById('question-type').value = questionData.type;
    document.getElementById('question-subject').value = questionData.subject;
    
    // Load chapters for the subject
    loadChapters();
    
    // Show/hide appropriate fields
    toggleQuestionFields();
    
    // Update active section button
    highlightCurrentSection();
}

// Function to jump to a specific section
function jumpToSection(index) {
    console.log('Jumping to section index:', index);
    currentQuestionIndex = index;
    updateQuestionFields(index);
}

// Function to highlight the current section button
function highlightCurrentSection() {
    // Remove active class from all buttons
    document.querySelectorAll('.btn-group .btn').forEach(btn => {
        btn.classList.remove('active');
        btn.classList.add('btn-outline-primary');
        btn.classList.remove('btn-primary');
    });
    
    // Determine which section we're in
    let sectionIndex = 0;
    if (currentQuestionIndex >= 20 && currentQuestionIndex < 25) sectionIndex = 1;
    else if (currentQuestionIndex >= 25 && currentQuestionIndex < 45) sectionIndex = 2;
    else if (currentQuestionIndex >= 45 && currentQuestionIndex < 50) sectionIndex = 3;
    else if (currentQuestionIndex >= 50 && currentQuestionIndex < 70) sectionIndex = 4;
    else if (currentQuestionIndex >= 70) sectionIndex = 5;
    
    // Add active class to current section button
    const buttons = document.querySelectorAll('.btn-group .btn');
    if (buttons[sectionIndex]) {
        buttons[sectionIndex].classList.add('active');
        buttons[sectionIndex].classList.remove('btn-outline-primary');
        buttons[sectionIndex].classList.add('btn-primary');
    }
}