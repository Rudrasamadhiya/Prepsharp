// Function to render exams
function renderExams(exams) {
    const container = document.getElementById('exams-container');
    container.innerHTML = '';
    
    // Check if list view is active
    const isListView = document.getElementById('list-view-btn').classList.contains('active');
    
    // Add table header for list view
    if (isListView) {
        const tableHeader = document.createElement('div');
        tableHeader.className = 'table-header';
        tableHeader.innerHTML = `
            <div style="display: inline-block; width: 25%;">NAME</div>
            <div style="display: inline-block; width: 10%;">STATUS</div>
            <div style="display: inline-block; width: 10%;">YEAR</div>
            <div style="display: inline-block; width: 10%;">QUESTIONS</div>
            <div style="display: inline-block; width: 15%;">CREATED BY</div>
            <div style="display: inline-block; width: 30%; text-align: right;">ACTIONS</div>
        `;
        container.appendChild(tableHeader);
    }
    
    if (exams.length === 0) {
        container.innerHTML += `
            <div class="col-12 text-center py-5">
                <i class="fas fa-search fa-3x text-muted mb-3"></i>
                <h4>No Matching Exams</h4>
                <p class="text-muted">Try adjusting your filters</p>
                <button class="btn btn-outline-secondary mt-3" onclick="resetFilters()">
                    <i class="fas fa-times me-2"></i> Clear Filters
                </button>
            </div>
        `;
        return;
    }
    
    exams.forEach((exam, index) => {
        const examName = exam.name || 'Unnamed Exam';
        const examType = exam.type || 'Unknown';
        const examYear = exam.year || 'N/A';
        const status = exam.status || 'Draft';
        const createdBy = exam.createdBy ? exam.createdBy.split('@')[0] : 'Unknown';
        
        // Count questions
        let questionCount = 0;
        if (exam.questions && Array.isArray(exam.questions)) {
            questionCount = exam.questions.length;
        }
        
        // Determine status badge class
        let statusClass = 'bg-secondary';
        if (status === 'Published') statusClass = 'bg-success';
        else if (status === 'Review') statusClass = 'bg-warning';
        else if (status === 'Draft') statusClass = 'bg-info';
        
        if (isListView) {
            // List view row
            const listRow = document.createElement('div');
            listRow.className = 'list-row';
            listRow.style.borderBottom = '1px solid #e2e8f0';
            listRow.style.backgroundColor = index % 2 === 0 ? '#ffffff' : '#f8fafc';
            listRow.innerHTML = `
                <div style="display: inline-block; width: 25%; padding: 12px 15px; vertical-align: middle;">
                    <span class="fw-medium" style="color: #4f46e5;">${examName}</span>
                </div>
                <div style="display: inline-block; width: 10%; padding: 12px 15px; vertical-align: middle;">
                    <span class="badge ${statusClass}">${status}</span>
                </div>
                <div style="display: inline-block; width: 10%; padding: 12px 15px; vertical-align: middle;">
                    ${examYear}
                </div>
                <div style="display: inline-block; width: 10%; padding: 12px 15px; vertical-align: middle;">
                    ${questionCount}
                </div>
                <div style="display: inline-block; width: 15%; padding: 12px 15px; vertical-align: middle;">
                    ${createdBy}
                </div>
                <div style="display: inline-block; width: 30%; padding: 12px 15px; vertical-align: middle; text-align: right;">
                    <a href="edit-exam.html?id=${exam.id}" class="btn btn-sm btn-outline-primary me-2">
                        <i class="fas fa-edit me-1"></i> Edit
                    </a>
                    <a href="preview-exam.html?id=${exam.id}" class="btn btn-sm btn-outline-secondary">
                        <i class="fas fa-eye me-1"></i> Preview
                    </a>
                </div>
            `;
            container.appendChild(listRow);
        } else {
            // Grid view card
            const examCard = document.createElement('div');
            examCard.className = 'col-md-4';
            examCard.innerHTML = `
                <div class="card exam-card">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <h5 class="mb-0">${examName}</h5>
                        <span class="badge ${statusClass}">${status}</span>
                    </div>
                    <div class="card-body">
                        <div class="mb-3">
                            <div class="d-flex justify-content-between mb-2">
                                <span class="text-muted">Type:</span>
                                <span class="fw-medium">${examType}</span>
                            </div>
                            <div class="d-flex justify-content-between mb-2">
                                <span class="text-muted">Year:</span>
                                <span class="fw-medium">${examYear}</span>
                            </div>
                            <div class="d-flex justify-content-between">
                                <span class="text-muted">Questions:</span>
                                <span class="fw-medium">${questionCount}</span>
                            </div>
                        </div>
                    </div>
                    <div class="card-footer p-0">
                        <div class="btn-group w-100">
                            <a href="edit-exam.html?id=${exam.id}" class="btn btn-outline-primary">
                                <i class="fas fa-edit me-1"></i> Edit
                            </a>
                            <a href="preview-exam.html?id=${exam.id}" class="btn btn-outline-secondary">
                                <i class="fas fa-eye me-1"></i> Preview
                            </a>
                        </div>
                    </div>
                </div>
            `;
            container.appendChild(examCard);
        }
    });
}

