// Direct image saving implementation
document.addEventListener('DOMContentLoaded', function() {
    // Override saveQuestion to handle image uploads directly
    if (typeof saveQuestion === 'function') {
        const originalSaveQuestion = saveQuestion;
        window.saveQuestion = function(examId) {
            // Get current question number
            const questionNumber = (window.currentQuestionIndex || 0) + 1;
            
            // Create question ID
            const questionId = `${examId}-question-${questionNumber}`;
            
            // Check for question image
            const questionPreviewImg = document.getElementById('question-image-preview-img');
            const questionPreviewContainer = document.getElementById('question-image-preview');
            const hasQuestionImage = questionPreviewImg && 
                                    questionPreviewContainer && 
                                    questionPreviewContainer.style.display !== 'none' && 
                                    questionPreviewImg.src && 
                                    questionPreviewImg.src.startsWith('data:');
            
            // Check for option images
            const optionImages = [];
            const optionLetters = ['a', 'b', 'c', 'd'];
            
            optionLetters.forEach(letter => {
                const optionPreviewImg = document.getElementById(`option-${letter}-image-preview-img`);
                const optionPreviewContainer = document.getElementById(`option-${letter}-image-preview`);
                
                if (optionPreviewImg && 
                    optionPreviewContainer && 
                    optionPreviewContainer.style.display !== 'none' && 
                    optionPreviewImg.src && 
                    optionPreviewImg.src.startsWith('data:')) {
                    
                    optionImages.push({
                        letter: letter,
                        img: optionPreviewImg
                    });
                }
            });
            
            // If we have images, upload them first
            if (hasQuestionImage || optionImages.length > 0) {
                // Disable save button
                const saveBtn = document.getElementById('save-question-btn');
                if (saveBtn) {
                    saveBtn.disabled = true;
                    saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i> Uploading Images...';
                }
                
                // Initialize Firebase Storage if not already done
                let storage;
                try {
                    if (firebase && firebase.storage) {
                        storage = firebase.storage();
                    } else {
                        console.error("Firebase Storage not available");
                        originalSaveQuestion(examId);
                        return;
                    }
                } catch (error) {
                    console.error("Firebase error:", error);
                    originalSaveQuestion(examId);
                    return;
                }
                
                // Upload question image
                if (hasQuestionImage) {
                    const dataUrl = questionPreviewImg.src;
                    const blob = dataURLtoBlob(dataUrl);
                    const storageRef = storage.ref().child(`papers/${examId}/questions/${questionId}/question-image`);
                    
                    storageRef.put(blob)
                        .then(snapshot => snapshot.ref.getDownloadURL())
                        .then(downloadURL => {
                            // Set the image URL
                            questionPreviewImg.src = downloadURL;
                            
                            // Check if all uploads are done
                            if (optionImages.length === 0) {
                                // Re-enable save button
                                if (saveBtn) {
                                    saveBtn.disabled = false;
                                    saveBtn.innerHTML = '<i class="fas fa-save me-2"></i> Save Question';
                                }
                                
                                // Save the question
                                originalSaveQuestion(examId);
                            }
                        })
                        .catch(error => {
                            console.error("Error uploading question image:", error);
                            
                            // Re-enable save button
                            if (saveBtn) {
                                saveBtn.disabled = false;
                                saveBtn.innerHTML = '<i class="fas fa-save me-2"></i> Save Question';
                            }
                            
                            // Save anyway
                            originalSaveQuestion(examId);
                        });
                }
                
                // Upload option images
                let uploadedCount = 0;
                optionImages.forEach(option => {
                    const dataUrl = option.img.src;
                    const blob = dataURLtoBlob(dataUrl);
                    const storageRef = storage.ref().child(`papers/${examId}/questions/${questionId}/option-${option.letter}-image`);
                    
                    storageRef.put(blob)
                        .then(snapshot => snapshot.ref.getDownloadURL())
                        .then(downloadURL => {
                            // Set the image URL
                            option.img.src = downloadURL;
                            
                            // Increment counter
                            uploadedCount++;
                            
                            // Check if all uploads are done
                            if (uploadedCount === optionImages.length && !hasQuestionImage) {
                                // Re-enable save button
                                if (saveBtn) {
                                    saveBtn.disabled = false;
                                    saveBtn.innerHTML = '<i class="fas fa-save me-2"></i> Save Question';
                                }
                                
                                // Save the question
                                originalSaveQuestion(examId);
                            }
                        })
                        .catch(error => {
                            console.error(`Error uploading option ${option.letter} image:`, error);
                            
                            // Increment counter
                            uploadedCount++;
                            
                            // Check if all uploads are done
                            if (uploadedCount === optionImages.length && !hasQuestionImage) {
                                // Re-enable save button
                                if (saveBtn) {
                                    saveBtn.disabled = false;
                                    saveBtn.innerHTML = '<i class="fas fa-save me-2"></i> Save Question';
                                }
                                
                                // Save anyway
                                originalSaveQuestion(examId);
                            }
                        });
                });
                
                // If no images to upload, just save
                if (!hasQuestionImage && optionImages.length === 0) {
                    originalSaveQuestion(examId);
                }
            } else {
                // No images to upload, just save
                originalSaveQuestion(examId);
            }
        };
    }
    
    // Helper function to convert data URL to Blob
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