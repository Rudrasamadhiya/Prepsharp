// This script fixes the question count display in the exam list

document.addEventListener('DOMContentLoaded', function() {
    // Wait for the page to fully load
    setTimeout(function() {
        // Find all exam rows and cards
        const examElements = document.querySelectorAll('.list-row, .col-md-4');
        
        // Process each exam element
        examElements.forEach(element => {
            // Find the exam ID from links
            const links = element.querySelectorAll('a[href^="edit-exam.html?id="]');
            if (links.length > 0) {
                const href = links[0].getAttribute('href');
                const examId = href.split('=')[1];
                
                if (examId) {
                    // Set data attribute
                    element.setAttribute('data-exam-id', examId);
                    
                    // Find question count element
                    const countElement = element.querySelector('.question-count');
                    if (!countElement) {
                        // If no element with question-count class, find the one showing the count
                        const countElements = element.querySelectorAll('span');
                        countElements.forEach(span => {
                            if (span.textContent === '0' || /^\d+$/.test(span.textContent.trim())) {
                                span.classList.add('question-count');
                            }
                        });
                    }
                    
                    // Fetch the actual count
                    db.collection('papers').doc(examId).collection('questions').get()
                        .then(snapshot => {
                            const count = snapshot.size;
                            const countElements = element.querySelectorAll('.question-count');
                            countElements.forEach(el => {
                                el.textContent = count;
                            });
                        })
                        .catch(error => {
                            console.error("Error getting questions:", error);
                        });
                }
            }
        });
    }, 2000); // Wait 2 seconds for everything to render
});

// Run this every 5 seconds to catch any updates
setInterval(function() {
    const examElements = document.querySelectorAll('[data-exam-id]');
    examElements.forEach(element => {
        const examId = element.getAttribute('data-exam-id');
        if (examId) {
            db.collection('papers').doc(examId).collection('questions').get()
                .then(snapshot => {
                    const count = snapshot.size;
                    const countElements = element.querySelectorAll('.question-count');
                    countElements.forEach(el => {
                        el.textContent = count;
                    });
                })
                .catch(error => {
                    console.error("Error getting questions:", error);
                });
        }
    });
}, 5000);