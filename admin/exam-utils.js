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

// Function to validate paper on page load
function validatePaper(paperId) {
    if (!db) {
        console.warn('Firebase not initialized');
        document.getElementById('loading-container').style.display = 'none';
        document.getElementById('add-question-form').style.display = 'block';
        return;
    }
    
    checkPaperExists(paperId)
        .then(exists => {
            if (!exists) {
                alert('This paper does not exist in the database. Redirecting to papers page.');
                window.location.href = 'collaborate-exams.html';
            } else {
                console.log('Paper exists, loading page...');
                document.getElementById('loading-container').style.display = 'none';
                document.getElementById('add-question-form').style.display = 'block';
            }
        });
}