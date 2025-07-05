// Fix section image upload for 2024-2
async function uploadSectionImages() {
    const examId = '2024-2';
    const sectionFiles = ['Section-1.png', 'Section-2.png', 'Section-3.png', 'Section-4.png'];
    
    for (let i = 0; i < sectionFiles.length; i++) {
        const fileName = sectionFiles[i];
        const filePath = `C:\\Users\\suppo\\OneDrive\\Desktop\\Prepsharp\\papers\\2024-2\\${fileName}`;
        
        try {
            // Create file input to read the image
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            
            // Simulate file selection
            const file = await fetch(filePath).then(r => r.blob());
            
            // Upload to Firebase Storage
            const storageRef = firebase.storage().ref(`papers/${examId}/sections/${fileName}`);
            const uploadTask = await storageRef.put(file);
            const downloadURL = await uploadTask.ref.getDownloadURL();
            
            console.log(`✓ ${fileName} uploaded successfully: ${downloadURL}`);
        } catch (error) {
            console.error(`✗ Failed to upload ${fileName}:`, error);
        }
    }
}

// Run the fix
uploadSectionImages();