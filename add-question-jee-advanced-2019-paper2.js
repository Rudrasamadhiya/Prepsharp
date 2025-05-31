// JEE Advanced 2019 Paper 2 Question Manager
const jeeAdvanced2019Paper2 = {
    // Paper configuration
    paperConfig: {
        name: "JEE Advanced 2019: Paper 2",
        subjects: ["physics", "chemistry", "mathematics"],
        questionsPerSubject: 18,
        totalQuestions: 54,
        questionTypes: {
            matchList: { count: 4, marks: 3, negative: 1 },
            mcq: { count: 8, marks: 4, negative: 1, partial: true },
            numerical: { count: 6, marks: 3, negative: 0 }
        }
    },
    
    // Current paper data
    currentPaper: {
        id: `jee-adv-2019-paper2-${Date.now()}`,
        type: 'jee-advanced',
        name: "JEE Advanced 2019: Paper 2",
        year: '2019',
        paperNumber: '2',
        subjects: ["physics", "chemistry", "mathematics"],
        questions: []
    },
    
    // Question counters
    questionCounts: {
        physics: { matchList: 0, mcq: 0, numerical: 0 },
        chemistry: { matchList: 0, mcq: 0, numerical: 0 },
        mathematics: { matchList: 0, mcq: 0, numerical: 0 }
    },
    
    // Reset question counters
    resetQuestionCounts: function() {
        for (const subject of this.paperConfig.subjects) {
            this.questionCounts[subject] = {
                matchList: 0,
                mcq: 0,
                numerical: 0
            };
        }
    },
    
    // Add a question
    addQuestion: function(subject, type, data) {
        // Check if we've reached the limit for this question type
        if (this.questionCounts[subject][type] >= this.paperConfig.questionTypes[type].count) {
            throw new Error(`Maximum ${this.paperConfig.questionTypes[type].count} ${type.toUpperCase()} questions allowed for ${subject}`);
        }
        
        // Create question object
        const questionNumber = this.currentPaper.questions.length + 1;
        const question = {
            id: `${subject}-${type}-${questionNumber}`,
            number: questionNumber,
            subject: subject,
            type: type,
            text: data.text,
            explanation: data.explanation || ""
        };
        
        // Add type-specific data
        if (type === 'mcq') {
            question.options = data.options;
            question.marks = this.paperConfig.questionTypes[type].marks;
            question.negative = this.paperConfig.questionTypes[type].negative;
        } else if (type === 'numerical') {
            question.answer = data.answer;
            question.marks = this.paperConfig.questionTypes[type].marks;
        } else if (type === 'matchList') {
            question.matchItems = data.matchItems;
            question.options = data.options;
            question.correctOption = data.correctOption;
            question.marks = this.paperConfig.questionTypes[type].marks;
            question.negative = this.paperConfig.questionTypes[type].negative;
        }
        
        // Add to questions array
        this.currentPaper.questions.push(question);
        
        // Update question count
        this.questionCounts[subject][type]++;
        
        return question;
    },
    
    // Get available question types for a subject
    getAvailableTypes: function(subject) {
        const availableTypes = [];
        
        for (const type in this.paperConfig.questionTypes) {
            if (this.questionCounts[subject][type] < this.paperConfig.questionTypes[type].count) {
                availableTypes.push({
                    type: type,
                    remaining: this.paperConfig.questionTypes[type].count - this.questionCounts[subject][type]
                });
            }
        }
        
        return availableTypes;
    },
    
    // Get question count summary
    getQuestionSummary: function() {
        const summary = {};
        
        for (const subject of this.paperConfig.subjects) {
            summary[subject] = {
                total: 0
            };
            
            for (const type in this.questionCounts[subject]) {
                summary[subject][type] = this.questionCounts[subject][type];
                summary[subject].total += this.questionCounts[subject][type];
            }
        }
        
        return summary;
    },
    
    // Save paper to localStorage
    savePaper: function() {
        localStorage.setItem('jeeAdvanced2019Paper2', JSON.stringify(this.currentPaper));
    },
    
    // Load paper from localStorage
    loadPaper: function() {
        const savedPaper = localStorage.getItem('jeeAdvanced2019Paper2');
        if (savedPaper) {
            this.currentPaper = JSON.parse(savedPaper);
            this.recalculateQuestionCounts();
            return this.currentPaper;
        }
        return null;
    },
    
    // Recalculate question counts from loaded paper
    recalculateQuestionCounts: function() {
        this.resetQuestionCounts();
        
        for (const question of this.currentPaper.questions) {
            if (question.subject && question.type) {
                this.questionCounts[question.subject][question.type]++;
            }
        }
    }
};