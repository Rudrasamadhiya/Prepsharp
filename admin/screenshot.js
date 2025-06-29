// Simple screenshot function using native browser APIs
function takeScreenshot() {
    return new Promise((resolve, reject) => {
        try {
            // Create a canvas element
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            
            // Set canvas dimensions to window size
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            
            // Draw the current view to the canvas
            context.drawImage(window, 0, 0, window.innerWidth, window.innerHeight);
            
            // Convert canvas to data URL
            const dataUrl = canvas.toDataURL('image/png');
            resolve(dataUrl);
        } catch (error) {
            reject(error);
        }
    });
}