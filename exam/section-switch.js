function switchSection(element) {
    // Remove active from all tabs
    document.querySelectorAll('.section-tab').forEach(tab => tab.classList.remove('active'));
    
    // Add active to clicked tab
    element.classList.add('active');
    
    // Update section info
    const sectionName = element.textContent;
    const sectionStrip = document.querySelector('.section-strip');
    const questionPalette = document.querySelector('.question-palette');
    
    // Section data
    const sections = {
        'Physics - Single Correct': 4,
        'Physics - Multiple Correct': 3,
        'Physics - Integer Type': 6,
        'Physics - Match List': 4,
        'Chemistry - Single Correct': 4,
        'Chemistry - Multiple Correct': 3,
        'Chemistry - Integer Type': 6,
        'Chemistry - Match List': 4,
        'Mathematics - Single Correct': 4,
        'Mathematics - Multiple Correct': 3,
        'Mathematics - Integer Type': 6,
        'Mathematics - Match List': 4
    };
    
    const questionCount = sections[sectionName] || 4;
    sectionStrip.textContent = sectionName + ' (' + questionCount + ' Questions)';
    
    // Update question palette
    questionPalette.innerHTML = '';
    for (let i = 1; i <= questionCount; i++) {
        questionPalette.innerHTML += '<div class="question-btn not-visited" style="background: #e9ecef; color: #333;">' + i + '</div>';
    }
}