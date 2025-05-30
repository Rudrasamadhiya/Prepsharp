// Direct fix for view-exam.html
const fs = require('fs');
const path = require('path');

// Path to view-exam.html
const VIEW_EXAM_PATH = path.join(__dirname, 'view-exam.html');

try {
  // Read the current file
  let content = fs.readFileSync(VIEW_EXAM_PATH, 'utf8');
  
  // Fix the displayQuestions function
  content = content.replace(
    /function displayQuestions\(exam\) \{[\s\S]*?if \(!exam\.questions \|\| exam\.questions\.length === 0\) \{[\s\S]*?noQuestionsMessage\.style\.display = 'block';[\s\S]*?return;[\s\S]*?\}/,
    `function displayQuestions(exam) {
            const questionList = document.getElementById('question-list');
            const noQuestionsMessage = document.getElementById('no-questions-message');
            
            // Filter out null questions and check if there are any valid questions
            const validQuestions = exam.questions ? exam.questions.filter(q => q !== null) : [];
            console.log('Valid questions:', validQuestions.length);
            
            if (!validQuestions || validQuestions.length === 0) {
                questionList.innerHTML = '';
                noQuestionsMessage.style.display = 'block';
                return;
            }`
  );
  
  // Fix the questions iteration
  content = content.replace(
    /exam\.questions\.forEach\(\(question, index\) => \{/g,
    `validQuestions.forEach((question, index) => {`
  );
  
  // Fix the question count display
  content = content.replace(
    /addInfoItem\(examInfo, 'Questions Added', exam\.questions \? exam\.questions\.length : 0\);/,
    `addInfoItem(examInfo, 'Questions Added', exam.questions ? exam.questions.filter(q => q !== null).length : 0);`
  );
  
  // Fix the subject question count
  content = content.replace(
    /let questionCount = 0;[\s\S]*?if \(exam\.questions\) \{[\s\S]*?questionCount = exam\.questions\.filter\(q => q\.subject === subject\)\.length;[\s\S]*?\}/,
    `let questionCount = 0;
                    if (exam.questions) {
                        questionCount = exam.questions.filter(q => q && q.subject === subject).length;
                    }`
  );
  
  // Fix the options display
  content = content.replace(
    /\['A', 'B', 'C', 'D'\]\.forEach\(\(optionLabel, optionIndex\) => \{[\s\S]*?const option = document\.createElement\('div'\);[\s\S]*?option\.className = 'option';[\s\S]*?if \(question\.correctOption === optionIndex\) \{[\s\S]*?option\.classList\.add\('correct'\);[\s\S]*?\}[\s\S]*?option\.textContent = `\${optionLabel}: \${question\.options\[optionIndex\]}`;[\s\S]*?options\.appendChild\(option\);[\s\S]*?\}\);/,
    `// Handle different question types
                if (question.type === 'scq' || question.type === 'mcq') {
                    // For multiple choice questions
                    question.options.forEach((option, optionIndex) => {
                        const optionDiv = document.createElement('div');
                        optionDiv.className = 'option';
                        
                        if (option.correct) {
                            optionDiv.classList.add('correct');
                        }
                        
                        const optionLabel = String.fromCharCode(65 + optionIndex); // A, B, C, D
                        optionDiv.textContent = \`\${optionLabel}: \${option.text || ''}\`;
                        options.appendChild(optionDiv);
                    });
                } else if (question.type === 'integer') {
                    // For integer type questions
                    const answerDiv = document.createElement('div');
                    answerDiv.className = 'option correct';
                    answerDiv.textContent = \`Answer: \${question.answer}\`;
                    options.appendChild(answerDiv);
                }`
  );
  
  // Write the fixed file
  fs.writeFileSync(VIEW_EXAM_PATH, content);
  console.log('Fixed view-exam.html successfully');
  
} catch (error) {
  console.error('Error fixing view-exam.html:', error);
}