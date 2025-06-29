// Check if images exist in Firebase Storage
(function() {
    // Function to check if an image exists
    async function checkImage(url) {
        try {
            const response = await fetch(url, { method: 'HEAD' });
            return response.ok;
        } catch (error) {
            console.error("Error checking image:", error);
            return false;
        }
    }
    
    // Function to display image status
    async function checkAndDisplayImages() {
        // Create status container
        const statusContainer = document.createElement('div');
        statusContainer.style.padding = '15px';
        statusContainer.style.margin = '15px 0';
        statusContainer.style.backgroundColor = '#f8f9fa';
        statusContainer.style.border = '2px solid #dc3545';
        statusContainer.style.borderRadius = '5px';
        
        // Add header
        const header = document.createElement('h4');
        header.textContent = 'Image Status';
        header.style.color = '#dc3545';
        statusContainer.appendChild(header);
        
        // Get current question
        const questionNumber = window.currentQuestionIndex + 1;
        if (!window.existingQuestions || !window.existingQuestions[questionNumber]) {
            statusContainer.innerHTML += '<p>No question data found for question ' + questionNumber + '</p>';
            return statusContainer;
        }
        
        const question = window.existingQuestions[questionNumber];
        
        // Check question image
        if (question.imageUrl) {
            const status = document.createElement('div');
            status.innerHTML = `<strong>Question Image URL:</strong> ${question.imageUrl}<br>`;
            
            const exists = await checkImage(question.imageUrl);
            if (exists) {
                status.innerHTML += '<span style="color: green">✓ Image exists</span>';
                
                // Create image element
                const img = document.createElement('img');
                img.src = question.imageUrl;
                img.style.maxWidth = '100%';
                img.style.border = '1px solid #28a745';
                img.style.marginTop = '10px';
                status.appendChild(img);
            } else {
                status.innerHTML += '<span style="color: red">✗ Image does not exist or is inaccessible</span>';
            }
            
            statusContainer.appendChild(status);
            statusContainer.appendChild(document.createElement('hr'));
        } else {
            statusContainer.innerHTML += '<p>No question image URL found</p>';
            statusContainer.appendChild(document.createElement('hr'));
        }
        
        // Check option images
        if (question.optionImages && question.optionImages.length > 0) {
            const optionLetters = ['A', 'B', 'C', 'D'];
            
            for (let i = 0; i < question.optionImages.length; i++) {
                if (!question.optionImages[i]) continue;
                
                const status = document.createElement('div');
                status.innerHTML = `<strong>Option ${optionLetters[i]} Image URL:</strong> ${question.optionImages[i]}<br>`;
                
                const exists = await checkImage(question.optionImages[i]);
                if (exists) {
                    status.innerHTML += '<span style="color: green">✓ Image exists</span>';
                    
                    // Create image element
                    const img = document.createElement('img');
                    img.src = question.optionImages[i];
                    img.style.maxWidth = '100%';
                    img.style.border = '1px solid #28a745';
                    img.style.marginTop = '10px';
                    status.appendChild(img);
                } else {
                    status.innerHTML += '<span style="color: red">✗ Image does not exist or is inaccessible</span>';
                }
                
                statusContainer.appendChild(status);
                if (i < question.optionImages.length - 1) {
                    statusContainer.appendChild(document.createElement('hr'));
                }
            }
        } else {
            statusContainer.innerHTML += '<p>No option image URLs found</p>';
        }
        
        return statusContainer;
    }
    
    // Add a button to check images
    window.addEventListener('load', function() {
        setTimeout(function() {
            const header = document.querySelector('.card-header');
            if (header) {
                const button = document.createElement('button');
                button.className = 'btn btn-danger ms-2';
                button.textContent = 'Check Images';
                button.onclick = async function() {
                    button.disabled = true;
                    button.textContent = 'Checking...';
                    
                    const statusContainer = await checkAndDisplayImages();
                    
                    // Find a place to insert the status
                    const form = document.getElementById('question-form');
                    if (form) {
                        form.insertBefore(statusContainer, form.firstChild);
                    }
                    
                    button.disabled = false;
                    button.textContent = 'Check Images';
                };
                header.appendChild(button);
            }
        }, 1000);
    });
})();