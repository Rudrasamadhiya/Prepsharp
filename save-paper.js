/**
 * Save paper functionality for JEE Advanced 2024 Paper 1
 */

// Function to save paper to database
function savePaperToDatabase(paperData) {
    // Get existing papers from localStorage
    let papers = [];
    try {
        const papersJson = localStorage.getItem('papers');
        if (papersJson) {
            papers = JSON.parse(papersJson);
        }
    } catch (e) {
        console.error('Error parsing papers from localStorage:', e);
    }
    
    // Find the paper with id jee-adv-2024-p1
    const paperIndex = papers.findIndex(p => p.id === 'jee-adv-2024-p1');
    
    if (paperIndex >= 0) {
        // Update existing paper
        papers[paperIndex] = {
            ...papers[paperIndex],
            ...paperData,
            updatedAt: new Date().toISOString()
        };
    } else {
        // Add new paper
        papers.push({
            id: 'jee-adv-2024-p1',
            name: 'JEE Advanced 2024: Paper 1',
            type: 'jee-advanced',
            year: '2024',
            paperNumber: '1',
            subjects: ['physics', 'chemistry', 'mathematics'],
            ...paperData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });
    }
    
    // Save back to localStorage
    localStorage.setItem('papers', JSON.stringify(papers));
    
    // Also update the papers.json file if possible
    // This would typically be done via a server API
    console.log('Paper saved to localStorage. In a real application, this would also update the server database.');
    
    return 'jee-adv-2024-p1';
}

// Export function
window.savePaperToDatabase = savePaperToDatabase;