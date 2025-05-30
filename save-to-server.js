// Function to save exam data to server
function saveExamToServer(examData) {
    console.log('Attempting to save exam to server:', examData.id);
    
    // Check if we have an ID
    if (examData.id) {
        // Update existing paper
        return fetch(`/api/papers/${examData.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(examData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('Exam saved to server successfully');
                return { success: true, paper: data.paper };
            } else {
                console.error('Failed to save exam to server:', data.message);
                return { success: false, message: data.message };
            }
        })
        .catch(error => {
            console.error('Error saving exam to server:', error);
            return { success: false, message: 'Connection error' };
        });
    } else {
        // Create new paper
        return fetch('/api/papers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(examData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('New exam created on server:', data.paper);
                // Return the updated paper with server ID
                return { success: true, paper: data.paper };
            } else {
                console.error('Failed to create exam on server:', data.message);
                return { success: false, message: data.message };
            }
        })
        .catch(error => {
            console.error('Error creating exam on server:', error);
            return { success: false, message: 'Connection error' };
        });
    }
}

// Function to save a question to server
function saveQuestionToServer(paperId, question) {
    if (!paperId) {
        console.error('Cannot save question: No paper ID provided');
        return Promise.resolve({ success: false, message: 'No paper ID' });
    }
    
    return fetch(`/api/papers/${paperId}/questions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(question)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log('Question saved to server:', data.questionId);
            return { success: true, questionId: data.questionId };
        } else {
            console.error('Failed to save question to server:', data.message);
            return { success: false, message: data.message };
        }
    })
    .catch(error => {
        console.error('Error saving question to server:', error);
        return { success: false, message: 'Connection error' };
    });
}