// Direct Firebase implementation
document.addEventListener('DOMContentLoaded', function() {
    // Set up click handlers for all buttons
    document.getElementById('viewAssignedBtn').onclick = function() {
        fetchAndDisplayResources('pending');
    };
    
    document.getElementById('viewPendingBtn').onclick = function() {
        fetchAndDisplayResources('pending');
    };
    
    document.getElementById('viewUnassignedBtn').onclick = function() {
        fetchAndDisplayResources('unassigned');
    };
    
    document.getElementById('viewCompletedBtn').onclick = function() {
        fetchAndDisplayResources('completed');
    };
    
    // Function to fetch and display resources
    function fetchAndDisplayResources(status) {
        const resourcesTable = document.getElementById('resourcesTableBody');
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
                
                resourcesTable.appendChild(row);
            });
            
            // Update table header
            const tableHeader = document.querySelector('.card-header div:first-child');
            tableHeader.textContent = status === 'all' ? 'All Resources' : 
                                     status === 'pending' ? 'Pending Resources' :
                                     status === 'completed' ? 'Completed Resources' :
                                     status === 'unassigned' ? 'Unassigned Resources' : 'Resources';
        }).catch(error => {
            console.error('Error fetching resources:', error);
            resourcesTable.innerHTML = '<tr><td colspan="7" class="text-center text-danger">Error loading resources</td></tr>';
        });
    }
    
    // Function to delete a resource
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
                    fetchAndDisplayResources(status);
                })
                .catch(error => {
                    console.error('Error deleting resource:', error);
                    alert('Error deleting resource');
                });
        }
    };
    
    // Load all resources initially
    setTimeout(() => {
        fetchAndDisplayResources('all');
    }, 1000);
});