// Function to render my exams
function renderMyExams(exams) {
    const container = document.getElementById('my-exams-container');
    container.innerHTML = '';
    
    // Check if list view is active
    const isListView = document.getElementById('list-view-btn').classList.contains('active');
    
    // Add table header for list view
    if (isListView) {
        const tableHeader = document.createElement('div');
        tableHeader.className = 'table-header';
        tableHeader.innerHTML = `
            <div style="display: inline-block; width: 25%;">NAME</div>
            <div style="display: inline-block; width: 10%;">STATUS</div>
            <div style="display: inline-block; width: 10%;">YEAR</div>
            <div style="display: inline-block; width: 10%;">QUESTIONS</div>
            <div style="display: inline-block; width: 15%;">CREATED BY</div>
            <div style="display: inline-block; width: 30%; text-align: right;">ACTIONS</div>
        `;
        container.appendChild(tableHeader);
    }
    
    if (exams.length === 0) {
        container.innerHTML += `
            <div class="col-12 text-center py-5">
                <i class="fas fa-search fa-3x text-muted mb-3"></i>
                <h4>No Matching Exams</h4>
                <p class="text-muted">Try adjusting your filters</p>
            </div>
        `;
        return;
    }
    
    exams.forEach((exam, index) => {
        const examName = exam.name || 'Unnamed Exam';
        const examType = exam.type || 'Unknown';
        const examYear = exam.year || 'N/A';
        const status = exam.status || 'Draft';
        const createdBy = exam.createdBy ? exam.createdBy.split('@')[0] : 'Unknown';
        
        // Count questions
        let questionCount = 0;
        if (exam.questions && Array.isArray(exam.questions)) {
            questionCount = exam.questions.length;
        }
        
        // Determine status badge class
        let statusClass = 'bg-secondary';
        if (status === 'Published') statusClass = 'bg-success';
        else if (status === 'Review') statusClass = 'bg-warning';
        else if (status === 'Draft') statusClass = 'bg-info';
        
        if (isListView) {
            // List view row
            const listRow = document.createElement('div');
            listRow.className = 'list-row';
            listRow.style.borderBottom = '1px solid #e2e8f0';
            listRow.style.backgroundColor = index % 2 === 0 ? '#ffffff' : '#f8fafc';
            listRow.innerHTML = `
                <div style="display: inline-block; width: 25%; padding: 12px 15px; vertical-align: middle;">
                    <span class="fw-medium" style="color: #4f46e5;">${examName}</span>
                </div>
                <div style="display: inline-block; width: 10%; padding: 12px 15px; vertical-align: middle;">
                    <span class="badge ${statusClass}">${status}</span>
                </div>
                <div style="display: inline-block; width: 10%; padding: 12px 15px; vertical-align: middle;">
                    ${examYear}
                </div>
                <div style="display: inline-block; width: 10%; padding: 12px 15px; vertical-align: middle;">
                    ${questionCount}
                </div>
                <div style="display: inline-block; width: 15%; padding: 12px 15px; vertical-align: middle;">
                    ${createdBy}
                </div>
                <div style="display: inline-block; width: 30%; padding: 12px 15px; vertical-align: middle; text-align: right;">
                    <a href="edit-exam.html?id=${exam.id}" class="btn btn-sm btn-outline-primary me-2">
                        <i class="fas fa-edit me-1"></i> Edit
                    </a>
                    <a href="preview-exam.html?id=${exam.id}" class="btn btn-sm btn-outline-secondary">
                        <i class="fas fa-eye me-1"></i> Preview
                    </a>
                </div>
            `;
            container.appendChild(listRow);
        } else {
            // Grid view card
            const examCard = document.createElement('div');
            examCard.className = 'col-md-4';
            examCard.innerHTML = `
                <div class="card exam-card">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <h5 class="mb-0">${examName}</h5>
                        <span class="badge ${statusClass}">${status}</span>
                    </div>
                    <div class="card-body">
                        <div class="mb-3">
                            <div class="d-flex justify-content-between mb-2">
                                <span class="text-muted">Type:</span>
                                <span class="fw-medium">${examType}</span>
                            </div>
                            <div class="d-flex justify-content-between mb-2">
                                <span class="text-muted">Year:</span>
                                <span class="fw-medium">${examYear}</span>
                            </div>
                            <div class="d-flex justify-content-between">
                                <span class="text-muted">Questions:</span>
                                <span class="fw-medium">${questionCount}</span>
                            </div>
                        </div>
                    </div>
                    <div class="card-footer p-0">
                        <div class="btn-group w-100">
                            <a href="edit-exam.html?id=${exam.id}" class="btn btn-outline-primary">
                                <i class="fas fa-edit me-1"></i> Edit
                            </a>
                            <a href="preview-exam.html?id=${exam.id}" class="btn btn-outline-secondary">
                                <i class="fas fa-eye me-1"></i> Preview
                            </a>
                        </div>
                    </div>
                </div>
            `;
            container.appendChild(examCard);
        }
    });
}