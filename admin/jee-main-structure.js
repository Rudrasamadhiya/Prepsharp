// JEE Main paper structure
const jeeMainStructure = [
    // Physics Section 1 (Single Correct MCQs) - Questions 1-20
    { section: "Physics - Section 1", subject: "Physics", type: "mcq-single", count: 20 },
    
    // Physics Section 2 (Integer Type) - Questions 21-25
    { section: "Physics - Section 2", subject: "Physics", type: "numerical", count: 5 },
    
    // Chemistry Section 1 (Single Correct MCQs) - Questions 26-45
    { section: "Chemistry - Section 1", subject: "Chemistry", type: "mcq-single", count: 20 },
    
    // Chemistry Section 2 (Integer Type) - Questions 46-50
    { section: "Chemistry - Section 2", subject: "Chemistry", type: "numerical", count: 5 },
    
    // Mathematics Section 1 (Single Correct MCQs) - Questions 51-70
    { section: "Mathematics - Section 1", subject: "Mathematics", type: "mcq-single", count: 20 },
    
    // Mathematics Section 2 (Integer Type) - Questions 71-75
    { section: "Mathematics - Section 2", subject: "Mathematics", type: "numerical", count: 5 }
];

// Function to get section info based on question number
function getSectionInfo(questionNumber) {
    let currentIndex = 0;
    for (const section of jeeMainStructure) {
        if (questionNumber <= currentIndex + section.count) {
            return {
                section: section.section,
                subject: section.subject,
                type: section.type,
                questionInSection: questionNumber - currentIndex
            };
        }
        currentIndex += section.count;
    }
    return null;
}

// Total questions in JEE Main paper
const totalJeeMainQuestions = jeeMainStructure.reduce((sum, section) => sum + section.count, 0);

// Function to get section number based on question number
function getSectionNumber(questionNumber) {
    let currentIndex = 0;
    for (let i = 0; i < jeeMainStructure.length; i++) {
        if (questionNumber <= currentIndex + jeeMainStructure[i].count) {
            return i + 1; // 1-based section number
        }
        currentIndex += jeeMainStructure[i].count;
    }
    return 1;
}