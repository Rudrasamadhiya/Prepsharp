// Panel resources display
document.addEventListener('DOMContentLoaded', function() {
    // Create panels for each resource type
    createResourcePanel('assigned', 'Assigned Resources');
    createResourcePanel('pending', 'Pending Tasks');
    createResourcePanel('unassigned', 'Unassigned Resources');
    createResourcePanel('completed', 'Completed Resources');
    
    // Set up click handlers for admin resource buttons
    document.getElementById('viewAssignedBtn').addEventListener('click', function() {
        togglePanel('assigned-panel');
        loadResourcesInPanel('pending', 'assigned-panel-table');
    });
    
    document.getElementById('viewPendingBtn').addEventListener('click', function() {
        togglePanel('pending-panel');
        loadResourcesInPanel('pending', 'pending-panel-table');
    });
    
    document.getElementById('viewUnassignedBtn').addEventListener('click', function() {
        togglePanel('unassigned-panel');
        loadResourcesInPanel('unassigned', 'unassigned-panel-table');
    });
    
    document.getElementById('viewCompletedBtn').addEventListener('click', function() {
        togglePanel('completed-panel');
        loadResourcesInPanel('completed', 'completed-panel-table');
    });
    
    // Function to create resource panel
    function createResourcePanel(id, title) {
        const panel = document.createElement('div');
        panel.id = id + '-panel';
        panel.className = 'resource-panel card mt-3 mb-4 d-none';
        panel.innerHTML = `
            <div class="card-header bg-light d-flex justify-content-between align-items-center">
                <h5 class="mb-0">${title}</h5>
                <button type="button" class="btn-close" onclick="closePanel('${id}-panel')"></button>
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-hover">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Type</th>
                                <th>Subject</th>
                                <th>Assigned To</th>
                                <th>Date Added</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="${id}-panel-table">
                            <tr>
                                <td colspan="7" class="text-center">Loading resources...</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        
        // Find the parent row
        const parentRow = document.getElementById(id + '-row') || document.querySelector('.admin-resources-row');
        
        // Insert after the parent row
        parentRow.after(panel);
    }
    
    // Function to toggle panel visibility
    window.togglePanel = function(panelId) {
        // Hide all panels
        document.querySelectorAll('.resource-panel').forEach(panel => {
            panel.classList.add('d-none');
        });
        
        // Show the selected panel
        const panel = document.getElementById(panelId);
        panel.classList.remove('d-none');
    };
    
    // Function to close panel
    window.closePanel = function(panelId) {
        document.getElementById(panelId).classList.add('d-none');
    };
    
    // Function to load resources in panel
    function loadResourcesInPanel(status, tableId) {
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
                
                // Create row content
                row.innerHTML = `
                    <td>
                        <div class="d-flex align-items-center">
                            <i class="fas ${resource.type && resource.type.includes('pdf') ? 'fa-file-pdf' : 'fa-file-word'} text-primary me-2"></i>
                            <span>${resource.title || 'Untitled'}</span>
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
                            <button class="btn btn-sm btn-outline-danger" onclick="deleteResource('${doc.id}', '${tableId}')">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                `;
                
                tableBody.appendChild(row);
            });
        }).catch(error => {
            console.error('Error loading resources:', error);
            tableBody.innerHTML = '<tr><td colspan="7" class="text-center text-danger">Error loading resources</td></tr>';
        });
    }
    
    // Global function to delete a resource
    window.deleteResource = function(resourceId, tableId) {
        if (confirm('Are you sure you want to delete this resource?')) {
            const db = firebase.firestore();
            db.collection('adminResources').doc(resourceId).delete()
                .then(() => {
                    alert('Resource deleted successfully');
                    // Reload current panel
                    const status = tableId.includes('assigned') || tableId.includes('pending') ? 'pending' :
                                  tableId.includes('unassigned') ? 'unassigned' : 'completed';
                    loadResourcesInPanel(status, tableId);
                })
                .catch(error => {
                    console.error('Error deleting resource:', error);
                    alert('Error deleting resource');
                });
        }
    };
});