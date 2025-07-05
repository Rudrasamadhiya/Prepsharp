// Fix image display after capture/paste
document.addEventListener('DOMContentLoaded', function() {
    // Override the use-for-question button functionality
    const useQuestionBtn = document.getElementById('use-for-question-btn');
    if (useQuestionBtn) {
        useQuestionBtn.addEventListener('click', function() {
            const imageData = document.getElementById('screenshot-preview').src;
            
            if (imageData && currentCaptureTarget === 'question') {
                const questionPreviewImg = document.getElementById('question-image-preview-img');
                const questionPreviewContainer = document.getElementById('question-image-preview');
                
                if (questionPreviewImg && questionPreviewContainer) {
                    questionPreviewImg.src = imageData;
                    questionPreviewImg.style.display = 'block';
                    questionPreviewImg.style.maxWidth = '100%';
                    questionPreviewImg.style.height = 'auto';
                    questionPreviewContainer.style.display = 'block';
                }
            }
        });
    }
    
    // Fix paste functionality for question images
    document.addEventListener('paste', function(e) {
        const items = e.clipboardData.items;
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                const blob = items[i].getAsFile();
                const reader = new FileReader();
                reader.onload = function(event) {
                    const questionPreviewImg = document.getElementById('question-image-preview-img');
                    const questionPreviewContainer = document.getElementById('question-image-preview');
                    
                    if (questionPreviewImg && questionPreviewContainer) {
                        questionPreviewImg.src = event.target.result;
                        questionPreviewImg.style.display = 'block';
                        questionPreviewImg.style.maxWidth = '100%';
                        questionPreviewImg.style.height = 'auto';
                        questionPreviewContainer.style.display = 'block';
                    }
                };
                reader.readAsDataURL(blob);
                break;
            }
        }
    });
});