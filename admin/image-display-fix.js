// Fix for image display issues after capture
document.addEventListener('DOMContentLoaded', function() {
    // Function to ensure image previews display correctly
    function fixImageDisplay() {
        // Fix for question image preview
        const questionImageInput = document.getElementById('question-image');
        if (questionImageInput) {
            questionImageInput.addEventListener('change', function(e) {
                if (this.files && this.files[0]) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        const previewImg = document.getElementById('question-image-preview-img');
                        const previewContainer = document.getElementById('question-image-preview');
                        previewImg.src = e.target.result;
                        previewContainer.style.display = 'block';
                    };
                    reader.readAsDataURL(this.files[0]);
                }
            });
        }

        // Fix for option image previews
        const optionLetters = ['a', 'b', 'c', 'd'];
        optionLetters.forEach(letter => {
            const optionInput = document.getElementById(`option-${letter}-image`);
            if (optionInput) {
                optionInput.addEventListener('change', function(e) {
                    if (this.files && this.files[0]) {
                        const reader = new FileReader();
                        reader.onload = function(e) {
                            const previewImg = document.getElementById(`option-${letter}-image-preview-img`);
                            const previewContainer = document.getElementById(`option-${letter}-image-preview`);
                            previewImg.src = e.target.result;
                            previewContainer.style.display = 'block';
                        };
                        reader.readAsDataURL(this.files[0]);
                    }
                });
            }
        });
    }

    // Fix for captured screenshots
    function fixCapturedImageDisplay() {
        // Override any existing screenshot preview functions
        if (window.useScreenshotForQuestion) {
            const originalFunction = window.useScreenshotForQuestion;
            window.useScreenshotForQuestion = function(imageData) {
                // Call original function
                originalFunction(imageData);
                
                // Ensure the image is displayed
                setTimeout(() => {
                    const previewImg = document.getElementById('question-image-preview-img');
                    const previewContainer = document.getElementById('question-image-preview');
                    if (previewImg && previewContainer) {
                        previewImg.src = imageData;
                        previewContainer.style.display = 'block';
                    }
                }, 100);
            };
        }

        // Fix for option screenshots
        if (window.useScreenshotForOption) {
            const originalFunction = window.useScreenshotForOption;
            window.useScreenshotForOption = function(optionLetter, imageData) {
                // Call original function
                originalFunction(optionLetter, imageData);
                
                // Ensure the image is displayed
                setTimeout(() => {
                    const previewImg = document.getElementById(`option-${optionLetter}-image-preview-img`);
                    const previewContainer = document.getElementById(`option-${optionLetter}-image-preview`);
                    if (previewImg && previewContainer) {
                        previewImg.src = imageData;
                        previewContainer.style.display = 'block';
                    }
                }, 100);
            };
        }
    }

    // Apply both fixes
    fixImageDisplay();
    fixCapturedImageDisplay();
});