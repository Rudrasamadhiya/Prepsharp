// Admin Resources functionality

// Function to load admin resources based on status
function loadAdminResources(status) {
    console.log("Loading resources with status:", status);
    const resourcesTable = document.getElementById('resourcesTableBody');
    resourcesTable.innerHTML = '<tr><td colspan="7" class="text-center"><div class="spinner-border text-primary" role="status"></div><p class="mt-2">Loading resources...</p></td></tr>';
    
    // Get Firebase references
    if (typeof db === 'undefined') {
        console.error("Firebase db is not defined");
        resourcesTable.innerHTML = '<tr><td colspan="7" class="text-center text-danger">Error: Firebase not initialized</td></tr>';
        return;
    }
    
    let query = db.collection('adminResources');
    
    // Apply status filter if provided
    if (status && status !== 'all') {
        query = query.where('status', '==', status);
    }
    
    // Order by date (newest first)
    query = query.orderBy('dateAssigned', 'desc');
    
    // Execute query
    query.get().then(snapshot => {
        if (snapshot.empty) {
            resourcesTable.innerHTML = '<tr><td colspan="7" class="text-center">No resources found matching the criteria.</td></tr>';
            return;
        }
        
        // Clear table
        resourcesTable.innerHTML = '';
        
        // Add resources to table
        snapshot.forEach(doc => {
            const resource = doc.data();
            const row = document.createElement('tr');
            
            // Format date
            const date = new Date(resource.dateAssigned);
            const formattedDate = date.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
            });
            
            // Determine resource type icon and class
            let typeIcon, typeLabel;
            if (resource.type && resource.type.includes('question_pdf')) {
                typeIcon = 'fa-file-pdf';
                typeLabel = '<span class="badge bg-danger">PDF</span> Question Paper';
            } else if (resource.type && resource.type.includes('question_doc')) {
                typeIcon = 'fa-file-word';
                typeLabel = '<span class="badge bg-primary">DOC</span> Question Paper';
            } else if (resource.type && resource.type.includes('solution_pdf')) {
                typeIcon = 'fa-file-pdf';
                typeLabel = '<span class="badge bg-danger">PDF</span> Solution';
            } else if (resource.type && resource.type.includes('solution_doc')) {
                typeIcon = 'fa-file-word';
                typeLabel = '<span class="badge bg-primary">DOC</span> Solution';
            } else {
                typeIcon = 'fa-file';
                typeLabel = 'Document';
            }
            
            // Determine status badge
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
                        <i class="fas ${typeIcon} text-primary me-2"></i>
                        <span>${resource.title || 'Untitled'}</span>
                        ${resource.priority ? '<span class="badge bg-danger ms-2">Priority</span>' : ''}
                    </div>
                </td>
                <td>${typeLabel}</td>
                <td>${resource.subject ? (resource.subject.charAt(0).toUpperCase() + resource.subject.slice(1)) : 'N/A'}</td>
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
        
        // Update table header to match the current view
        const tableHeader = document.querySelector('.card-header div:first-child');
        switch(status) {
            case 'pending':
                tableHeader.textContent = 'Pending Resources';
                break;
            case 'completed':
                tableHeader.textContent = 'Completed Resources';
                break;
            case 'unassigned':
                tableHeader.textContent = 'Unassigned Resources';
                break;
            default:
                tableHeader.textContent = 'All Admin Resources';
        }
        
        // Update resource count
        document.getElementById('resourceCount').textContent = snapshot.size;
    }).catch(error => {
        console.error('Error loading resources:', error);
        resourcesTable.innerHTML = '<tr><td colspan="7" class="text-center text-danger">Error loading resources. Please try again.</td></tr>';
    });
}

// Function to delete a resource
function deleteResource(resourceId) {
    if (confirm('Are you sure you want to delete this resource?')) {
        db.collection('adminResources').doc(resourceId).get().then(doc => {
            if (doc.exists) {
                const resource = doc.data();
                // Delete file from storage if it exists
                if (resource.storagePath) {
                    storage.ref(resource.storagePath).delete().catch(error => {
                        console.error('Error deleting file from storage:', error);
                    });
                }
                
                // Delete document from Firestore
                return db.collection('adminResources').doc(resourceId).delete();
            }
        }).then(() => {
            alert('Resource deleted successfully');
            // Reload current view
            const currentStatus = document.querySelector('.card-header div:first-child').textContent;
            let status = 'all';
            if (currentStatus.includes('Pending')) status = 'pending';
            else if (currentStatus.includes('Completed')) status = 'completed';
            else if (currentStatus.includes('Unassigned')) status = 'unassigned';
            loadAdminResources(status);
        }).catch(error => {
            console.error('Error deleting resource:', error);
            alert('Error deleting resource. Please try again.');
        });
    }
}

// Function to assign a resource to an admin
function assignResource(resourceId) {
    // This would typically open a modal to select an admin
    alert('This would open a modal to assign the resource to an admin');
    // For now, just reload the current view
    const currentStatus = document.querySelector('.card-header div:first-child').textContent;
    let status = 'all';
    if (currentStatus.includes('Pending')) status = 'pending';
    else if (currentStatus.includes('Completed')) status = 'completed';
    else if (currentStatus.includes('Unassigned')) status = 'unassigned';
    loadAdminResources(status);
}

// Load resources when the script is loaded
console.log("Admin resources script loaded");
setTimeout(function() {
    console.log("Loading initial resources");
    loadAdminResources('all');
}, 1000);