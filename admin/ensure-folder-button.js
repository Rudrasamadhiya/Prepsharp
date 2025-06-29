// Add a mutation observer to watch for changes to the DOM
const folderButtonObserver = new MutationObserver(function(mutations) {
    // Check if our button exists, if not add it
    if (!document.getElementById('folder-images-btn')) {
        if (typeof addFolderSelectionButton === 'function') {
            addFolderSelectionButton();
        }
    }
});

// Start observing the document body for changes
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        folderButtonObserver.observe(document.body, { childList: true, subtree: true });
    }, 2000);
});