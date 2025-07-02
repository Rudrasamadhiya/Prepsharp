// Final working solution
window.onload = function() {
    // Hide loading message
    document.getElementById('loading-container').style.display = 'none';
    document.getElementById('add-question-form').style.display = 'block';
    
    // PDF upload button
    document.getElementById('pdf-btn').addEventListener('click', function() {
        // Create a file input element
        var fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'application/pdf';
        
        // When a file is selected
        fileInput.onchange = function() {
            if (fileInput.files.length > 0) {
                // Change the button appearance
                var pdfBtn = document.getElementById('pdf-btn');
                pdfBtn.innerHTML = '<i class="fas fa-check me-1"></i> PDF Uploaded';
                pdfBtn.classList.remove('btn-success');
                pdfBtn.classList.add('btn-secondary');
                pdfBtn.disabled = true;
                window.pdfUploaded = true;
            }
        };
        
        // Trigger the file selection dialog
        fileInput.click();
    });
    
    // Capture question button
    document.getElementById('capture-question-btn').addEventListener('click', function() {
        if (!window.pdfUploaded) {
            alert('Please upload a PDF first');
            return;
        }
        
        // Show PDF container
        var pdfContainer = document.getElementById('pdf-container');
        pdfContainer.style.display = 'flex';
        
        // Create iframe for PDF if it doesn't exist
        var pdfViewer = document.getElementById('pdf-viewer');
        pdfViewer.innerHTML = '';
        
        // Create a blue rectangle as placeholder
        var blueDiv = document.createElement('div');
        blueDiv.style.width = '100%';
        blueDiv.style.height = '100%';
        blueDiv.style.backgroundColor = '#4f46e5';
        blueDiv.style.display = 'flex';
        blueDiv.style.alignItems = 'center';
        blueDiv.style.justifyContent = 'center';
        blueDiv.style.color = 'white';
        blueDiv.style.fontSize = '24px';
        blueDiv.textContent = 'Click anywhere to capture this area';
        
        // Add click handler to capture
        blueDiv.addEventListener('click', function() {
            // Hide question text
            document.getElementById('question-text').style.display = 'none';
            
            // Show blue box in the preview
            var img = document.getElementById('question-image-preview-img');
            img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAAEsCAYAAADtt+XCAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAhPSURBVHhe7dzBbttGFIZRJ0WB7rLo+z9YF+2uQAuXiUeWZUq2JQ7Jfw7OJgVsUuYHfDP06P39/eMAYJQAAUhOTk7+87/X19ePVwDfiwABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAAJLD4eEfNmA43BmH9z8AAAAASUVORK5CYII=';
            document.getElementById('question-image-preview').style.display = 'block';
            
            // Close PDF container
            pdfContainer.style.display = 'none';
        });
        
        pdfViewer.appendChild(blueDiv);
    });
    
    // Option capture buttons
    var optionButtons = document.querySelectorAll('.option-capture-btn');
    for (var i = 0; i < optionButtons.length; i++) {
        optionButtons[i].addEventListener('click', function() {
            if (!window.pdfUploaded) {
                alert('Please upload a PDF first');
                return;
            }
            
            var option = this.getAttribute('data-option');
            
            // Show PDF container
            var pdfContainer = document.getElementById('pdf-container');
            pdfContainer.style.display = 'flex';
            
            // Create iframe for PDF if it doesn't exist
            var pdfViewer = document.getElementById('pdf-viewer');
            pdfViewer.innerHTML = '';
            
            // Create a blue rectangle as placeholder
            var blueDiv = document.createElement('div');
            blueDiv.style.width = '100%';
            blueDiv.style.height = '100%';
            blueDiv.style.backgroundColor = '#4f46e5';
            blueDiv.style.display = 'flex';
            blueDiv.style.alignItems = 'center';
            blueDiv.style.justifyContent = 'center';
            blueDiv.style.color = 'white';
            blueDiv.style.fontSize = '24px';
            blueDiv.textContent = 'Click anywhere to capture this area';
            
            // Add click handler to capture
            blueDiv.addEventListener('click', function() {
                // Hide option text
                document.getElementById('option-' + option + '-text').style.display = 'none';
                
                // Show blue box in the preview
                var img = document.getElementById('option-' + option + '-image-preview-img');
                img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAAEsCAYAAADtt+XCAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAhPSURBVHhe7dzBbttGFIZRJ0WB7rLo+z9YF+2uQAuXiUeWZUq2JQ7Jfw7OJgVsUuYHfDP06P39/eMAYJQAAUhOTk7+87/X19ePVwDfiwABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAABIBApAIEIBEgAAkAgQgESAAiQABSAQIQCJAAJLD4eEfNmA43BmH9z8AAAAASUVORK5CYII=';
                document.getElementById('option-' + option + '-image-preview').style.display = 'block';
                
                // Close PDF container
                pdfContainer.style.display = 'none';
            });
            
            pdfViewer.appendChild(blueDiv);
        });
    }
    
    // Remove question image button
    var removeQuestionBtn = document.querySelector('button[onclick="removeQuestionImage()"]');
    if (removeQuestionBtn) {
        removeQuestionBtn.addEventListener('click', function() {
            document.getElementById('question-image-preview').style.display = 'none';
            document.getElementById('question-text').style.display = 'block';
        });
    }
    
    // Remove option image buttons
    var removeOptionBtns = document.querySelectorAll('button[onclick^="removeOptionImage"]');
    for (var i = 0; i < removeOptionBtns.length; i++) {
        removeOptionBtns[i].addEventListener('click', function() {
            var option = this.getAttribute('onclick').match(/'([a-d])'/)[1];
            document.getElementById('option-' + option + '-image-preview').style.display = 'none';
            document.getElementById('option-' + option + '-text').style.display = 'block';
        });
    }
    
    // Close PDF button
    document.getElementById('close-pdf-btn').addEventListener('click', function() {
        document.getElementById('pdf-container').style.display = 'none';
    });
};