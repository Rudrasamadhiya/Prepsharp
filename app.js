// Main application class
class PrepSharpApp {
    constructor() {
        this.currentUser = null;
        this.currentExam = null;
        this.currentQuestionIndex = 0;
        this.userAnswers = [];
        this.examTimer = null;
        this.timeRemaining = 3 * 60 * 60; // 3 hours in seconds
        
        // Initialize the application
        this.init();
    }
    
    init() {
        // Set up event listeners for the login form
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', this.handleLogin.bind(this));
        }
        
        // Set up event listener for register button
        const registerBtn = document.getElementById('register-btn');
        if (registerBtn) {
            registerBtn.addEventListener('click', this.showRegisterScreen.bind(this));
        }
        
        // Check if user is already logged in (from localStorage)
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            this.showDashboard();
        }
    }
    
    // Handle login form submission
    handleLogin(event) {
        event.preventDefault();
        const userId = document.getElementById('userId').value;
        const password = document.getElementById('password').value;
        
        // In a real app, this would validate against a server
        // For demo purposes, we'll use localStorage
        const users = JSON.parse(localStorage.getItem('users') || '{}');
        
        if (users[userId] && users[userId].password === password) {
            this.currentUser = {
                userId: userId,
                name: users[userId].name
            };
            
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            this.showDashboard();
        } else {
            alert('Invalid user ID or password');
        }
    }
    
    // Show registration screen
    showRegisterScreen() {
        const app = document.getElementById('app');
        const registerTemplate = document.getElementById('register-template');
        app.innerHTML = registerTemplate.innerHTML;
        
        // Set up event listeners for the register form
        const registerForm = document.getElementById('register-form');
        registerForm.addEventListener('submit', this.handleRegister.bind(this));
        
        // Set up event listener for back to login button
        const backToLoginBtn = document.getElementById('back-to-login');
        backToLoginBtn.addEventListener('click', () => {
            window.location.reload();
        });
    }
    
    // Handle registration form submission
    handleRegister(event) {
        event.preventDefault();
        const userId = document.getElementById('newUserId').value;
        const name = document.getElementById('name').value;
        const password = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        
        // In a real app, this would send data to a server
        // For demo purposes, we'll use localStorage
        const users = JSON.parse(localStorage.getItem('users') || '{}');
        
        if (users[userId]) {
            alert('User ID already exists');
            return;
        }
        
        users[userId] = {
            name: name,
            password: password,
            examResults: []
        };
        
        localStorage.setItem('users', JSON.stringify(users));
        
        this.currentUser = {
            userId: userId,
            name: name
        };
        
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        this.showDashboard();
    }
    
    // Show dashboard screen
    showDashboard() {
        const app = document.getElementById('app');
        const dashboardTemplate = document.getElementById('dashboard-template');
        app.innerHTML = dashboardTemplate.innerHTML;
        
        // Update user name
        document.getElementById('user-name').textContent = `Welcome, ${this.currentUser.name}`;
        
        // Set up event listener for logout button
        const logoutBtn = document.getElementById('logout-btn');
        logoutBtn.addEventListener('click', this.handleLogout.bind(this));
        
        // Load available exams
        this.loadExams();
        
        // Load user results
        this.loadResults();
    }
    
    // Load available exams
    loadExams() {
        const examList = document.getElementById('exam-list');
        
        // In a real app, this would fetch from a server
        // For demo purposes, we'll create sample exams
        const exams = this.getSampleExams();
        
        examList.innerHTML = '';
        exams.forEach(exam => {
            const examItem = document.createElement('div');
            examItem.className = 'exam-item';
            examItem.innerHTML = `
                <div>
                    <h3>${exam.title}</h3>
                    <p>Year: ${exam.year}</p>
                </div>
                <button class="btn primary start-exam" data-exam-id="${exam.id}">Start Exam</button>
            `;
            examList.appendChild(examItem);
        });
        
        // Add event listeners to start exam buttons
        const startExamButtons = document.querySelectorAll('.start-exam');
        startExamButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const examId = event.target.getAttribute('data-exam-id');
                this.startExam(examId);
            });
        });
    }
    
    // Load user results
    loadResults() {
        const resultsList = document.getElementById('results-list');
        resultsList.innerHTML = '<p>Loading results...</p>';
        
        // Fetch results from server
        fetch(`/api/results/user/${this.currentUser.userId}`)
            .then(response => response.json())
            .then(data => {
                if (data.success && data.results && data.results.length > 0) {
                    resultsList.innerHTML = '';
                    data.results.forEach(result => {
                        const resultItem = document.createElement('div');
                        resultItem.className = 'exam-item';
                        resultItem.innerHTML = `
                            <div>
                                <h3>${result.examTitle}</h3>
                                <p>Score: ${result.score}/${result.totalQuestions}</p>
                            </div>
                            <button class="btn secondary view-result" data-result-id="${result.id}">View Details</button>
                        `;
                        resultsList.appendChild(resultItem);
                    });
                    
                    // Add event listeners to view result buttons
                    const viewResultButtons = document.querySelectorAll('.view-result');
                    viewResultButtons.forEach(button => {
                        button.addEventListener('click', (event) => {
                            const resultId = event.target.getAttribute('data-result-id');
                            window.location.href = `result.html?resultId=${resultId}`;
                        });
                    });
                } else {
                    // Fallback to localStorage if no results from server
                    const users = JSON.parse(localStorage.getItem('users') || '{}');
                    const user = users[this.currentUser.userId];
                    
                    if (!user || !user.examResults || user.examResults.length === 0) {
                        resultsList.innerHTML = '<p>No exam results yet.</p>';
                        return;
                    }
                    
                    resultsList.innerHTML = '';
                    user.examResults.forEach(result => {
                        const resultItem = document.createElement('div');
                        resultItem.className = 'exam-item';
                        resultItem.innerHTML = `
                            <div>
                                <h3>${result.examTitle}</h3>
                                <p>Score: ${result.score}/${result.totalQuestions}</p>
                            </div>
                            <button class="btn secondary view-result" data-result-id="${result.id}">View Details</button>
                        `;
                        resultsList.appendChild(resultItem);
                    });
                    
                    // Add event listeners to view result buttons
                    const viewResultButtons = document.querySelectorAll('.view-result');
                    viewResultButtons.forEach(button => {
                        button.addEventListener('click', (event) => {
                            const resultId = event.target.getAttribute('data-result-id');
                            window.location.href = `result.html?resultId=${resultId}`;
                        });
                    });
                }
            })
            .catch(error => {
                console.error('Error fetching results:', error);
                // Fallback to localStorage
                const users = JSON.parse(localStorage.getItem('users') || '{}');
                const user = users[this.currentUser.userId];
                
                if (!user || !user.examResults || user.examResults.length === 0) {
                    resultsList.innerHTML = '<p>No exam results yet.</p>';
                    return;
                }
                
                resultsList.innerHTML = '';
                user.examResults.forEach(result => {
                    const resultItem = document.createElement('div');
                    resultItem.className = 'exam-item';
                    resultItem.innerHTML = `
                        <div>
                            <h3>${result.examTitle}</h3>
                            <p>Score: ${result.score}/${result.totalQuestions}</p>
                        </div>
                        <button class="btn secondary view-result" data-result-id="${result.id}">View Details</button>
                    `;
                    resultsList.appendChild(resultItem);
                });
                
                // Add event listeners to view result buttons
                const viewResultButtons = document.querySelectorAll('.view-result');
                viewResultButtons.forEach(button => {
                    button.addEventListener('click', (event) => {
                        const resultId = event.target.getAttribute('data-result-id');
                        window.location.href = `result.html?resultId=${resultId}`;
                    });
                });
            });
    }
    
    // Start an exam
    startExam(examId) {
        // In a real app, this would fetch the exam from a server
        // For demo purposes, we'll use our sample exams
        const exams = this.getSampleExams();
        this.currentExam = exams.find(exam => exam.id === examId);
        
        if (!this.currentExam) {
            alert('Exam not found');
            return;
        }
        
        // Initialize user answers array
        this.userAnswers = new Array(this.currentExam.questions.length).fill(null);
        this.currentQuestionIndex = 0;
        
        // Show exam screen
        const app = document.getElementById('app');
        const examTemplate = document.getElementById('exam-template');
        app.innerHTML = examTemplate.innerHTML;
        
        // Update exam title
        document.getElementById('exam-title').textContent = this.currentExam.title;
        
        // Set up timer
        this.timeRemaining = 3 * 60 * 60; // 3 hours in seconds
        this.updateTimer();
        this.examTimer = setInterval(this.updateTimer.bind(this), 1000);
        
        // Load first question
        this.loadQuestion();
        
        // Set up question navigator
        this.setupQuestionNavigator();
        
        // Set up event listeners for navigation buttons
        document.getElementById('prev-btn').addEventListener('click', this.prevQuestion.bind(this));
        document.getElementById('next-btn').addEventListener('click', this.nextQuestion.bind(this));
        document.getElementById('submit-exam').addEventListener('click', this.confirmSubmitExam.bind(this));
        

    }
    
    // Load current question
    loadQuestion() {
        const questionContainer = document.getElementById('question-container');
        const question = this.currentExam.questions[this.currentQuestionIndex];
        
        questionContainer.innerHTML = `
            <div class="question">
                <div class="question-text">${this.currentQuestionIndex + 1}. ${question.text}</div>
                <ul class="options">
                    ${question.options.map((option, index) => `
                        <li class="option ${this.userAnswers[this.currentQuestionIndex] === index ? 'selected' : ''}\" 
                            data-index="${index}">${option}</li>
                    `).join('')}
                </ul>
            </div>
        `;
        
        // Add event listeners to options
        const options = questionContainer.querySelectorAll('.option');
        options.forEach(option => {
            option.addEventListener('click', (event) => {
                const index = parseInt(event.target.getAttribute('data-index'));
                this.selectAnswer(index);
            });
        });
        
        // Update question navigator
        this.updateQuestionNavigator();
    }
    
    // Set up question navigator
    setupQuestionNavigator() {
        const questionNumbers = document.getElementById('question-numbers');
        questionNumbers.innerHTML = '';
        
        for (let i = 0; i < this.currentExam.questions.length; i++) {
            const questionNumber = document.createElement('div');
            questionNumber.className = 'question-number';
            questionNumber.textContent = i + 1;
            questionNumber.setAttribute('data-index', i);
            
            questionNumber.addEventListener('click', (event) => {
                const index = parseInt(event.target.getAttribute('data-index'));
                this.goToQuestion(index);
            });
            
            questionNumbers.appendChild(questionNumber);
        }
    }
    
    // Update question navigator
    updateQuestionNavigator() {
        const questionNumbers = document.querySelectorAll('.question-number');
        
        questionNumbers.forEach((item, index) => {
            item.className = 'question-number';
            
            if (this.userAnswers[index] !== null) {
                item.classList.add('answered');
            }
            
            if (index === this.currentQuestionIndex) {
                item.classList.add('current');
            }
        });
    }
    
    // Select an answer
    selectAnswer(optionIndex) {
        this.userAnswers[this.currentQuestionIndex] = optionIndex;
        
        // Update UI
        const options = document.querySelectorAll('.option');
        options.forEach((option, index) => {
            if (index === optionIndex) {
                option.classList.add('selected');
            } else {
                option.classList.remove('selected');
            }
        });
        
        // Update question navigator
        this.updateQuestionNavigator();
    }
    

    
    // Go to previous question
    prevQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
            this.loadQuestion();
        }
    }
    
    // Go to next question
    nextQuestion() {
        if (this.currentQuestionIndex < this.currentExam.questions.length - 1) {
            this.currentQuestionIndex++;
            this.loadQuestion();
        }
    }
    
    // Go to specific question
    goToQuestion(index) {
        if (index >= 0 && index < this.currentExam.questions.length) {
            this.currentQuestionIndex = index;
            this.loadQuestion();
        }
    }
    
    // Update timer
    updateTimer() {
        if (this.timeRemaining <= 0) {
            clearInterval(this.examTimer);
            this.submitExam();
            return;
        }
        
        this.timeRemaining--;
        
        const hours = Math.floor(this.timeRemaining / 3600);
        const minutes = Math.floor((this.timeRemaining % 3600) / 60);
        const seconds = this.timeRemaining % 60;
        
        const timerDisplay = document.getElementById('timer');
        timerDisplay.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    // Confirm submit exam
    confirmSubmitExam() {
        const unanswered = this.userAnswers.filter(answer => answer === null).length;
        
        if (unanswered > 0) {
            const confirmSubmit = confirm(`You have ${unanswered} unanswered questions. Are you sure you want to submit?`);
            if (confirmSubmit) {
                this.submitExam();
            }
        } else {
            this.submitExam();
        }
    }
    
    // Submit exam
    submitExam() {
        clearInterval(this.examTimer);
        
        // Calculate score
        let score = 0;
        this.userAnswers.forEach((answer, index) => {
            if (answer === this.currentExam.questions[index].correctAnswer) {
                score++;
            }
        });
        
        // Create result object
        const resultId = Date.now().toString();
        const result = {
            id: resultId,
            userId: this.currentUser.userId,
            examId: this.currentExam.id,
            examTitle: this.currentExam.title,
            score: score,
            maxScore: this.currentExam.questions.length,
            totalQuestions: this.currentExam.questions.length,
            answers: this.userAnswers,
            timeTaken: 3 * 60 * 60 - this.timeRemaining,
            date: new Date().toISOString()
        };
        
        // Save to server database
        fetch('/api/results', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(result)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('Result saved to database:', data.resultId);
                
                // Also save to localStorage for backward compatibility
                const users = JSON.parse(localStorage.getItem('users') || '{}');
                if (!users[this.currentUser.userId].examResults) {
                    users[this.currentUser.userId].examResults = [];
                }
                users[this.currentUser.userId].examResults.push(result);
                localStorage.setItem('users', JSON.stringify(users));
                
                // Redirect to result page
                window.location.href = `result.html?resultId=${resultId}`;
            } else {
                console.error('Failed to save result to database');
                // Fallback to local storage only
                this.showResult(resultId);
            }
        })
        .catch(error => {
            console.error('Error saving result:', error);
            // Fallback to local storage only
            this.showResult(resultId);
        });
    }
    
    // Show result screen
    showResult(resultId) {
        const users = JSON.parse(localStorage.getItem('users') || '{}');
        const user = users[this.currentUser.userId];
        const result = user.examResults.find(result => result.id === resultId);
        
        if (!result) {
            alert('Result not found');
            this.showDashboard();
            return;
        }
        
        const app = document.getElementById('app');
        const resultTemplate = document.getElementById('result-template');
        app.innerHTML = resultTemplate.innerHTML;
        
        // Update result details
        document.getElementById('result-title').textContent = result.examTitle;
        document.getElementById('result-score').textContent = `${result.score} / ${result.totalQuestions}`;
        document.getElementById('result-percentage').textContent = `${Math.round((result.score / result.totalQuestions) * 100)}%`;
        
        // Set up event listener for back to dashboard button
        document.getElementById('back-to-dashboard').addEventListener('click', this.showDashboard.bind(this));
    }
    
    // View a previous result
    viewResult(resultId) {
        this.showResult(resultId);
    }
    
    // Handle logout
    handleLogout() {
        localStorage.removeItem('currentUser');
        this.currentUser = null;
        window.location.reload();
    }
    
    // Get sample exams
    getSampleExams() {
        return [
            {
                id: 'jee-2022',
                title: 'JEE Main 2022',
                year: 2022,
                questions: [
                    {
                        text: 'If the sum of the first 11 terms of the arithmetic progression 10, 7, 4, ... is S, then S equals',
                        options: ['-275', '-165', '165', '275'],
                        correctAnswer: 1
                    },
                    {
                        text: 'The value of the integral ∫(0 to π/2) (sin x)/(2 + cos x) dx is',
                        options: ['π/8', 'π/6', 'π/4', 'π/3'],
                        correctAnswer: 2
                    },
                    {
                        text: 'A particle moves along the x-axis in such a way that at time t seconds, its position is given by x = 3t² - 4t meters. The acceleration of the particle is',
                        options: ['6 m/s²', '3 m/s²', '-4 m/s²', '0 m/s²'],
                        correctAnswer: 0
                    }
                ]
            },
            {
                id: 'jee-2021',
                title: 'JEE Main 2021',
                year: 2021,
                questions: [
                    {
                        text: 'The value of the determinant |1 2 3; 4 5 6; 7 8 9| is',
                        options: ['0', '1', '-3', '3'],
                        correctAnswer: 0
                    },
                    {
                        text: 'The solution of the differential equation dy/dx + y = e^x is',
                        options: ['y = e^x + Ce^(-x)', 'y = e^x + Ce^x', 'y = xe^x + Ce^(-x)', 'y = e^x + C'],
                        correctAnswer: 2
                    },
                    {
                        text: 'A body of mass 2 kg is moving with a velocity of 10 m/s. The kinetic energy of the body is',
                        options: ['100 J', '200 J', '20 J', '10 J'],
                        correctAnswer: 0
                    }
                ]
            }
        ];
    }
}