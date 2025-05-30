// Fix questions script
const fs = require('fs');
const path = require('path');

// Path to papers.json
const PAPERS_DB_PATH = path.join(__dirname, 'db', 'papers.json');

// Read papers from database
function getPapers() {
  try {
    const data = fs.readFileSync(PAPERS_DB_PATH, 'utf8');
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading papers database:', error);
    return [];
  }
}

// Save papers to database
function savePapers(papers) {
  try {
    fs.writeFileSync(PAPERS_DB_PATH, JSON.stringify(papers, null, 2));
    console.log('Papers saved successfully');
  } catch (error) {
    console.error('Error saving papers database:', error);
  }
}

// Fix papers
function fixPapers() {
  const papers = getPapers();
  let modified = false;
  
  papers.forEach(paper => {
    // Fix questions array
    if (!paper.questions) {
      paper.questions = [];
      modified = true;
      console.log(`Created questions array for paper: ${paper.name}`);
    }
    
    // Filter out null questions
    const originalLength = paper.questions.length;
    paper.questions = paper.questions.filter(q => q !== null);
    
    if (paper.questions.length !== originalLength) {
      modified = true;
      console.log(`Removed ${originalLength - paper.questions.length} null questions from paper: ${paper.name}`);
    }
    
    // Fix question format if needed
    paper.questions.forEach(question => {
      // Convert old format to new format if needed
      if (question.options && Array.isArray(question.options) && typeof question.options[0] === 'string') {
        const oldOptions = [...question.options];
        const correctOption = question.correctOption;
        
        question.options = oldOptions.map((text, index) => ({
          text: text,
          correct: index === correctOption
        }));
        
        question.type = 'scq';
        delete question.correctOption;
        
        modified = true;
        console.log(`Fixed question format for question: ${question.id}`);
      }
    });
  });
  
  if (modified) {
    savePapers(papers);
    console.log('Papers database updated');
  } else {
    console.log('No changes needed');
  }
}

// Run the fix
fixPapers();