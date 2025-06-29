// Direct fix for recent data not showing
setTimeout(function() {
    if (typeof loadRecentUsers === 'function') {
        loadRecentUsers();
    }
    
    if (typeof loadRecentExams === 'function') {
        loadRecentExams();
    }
}, 1000);