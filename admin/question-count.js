// Function to update question counts for all exams
function updateQuestionCounts() {
    // Get all papers from Firestore
    db.collection('papers').get().then(snapshot => {
        snapshot.forEach(doc => {
            const examId = doc.id;
            
            // Get questions subcollection for each paper
            db.collection('papers').doc(examId).collection('questions').get().then(questionSnapshot => {
                const count = questionSnapshot.size;
                
                // Update count in the UI
                document.querySelectorAll(`[data-exam-id="${examId}"] .question-count`).forEach(el => {
                    el.textContent = count;
                });
            }).catch(error => {
                console.error("Error getting questions:", error);
            });
        });
    }).catch(error => {
        console.error("Error getting papers:", error);
    });
}

// Function to update question count for a specific exam
function updateExamQuestionCount(examId) {
    db.collection('papers').doc(examId).collection('questions').get().then(snapshot => {
        const count = snapshot.size;
        document.querySelectorAll(`[data-exam-id="${examId}"] .question-count`).forEach(el => {
            el.textContent = count;
        });
    }).catch(error => {
        console.error("Error getting questions for exam:", error);
    });
}