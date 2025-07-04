// Script to navigate to the next unanswered question on page load
document.addEventListener('DOMContentLoaded', function() {
    // Get exam ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const examId = urlParams.get('examId') || 'default-exam';
    
    // Initialize Firebase if not already initialized
    let db;
    try {
        if (!firebase.apps.length) {
            firebase.initializeApp({
                apiKey: "AIzaSyCtkee-Lv8lEMestaSVJxx7yvKB-lBygPQ",
                authDomain: "prepsharp-c91fd.firebaseapp.com",
                projectId: "prepsharp-c91fd",
                storageBucket: "prepsharp-c91fd.firebasestorage.app",
                messagingSenderId: "688294848433",
                appId: "1:688294848433:web:dd93fc6d61d62392473f90",
                measurementId: "G-LLJSLMXMNY"
            });
        }
        db = firebase.firestore();
        console.log("Firebase initialized for next unanswered question");
    } catch (error) {
        console.error("Firebase initialization error:", error);
    }
    
    // Function to find the next unanswered question
    function findNextUnansweredQuestion() {
        if (!db) return;
        
        // Show loading message
        const loadingMsg = document.createElement('div');
        loadingMsg.id = 'loading-next-question';
        loadingMsg.className = 'alert alert-info';
        loadingMsg.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i> Finding next unanswered question...';
        loadingMsg.style.position = 'fixed';
        loadingMsg.style.top = '10px';
        loadingMsg.style.left = '50%';
        loadingMsg.style.transform = 'translateX(-50%)';
        loadingMsg.style.zIndex = '9999';
        document.body.appendChild(loadingMsg);
        
        // Get all questions for this exam
        db.collection('papers').doc(examId).collection('questions')
            .get()
            .then(snapshot => {
                // Get all question numbers that exist
                const existingQuestionNumbers = new Set();
                snapshot.docs.forEach(doc => {
                    const data = doc.data();
                    if (data.questionNo) {
                        existingQuestionNumbers.add(data.questionNo);
                    }
                });
                
                // Find the first gap or the next question after the highest
                let nextQuestion = 1;
                const totalQuestions = 75; // Assuming 75 questions total
                
                for (let i = 1; i <= totalQuestions; i++) {
                    if (!existingQuestionNumbers.has(i)) {
                        nextQuestion = i;
                        break;
                    }
                }
                
                // If all questions are answered, go to the next one after the highest
                if (existingQuestionNumbers.size > 0 && nextQuestion === 1) {
                    nextQuestion = Math.max(...existingQuestionNumbers) + 1;
                }
                
                // Navigate to that question
                navigateToQuestion(nextQuestion);
                
                // Remove loading message
                document.body.removeChild(loadingMsg);
            })
            .catch(error => {
                console.error("Error finding next question:", error);
                
                // Remove loading message
                if (document.getElementById('loading-next-question')) {
                    document.body.removeChild(document.getElementById('loading-next-question'));
                }
            });
    }
    
    // Function to navigate to a specific question
    function navigateToQuestion(questionNumber) {
        // If we have a jumpToQuestion function, use it
        if (typeof jumpToQuestion === 'function') {
            jumpToQuestion(questionNumber - 1); // Convert to 0-based index
            return;
        }
        
        // If we have section navigation, use it
        if (typeof getSectionForQuestion === 'function' && typeof jumpToSection === 'function') {
            const sectionIndex = getSectionForQuestion(questionNumber);
            jumpToSection(sectionIndex);
            return;
        }
        
        // Direct manipulation as fallback
        if (typeof window.currentQuestionIndex !== 'undefined') {
            window.currentQuestionIndex = questionNumber - 1;
            if (typeof updateQuestionFields === 'function') {
                updateQuestionFields();
            }
        }
    }
    
    // Wait for everything to load, then find next unanswered question
    setTimeout(findNextUnansweredQuestion, 1500);
});