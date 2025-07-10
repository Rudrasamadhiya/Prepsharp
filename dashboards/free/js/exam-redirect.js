// Script to redirect to the exam page with a random exam ID
document.addEventListener('DOMContentLoaded', function() {
    // Find all links to the demo exam
    const demoLinks = document.querySelectorAll('a[href="../../exam/index.html"]');
    
    demoLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Try to get a random paper ID from the papers grid
            const paperCards = document.querySelectorAll('.paper-card');
            if (paperCards.length > 0) {
                // Get a random paper card that's not premium
                const availablePapers = Array.from(paperCards).filter(card => !card.querySelector('.locked-overlay'));
                
                if (availablePapers.length > 0) {
                    const randomPaper = availablePapers[Math.floor(Math.random() * availablePapers.length)];
                    const paperId = randomPaper.getAttribute('data-paper-id');
                    const paperType = randomPaper.getAttribute('data-paper-type');
                    
                    if (paperId) {
                        // Redirect to the appropriate exam page based on paper type
                        if (paperType === 'jee-advanced') {
                            window.location.href = `../../exam/advanced.html?id=${paperId}`;
                        } else {
                            window.location.href = `../../exam/mains.html?id=${paperId}`;
                        }
                        return;
                    }
                }
            }
            
            // Fallback to a demo mode if no papers are available
            // Randomly choose between mains and advanced
            const examTypes = ['mains', 'advanced'];
            const randomType = examTypes[Math.floor(Math.random() * examTypes.length)];
            window.location.href = `../../exam/${randomType}.html?demo=true`;
        });
    });
});