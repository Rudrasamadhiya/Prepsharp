// Function to update paper name in header
function updatePaperName() {
    const paperNameElement = document.getElementById('paper-name');
    if (!examData) return;
    
    // Format the paper name according to exam type
    let formattedName = '';
    
    if (examData.type === 'jee-main') {
        const date = examData.date || '';
        const monthNum = examData.month || '';
        const shift = examData.shift || '';
        const year = examData.year || '';
        
        // Convert month number to name
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const monthName = monthNames[parseInt(monthNum) - 1] || '';
        
        formattedName = `JEE Main ${date}/${monthName} ${year} Shift ${shift}`;
    } else if (examData.type === 'neet') {
        formattedName = `NEET-${examData.year || ''}`;
    } else if (examData.type === 'jee-advanced') {
        const paperNum = examData.paperNumber || '';
        formattedName = `JEE Advanced Paper ${paperNum} ${examData.year || ''}`;
    } else {
        // Get exam title
        const examTitles = {
            'jee-advanced': 'JEE Advanced',
            'jee-main': 'JEE Main',
            'neet': 'NEET',
            'bitsat': 'BITSAT'
        };
        const examTitle = examTitles[examData.type] || examData.type || 'Exam';
        formattedName = `${examTitle} ${examData.year || ''}`;
    }
    
    // Set paper name
    paperNameElement.textContent = formattedName;
    console.log('Updated paper name:', formattedName);
}