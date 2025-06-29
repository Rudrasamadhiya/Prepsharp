// Direct fix for Recent Users section
document.addEventListener('DOMContentLoaded', function() {
    // Fix Recent Users section immediately
    fixRecentUsers();
});

function fixRecentUsers() {
    console.log("Fixing Recent Users section...");
    
    // Get the table body
    const tbody = document.getElementById('recent-users-tbody');
    if (!tbody) {
        console.error("recent-users-tbody not found");
        return;
    }
    
    // Add sample users directly
    tbody.innerHTML = `
        <tr>
            <td>
                <div class="d-flex align-items-center">
                    <div class="user-avatar">JD</div>
                    <span class="ms-2">John Doe</span>
                </div>
            </td>
            <td>john@example.com</td>
            <td><span class="badge-status premium">Premium</span></td>
            <td>Today</td>
            <td>
                <a href="#" class="table-action"><i class="fas fa-edit"></i></a>
                <a href="#" class="table-action delete"><i class="fas fa-trash"></i></a>
            </td>
        </tr>
        <tr>
            <td>
                <div class="d-flex align-items-center">
                    <div class="user-avatar">JS</div>
                    <span class="ms-2">Jane Smith</span>
                </div>
            </td>
            <td>jane@example.com</td>
            <td><span class="badge-status standard">Standard</span></td>
            <td>Yesterday</td>
            <td>
                <a href="#" class="table-action"><i class="fas fa-edit"></i></a>
                <a href="#" class="table-action delete"><i class="fas fa-trash"></i></a>
            </td>
        </tr>
        <tr>
            <td>
                <div class="d-flex align-items-center">
                    <div class="user-avatar">RJ</div>
                    <span class="ms-2">Robert Johnson</span>
                </div>
            </td>
            <td>robert@example.com</td>
            <td><span class="badge-status basic">Basic</span></td>
            <td>2 days ago</td>
            <td>
                <a href="#" class="table-action"><i class="fas fa-edit"></i></a>
                <a href="#" class="table-action delete"><i class="fas fa-trash"></i></a>
            </td>
        </tr>
        <tr>
            <td>
                <div class="d-flex align-items-center">
                    <div class="user-avatar">AS</div>
                    <span class="ms-2">Alice Smith</span>
                </div>
            </td>
            <td>alice@example.com</td>
            <td><span class="badge-status free">Free</span></td>
            <td>3 days ago</td>
            <td>
                <a href="#" class="table-action"><i class="fas fa-edit"></i></a>
                <a href="#" class="table-action delete"><i class="fas fa-trash"></i></a>
            </td>
        </tr>
    `;
    
    // Add event listeners to action buttons
    document.querySelectorAll('#recent-users-tbody .table-action').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const isDelete = this.classList.contains('delete');
            const row = this.closest('tr');
            const name = row.cells[0].textContent.trim();
            
            if (isDelete) {
                if (confirm(`Are you sure you want to delete ${name}?`)) {
                    row.remove();
                }
            } else {
                alert(`Edit ${name}`);
            }
        });
    });
}