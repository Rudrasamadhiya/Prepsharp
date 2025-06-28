// Updated button HTML for renderExams function
const previewButtonHTML = `
<a href="preview-exam.html?id=\${exam.id}" class="btn btn-sm btn-outline-info" style="border-radius: 6px; min-width: 80px; border-color: #0ea5e9; color: #0ea5e9; box-shadow: 0 2px 4px rgba(14, 165, 233, 0.15);">
    <i class="fas fa-eye me-1"></i> Preview
</a>
`;

const editButtonHTML = `
<a href="edit-exam.html?id=\${exam.id}" class="btn btn-sm btn-primary" style="border-radius: 6px; min-width: 80px; box-shadow: 0 2px 4px rgba(79, 70, 229, 0.2);">
    <i class="fas fa-edit me-1"></i> Edit
</a>
`;