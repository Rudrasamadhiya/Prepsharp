/**
 * Admin functions for PrepSharp question paper management
 */

// Database connection (simulated)
const database = {
    papers: [],
    
    // Save paper to database
    savePaper: function(paperData) {
        // Generate unique ID
        const paperId = 'paper_' + Date.now();
        paperData.id = paperId;
        paperData.createdAt = new Date().toISOString();
        
        // Add to database
        this.papers.push(paperData);
        
        // Save to localStorage for persistence
        this.saveToLocalStorage();
        
        return paperId;
    },
    
    // Get all papers
    getAllPapers: function() {
        return this.papers;
    },
    
    // Get paper by ID
    getPaperById: function(id) {
        return this.papers.find(paper => paper.id === id);
    },
    
    // Save to localStorage
    saveToLocalStorage: function() {
        localStorage.setItem('prepsharp_papers', JSON.stringify(this.papers));
    },
    
    // Load from localStorage
    loadFromLocalStorage: function() {
        const stored = localStorage.getItem('prepsharp_papers');
        if (stored) {
            this.papers = JSON.parse(stored);
        }
    }
};

// Initialize database from localStorage
database.loadFromLocalStorage();

// Function to save paper to database
function savePaperToDatabase(paperData) {
    return database.savePaper(paperData);
}

// Function to mark correct answers
function markCorrectAnswers(paperData) {
    paperData.questions.forEach(question => {
        if (question.type === 'Single Correct Option') {
            // For single correct option, mark one option as correct
            const correctOptionIndex = Math.floor(Math.random() * question.options.length);
            question.correctAnswer = question.options[correctOptionIndex].label;
        } else if (question.type === 'Multiple Correct Options') {
            // For multiple correct options, mark random options as correct
            const correctOptions = [];
            question.options.forEach(option => {
                if (Math.random() > 0.5) {
                    correctOptions.push(option.label);
                }
            });
            // Ensure at least one option is marked correct
            if (correctOptions.length === 0 && question.options.length > 0) {
                correctOptions.push(question.options[0].label);
            }
            question.correctAnswer = correctOptions;
        } else if (question.type === 'Non-Negative Integer') {
            // For integer type, generate a random integer
            question.correctAnswer = Math.floor(Math.random() * 100);
        } else if (question.type === 'Match List') {
            // For match list, assign a random option
            const correctOptionIndex = Math.floor(Math.random() * question.options.length);
            question.correctAnswer = question.options[correctOptionIndex].label;
        }
    });
    
    return paperData;
}

// Export functions
window.adminFunctions = {
    savePaperToDatabase,
    markCorrectAnswers,
    database
};