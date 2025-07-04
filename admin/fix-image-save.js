// Fix image saving to Firebase
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Firebase Storage
    let storage;
    try {
        if (firebase && firebase.storage) {
            storage = firebase.storage();
        }
    } catch (error) {
        console.error("Firebase Storage not available:", error);
    }

    // Override the saveQuestion function to handle images
    const originalSaveQuestion = window.saveQuestion;
    window.saveQuestion = async function(examId) {
        if (!storage) {
            return originalSaveQuestion(examId);
        }

        const saveBtn = document.getElementById('save-question-btn');
        
        try {
            // Check for images
            const questionImg = document.getElementById('question-image-preview-img');
            const hasQuestionImage = questionImg && questionImg.src && questionImg.src.startsWith('data:');
            
            const optionImages = [];
            ['a', 'b', 'c', 'd'].forEach(letter => {
                const img = document.getElementById(`option-${letter}-image-preview-img`);
                if (img && img.src && img.src.startsWith('data:')) {
                    optionImages.push({ letter, img });
                }
            });

            if (hasQuestionImage || optionImages.length > 0) {
                saveBtn.disabled = true;
                saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i> Uploading Images...';

                const questionNumber = (window.currentQuestionIndex || 0) + 1;
                const questionId = `${examId}-question-${questionNumber}`;

                // Upload question image
                if (hasQuestionImage) {
                    const blob = dataURLtoBlob(questionImg.src);
                    const ref = storage.ref(`papers/${examId}/questions/${questionId}/question-image`);
                    const snapshot = await ref.put(blob);
                    const url = await snapshot.ref.getDownloadURL();
                    questionImg.src = url;
                }

                // Upload option images
                for (const option of optionImages) {
                    const blob = dataURLtoBlob(option.img.src);
                    const ref = storage.ref(`papers/${examId}/questions/${questionId}/option-${option.letter}-image`);
                    const snapshot = await ref.put(blob);
                    const url = await snapshot.ref.getDownloadURL();
                    option.img.src = url;
                }

                saveBtn.disabled = false;
                saveBtn.innerHTML = '<i class="fas fa-save me-2"></i> Save Question';
            }
        } catch (error) {
            console.error('Image upload error:', error);
            saveBtn.disabled = false;
            saveBtn.innerHTML = '<i class="fas fa-save me-2"></i> Save Question';
        }

        return originalSaveQuestion(examId);
    };

    function dataURLtoBlob(dataURL) {
        const parts = dataURL.split(';base64,');
        const contentType = parts[0].split(':')[1];
        const raw = window.atob(parts[1]);
        const uInt8Array = new Uint8Array(raw.length);
        
        for (let i = 0; i < raw.length; i++) {
            uInt8Array[i] = raw.charCodeAt(i);
        }
        
        return new Blob([uInt8Array], { type: contentType });
    }
});