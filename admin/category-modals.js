// Category modals
document.addEventListener('DOMContentLoaded', function() {
    // Set up button click handlers to open modals
    document.getElementById('viewAssignedBtn').setAttribute('data-bs-toggle', 'modal');
    document.getElementById('viewAssignedBtn').setAttribute('data-bs-target', '#assignedModal');
    
    document.getElementById('viewPendingBtn').setAttribute('data-bs-toggle', 'modal');
    document.getElementById('viewPendingBtn').setAttribute('data-bs-target', '#pendingModal');
    
    document.getElementById('viewUnassignedBtn').setAttribute('data-bs-toggle', 'modal');
    document.getElementById('viewUnassignedBtn').setAttribute('data-bs-target', '#unassignedModal');
    
    document.getElementById('viewCompletedBtn').setAttribute('data-bs-toggle', 'modal');
    document.getElementById('viewCompletedBtn').setAttribute('data-bs-target', '#completedModal');
    
    // Load resources when modals are opened
    document.getElementById('assignedModal').addEventListener('show.bs.modal', function() {
        loadCategoryStats('pending', 'assignedStats');
    });
    
    document.getElementById('pendingModal').addEventListener('show.bs.modal', function() {
        loadCategoryStats('pending', 'pendingStats');
    });
    
    document.getElementById('unassignedModal').addEventListener('show.bs.modal', function() {
        loadCategoryStats('unassigned', 'unassignedStats');
    });
    
    document.getElementById('completedModal').addEventListener('show.bs.modal', function() {
        loadCategoryStats('completed', 'completedStats');
    });
    
    // Function to load category statistics
    function loadCategoryStats(status, containerId) {
        const container = document.getElementById(containerId);
        container.innerHTML = '<div class="text-center"><div class="spinner-border text-primary" role="status"></div><p class="mt-2">Loading statistics...</p></div>';
        
        // Get Firebase reference
        const db = firebase.firestore();
        let query = db.collection('adminResources');
        
        // Filter by status
        query = query.where('status', '==', status);
        
        // Execute query
        query.get().then(snapshot => {
            if (snapshot.empty) {
                container.innerHTML = '<div class="alert alert-info">No resources found in this category.</div>';
                return;
            }
            
            // Count resources by type and subject
            const stats = {
                total: snapshot.size,
                byType: {},
                bySubject: {},
                byAdmin: {}
            };
            
            snapshot.forEach(doc => {
                const resource = doc.data();
                
                // Count by type
                const type = resource.type || 'Unknown';
                stats.byType[type] = (stats.byType[type] || 0) + 1;
                
                // Count by subject
                const subject = resource.subject || 'Unknown';
                stats.bySubject[subject] = (stats.bySubject[subject] || 0) + 1;
                
                // Count by admin
                const admin = resource.adminEmail || 'Unassigned';
                stats.byAdmin[admin] = (stats.byAdmin[admin] || 0) + 1;
            });
            
            // Create HTML for stats
            let html = `
                <div class="row">
                    <div class="col-md-4">
                        <div class="card mb-3">
                            <div class="card-body text-center">
                                <h1 class="display-4">${stats.total}</h1>
                                <p class="text-muted">Total Resources</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-8">
                        <div class="card mb-3">
                            <div class="card-body">
                                <h5>Resource Types</h5>
                                <ul class="list-group">
            `;
            
            // Add type stats
            Object.keys(stats.byType).forEach(type => {
                const percentage = Math.round((stats.byType[type] / stats.total) * 100);
                html += `
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        ${type}
                        <span class="badge bg-primary rounded-pill">${stats.byType[type]} (${percentage}%)</span>
                    </li>
                `;
            });
            
            html += `
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6">
                        <div class="card mb-3">
                            <div class="card-body">
                                <h5>By Subject</h5>
                                <ul class="list-group">
            `;
            
            // Add subject stats
            Object.keys(stats.bySubject).forEach(subject => {
                const percentage = Math.round((stats.bySubject[subject] / stats.total) * 100);
                html += `
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        ${subject.charAt(0).toUpperCase() + subject.slice(1)}
                        <span class="badge bg-success rounded-pill">${stats.bySubject[subject]} (${percentage}%)</span>
                    </li>
                `;
            });
            
            html += `
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="card mb-3">
                            <div class="card-body">
                                <h5>By Admin</h5>
                                <ul class="list-group">
            `;
            
            // Add admin stats
            Object.keys(stats.byAdmin).forEach(admin => {
                const percentage = Math.round((stats.byAdmin[admin] / stats.total) * 100);
                html += `
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        ${admin}
                        <span class="badge bg-info rounded-pill">${stats.byAdmin[admin]} (${percentage}%)</span>
                    </li>
                `;
            });
            
            html += `
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-12">
                        <button class="btn btn-primary" onclick="viewAllResources('${status}')">View All Resources</button>
                    </div>
                </div>
            `;
            
            container.innerHTML = html;
        }).catch(error => {
            console.error('Error loading statistics:', error);
            container.innerHTML = '<div class="alert alert-danger">Error loading statistics. Please try again.</div>';
        });
    }
    
    // Function to view all resources
    window.viewAllResources = function(status) {
        // Close the modal
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            const modalInstance = bootstrap.Modal.getInstance(modal);
            if (modalInstance) {
                modalInstance.hide();
            }
        });
        
        // Update the main table
        const resourcesTable = document.getElementById('resourcesTableBody');
        resourcesTable.innerHTML = '<tr><td colspan="7" class="text-center"><div class="spinner-border text-primary" role="status"></div><p class="mt-2">Loading resources...</p></td></tr>';
        
        // Update table header
        const tableHeader = document.querySelector('.card-header div:first-child');
        if (status === 'pending') {
            tableHeader.textContent = 'Pending Resources';
        } else if (status === 'completed') {
            tableHeader.textContent = 'Completed Resources';
        } else if (status === 'unassigned') {
            tableHeader.textContent = 'Unassigned Resources';
        }
        
        // Get Firebase reference
        const db = firebase.firestore();
        let query = db.collection('adminResources');
        
        // Filter by status
        query = query.where('status', '==', status);
        
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
                            <a href="${resource.fileURL || '#'}" class="btn btn-sm btn-outline-primary" target="_blank">
                                <i class="fas fa-eye"></i>
                            </a>
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
    };
    
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
                    viewAllResources(status);
                })
                .catch(error => {
                    console.error('Error deleting resource:', error);
                    alert('Error deleting resource');
                });
        }
    };
});