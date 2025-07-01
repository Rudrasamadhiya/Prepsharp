// Function to create a new exam from the modal form
function createExam() {
    const examType = document.getElementById('new-exam-type').value;
    const examYear = document.getElementById('new-exam-year').value;
    const examName = document.getElementById('new-exam-name').textContent;
    const totalQuestions = document.getElementById('new-exam-total-questions').value;
    const description = document.getElementById('new-exam-description').innerHTML;
    
    // Validate required fields
    if (!examType || !examYear || !examName) {
        alert('Please fill in all required fields');
        return;
    }
    
    // Get admin info
    const adminEmail = sessionStorage.getItem('adminEmail') || 'admin@prepsharp.com';
    const adminName = sessionStorage.getItem('adminName') || 'Admin';
    
    // Generate paper ID
    let paperId = '';
    if (examType === 'jee-main') {
        const day = document.getElementById('new-exam-day').value;
        const month = document.getElementById('new-exam-month').value.toLowerCase();
        const shift = document.getElementById('new-exam-shift').value.toLowerCase().replace(' ', '-');
        paperId = `jee-main---${day}-${month}-${shift}-${examYear}`;
    } else if (examType === 'jee-advanced') {
        const paper = document.getElementById('new-exam-paper').value.toLowerCase().replace(' ', '-');
        paperId = `jee-advanced---${paper}-${examYear}`;
    } else if (examType === 'neet') {
        paperId = `neet---${examYear}`;
    } else if (examType === 'mock-test') {
        paperId = `mock-test---${examYear}-${Date.now()}`;
    }
    
    // Create exam object
    const exam = {
        id: paperId,
        name: examName,
        type: examType === 'jee-main' ? 'JEE Main' : 
              examType === 'jee-advanced' ? 'JEE Advanced' : 
              examType === 'neet' ? 'NEET' : 'Mock Test',
        year: examYear,
        status: 'Draft',
        totalQuestions: parseInt(totalQuestions),
        description: description,
        questions: [],
        createdBy: adminEmail,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };
    
    // Add type-specific fields
    if (examType === 'jee-main') {
        const day = document.getElementById('new-exam-day').value;
        const month = document.getElementById('new-exam-month').value;
        const shift = document.getElementById('new-exam-shift').value;
        const difficulty = document.getElementById('new-exam-difficulty').value;
        
        if (day) exam.day = day;
        if (month) exam.month = month;
        if (shift) exam.shift = shift;
        if (difficulty) exam.difficulty = difficulty;
    } else if (examType === 'jee-advanced') {
        const paper = document.getElementById('new-exam-paper').value;
        const difficulty = document.getElementById('new-exam-difficulty-adv').value;
        
        if (paper) exam.paper = paper;
        if (difficulty) exam.difficulty = difficulty;
    }
    
    // Show loading state
    const saveBtn = document.getElementById('save-exam-btn');
    const originalText = saveBtn.textContent;
    saveBtn.disabled = true;
    saveBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Creating...';
    
    // Save to Firestore
    db.collection('papers').doc(paperId).set(exam)
        .then(() => {
            console.log('Exam created successfully:', paperId);
            
            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('createExamModal'));
            modal.hide();
            
            // Reset form
            document.getElementById('create-exam-form').reset();
            document.getElementById('new-exam-name').textContent = '';
            document.getElementById('new-exam-description').innerHTML = '';
            
            // Refresh the exam list
            if (document.getElementById('all-papers').classList.contains('active')) {
                loadExams();
            } else {
                loadMyExams();
            }
            
            // Show success message
            alert('Exam created successfully!');
        })
        .catch(error => {
            console.error('Error creating exam:', error);
            alert('Error creating exam. Please try again.');
        })
        .finally(() => {
            // Reset button state
            saveBtn.disabled = false;
            saveBtn.textContent = originalText;
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