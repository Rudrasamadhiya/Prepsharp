// PDF Uploader and Parser for JEE Advanced Papers
// This script helps extract questions from JEE Advanced PDF papers

// PDF.js library is required for this functionality
// Make sure to include the PDF.js library in your HTML:
// <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.11.338/pdf.min.js"></script>

class PDFUploader {
    constructor() {
        this.pdfData = null;
        this.currentPage = 1;
        this.totalPages = 0;
    }

    // Initialize PDF.js
    init() {
        if (window.pdfjsLib) {
            window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.11.338/pdf.worker.min.js';
        } else {
            console.error('PDF.js library not loaded');
        }
    }

    // Load PDF from file input
    async loadPDF(fileInput) {
        const file = fileInput.files[0];
        if (!file || file.type !== 'application/pdf') {
            throw new Error('Please select a valid PDF file');
        }

        const fileReader = new FileReader();
        
        return new Promise((resolve, reject) => {
            fileReader.onload = async (event) => {
                try {
                    const typedArray = new Uint8Array(event.target.result);
                    const loadingTask = pdfjsLib.getDocument(typedArray);
                    
                    this.pdfData = await loadingTask.promise;
                    this.totalPages = this.pdfData.numPages;
                    
                    resolve({
                        totalPages: this.totalPages,
                        filename: file.name
                    });
                } catch (error) {
                    reject(error);
                }
            };
            
            fileReader.onerror = reject;
            fileReader.readAsArrayBuffer(file);
        });
    }

    // Extract text from a specific page
    async extractTextFromPage(pageNumber) {
        if (!this.pdfData) {
            throw new Error('No PDF loaded');
        }

        const page = await this.pdfData.getPage(pageNumber);
        const textContent = await page.getTextContent();
        
        // Combine text items into a single string
        return textContent.items.map(item => item.str).join(' ');
    }

    // Extract all text from the PDF
    async extractAllText() {
        if (!this.pdfData) {
            throw new Error('No PDF loaded');
        }

        const textPromises = [];
        for (let i = 1; i <= this.totalPages; i++) {
            textPromises.push(this.extractTextFromPage(i));
        }

        return Promise.all(textPromises);
    }

    // Parse JEE Advanced questions from text
    parseJEEAdvancedQuestions(text) {
        // This is a simplified parser - you'll need to adapt it based on the actual PDF format
        const questions = [];
        
        // Split text into sections that might contain questions
        // This regex pattern looks for question numbers like "1.", "2.", etc.
        const questionSections = text.split(/\d+\.\s+/);
        
        // Skip the first section as it's likely to be header text
        for (let i = 1; i < questionSections.length; i++) {
            const section = questionSections[i].trim();
            
            // Skip empty sections
            if (!section) continue;
            
            // Try to identify the question text and options
            const lines = section.split('\n').map(line => line.trim()).filter(line => line);
            
            if (lines.length >= 5) { // Question + 4 options at minimum
                const questionText = lines[0];
                
                // Look for option indicators (A), (B), (C), (D) or similar patterns
                const optionPattern = /\([A-D]\)/;
                const optionIndices = [];
                
                for (let j = 0; j < lines.length; j++) {
                    if (optionPattern.test(lines[j])) {
                        optionIndices.push(j);
                    }
                }
                
                // If we found 4 options
                if (optionIndices.length === 4) {
                    const options = optionIndices.map((index, optionNum) => {
                        const optionText = lines[index].replace(optionPattern, '').trim();
                        return {
                            text: optionText,
                            correct: false // We don't know the correct answer from the PDF
                        };
                    });
                    
                    // Determine subject based on keywords
                    let subject = 'physics'; // Default
                    const lowerText = questionText.toLowerCase();
                    
                    if (lowerText.includes('atom') || lowerText.includes('molecule') || 
                        lowerText.includes('compound') || lowerText.includes('reaction')) {
                        subject = 'chemistry';
                    } else if (lowerText.includes('integral') || lowerText.includes('derivative') || 
                               lowerText.includes('equation') || lowerText.includes('function')) {
                        subject = 'mathematics';
                    }
                    
                    questions.push({
                        id: `q${Date.now()}-${i}`,
                        subject,
                        text: questionText,
                        options,
                        type: 'scq'
                    });
                }
            }
        }
        
        return questions;
    }
}

// Export the class
window.PDFUploader = PDFUploader;