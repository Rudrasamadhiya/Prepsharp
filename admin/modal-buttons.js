// Modal buttons for admin resources
document.addEventListener('DOMContentLoaded', function() {
    // Set up button click handlers to open modals
    document.getElementById('viewAssignedBtn').setAttribute('data-bs-toggle', 'modal');
    document.getElementById('viewAssignedBtn').setAttribute('data-bs-target', '#assignedResourcesModal');
    
    document.getElementById('viewPendingBtn').setAttribute('data-bs-toggle', 'modal');
    document.getElementById('viewPendingBtn').setAttribute('data-bs-target', '#pendingTasksModal');
    
    document.getElementById('viewUnassignedBtn').setAttribute('data-bs-toggle', 'modal');
    document.getElementById('viewUnassignedBtn').setAttribute('data-bs-target', '#unassignedResourcesModal');
    
    document.getElementById('viewCompletedBtn').setAttribute('data-bs-toggle', 'modal');
    document.getElementById('viewCompletedBtn').setAttribute('data-bs-target', '#completedResourcesModal');
    
    // Load resources when modals are opened
    document.getElementById('assignedResourcesModal').addEventListener('show.bs.modal', function() {
        loadModalResources('pending', 'assignedResourcesTable');
    });
    
    document.getElementById('pendingTasksModal').addEventListener('show.bs.modal', function() {
        loadModalResources('pending', 'pendingTasksTable');
    });
    
    document.getElementById('unassignedResourcesModal').addEventListener('show.bs.modal', function() {
        loadModalResources('unassigned', 'unassignedResourcesTable');
    });
    
    document.getElementById('completedResourcesModal').addEventListener('show.bs.modal', function() {
        loadModalResources('completed', 'completedResourcesTable');
    });
    
    // Function to load resources into modal tables
    function loadModalResources(status, tableId) {
        const tableBody = document.getElementById(tableId);
        tableBody.innerHTML = '<tr><td colspan="7" class="text-center"><div class="spinner-border text-primary" role="status"></div><p class="mt-2">Loading resources...</p></td></tr>';
        
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
                tableBody.innerHTML = '<tr><td colspan="7" class="text-center">No resources found</td></tr>';
                return;
            }
            
            // Clear table
            tableBody.innerHTML = '';
            
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
                
                // Create row content based on table type
                if (tableId === 'completedResourcesTable') {
                    row.innerHTML = `
                        <td>${resource.title || 'Untitled'}</td>
                        <td>${resource.type || 'Unknown'}</td>
                        <td>${resource.subject || 'N/A'}</td>
                        <td>${resource.adminEmail || 'Unknown'}</td>
                        <td>${formattedDate}</td>
                        <td>
                            <div class="btn-group">
                                <a href="${resource.fileURL || '#'}" class="btn btn-sm btn-primary" target="_blank">
                                    <i class="fas fa-eye"></i>
                                </a>
                                <button class="btn btn-sm btn-danger" onclick="deleteResource('${doc.id}')">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </td>
                    `;
                } else if (tableId === 'unassignedResourcesTable') {
                    row.innerHTML = `
                        <td>${resource.title || 'Untitled'}</td>
                        <td>${resource.type || 'Unknown'}</td>
                        <td>${resource.subject || 'N/A'}</td>
                        <td>${formattedDate}</td>
                        <td>${statusBadge}</td>
                        <td>
                            <div class="btn-group">
                                <a href="${resource.fileURL || '#'}" class="btn btn-sm btn-primary" target="_blank">
                                    <i class="fas fa-eye"></i>
                                </a>
                                <button class="btn btn-sm btn-success" onclick="assignResource('${doc.id}')">
                                    <i class="fas fa-user-plus"></i>
                                </button>
                                <button class="btn btn-sm btn-danger" onclick="deleteResource('${doc.id}')">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </td>
                    `;
                } else {
                    row.innerHTML = `
                        <td>${resource.title || 'Untitled'}</td>
                        <td>${resource.type || 'Unknown'}</td>
                        <td>${resource.subject || 'N/A'}</td>
                        <td>${resource.adminEmail || 'Unassigned'}</td>
                        <td>${formattedDate}</td>
                        <td>${statusBadge}</td>
                        <td>
                            <div class="btn-group">
                                <a href="${resource.fileURL || '#'}" class="btn btn-sm btn-primary" target="_blank">
                                    <i class="fas fa-eye"></i>
                                </a>
                                <button class="btn btn-sm btn-danger" onclick="deleteResource('${doc.id}')">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </td>
                    `;
                }
                
                tableBody.appendChild(row);
            });
        }).catch(error => {
            console.error('Error loading resources:', error);
            tableBody.innerHTML = '<tr><td colspan="7" class="text-center text-danger">Error loading resources</td></tr>';
        });
    }
    
    // Global function to delete a resource
    window.deleteResource = function(resourceId) {
        if (confirm('Are you sure you want to delete this resource?')) {
            const db = firebase.firestore();
            db.collection('adminResources').doc(resourceId).delete()
                .then(() => {
                    alert('Resource deleted successfully');
                    // Close all modals
                    const modals = document.querySelectorAll('.modal');
                    modals.forEach(modal => {
                        const modalInstance = bootstrap.Modal.getInstance(modal);
                        if (modalInstance) {
                            modalInstance.hide();
                        }
                    });
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
});