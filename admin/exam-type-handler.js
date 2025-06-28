// Function to change exam type
function changeExamType() {
    const examType = document.getElementById('exam-type').value;
    
    // Update section navigation
    if (examType === 'jee-main') {
        document.getElementById('jee-main-sections').style.display = 'flex';
        document.getElementById('jee-advanced-sections').style.display = 'none';
        document.getElementById('question-number').textContent = '1';
        document.getElementById('current-section').textContent = 'Physics - Section 1 (MCQ)';
        
        // Update exam name if needed
        const examName = document.getElementById('exam-name').textContent;
        if (examName.includes('Advanced')) {
            document.getElementById('exam-name').textContent = examName.replace('Advanced', 'Main');
        }
    } else {
        document.getElementById('jee-main-sections').style.display = 'none';
        document.getElementById('jee-advanced-sections').style.display = 'flex';
        document.getElementById('question-number').textContent = '1';
        document.getElementById('current-section').textContent = 'Physics - Multiple Correct Options';
        
        // Update exam name if needed
        const examName = document.getElementById('exam-name').textContent;
        if (examName.includes('Main')) {
            document.getElementById('exam-name').textContent = examName.replace('Main', 'Advanced');
        }
    }
    
    // Reset to first question
    currentQuestionIndex = 0;
    updateQuestionFields(0);
}

// Function to toggle question fields based on type
function toggleQuestionFields() {
    const questionType = document.getElementById('question-type').value;
    
    // Hide all option containers
    document.getElementById('mcq-options').style.display = 'none';
    document.getElementById('multiple-options').style.display = 'none';
    document.getElementById('numerical-answer').style.display = 'none';
    document.getElementById('match-list').style.display = 'none';
    
    // Show the appropriate container based on question type
    if (questionType === 'mcq-single') {
        document.getElementById('mcq-options').style.display = 'block';
    } else if (questionType === 'mcq-multiple') {
        document.getElementById('multiple-options').style.display = 'block';
    } else if (questionType === 'numerical') {
        document.getElementById('numerical-answer').style.display = 'block';
    } else if (questionType === 'match-list') {
        // Create match list UI
        const matchListContainer = document.getElementById('match-list');
        matchListContainer.innerHTML = ''; // Clear previous content
        
        // Generate a unique ID for this question
        const questionId = 'q' + Date.now();
        
        // Create and append match list UI
        matchListContainer.appendChild(createMatchListUI(questionId));
        matchListContainer.style.display = 'block';
    }
}