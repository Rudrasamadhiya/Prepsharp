// Simple inline function for loading resources
function loadAdminResources(status) {
    console.log('Loading resources with status:', status);
    const resourcesTable = document.getElementById('resourcesTableBody');
    resourcesTable.innerHTML = '<tr><td colspan="7" class="text-center"><div class="spinner-border text-primary" role="status"></div><p class="mt-2">Loading resources...</p></td></tr>';
    
    // Create sample resources for testing
    setTimeout(() => {
        resourcesTable.innerHTML = `
            <tr>
                <td>JEE Main Question Paper - Physics (2023)</td>
                <td>PDF Document</td>
                <td>Physics</td>
                <td>Admin</td>
                <td>Jan 15, 2023</td>
                <td><span class="badge bg-warning">Pending</span></td>
                <td>
                    <div class="btn-group">
                        <button class="btn btn-sm btn-primary">View</button>
                        <button class="btn btn-sm btn-danger">Delete</button>
                    </div>
                </td>
            </tr>
            <tr>
                <td>NEET Solution Paper - Chemistry (2023)</td>
                <td>PDF Document</td>
                <td>Chemistry</td>
                <td>Admin</td>
                <td>Feb 20, 2023</td>
                <td><span class="badge bg-${status === 'completed' ? 'success' : 'warning'}">${status === 'completed' ? 'Completed' : 'Pending'}</span></td>
                <td>
                    <div class="btn-group">
                        <button class="btn btn-sm btn-primary">View</button>
                        <button class="btn btn-sm btn-danger">Delete</button>
                    </div>
                </td>
            </tr>
        `;
    }, 1000);
}

// Load resources on page load
setTimeout(() => {
    loadAdminResources('all');
}, 1000);