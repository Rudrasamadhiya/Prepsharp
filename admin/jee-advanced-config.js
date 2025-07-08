// Function to check if the current exam is JEE Advanced
function isJeeAdvanced(examId) {
    return examId && examId.includes('jee-advanced');
}

// Function to show the JEE Advanced configuration modal
function showAdvancedConfigModal(examId) {
    // Create modal HTML
    const modalHTML = `
    <div class="modal fade" id="advancedConfigModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header bg-primary text-white">
                    <h5 class="modal-title">Configure JEE Advanced Paper Structure</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="alert alert-info">
                        <strong>Configure JEE Advanced Paper Structure</strong><br>
                        Please specify the number of sections per subject. The same section structure will be applied to Physics, Chemistry, and Mathematics.
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Number of Sections per Subject</label>
                        <select id="section-count" class="form-select">
                            <option value="1">1 Section per Subject</option>
                            <option value="2">2 Sections per Subject</option>
                            <option value="3" selected>3 Sections per Subject</option>
                            <option value="4">4 Sections per Subject</option>
                            <option value="5">5 Sections per Subject</option>
                        </select>
                    </div>
                    
                    <div id="sections-container">
                        <!-- Sections will be added here dynamically -->
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-primary" id="save-sections-btn">Save Structure</button>
                </div>
            </div>
        </div>
    </div>`;
    
    // Add modal to body if it doesn't exist
    if (!document.getElementById('advancedConfigModal')) {
        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = modalHTML;
        document.body.appendChild(modalContainer);
    }
    
    // Initialize modal
    const modal = new bootstrap.Modal(document.getElementById('advancedConfigModal'));
    
    // Update sections when section count changes
    document.getElementById('section-count').addEventListener('change', updateSectionInputs);
    
    // Save button click handler
    document.getElementById('save-sections-btn').addEventListener('click', function() {
        saveAdvancedStructure(examId);
        modal.hide();
    });
    
    // Initialize modal with saved structure or default
    const savedStructure = localStorage.getItem(`structure-${examId}`);
    if (savedStructure) {
        initializeModal(examId);
    } else {
        // Initial update of section inputs with default value
        updateSectionInputs();
    }
    
    // Show modal
    modal.show();
}

// Function to update section inputs based on selected count
function updateSectionInputs() {
    const sectionCount = parseInt(document.getElementById('section-count').value);
    const container = document.getElementById('sections-container');
    container.innerHTML = '';
    
    // Create a single section configuration that will apply to all subjects
    const sectionHTML = `
    <div class="alert alert-warning">
        <strong>Note:</strong> This section configuration will be applied to all three subjects (Physics, Chemistry, Mathematics).
    </div>
    <div class="card mb-3">
        <div class="card-header bg-primary text-white">
            Section Configuration (Applied to All Subjects)
        </div>
        <div class="card-body">
            <div id="section-templates">
                <!-- Section template for each section number -->
            </div>
        </div>
    </div>`;
    
    container.innerHTML = sectionHTML;
    
    // Add section templates based on the selected count
    const templatesContainer = document.getElementById('section-templates');
    templatesContainer.innerHTML = ''; // Clear existing templates
    
    for (let i = 0; i < sectionCount; i++) {
        const templateHTML = `
        <div class="section-template card mb-3" data-index="${i}">
            <div class="card-header bg-light">
                <span>Section ${i + 1}</span>
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label class="form-label">Question Type</label>
                            <select class="form-select section-type" data-index="${i}">
                                <option value="mcq-single">Single Correct MCQ</option>
                                <option value="mcq-multiple">Multiple Correct MCQ</option>
                                <option value="numerical">Numerical Type</option>
                                <option value="match-list">Match List Type</option>
                            </select>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label class="form-label">Number of Questions</label>
                            <input type="number" class="form-control section-count" data-index="${i}" min="1" value="4">
                        </div>
                    </div>
                </div>
                <div class="mb-3">
                    <label class="form-label">Section Image (Optional - Base64 Format)</label>
                    <input type="file" class="form-control section-image" data-index="${i}" accept="image/*">
                    <small class="form-text text-muted">Images will be stored in base64 format</small>
                </div>
            </div>
        </div>`;
        
        templatesContainer.innerHTML += templateHTML;
    }
}

// Function to initialize the modal with the saved structure
function initializeModal(examId) {
    const savedStructure = localStorage.getItem(`structure-${examId}`);
    if (savedStructure) {
        const structure = JSON.parse(savedStructure);
        // Count how many sections per subject (assuming all subjects have the same number)
        const sectionsPerSubject = structure.filter(s => s.subject === 'Physics').length;
        // Set the section count dropdown
        document.getElementById('section-count').value = sectionsPerSubject;
        // Update the section inputs
        updateSectionInputs();
        
        // Set the values for each section
        const physicsSection = structure.filter(s => s.subject === 'Physics');
        physicsSection.forEach((section, index) => {
            const typeElement = document.querySelector(`.section-type[data-index="${index}"]`);
            const countElement = document.querySelector(`.section-count[data-index="${index}"]`);
            if (typeElement) typeElement.value = section.type;
            if (countElement) countElement.value = section.count;
        });
    }
}

