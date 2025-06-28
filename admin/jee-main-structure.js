// JEE Main paper structure
const jeeMainStructure = [];

// Physics Section 1 (MCQ) - 20 questions
for (let i = 0; i < 20; i++) {
    jeeMainStructure.push({ subject: 'Physics', type: 'mcq-single', section: 'Physics - Section 1 (MCQ)' });
}

// Physics Section 2 (Numerical) - 5 questions
for (let i = 0; i < 5; i++) {
    jeeMainStructure.push({ subject: 'Physics', type: 'numerical', section: 'Physics - Section 2 (Numerical)' });
}

// Chemistry Section 1 (MCQ) - 20 questions
for (let i = 0; i < 20; i++) {
    jeeMainStructure.push({ subject: 'Chemistry', type: 'mcq-single', section: 'Chemistry - Section 1 (MCQ)' });
}

// Chemistry Section 2 (Numerical) - 5 questions
for (let i = 0; i < 5; i++) {
    jeeMainStructure.push({ subject: 'Chemistry', type: 'numerical', section: 'Chemistry - Section 2 (Numerical)' });
}

// Mathematics Section 1 (MCQ) - 20 questions
for (let i = 0; i < 20; i++) {
    jeeMainStructure.push({ subject: 'Mathematics', type: 'mcq-single', section: 'Mathematics - Section 1 (MCQ)' });
}

// Mathematics Section 2 (Numerical) - 5 questions
for (let i = 0; i < 5; i++) {
    jeeMainStructure.push({ subject: 'Mathematics', type: 'numerical', section: 'Mathematics - Section 2 (Numerical)' });
}