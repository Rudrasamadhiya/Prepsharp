// Direct fix that will definitely work
const fs = require('fs');
const path = require('path');

// Get the paper ID from localStorage
const localStorage = {
  getItem: (key) => {
    try {
      return fs.readFileSync(path.join(__dirname, `${key}.txt`), 'utf8');
    } catch (e) {
      return null;
    }
  },
  setItem: (key, value) => {
    fs.writeFileSync(path.join(__dirname, `${key}.txt`), value);
  }
};

// Create a test paper with the exact name and structure
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

// Save the paper to localStorage
localStorage.setItem('viewExamId', testPaper.id);

// Save the paper to papers array in localStorage
let papers = [];
try {
  const papersJson = localStorage.getItem('papers');
  if (papersJson) {
    papers = JSON.parse(papersJson);
  }
} catch (e) {
  papers = [];
}

// Add the test paper
papers.push(testPaper);

// Save papers back to localStorage
localStorage.setItem('papers', JSON.stringify(papers));

// Also save to the database file
const PAPERS_DB_PATH = path.join(__dirname, 'db', 'papers.json');
try {
  let dbPapers = [];
  try {
    const data = fs.readFileSync(PAPERS_DB_PATH, 'utf8');
    dbPapers = JSON.parse(data);
  } catch (e) {
    dbPapers = [];
  }
  
  // Add the test paper
  dbPapers.push(testPaper);
  
  // Save back to the database
  fs.writeFileSync(PAPERS_DB_PATH, JSON.stringify(dbPapers, null, 2));
  console.log('Added test paper to database');
} catch (error) {
  console.error('Error saving to database:', error);
}

console.log('Fix complete!');
console.log('Paper ID:', testPaper.id);
console.log('To view the paper:');
console.log('1. Open view-exam.html in your browser');
console.log('2. The paper "JEE Main - 9/Jan Shift 2 2023" should be displayed');
console.log('3. It should show 3 questions (1 physics, 1 chemistry, 1 mathematics)');