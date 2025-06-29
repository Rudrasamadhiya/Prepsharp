// Simple image loader - bare minimum code
document.addEventListener('DOMContentLoaded', function() {
    // Add a button to the top navbar
    const topNav = document.querySelector('.top-navbar .d-flex.align-items-center');
    if (topNav) {
        const btn = document.createElement('button');
        btn.className = 'btn btn-info me-3';
        btn.innerHTML = '<i class="fas fa-folder-open me-1"></i> Load Images';
        btn.onclick = loadImagesFromFolder;
        topNav.appendChild(btn);
    }
    
    // Function to load images from folder
    function loadImagesFromFolder() {
        // Get folder path from user
        const folderPath = prompt("Enter folder path (e.g., C:\\Users\\HP\\myproject\\jeeapp\\src\\webapp\\Prepsharp\\papers\\2024-1\\Physics)");
        if (!folderPath) return;
        
        // Get current question number
        const questionNumber = window.currentQuestionIndex + 1;
        
        // Create image paths
        const questionImagePath = `${folderPath}/Question-${questionNumber}.png`;
        const optionAImagePath = `${folderPath}/Question-${questionNumber} Option-1.png`;
        const optionBImagePath = `${folderPath}/Question-${questionNumber} Option-2.png`;
        const optionCImagePath = `${folderPath}/Question-${questionNumber} Option-3.png`;
        const optionDImagePath = `${folderPath}/Question-${questionNumber} Option-4.png`;
        
        // Load question image
        const qImg = document.createElement('img');
        qImg.src = questionImagePath;
        qImg.style.maxWidth = '100%';
        qImg.style.border = '2px solid blue';
        qImg.style.marginBottom = '10px';
        
        // Hide question text and label
        const qText = document.getElementById('question-text');
        const qLabel = document.querySelector('label[for="question-text"]');
        if (qText) qText.style.display = 'none';
        if (qLabel) qLabel.style.display = 'none';
        
        // Hide question image input and label
        const qImgInput = document.getElementById('question-image');
        const qImgLabel = document.querySelector('label[for="question-image"]');
        if (qImgInput && qImgInput.parentElement) qImgInput.parentElement.style.display = 'none';
        if (qImgLabel) qImgLabel.style.display = 'none';
        
        // Add question image to page
        const qContainer = document.createElement('div');
        qContainer.appendChild(qImg);
        const form = document.getElementById('question-form');
        if (form) form.insertBefore(qContainer, form.firstChild);
        
        // Load option images
        loadOptionImage(optionAImagePath, 'a');
        loadOptionImage(optionBImagePath, 'b');
        loadOptionImage(optionCImagePath, 'c');
        loadOptionImage(optionDImagePath, 'd');
    }
    
    // Function to load an option image
    function loadOptionImage(path, letter) {
        // Create image
        const img = document.createElement('img');
        img.src = path;
        img.style.maxWidth = '100%';
        img.style.border = '2px solid green';
        img.style.marginTop = '10px';
        
        // Find option container
        const optContainer = document.querySelector(`.option-container:nth-child(${letter.charCodeAt(0) - 96})`);
        if (!optContainer) return;
        
        // Hide option text
        const optText = document.getElementById(`option-${letter}-text`);
        if (optText) optText.style.display = 'none';
        
        // Hide option image input and label
        const optImgInput = document.getElementById(`option-${letter}-image`);
        const optImgLabel = document.querySelector(`label[for="option-${letter}-image"]`);
        if (optImgInput && optImgInput.parentElement) optImgInput.parentElement.style.display = 'none';
        if (optImgLabel) optImgLabel.style.display = 'none';
        
        // Add image to option container
        const container = document.createElement('div');
        container.appendChild(img);
        optContainer.appendChild(container);
    }
});