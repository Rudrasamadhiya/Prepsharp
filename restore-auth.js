// Quick script to restore authentication for ai-coach.html
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'dashboards', 'premium', 'ai-coach.html');

fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        return;
    }
    
    // Restore the auth-check.js script
    const updatedContent = data.replace(
        '    <!-- <script src="../../js/auth-check.js"></script> -->',
        '    <script src="../../js/auth-check.js"></script>'
    );
    
    fs.writeFile(filePath, updatedContent, 'utf8', (err) => {
        if (err) {
            console.error('Error writing file:', err);
            return;
        }
        console.log('✅ Authentication restored successfully for ai-coach.html');
    });
});