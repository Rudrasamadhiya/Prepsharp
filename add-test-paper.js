// Add a test paper with questions to verify the fix
const fs = require('fs');
const path = require('path');

// Path to papers.json
const PAPERS_DB_PATH = path.join(__dirname, 'db', 'papers.json');

try {
  // Read the current papers
  const data = fs.readFileSync(PAPERS_DB_PATH, 'utf8');
  let papers = JSON.parse(data);
  
  // Create a new test paper
  const testPaper = {
    "id": "test" + Date.now(),
    "type": "jee-main",
    "name": "JEE Main - 9/Jan Shift 2 2023",
    "year": "2023",
    "date": "9",
    "month": "1",
    "shift": "2",
    "subjects": ["physics", "chemistry", "mathematics"],
    "totalQuestions": 3,
    "subjectDetails": {
      "physics": { "questionCount": 1 },
      "chemistry": { "questionCount": 1 },
      "mathematics": { "questionCount": 1 }
    },
    "createdAt": new Date().toISOString(),
    "questions": [
      {
        "id": "test1",
        "type": "scq",
        "subject": "physics",
        "text": "A test physics question",
        "options": [
          { "text": "Option A", "correct": false },
          { "text": "Option B", "correct": true },
          { "text": "Option C", "correct": false },
          { "text": "Option D", "correct": false }
        ]
      },
      {
        "id": "test2",
        "type": "scq",
        "subject": "chemistry",
        "text": "A test chemistry question",
        "options": [
          { "text": "Option A", "correct": false },
          { "text": "Option B", "correct": false },
          { "text": "Option C", "correct": true },
          { "text": "Option D", "correct": false }
        ]
      },
      {
        "id": "test3",
        "type": "scq",
        "subject": "mathematics",
        "text": "A test mathematics question",
        "options": [
          { "text": "Option A", "correct": true },
          { "text": "Option B", "correct": false },
          { "text": "Option C", "correct": false },
          { "text": "Option D", "correct": false }
        ]
      }
    ]
  };
  
  // Add the test paper
  papers.push(testPaper);
  
  // Save the papers back to the file
  fs.writeFileSync(PAPERS_DB_PATH, JSON.stringify(papers, null, 2));
  console.log('Added test paper with ID:', testPaper.id);
  console.log('Paper name:', testPaper.name);
  console.log('Questions added:', testPaper.questions.length);
  
} catch (error) {
  console.error('Error adding test paper:', error);
}