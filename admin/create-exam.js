// Function to create a new exam document in Firestore
function createExam(examId, examName) {
    // Validate inputs
    if (!examId || !examName) {
        console.error('Exam ID and name are required');
        return Promise.reject(new Error('Exam ID and name are required'));
    }
    
    // Create exam object
    const exam = {
        id: examId,
        name: examName,
        createdAt: new Date().getTime(),
        status: 'Draft',
        questionCount: 0
    };
    
    // Save to Firestore
    return db.collection('exams').doc(examId).set(exam)
        .then(() => {
            console.log('Exam created successfully:', examId);
            return exam;
        })
        .catch(error => {
            console.error('Error creating exam:', error);
            throw error;
        });
}

// Function to check if an exam exists
function checkExamExists(examId) {
    return db.collection('exams').doc(examId).get()
        .then(doc => {
            return doc.exists;
        })
        .catch(error => {
            console.error('Error checking exam existence:', error);
            throw error;
        });
}

// Function to get exam details
function getExamDetails(examId) {
    return db.collection('exams').doc(examId).get()
        .then(doc => {
            if (doc.exists) {
                return doc.data();
            } else {
                throw new Error('Exam not found');
            }
        })
        .catch(error => {
            console.error('Error getting exam details:', error);
            throw error;
        });
}