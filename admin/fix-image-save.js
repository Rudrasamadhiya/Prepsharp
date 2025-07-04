// Fix image saving to Firebase
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Firebase Storage with proper config
    let storage;
    try {
        if (firebase && firebase.storage) {
            storage = firebase.storage();
            // Test Firebase connection
            storage.ref().child('test').getDownloadURL().catch(() => {
                console.log('Firebase Storage connected but no test file');
            });
        } else {
            console.error('Firebase not initialized');
            return;
        }
    } catch (error) {
        console.error("Firebase Storage error:", error);
        return;
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

                // Set 30-second timeout
                const uploadTimeout = setTimeout(() => {
                    console.error('Upload timeout');
                    saveBtn.disabled = false;
                    saveBtn.innerHTML = '<i class="fas fa-save me-2"></i> Save Question';
                    alert('Image upload timeout. Please try again.');
                    return;
                }, 30000);

                try {
                    // Upload question image
                    if (hasQuestionImage) {
                        console.log('Uploading question image...');
                        const blob = dataURLtoBlob(questionImg.src);
                        const ref = storage.ref(`papers/${examId}/questions/${questionId}/question-image.jpg`);
                        const snapshot = await ref.put(blob, { contentType: 'image/jpeg' });
                        const url = await snapshot.ref.getDownloadURL();
                        questionImg.src = url;
                        console.log('Question image uploaded:', url);
                    }

                    // Upload option images
                    for (const option of optionImages) {
                        console.log(`Uploading option ${option.letter} image...`);
                        const blob = dataURLtoBlob(option.img.src);
                        const ref = storage.ref(`papers/${examId}/questions/${questionId}/option-${option.letter}-image.jpg`);
                        const snapshot = await ref.put(blob, { contentType: 'image/jpeg' });
                        const url = await snapshot.ref.getDownloadURL();
                        option.img.src = url;
                        console.log(`Option ${option.letter} image uploaded:`, url);
                    }

                    clearTimeout(uploadTimeout);
                    console.log('All images uploaded successfully');
                } catch (uploadError) {
                    clearTimeout(uploadTimeout);
                    console.error('Upload failed:', uploadError);
                    alert('Image upload failed: ' + uploadError.message);
                    saveBtn.disabled = false;
                    saveBtn.innerHTML = '<i class="fas fa-save me-2"></i> Save Question';
                    return;
                }

                saveBtn.disabled = false;
                saveBtn.innerHTML = '<i class="fas fa-save me-2"></i> Save Question';
            }
        } catch (error) {
            console.error('Image upload error:', error);
            alert('Error: ' + error.message);
            saveBtn.disabled = false;
            saveBtn.innerHTML = '<i class="fas fa-save me-2"></i> Save Question';
            return;
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