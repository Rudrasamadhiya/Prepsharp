// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize with first question
    updateQuestionFields(0);
    
    // Set up navigation button event listeners
    document.getElementById('prev-question-btn').addEventListener('click', function() {
        const examType = document.getElementById('exam-type').value;
        const structure = examType === 'jee-advanced' ? jeeAdvancedStructure : jeeMainStructure;
        
        if (currentQuestionIndex > 0) {
            updateQuestionFields(currentQuestionIndex - 1);
        }
    });
    
    document.getElementById('next-question-btn').addEventListener('click', function() {
        const examType = document.getElementById('exam-type').value;
        const structure = examType === 'jee-advanced' ? jeeAdvancedStructure : jeeMainStructure;
        
        if (currentQuestionIndex < structure.length - 1) {
            updateQuestionFields(currentQuestionIndex + 1);
        }
    });
});