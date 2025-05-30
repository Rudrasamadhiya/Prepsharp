// Fix server script - creates a fixed version of server.js
const fs = require('fs');
const path = require('path');

// Path to server.js
const SERVER_PATH = path.join(__dirname, 'server.js');
const FIXED_SERVER_PATH = path.join(__dirname, 'fixed-server.js');

// Read server.js
let serverCode = fs.readFileSync(SERVER_PATH, 'utf8');

// Fix the update paper endpoint
serverCode = serverCode.replace(
  /\/\/ Update a paper by ID[\s\S]*?app\.put\('\/api\/papers\/:paperId', \(req, res\) => \{[\s\S]*?\}\);/,
  `// Update a paper by ID
app.put('/api/papers/:paperId', (req, res) => {
  const paperId = req.params.paperId;
  const updateData = req.body;
  const papers = getPapers();
  const paperIndex = papers.findIndex(p => p.id === paperId);
  
  if (paperIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Paper not found'
    });
  }
  
  // Clean up questions array - remove null entries
  if (updateData.questions) {
    updateData.questions = updateData.questions.filter(q => q !== null);
    console.log(\`Filtered questions array for paper \${paperId}. Questions count: \${updateData.questions.length}\`);
  }
  
  // Update the paper with new data
  papers[paperIndex] = {
    ...papers[paperIndex],
    ...updateData,
    updatedAt: new Date().toISOString()
  };
  
  savePapers(papers);
  
  res.json({
    success: true,
    message: 'Paper updated successfully',
    paper: papers[paperIndex]
  });
});`
);

// Fix the create paper endpoint
serverCode = serverCode.replace(
  /\/\/ Create new exam paper[\s\S]*?app\.post\('\/api\/papers', \(req, res\) => \{[\s\S]*?\}\);/,
  `// Create new exam paper
app.post('/api/papers', (req, res) => {
  const paperData = req.body;
  
  // Clean up questions array if it exists
  if (paperData.questions) {
    paperData.questions = paperData.questions.filter(q => q !== null);
    console.log(\`Filtered questions for new paper. Questions count: \${paperData.questions.length}\`);
  } else {
    paperData.questions = [];
  }
  
  // Generate paper name based on exam type
  let paperName = '';
  
  if (paperData.type === 'jee-main') {
    // Format: JEE Main - DD/MM SHIFT# YYYY
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthName = monthNames[parseInt(paperData.month) - 1];
    paperName = \`JEE Main - \${paperData.date}/\${monthName} Shift \${paperData.shift} \${paperData.year}\`;
  } else if (paperData.type === 'jee-advanced') {
    // Format: JEE Advanced - Paper # YYYY
    paperName = \`JEE Advanced - Paper \${paperData.paperNumber} \${paperData.year}\`;
  } else {
    // Format: EXAM NAME YYYY
    const examNames = {
      'neet': 'NEET',
      'bitsat': 'BITSAT',
      'aiims': 'AIIMS'
    };
    const examName = examNames[paperData.type] || paperData.type.toUpperCase();
    paperName = \`\${examName} \${paperData.year}\`;
  }
  
  // Add unique ID and created timestamp
  const paper = {
    ...paperData,
    id: Date.now().toString(),
    name: paperName,
    createdAt: new Date().toISOString()
  };
  
  console.log(\`Creating new paper: \${paperName}\`);
  
  // Save to database
  const papers = getPapers();
  papers.push(paper);
  savePapers(papers);
  
  res.json({ 
    success: true, 
    message: 'Paper created successfully',
    paper: paper
  });
});`
);

// Fix the add question endpoint
serverCode = serverCode.replace(
  /\/\/ Add question to paper[\s\S]*?app\.post\('\/api\/papers\/:paperId\/questions', \(req, res\) => \{[\s\S]*?\}\);/,
  `// Add question to paper
app.post('/api/papers/:paperId/questions', (req, res) => {
  const paperId = req.params.paperId;
  const questionData = req.body;
  const papers = getPapers();
  const paperIndex = papers.findIndex(p => p.id === paperId);
  
  if (paperIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Paper not found'
    });
  }
  
  // Add question ID if not provided
  if (!questionData.id) {
    questionData.id = Date.now().toString();
  }
  
  // Initialize questions array if it doesn't exist
  if (!papers[paperIndex].questions) {
    papers[paperIndex].questions = [];
    console.log(\`Initialized questions array for paper \${paperId}\`);
  }
  
  // Add question to paper
  papers[paperIndex].questions.push(questionData);
  
  // Log for debugging
  console.log(\`Added question to paper \${paperId}. Total questions: \${papers[paperIndex].questions.length}\`);
  
  savePapers(papers);
  
  res.json({
    success: true,
    message: 'Question added successfully',
    questionId: questionData.id,
    paperName: papers[paperIndex].name,
    totalQuestions: papers[paperIndex].questions.length
  });
});`
);

// Write the fixed server.js
fs.writeFileSync(FIXED_SERVER_PATH, serverCode);
console.log(`Fixed server code written to ${FIXED_SERVER_PATH}`);
console.log('To use the fixed server, run: node fixed-server.js');