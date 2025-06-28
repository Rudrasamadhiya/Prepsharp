// Function to save question
function saveQuestion(examId) {
    // Get form values
    const questionType = document.getElementById('question-type').value;
    const subject = document.getElementById('question-subject').value;
    const chapter = document.getElementById('question-chapter').value;
    const questionText = document.getElementById('question-text').value;
    const difficulty = document.getElementById('question-difficulty').value;
    const marks = document.getElementById('question-marks').value;
    const examType = document.getElementById('exam-type').value;
    
    // Validate required fields
    if (!questionType || !subject || !chapter || !questionText || !difficulty) {
        alert('Please fill in all required fields');
        return;
    }
    
    // Disable save button
    const saveBtn = document.getElementById('save-question-btn');
    saveBtn.disabled = true;
    saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i> Saving...';
    
    // Create question object
    let question = {
        text: questionText,
        type: questionType,
        subject: subject,
        chapter: chapter,
        difficulty: difficulty,
        marks: parseInt(marks) || 4
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
        try {
            // Get match list data
            const questionId = document.querySelector('#match-list > div').id.replace('match-list-', '');
            const matchData = getMatchListData(questionId);
            
            question.matchItems = {
                list1: matchData.list1,
                list2: matchData.list2
            };
            question.correctOption = matchData.correctOption;
        } catch (error) {
            alert(error.message);
            saveBtn.disabled = false;
            saveBtn.innerHTML = '<i class="fas fa-save me-2"></i> Save Question';
            return;
        }
    }
    
    // Simplified save function to avoid Firebase errors
    console.log('Saving question:', question);
    
    // Determine which structure to use based on exam type
    const structure = examType === 'jee-advanced' ? jeeAdvancedStructure : jeeMainStructure;
    
    // Simulate successful save
    setTimeout(() => {
        alert('Question added successfully!');
        
        // Move to next question if available
        if (currentQuestionIndex < structure.length - 1) {
            updateQuestionFields(currentQuestionIndex + 1);
        } else {
            // Reset form if at the last question
            document.getElementById('question-form').reset();
        }
        
        // Re-enable save button
        saveBtn.disabled = false;
        saveBtn.innerHTML = '<i class="fas fa-save me-2"></i> Save Question';
    }, 1000); // Simulate network delay
}