// JEE Advanced 2024 Question Manager
const jeeAdvanced2024 = {
    // Paper configuration
    paperConfig: {
        paper1: {
            name: "JEE Advanced 2024: Paper 1",
            subjects: ["physics", "chemistry", "mathematics"],
            questionsPerSubject: 17,
            totalQuestions: 51,
            questionTypes: {
                scq: { count: 4, marks: 3, negative: 1 },
                mcq: { count: 3, marks: 4, negative: 2, partial: true },
                integer: { count: 6, marks: 4, negative: 0 },
                matchList: { count: 4, marks: 3, negative: 1 }
            }
        }
    },
    
    // Current paper data
    currentPaper: null,
    
    // Question counters
    questionCounts: {
        physics: { scq: 0, mcq: 0, integer: 0, matchList: 0 },
        chemistry: { scq: 0, mcq: 0, integer: 0, matchList: 0 },
        mathematics: { scq: 0, mcq: 0, integer: 0, matchList: 0 }
    },
    
    // Initialize paper
    initPaper: function(paperKey) {
        const config = this.paperConfig[paperKey];
        
        this.currentPaper = {
            id: `jee-adv-2024-${paperKey}-${Date.now()}`,
            type: 'jee-advanced',
            name: config.name,
            year: '2024',
            paperNumber: paperKey === 'paper1' ? '1' : '2',
            subjects: config.subjects,
            questions: []
        };
        
        // Reset question counters
        this.resetQuestionCounts();
        
        return this.currentPaper;
    },
    
    // Reset question counters
    resetQuestionCounts: function() {
        for (const subject of this.currentPaper.subjects) {
            this.questionCounts[subject] = {
                scq: 0,
                mcq: 0,
                integer: 0,
                matchList: 0
            };
        }
    },
    
    // Add a question
    addQuestion: function(subject, type, data) {
        // Check if we've reached the limit for this question type
        const config = this.paperConfig.paper1;
        if (this.questionCounts[subject][type] >= config.questionTypes[type].count) {
            throw new Error(`Maximum ${config.questionTypes[type].count} ${type.toUpperCase()} questions allowed for ${subject}`);
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
        if (type === 'scq' || type === 'mcq') {
            question.options = data.options;
            question.marks = config.questionTypes[type].marks;
            question.negative = config.questionTypes[type].negative;
        } else if (type === 'integer') {
            question.answer = data.answer;
            question.marks = config.questionTypes[type].marks;
        } else if (type === 'matchList') {
            question.matchItems = data.matchItems;
            question.options = data.options;
            question.correctOption = data.correctOption;
            question.marks = config.questionTypes[type].marks;
            question.negative = config.questionTypes[type].negative;
        }
        
        // Add to questions array
        this.currentPaper.questions.push(question);
        
        // Update question count
        this.questionCounts[subject][type]++;
        
        return question;
    },
    
    // Get available question types for a subject
    getAvailableTypes: function(subject) {
        const config = this.paperConfig.paper1;
        const availableTypes = [];
        
        for (const type in config.questionTypes) {
            if (this.questionCounts[subject][type] < config.questionTypes[type].count) {
                availableTypes.push({
                    type: type,
                    remaining: config.questionTypes[type].count - this.questionCounts[subject][type]
                });
            }
        }
        
        return availableTypes;
    },
    
    // Get question count summary
    getQuestionSummary: function() {
        const summary = {};
        
        for (const subject of this.currentPaper.subjects) {
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
        localStorage.setItem('jeeAdvanced2024Paper1', JSON.stringify(this.currentPaper));
    },
    
    // Load paper from localStorage
    loadPaper: function() {
        const savedPaper = localStorage.getItem('jeeAdvanced2024Paper1');
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