// Function to save the advanced structure
function saveAdvancedStructure(examId) {
    const structure = [];
    const subjects = ['Physics', 'Chemistry', 'Mathematics'];
    
    // Get all section templates
    const sectionTemplates = document.querySelectorAll('.section-template');
    
    // For each subject, apply all section templates
    subjects.forEach(subject => {
        sectionTemplates.forEach((template, index) => {
            const typeElement = template.querySelector('.section-type');
            const countElement = template.querySelector('.section-count');
            
            structure.push({
                section: `${subject} - Section ${index + 1}`,
                subject: subject,
                type: typeElement.value,
                count: parseInt(countElement.value) || 4
            });
        });
    });
    
    // Save structure to localStorage for now (can be changed to Firebase later)
    localStorage.setItem(`structure-${examId}`, JSON.stringify(structure));
    
    // Set the structure in memory
    window.jeeAdvancedStructure = structure;
    
    // Create section navigation buttons
    createAdvancedSectionButtons();
    
    // Reset to first question
    window.currentQuestionIndex = 0;
    updateAdvancedQuestionFields();
    document.getElementById('question-form').reset();
}

// Function to initialize the page with the saved structure
function initializeAdvancedStructure(examId) {
    // Try to get saved structure
    const savedStructure = localStorage.getItem(`structure-${examId}`);
    
    if (savedStructure) {
        // Use saved structure
        window.jeeAdvancedStructure = JSON.parse(savedStructure);
    } else {
        // Show configuration modal instead of using default structure
        showAdvancedConfigModal(examId);
        return;
    }
    
    // Create section navigation buttons
    createAdvancedSectionButtons();
    
    // Initialize with first question
    window.currentQuestionIndex = 0;
    updateAdvancedQuestionFields();
}

// Function to create section navigation buttons
function createAdvancedSectionButtons() {
    const container = document.querySelector('.section-navigation .btn-group');
    container.innerHTML = '';
    
    window.jeeAdvancedStructure.forEach((section, index) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'btn btn-outline-primary section-btn';
        button.textContent = section.section;
        button.onclick = function() { return jumpToAdvancedSection(index); };
        container.appendChild(button);
    });
}

// Function to jump to a specific section
function jumpToAdvancedSection(sectionIndex) {
    // Calculate the starting question index for the section
    let questionIndex = 0;
    for (let i = 0; i < sectionIndex; i++) {
        questionIndex += window.jeeAdvancedStructure[i].count;
    }
    
    window.currentQuestionIndex = questionIndex;
    updateAdvancedQuestionFields();
    document.getElementById('question-form').reset();
    
    return false; // Prevent default link behavior
}

// Function to update form fields based on current question index
function updateAdvancedQuestionFields() {
    // Get 1-based question number
    const questionNumber = window.currentQuestionIndex + 1;
    
    // Get section info for current question
    const sectionInfo = getAdvancedSectionInfo(questionNumber);
    
    if (!sectionInfo) return;
    
    // Calculate total questions
    const totalQuestions = window.jeeAdvancedStructure.reduce((sum, section) => sum + section.count, 0);
    
    // Update section and question display
    document.getElementById('question-number').textContent = `Question ${questionNumber} of ${totalQuestions}`;
    document.getElementById('section-name').textContent = sectionInfo.section;
    
    // Set subject (hidden) and update subject display
    document.getElementById('question-subject').value = sectionInfo.subject;
    document.getElementById('subject-display').textContent = sectionInfo.subject;
    
    // Set question type and toggle fields
    document.getElementById('question-type').value = sectionInfo.type;
    toggleQuestionFields();
    
    // Update chapters dropdown
    updateChapters(sectionInfo.subject);
    
    // Highlight current section button
    highlightAdvancedCurrentSection();
}

// Function to get section info based on question number
function getAdvancedSectionInfo(questionNumber) {
    let currentIndex = 0;
    for (const section of window.jeeAdvancedStructure) {
        if (questionNumber <= currentIndex + section.count) {
            return {
                section: section.section,
                subject: section.subject,
                type: section.type,
                questionInSection: questionNumber - currentIndex
            };
        }
        currentIndex += section.count;
    }
    return null;
}

// Function to highlight the current section button
function highlightAdvancedCurrentSection() {
    // Get current section index
    let sectionIndex = 0;
    let questionCount = 0;
    
    for (let i = 0; i < window.jeeAdvancedStructure.length; i++) {
        questionCount += window.jeeAdvancedStructure[i].count;
        if (window.currentQuestionIndex + 1 <= questionCount) {
            sectionIndex = i;
            break;
        }
    }
    
    // Remove active class from all section buttons
    const sectionButtons = document.querySelectorAll('.section-btn');
    sectionButtons.forEach(btn => btn.classList.remove('active'));
    
    // Add active class to current section button
    if (sectionButtons[sectionIndex]) {
        sectionButtons[sectionIndex].classList.add('active');
    }
}

// Function to navigate to next question
function nextAdvancedQuestion() {
    const totalQuestions = window.jeeAdvancedStructure.reduce((sum, section) => sum + section.count, 0);
    
    if (window.currentQuestionIndex < totalQuestions - 1) {
        window.currentQuestionIndex++;
        updateAdvancedQuestionFields();
        document.getElementById('question-form').reset();
    }
}

// Function to navigate to previous question
function prevAdvancedQuestion() {
    if (window.currentQuestionIndex > 0) {
        window.currentQuestionIndex--;
        updateAdvancedQuestionFields();
        document.getElementById('question-form').reset();
    }
}