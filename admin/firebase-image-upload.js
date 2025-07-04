// Firebase image upload functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get exam ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const examId = urlParams.get('examId') || 'default-exam';
    
    // Reference to Firebase Storage
    let storage;
    try {
        if (firebase && firebase.storage) {
            storage = firebase.storage();
            console.log("Firebase Storage connection established");
        }
    } catch (error) {
        console.error("Firebase Storage not available:", error);
    }
    
    // Override saveQuestion to upload images first
    if (typeof saveQuestion === 'function' && storage) {
        const originalSaveQuestion = saveQuestion;
        window.saveQuestion = function(examId) {
            // Check if we have images to upload
            const questionPreviewImg = document.getElementById('question-image-preview-img');
            const questionPreviewContainer = document.getElementById('question-image-preview');
            const hasQuestionImage = questionPreviewImg && questionPreviewContainer && 
                                    questionPreviewContainer.style.display !== 'none' && 
                                    questionPreviewImg.src && 
                                    questionPreviewImg.src.startsWith('data:');
            
            // Check for option images
            const optionImages = [];
            const optionLetters = ['a', 'b', 'c', 'd'];
            
            optionLetters.forEach(letter => {
                const optionPreviewImg = document.getElementById(`option-${letter}-image-preview-img`);
                const optionPreviewContainer = document.getElementById(`option-${letter}-image-preview`);
                
                if (optionPreviewImg && optionPreviewContainer && 
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
                
                // Get current question number (1-based)
                const questionNumber = (window.currentQuestionIndex || 0) + 1;
                
                // Create question ID in the format: examId-question-questionNumber
                const questionId = `${examId}-question-${questionNumber}`;
                
                // Upload question image if exists
                let questionImagePromise = Promise.resolve(null);
                if (hasQuestionImage) {
                    questionImagePromise = uploadImage(questionPreviewImg.src, 
                                                      `papers/${examId}/questions/${questionId}/question-image`);
                }
                
                // Upload option images if exist
                const optionImagePromises = optionImages.map(option => {
                    return uploadImage(option.img.src, 
                                      `papers/${examId}/questions/${questionId}/option-${option.letter}-image`);
                });
                
                // Update save button to show progress
                if (saveBtn) {
                    saveBtn.innerHTML = '<i class="fas fa-cloud-upload-alt me-2"></i> Uploading Images...';
                }
                
                // Set a shorter timeout to prevent hanging forever
                const uploadTimeout = setTimeout(() => {
                    console.error("Image upload timeout");
                    
                    // Re-enable save button and proceed with save
                    if (saveBtn) {
                        saveBtn.disabled = false;
                        saveBtn.innerHTML = '<i class="fas fa-save me-2"></i> Save Question';
                    }
                    originalSaveQuestion(examId);
                }, 10000); // 10 second timeout
                
                // Wait for all uploads to complete
                Promise.all([questionImagePromise, ...optionImagePromises])
                    .then(results => {
                        // Clear the timeout since uploads completed
                        clearTimeout(uploadTimeout);
                        
                        // First result is question image URL
                        const questionImageUrl = results[0];
                        
                        // Remaining results are option image URLs
                        const optionImageUrls = results.slice(1);
                        
                        // Replace data URLs with Firebase Storage URLs
                        if (questionImageUrl) {
                            questionPreviewImg.src = questionImageUrl;
                        }
                        
                        optionImages.forEach((option, index) => {
                            if (optionImageUrls[index]) {
                                option.img.src = optionImageUrls[index];
                            }
                        });
                        
                        // Now save the question with image URLs
                        originalSaveQuestion(examId);
                    })
                    .catch(error => {
                        // Clear the timeout since we got an error response
                        clearTimeout(uploadTimeout);
                        
                        console.error("Error uploading images:", error);
                        alert("Error uploading images. Proceeding with save without images.");
                        
                        // Re-enable save button and proceed with save anyway
                        if (saveBtn) {
                            saveBtn.disabled = false;
                            saveBtn.innerHTML = '<i class="fas fa-save me-2"></i> Save Question';
                        }
                        originalSaveQuestion(examId);
                    });
            } else {
                // No images to upload, proceed with normal save
                return originalSaveQuestion(examId);
            }
        };
    }
    
    // Function to upload an image to Firebase Storage with optimizations
    function uploadImage(dataUrl, path) {
        return new Promise((resolve, reject) => {
            // Skip upload if dataUrl is not a data URL
            if (!dataUrl || !dataUrl.startsWith('data:')) {
                resolve(dataUrl); // Return the original URL
                return;
            }
            
            // Optimize image before upload
            const optimizedDataUrl = optimizeImage(dataUrl);
            
            // Convert data URL to blob
            const blob = dataURLtoBlob(optimizedDataUrl);
            
            // Create a storage reference
            const storageRef = storage.ref().child(path);
            
            // Set metadata for caching
            const metadata = {
                contentType: blob.type,
                cacheControl: 'public,max-age=31536000' // 1 year cache
            };
            
            // Upload the blob with optimized settings
            const uploadTask = storageRef.put(blob, metadata);
            
            // Monitor upload progress
            uploadTask.on('state_changed', 
                (snapshot) => {
                    // Update progress if needed
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload progress: ' + progress.toFixed(2) + '%');
                }, 
                (error) => {
                    // Handle error
                    console.error("Upload failed:", error);
                    reject(error);
                }, 
                () => {
                    // Upload completed successfully
                    uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                        resolve(downloadURL);
                    });
                }
            );
        });
    }
    
    // Function to optimize image before upload
    function optimizeImage(dataUrl) {
        // For small images, return as is
        if (dataUrl.length < 100000) { // Less than ~100KB
            return dataUrl;
        }
        
        try {
            // Create an image element
            const img = document.createElement('img');
            img.src = dataUrl;
            
            // Create a canvas to resize the image
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // Set max dimensions
            const maxWidth = 1200;
            const maxHeight = 1200;
            
            // Calculate new dimensions
            let width = img.width;
            let height = img.height;
            
            if (width > height) {
                if (width > maxWidth) {
                    height *= maxWidth / width;
                    width = maxWidth;
                }
            } else {
                if (height > maxHeight) {
                    width *= maxHeight / height;
                    height = maxHeight;
                }
            }
            
            // Set canvas dimensions
            canvas.width = width;
            canvas.height = height;
            
            // Draw image on canvas
            ctx.drawImage(img, 0, 0, width, height);
            
            // Get optimized data URL with reduced quality
            return canvas.toDataURL('image/jpeg', 0.8);
        } catch (e) {
            console.error('Image optimization failed:', e);
            return dataUrl; // Return original if optimization fails
        }
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