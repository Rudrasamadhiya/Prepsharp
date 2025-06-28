// Function to create match list UI
function createMatchListUI(questionId) {
    const matchListContainer = document.createElement('div');
    matchListContainer.className = 'match-list-container';
    
    // Create List-I (Column 1)
    let html = '<h5>List-I (Column 1)</h5>';
    for (let i = 0; i < 4; i++) {
        const label = String.fromCharCode(65 + i); // A, B, C, D
        html += `
            <div class="match-item mb-2">
                <div class="match-item-label me-2">${label}.</div>
                <input type="text" class="form-control" id="list1-${questionId}-${i}" placeholder="Item ${label}">
            </div>
        `;
    }
    
    // Create List-II (Column 2)
    html += '<h5 class="mt-3">List-II (Column 2)</h5>';
    for (let i = 0; i < 4; i++) {
        const label = i + 1; // 1, 2, 3, 4
        html += `
            <div class="match-item mb-2">
                <div class="match-item-label me-2">${label}.</div>
                <input type="text" class="form-control" id="list2-${questionId}-${i}" placeholder="Item ${label}">
            </div>
        `;
    }
    
    // Create match options
    html += `
        <div class="match-options mt-4">
            <h5>Correct Matching</h5>
            <p>Select the correct matching of items from List-I to List-II</p>
            
            <div class="option-container mb-2">
                <div class="form-check">
                    <input class="form-check-input" type="radio" id="match-option-${questionId}-0" name="match-option-${questionId}" value="0" checked>
                    <label class="form-check-label" for="match-option-${questionId}-0">Option A: A-1, B-2, C-3, D-4</label>
                </div>
            </div>
            
            <div class="option-container mb-2">
                <div class="form-check">
                    <input class="form-check-input" type="radio" id="match-option-${questionId}-1" name="match-option-${questionId}" value="1">
                    <label class="form-check-label" for="match-option-${questionId}-1">Option B: A-2, B-1, C-4, D-3</label>
                </div>
            </div>
            
            <div class="option-container mb-2">
                <div class="form-check">
                    <input class="form-check-input" type="radio" id="match-option-${questionId}-2" name="match-option-${questionId}" value="2">
                    <label class="form-check-label" for="match-option-${questionId}-2">Option C: A-3, B-4, C-1, D-2</label>
                </div>
            </div>
            
            <div class="option-container mb-2">
                <div class="form-check">
                    <input class="form-check-input" type="radio" id="match-option-${questionId}-3" name="match-option-${questionId}" value="3">
                    <label class="form-check-label" for="match-option-${questionId}-3">Option D: A-4, B-3, C-2, D-1</label>
                </div>
            </div>
        </div>
    `;
    
    matchListContainer.innerHTML = html;
    return matchListContainer;
}

// Function to get match list data
function getMatchListData(questionId) {
    // Collect List-I items
    const list1Items = [];
    for (let i = 0; i < 4; i++) {
        const itemText = document.getElementById(`list1-${questionId}-${i}`).value;
        if (!itemText) {
            throw new Error(`Please enter text for List-I item ${String.fromCharCode(65 + i)}`);
        }
        list1Items.push(itemText);
    }
    
    // Collect List-II items
    const list2Items = [];
    for (let i = 0; i < 4; i++) {
        const itemText = document.getElementById(`list2-${questionId}-${i}`).value;
        if (!itemText) {
            throw new Error(`Please enter text for List-II item ${i+1}`);
        }
        list2Items.push(itemText);
    }
    
    // Get correct option
    const selectedOption = document.querySelector(`input[name="match-option-${questionId}"]:checked`);
    if (!selectedOption) {
        throw new Error('Please select a correct match option');
    }
    
    const correctOption = parseInt(selectedOption.value);
    
    return {
        list1: list1Items,
        list2: list2Items,
        correctOption: correctOption
    };
}