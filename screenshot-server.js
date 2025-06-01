const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(express.static('public'));

// Ensure the papers directory exists
const papersDir = path.join(__dirname, 'papers');
if (!fs.existsSync(papersDir)) {
    fs.mkdirSync(papersDir);
}

// Route to save files
app.post('/save-screenshot', (req, res) => {
    const { imageData, folderName, fileName } = req.body;
    
    if (!imageData || !folderName || !fileName) {
        return res.status(400).json({ success: false, message: 'Missing required parameters' });
    }
    
    try {
        // Create folder if it doesn't exist
        const folderPath = path.join(papersDir, folderName);
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
        }
        
        // Remove the data URL prefix and convert to buffer
        const base64Data = imageData.replace(/^data:image\/[^;]+;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');
        
        // Save the file
        const filePath = path.join(folderPath, fileName);
        fs.writeFileSync(filePath, buffer);
        
        res.json({ 
            success: true, 
            message: 'File saved successfully',
            path: filePath
        });
    } catch (error) {
        console.error('Error saving file:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to save file',
            error: error.message
        });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`File upload server running on http://localhost:${PORT}`);
    console.log(`Files will be saved to: ${papersDir}`);
});