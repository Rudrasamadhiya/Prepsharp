// Paper utilities for consistent access across all pages

// Function to check if a paper exists
function checkPaperExists(paperId) {
    return db.collection('papers').doc(paperId).get()
        .then(doc => {
            return doc.exists;
        })
        .catch(error => {
            console.error('Error checking paper existence:', error);
            return false;
        });
}

// Function to get paper details
function getPaperDetails(paperId) {
    return db.collection('papers').doc(paperId).get()
        .then(doc => {
            if (doc.exists) {
                return doc.data();
            } else {
                throw new Error('Paper not found');
            }
        });
}

// Function to get paper questions
function getPaperQuestions(paperId) {
    return db.collection('papers').doc(paperId).collection('questions').get()
        .then(snapshot => {
            const questions = [];
            snapshot.forEach(doc => {
                questions.push(doc.data());
            });
            return questions;
        });
}

// Function to save question to paper
function saveQuestionToPaper(paperId, question, questionId) {
    return db.collection('papers').doc(paperId).collection('questions').doc(questionId).set(question);
}

// Function to update question count
function updatePaperQuestionCount(paperId) {
    return getPaperQuestions(paperId)
        .then(questions => {
            return db.collection('papers').doc(paperId).update({
                questionCount: questions.length
            });
        });
}