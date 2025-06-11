// TCS iON JEE Advanced CBT Interface - Core Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize question status tracking
    const questionStatus = {};
    let currentQuestion = 3; // Starting with question 3 as in the example
    
    // Set up section tabs
    document.querySelectorAll('.section-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            document.querySelectorAll('.section-tab').forEach(t => {
                t.classList.remove('active');
            });
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Update section title
            document.querySelector('.section-strip').textContent = this.textContent;
        });
    });
    
    // Set up question buttons
    document.querySelectorAll('.question-btn').forEach(btn => {
        // Initialize question status
        const questionNumber = parseInt(btn.textContent);
        questionStatus[questionNumber] = {
            visited: questionNumber <= 3, // Questions 1-3 are visited
            answered: questionNumber <= 2, // Questions 1-2 are answered
            marked: questionNumber === 16 || questionNumber === 17, // Questions 16-17 are marked
        };
        
        // Add click event
        btn.addEventListener('click', function() {
            // Get question number
            const questionNumber = parseInt(this.textContent);
            
            // Update current question
            currentQuestion = questionNumber;
            
            // Update active question
            updateActiveQuestion();
            
            // Update question number in display
            document.querySelector('.question-number').textContent = `Question No. ${questionNumber}`;
        });
    });
    
    // Set up action buttons
    document.querySelector('.mark-btn').addEventListener('click', function() {
        // Mark current question for review
        if (questionStatus[currentQuestion]) {
            questionStatus[currentQuestion].marked = true;
            updateQuestionStatus(currentQuestion);
        }
        
        // Go to next question
        goToNextQuestion();
    });
    
    document.querySelector('.clear-btn').addEventListener('click', function() {
        // Clear response for current question
        if (questionStatus[currentQuestion]) {
            questionStatus[currentQuestion].answered = false;
            updateQuestionStatus(currentQuestion);
        }
        
        // Clear radio buttons
        document.querySelectorAll(`input[name="q${currentQuestion}"]`).forEach(input => {
            input.checked = false;
        });
    });
    
    document.querySelector('.prev-btn').addEventListener('click', function() {
        // Go to previous question
        if (currentQuestion > 1) {
            currentQuestion--;
            updateActiveQuestion();
            document.querySelector('.question-number').textContent = `Question No. ${currentQuestion}`;
        }
    });
    
    document.querySelector('.save-btn').addEventListener('click', function() {
        // Save response for current question
        if (questionStatus[currentQuestion]) {
            // Check if any option is selected
            const isAnswered = document.querySelector(`input[name="q${currentQuestion}"]:checked`) !== null;
            questionStatus[currentQuestion].answered = isAnswered;
            updateQuestionStatus(currentQuestion);
        }
        
        // Go to next question
        goToNextQuestion();
    });
    
    document.querySelector('.submit-btn').addEventListener('click', function() {
        if (confirm('Are you sure you want to submit your answers?')) {
            alert('Your answers have been submitted successfully!');
        }
    });
    
    // Helper functions
    function updateQuestionStatus(questionNumber) {
        const status = questionStatus[questionNumber];
        const btn = document.querySelector(`.question-btn:nth-child(${questionNumber})`);
        
        if (!btn) return;
        
        // Remove all status classes
        btn.classList.remove('not-visited', 'not-answered', 'answered', 'marked', 'answered-marked');
        
        // Add appropriate class
        if (!status.visited) {
            btn.classList.add('not-visited');
        } else if (status.answered && status.marked) {
            btn.classList.add('answered-marked');
        } else if (status.answered) {
            btn.classList.add('answered');
        } else if (status.marked) {
            btn.classList.add('marked');
        } else {
            btn.classList.add('not-answered');
        }
    }
    
    function updateActiveQuestion() {
        // Remove active class from all question buttons
        document.querySelectorAll('.question-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Add active class to current question button
        const btn = document.querySelector(`.question-btn:nth-child(${currentQuestion})`);
        if (btn) {
            btn.classList.add('active');
        }
    }
    
    function goToNextQuestion() {
        if (currentQuestion < 20) {
            currentQuestion++;
            updateActiveQuestion();
            document.querySelector('.question-number').textContent = `Question No. ${currentQuestion}`;
        }
    }
    
    // Initialize question status display
    for (let i = 1; i <= 20; i++) {
        updateQuestionStatus(i);
    }
    
    // Set initial active question
    updateActiveQuestion();
});