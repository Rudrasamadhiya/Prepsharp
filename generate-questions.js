// Function to generate all questions for a subject
function generateQuestions(subject) {
    let html = '';
    const subjectCode = subject.toLowerCase() === 'mathematics' ? 'Maths' : subject;
    
    // Single Correct Option MCQs (1-4)
    for (let i = 1; i <= 4; i++) {
        html += `
    <div class="question-container">
        <div class="question-header">
            <div class="question-number">Question ${i}</div>
            <div class="question-type">Single Correct Option</div>
        </div>
        <div class="question-text">
            <img src="papers/2024-1/${subjectCode}/Question-${i}.png" class="question-image" alt="${subject} Question ${i}">
        </div>
        <div class="options-container">
            <div class="option">
                <div class="option-label">A.</div>
                <div class="option-text">
                    <img src="papers/2024-1/${subjectCode}/Question-${i} Option-1.png" class="option-image" alt="Option A">
                </div>
            </div>
            <div class="option">
                <div class="option-label">B.</div>
                <div class="option-text">
                    <img src="papers/2024-1/${subjectCode}/Question-${i} Option-2.png" class="option-image" alt="Option B">
                </div>
            </div>
            <div class="option">
                <div class="option-label">C.</div>
                <div class="option-text">
                    <img src="papers/2024-1/${subjectCode}/Question-${i} Option-3.png" class="option-image" alt="Option C">
                </div>
            </div>
            <div class="option">
                <div class="option-label">D.</div>
                <div class="option-text">
                    <img src="papers/2024-1/${subjectCode}/Question-${i} Option-4.png" class="option-image" alt="Option D">
                </div>
            </div>
        </div>
        <div class="show-explanation" onclick="toggleExplanation('${subject.toLowerCase()}-q${i}-explanation')">Add Explanation</div>
        <div id="${subject.toLowerCase()}-q${i}-explanation" class="explanation">
            <textarea class="explanation-text" placeholder="Enter explanation here" style="width: 100%; min-height: 100px;"></textarea>
        </div>
    </div>`;
    }
    
    // Multiple Correct Options MCQs (5-7)
    for (let i = 5; i <= 7; i++) {
        html += `
    <div class="question-container">
        <div class="question-header">
            <div class="question-number">Question ${i}</div>
            <div class="question-type">Multiple Correct Options</div>
        </div>
        <div class="question-text">
            <img src="papers/2024-1/${subjectCode}/Question-${i}.png" class="question-image" alt="${subject} Question ${i}">
        </div>
        <div class="options-container">
            <div class="option">
                <div class="option-label">A.</div>
                <div class="option-text">
                    <img src="papers/2024-1/${subjectCode}/Question-${i} Option-1.png" class="option-image" alt="Option A">
                </div>
            </div>
            <div class="option">
                <div class="option-label">B.</div>
                <div class="option-text">
                    <img src="papers/2024-1/${subjectCode}/Question-${i} Option-2.png" class="option-image" alt="Option B">
                </div>
            </div>
            <div class="option">
                <div class="option-label">C.</div>
                <div class="option-text">
                    <img src="papers/2024-1/${subjectCode}/Question-${i} Option-3.png" class="option-image" alt="Option C">
                </div>
            </div>
            <div class="option">
                <div class="option-label">D.</div>
                <div class="option-text">
                    <img src="papers/2024-1/${subjectCode}/Question-${i} Option-4.png" class="option-image" alt="Option D">
                </div>
            </div>
        </div>
        <div class="show-explanation" onclick="toggleExplanation('${subject.toLowerCase()}-q${i}-explanation')">Add Explanation</div>
        <div id="${subject.toLowerCase()}-q${i}-explanation" class="explanation">
            <textarea class="explanation-text" placeholder="Enter explanation here" style="width: 100%; min-height: 100px;"></textarea>
        </div>
    </div>`;
    }
    
    // Non-Negative Integer Type questions (8-13)
    for (let i = 8; i <= 13; i++) {
        html += `
    <div class="question-container">
        <div class="question-header">
            <div class="question-number">Question ${i}</div>
            <div class="question-type">Non-Negative Integer</div>
        </div>
        <div class="question-text">
            <img src="papers/2024-1/${subjectCode}/Question-${i}.png" class="question-image" alt="${subject} Question ${i}">
        </div>
        <div class="answer-input" style="margin-top: 15px;">
            <label for="${subject.toLowerCase()}-q${i}-answer" style="display: block; margin-bottom: 5px; font-weight: bold;">Your Answer:</label>
            <input type="number" id="${subject.toLowerCase()}-q${i}-answer" class="integer-answer" min="0" placeholder="Enter non-negative integer" style="padding: 8px; width: 200px; border: 1px solid #ccc; border-radius: 4px;">
        </div>
        <div class="show-explanation" onclick="toggleExplanation('${subject.toLowerCase()}-q${i}-explanation')">Add Explanation</div>
        <div id="${subject.toLowerCase()}-q${i}-explanation" class="explanation">
            <textarea class="explanation-text" placeholder="Enter explanation here" style="width: 100%; min-height: 100px;"></textarea>
        </div>
    </div>`;
    }
    
    // Match List type questions (14-17)
    for (let i = 14; i <= 17; i++) {
        html += `
    <div class="question-container">
        <div class="question-header">
            <div class="question-number">Question ${i}</div>
            <div class="question-type">Match List</div>
        </div>
        <div class="question-text">
            <img src="papers/2024-1/${subjectCode}/Question-${i}.png" class="question-image" alt="${subject} Question ${i}">
        </div>
        <div class="options-container">
            <div class="option">
                <div class="option-label">A.</div>
                <div class="option-text">
                    <img src="papers/2024-1/${subjectCode}/Question-${i} Option-1.png" class="option-image" alt="Option A">
                </div>
            </div>
            <div class="option">
                <div class="option-label">B.</div>
                <div class="option-text">
                    <img src="papers/2024-1/${subjectCode}/Question-${i} Option-2.png" class="option-image" alt="Option B">
                </div>
            </div>
            <div class="option">
                <div class="option-label">C.</div>
                <div class="option-text">
                    <img src="papers/2024-1/${subjectCode}/Question-${i} Option-3.png" class="option-image" alt="Option C">
                </div>
            </div>
            <div class="option">
                <div class="option-label">D.</div>
                <div class="option-text">
                    <img src="papers/2024-1/${subjectCode}/Question-${i} Option-4.png" class="option-image" alt="Option D">
                </div>
            </div>
        </div>
        <div class="show-explanation" onclick="toggleExplanation('${subject.toLowerCase()}-q${i}-explanation')">Add Explanation</div>
        <div id="${subject.toLowerCase()}-q${i}-explanation" class="explanation">
            <textarea class="explanation-text" placeholder="Enter explanation here" style="width: 100%; min-height: 100px;"></textarea>
        </div>
    </div>`;
    }
    
    return html;
}