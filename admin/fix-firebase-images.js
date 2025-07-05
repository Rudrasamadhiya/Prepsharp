// Simple Firebase image upload fix
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Firebase Storage
    let storage;
    try {
        if (firebase && firebase.storage) {
            storage = firebase.storage();
        }
    } catch (error) {
        console.error("Firebase Storage not available:", error);
        return;
    }

    // Override the original saveQuestion function
    const originalSaveQuestion = window.saveQuestion;
    window.saveQuestion = function(examId) {
        const questionPreviewImg = document.getElementById('question-image-preview-img');
        const questionPreviewContainer = document.getElementById('question-image-preview');
        
        // Check if question has image
        const hasQuestionImage = questionPreviewImg && 
                                questionPreviewContainer && 
                                questionPreviewContainer.style.display !== 'none' && 
                                questionPreviewImg.src && 
                                questionPreviewImg.src.startsWith('data:');

        if (hasQuestionImage && storage) {
            // Get question number
            const questionNumber = (window.currentQuestionIndex || 0) + 1;
            const questionId = `${examId}-question-${questionNumber}`;
            
            // Convert data URL to blob
            const blob = dataURLtoBlob(questionPreviewImg.src);
            
            // Upload to Firebase Storage
            const storageRef = storage.ref(`papers/${examId}/questions/${questionId}/question-image`);
            
            storageRef.put(blob).then(snapshot => {
                return snapshot.ref.getDownloadURL();
            }).then(downloadURL => {
                // Replace the data URL with Firebase URL
                questionPreviewImg.src = downloadURL;
                
                // Now save the question
                originalSaveQuestion(examId);
            }).catch(error => {
                console.error("Image upload failed:", error);
                // Save anyway without image
                originalSaveQuestion(examId);
            });
        } else {
            // No image or no storage, save normally
            originalSaveQuestion(examId);
        }
    };

    // Helper function
    function dataURLtoBlob(dataURL) {
        const parts = dataURL.split(';base64,');
        const contentType = parts[0].split(':')[1];
        const raw = window.atob(parts[1]);
        const rawLength = raw.length;
        const uInt8Array = new Uint8Array(rawLength);
        
        for (let i = 0; i < rawLength; ++i) {
            uInt8Array[i] = raw.charCodeAt(i);
        }
        
        return new Blob([uInt8Array], { type: contentType });
    }
});