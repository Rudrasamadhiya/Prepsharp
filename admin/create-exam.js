// Simple function to create an exam
function createExam() {
    console.log('createExam function called');
    
    // Get form values
    const name = document.getElementById('new-exam-name').textContent.trim();
    const type = document.getElementById('new-exam-type').value;
    const year = document.getElementById('new-exam-year').value.trim();
    const descriptionElement = document.getElementById('new-exam-description');
    const description = descriptionElement.innerHTML.trim();
    const totalQuestions = document.getElementById('new-exam-total-questions').value;
    
    // Basic validation
    if (!name || !type || !year || !totalQuestions) {
        alert('Please fill in all required fields');
        return;
    }
    
    // Get exam type specific fields
    let examData = {};
    
    if (type === 'jee-main') {
        const day = document.getElementById('new-exam-day').value;
        const month = document.getElementById('new-exam-month').value;
        const shift = document.getElementById('new-exam-shift').value;
        const difficulty = document.getElementById('new-exam-difficulty').value;
        
        if (!day || !month || !shift || !difficulty) {
            alert('Please fill in all JEE Main specific fields');
            return;
        }
        
        examData = { day, month, shift, difficulty };
    } else if (type === 'jee-advanced') {
        const paper = document.getElementById('new-exam-paper').value;
        const difficulty = document.getElementById('new-exam-difficulty-adv').value;
        
        if (!paper || !difficulty) {
            alert('Please fill in all JEE Advanced specific fields');
            return;
        }
        
        examData = { paper, difficulty };
    }
    
    // Disable button and show loading state
    const saveBtn = document.getElementById('save-exam-btn');
    saveBtn.disabled = true;
    saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i> Creating...';
    
    // Create the exam object
    const newExam = {
        name,
        type,
        year,
        description,
        totalQuestions: parseInt(totalQuestions) || 75,
        ...examData,
        status: 'Draft',
        questions: [],
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        createdBy: sessionStorage.getItem('adminEmail') || 'unknown',
        lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
    };
    
    // Use the paper name as the document ID (with special characters removed)
    const docId = name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    
    // Save to Firestore
    db.collection('papers').doc(docId).set(newExam)
        .then(() => {
            console.log('Exam created successfully');
            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('createExamModal'));
            if (modal) modal.hide();
            
            // Redirect to edit page
            window.location.href = `edit-exam.html?id=${docId}`;
        })
        .catch(error => {
            console.error('Error creating exam:', error);
            alert('Error creating exam: ' + error.message);
        })
        .finally(() => {
            saveBtn.disabled = false;
            saveBtn.innerHTML = 'Create Exam';
        });
}