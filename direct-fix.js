// Direct fix for the questions not showing up in view-exam.html
const fs = require('fs');
const path = require('path');

// Path to papers.json
const PAPERS_DB_PATH = path.join(__dirname, 'db', 'papers.json');

try {
  // Read the current papers
  const data = fs.readFileSync(PAPERS_DB_PATH, 'utf8');
  let papers = JSON.parse(data);
  
  console.log(`Found ${papers.length} papers in database`);
  
  // Process each paper
  papers.forEach(paper => {
    console.log(`\nProcessing paper: ${paper.name} (ID: ${paper.id})`);
    
    // Ensure questions array exists
    if (!paper.questions) {
      paper.questions = [];
      console.log('- Created questions array');
    }
    
    // Count questions before cleaning
    const beforeCount = paper.questions.length;
    console.log(`- Questions before cleaning: ${beforeCount}`);
    
    // Remove null entries
    paper.questions = paper.questions.filter(q => q !== null);
    console.log(`- Questions after cleaning: ${paper.questions.length}`);
    console.log(`- Removed ${beforeCount - paper.questions.length} null entries`);
    
    // Fix question format if needed
    let fixedQuestions = 0;
    paper.questions.forEach(question => {
      if (!question.type) {
        question.type = 'scq';
        fixedQuestions++;
      }
      
      // Convert old format options to new format
      if (question.options && Array.isArray(question.options) && 
          question.options.length > 0 && typeof question.options[0] === 'string') {
        
        const oldOptions = [...question.options];
        const correctOption = question.correctOption;
        
        question.options = oldOptions.map((text, index) => ({
          text: text,
          correct: index === correctOption
        }));
        
        delete question.correctOption;
        fixedQuestions++;
      }
    });
    
    console.log(`- Fixed format for ${fixedQuestions} questions`);
  });
  
  // Save the fixed papers back to the file
  fs.writeFileSync(PAPERS_DB_PATH, JSON.stringify(papers, null, 2));
  console.log('\nSaved fixed papers to database');
  
  console.log('\nFix complete! Please restart your server and try viewing the exams again.');
  
} catch (error) {
  console.error('Error fixing papers:', error);
}