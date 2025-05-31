// Function to add a question directly to a paper
function addQuestionToPaper(paperId, questionData) {
  // Get papers from localStorage or create empty array
  let papers = JSON.parse(localStorage.getItem('papers') || '[]');
  
  // Find the paper
  const paperIndex = papers.findIndex(p => p.id === paperId);
  
  if (paperIndex === -1) {
    console.error('Paper not found:', paperId);
    return false;
  }
  
  // Initialize questions array if it doesn't exist
  if (!papers[paperIndex].questions) {
    papers[paperIndex].questions = [];
  }
  
  // Add question ID if not provided
  if (!questionData.id) {
    questionData.id = Date.now().toString();
  }
  
  // Add question to paper
  papers[paperIndex].questions.push(questionData);
  
  // Save back to localStorage
  localStorage.setItem('papers', JSON.stringify(papers));
  
  console.log(`Added question to paper ${paperId}. Total questions: ${papers[paperIndex].questions.length}`);
  return true;
}

// Example usage:
// addQuestionToPaper('1007', {
//   type: 'scq',
//   text: 'What is the value of g on Earth?',
//   subject: 'physics',
//   options: [
//     { text: '9.8 m/s²', correct: true },
//     { text: '10 m/s²', correct: false },
//     { text: '8.9 m/s²', correct: false },
//     { text: '9.1 m/s²', correct: false }
//   ]
// });