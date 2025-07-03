// Inline resources display
document.addEventListener('DOMContentLoaded', function() {
    // Set up click handlers for admin resource buttons
    document.getElementById('viewAssignedBtn').addEventListener('click', function() {
        showResourcesInTable('pending');
        updateActiveButton(this);
    });
    
    document.getElementById('viewPendingBtn').addEventListener('click', function() {
        showResourcesInTable('pending');
        updateActiveButton(this);
    });
    
    document.getElementById('viewUnassignedBtn').addEventListener('click', function() {
        showResourcesInTable('unassigned');
        updateActiveButton(this);
    });
    
    document.getElementById('viewCompletedBtn').addEventListener('click', function() {
        showResourcesInTable('completed');
        updateActiveButton(this);
    });
    
    // Function to update active button
    function updateActiveButton(button) {
        // Remove active class from all buttons
        document.querySelectorAll('.admin-resource-btn').forEach(btn => {
            btn.classList.remove('btn-primary', 'btn-success', 'btn-warning', 'btn-info');
            btn.classList.add('btn-outline-primary', 'btn-outline-success', 'btn-outline-warning', 'btn-outline-info');
        });
        
        // Add active class to clicked button
        if (button.id === 'viewAssignedBtn') {
            button.classList.remove('btn-outline-primary');
            button.classList.add('btn-primary');
        } else if (button.id === 'viewPendingBtn') {
            button.classList.remove('btn-outline-success');
            button.classList.add('btn-success');
        } else if (button.id === 'viewUnassignedBtn') {
            button.classList.remove('btn-outline-warning');
            button.classList.add('btn-warning');
        } else if (button.id === 'viewCompletedBtn') {
            button.classList.remove('btn-outline-info');
            button.classList.add('btn-info');
        }
    }
    
    // Function to show resources in the table
    function showResourcesInTable(status) {
        const resourcesTable = document.getElementById('resourcesTableBody');
        const tableHeader = document.querySelector('.card-header div:first-child');
        
        // Update table header based on status
        if (status === 'pending') {
            tableHeader.textContent = 'Pending Resources';
        } else if (status === 'completed') {
            tableHeader.textContent = 'Completed Resources';
        } else if (status === 'unassigned') {
            tableHeader.textContent = 'Unassigned Resources';
        } else {
            tableHeader.textContent = 'All Resources';
        }
        
        // Show loading spinner
        resourcesTable.innerHTML = '<tr><td colspan="7" class="text-center"><div class="spinner-border text-primary" role="status"></div><p class="mt-2">Loading resources...</p></td></tr>';
        
        // Get Firebase reference
        const db = firebase.firestore();
        let query = db.collection('adminResources');
        
        // Filter by status if provided
        if (status && status !== 'all') {
            query = query.where('status', '==', status);
        }
        
        // Execute query
        query.get().then(snapshot => {
            if (snapshot.empty) {
                resourcesTable.innerHTML = '<tr><td colspan="7" class="text-center">No resources found</td></tr>';
                return;
            }
            
            // Clear table
            resourcesTable.innerHTML = '';
            
            // Add resources to table
            snapshot.forEach(doc => {
                const resource = doc.data();
                const row = document.createElement('tr');
                
                // Format date
                const date = resource.dateAssigned ? new Date(resource.dateAssigned) : new Date();
                const formattedDate = date.toLocaleDateString();
                
                // Create status badge
                let statusBadge;
                switch(resource.status) {
                    case 'pending':
                        statusBadge = '<span class="badge bg-warning">Pending</span>';
                        break;
                    case 'completed':
                        statusBadge = '<span class="badge bg-success">Completed</span>';
                        break;
                    case 'unassigned':
                        statusBadge = '<span class="badge bg-secondary">Unassigned</span>';
                        break;
                    default:
                        statusBadge = '<span class="badge bg-info">Unknown</span>';
                }
                
                // Create row content
                row.innerHTML = `
                    <td>
                        <div class="d-flex align-items-center">
                            <i class="fas ${resource.type && resource.type.includes('pdf') ? 'fa-file-pdf' : 'fa-file-word'} text-primary me-2"></i>
                            <span>${resource.title || 'Untitled'}</span>
                            ${resource.priority ? '<span class="badge bg-danger ms-2">Priority</span>' : ''}
                        </div>
                    </td>
                    <td>${resource.type || 'Unknown'}</td>
                    <td>${resource.subject || 'N/A'}</td>
                    <td>${resource.adminEmail || 'Unassigned'}</td>
                    <td>${formattedDate}</td>
                    <td>${statusBadge}</td>
                    <td>
                        <div class="btn-group">
                            <a href="${resource.fileURL || '#'}" class="btn btn-sm btn-outline-primary" target="_blank">
                                <i class="fas fa-eye"></i>
                            </a>
                            <button class="btn btn-sm btn-outline-success" onclick="assignResource('${doc.id}')">
                                <i class="fas fa-user-plus"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-danger" onclick="deleteResource('${doc.id}')">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                `;
                
                resourcesTable.appendChild(row);
            });
        }).catch(error => {
            console.error('Error loading resources:', error);
            resourcesTable.innerHTML = '<tr><td colspan="7" class="text-center text-danger">Error loading resources</td></tr>';
        });
    }
    
    // Global function to delete a resource
    window.deleteResource = function(resourceId) {
        if (confirm('Are you sure you want to delete this resource?')) {
            const db = firebase.firestore();
            db.collection('adminResources').doc(resourceId).delete()
                .then(() => {
                    alert('Resource deleted successfully');
                    // Reload current view
                    const tableHeader = document.querySelector('.card-header div:first-child').textContent;
                    let status = 'all';
                    if (tableHeader.includes('Pending')) status = 'pending';
                    else if (tableHeader.includes('Completed')) status = 'completed';
                    else if (tableHeader.includes('Unassigned')) status = 'unassigned';
                    showResourcesInTable(status);
                })
                .catch(error => {
                    console.error('Error deleting resource:', error);
                    alert('Error deleting resource');
                });
        }
    };
    
    // Global function to assign a resource
    window.assignResource = function(resourceId) {
        alert('This would open a dialog to assign the resource to an admin');
    };
    
    // Load all resources initially
    setTimeout(() => {
        showResourcesInTable('all');
    }, 1000);
});