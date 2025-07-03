// Simple fix for image display issues
document.addEventListener('DOMContentLoaded', function() {
    // Function to fix image display
    function fixImageDisplay() {
        // Fix question image
        const questionImg = document.getElementById('question-image-preview-img');
        if (questionImg) {
            questionImg.style.display = 'block';
            questionImg.style.maxWidth = '100%';
            questionImg.style.height = 'auto';
            questionImg.style.margin = '0 auto';
        }
        
        // Fix option images
        const optionLetters = ['a', 'b', 'c', 'd'];
        optionLetters.forEach(letter => {
            const optionImg = document.getElementById(`option-${letter}-image-preview-img`);
            if (optionImg) {
                optionImg.style.display = 'block';
                optionImg.style.maxWidth = '100%';
                optionImg.style.height = 'auto';
                optionImg.style.margin = '0 auto';
            }
        });
    }
    
    // Run immediately and every second for 5 seconds
    fixImageDisplay();
    for (let i = 1; i <= 5; i++) {
        setTimeout(fixImageDisplay, i * 1000);
    }
    
    // Override the image setting functions
    const originalUseForQuestion = document.getElementById('use-for-question-btn').onclick;
    document.getElementById('use-for-question-btn').onclick = function() {
        if (originalUseForQuestion) originalUseForQuestion.apply(this, arguments);
        setTimeout(fixImageDisplay, 100);
    };
});