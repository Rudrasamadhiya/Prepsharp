// Enhanced modal functionality with quotes and animations
function showPaperDetailsModal(paper) {
    const quotes = [
        { text: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela" },
        { text: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King" },
        { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
        { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
        { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
        { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" }
    ];
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    
    const modal = document.createElement('div');
    modal.className = 'paper-details-modal';
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <div class="modal-header">
                <div class="header-content">
                    <div class="exam-icon">📚</div>
                    <h3>${paper.name || 'Unnamed Exam'}</h3>
                </div>
                <button class="close-btn">&times;</button>
            </div>
            <div class="modal-body">
                <div class="motivational-quote">
                    <div class="quote-icon">💡</div>
                    <blockquote>
                        "${randomQuote.text}"
                        <cite>— ${randomQuote.author}</cite>
                    </blockquote>
                </div>
                <div class="paper-info">
                    <h4>📊 Exam Information</h4>
                    <div class="info-grid">
                        <div class="info-item"><span class="icon">🎯</span><strong>Type:</strong> ${paper.type === 'jee-advanced' ? 'JEE Advanced' : 'JEE Main'}</div>
                        <div class="info-item"><span class="icon">📅</span><strong>Year:</strong> ${paper.year || 'Recent'}</div>
                        <div class="info-item"><span class="icon">⏰</span><strong>Duration:</strong> 3 hours</div>
                        <div class="info-item"><span class="icon">❓</span><strong>Questions:</strong> ${paper.questions?.length || paper.questionCount || (paper.type === 'jee-advanced' ? 54 : 90)}</div>
                        <div class="info-item"><span class="icon">📖</span><strong>Subjects:</strong> ${(paper.subjects || ['Physics', 'Chemistry', 'Mathematics']).join(', ')}</div>
                    </div>
                </div>
                <div class="paper-description">
                    <h4>📝 Description</h4>
                    <p>${paper.description || `${paper.type === 'jee-advanced' ? 'JEE Advanced' : 'JEE Main'} Examination from ${paper.year || 'recent'} session. Challenge yourself with this comprehensive test designed to evaluate your understanding and problem-solving skills.`}</p>
                </div>
            </div>
            <div class="modal-footer">
                <div class="footer-content">
                    <div class="encouragement">🚀 Ready to excel? Let's begin!</div>
                    <a href="../../exam/${paper.type === 'jee-advanced' ? 'advanced' : 'mains'}.html?id=${paper.id}" class="start-btn">
                        <span>Start Exam</span>
                        <span class="btn-icon">⚡</span>
                    </a>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal handlers
    modal.querySelector('.close-btn').onclick = () => modal.remove();
    modal.querySelector('.modal-overlay').onclick = () => modal.remove();
    
    // ESC key to close
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') modal.remove();
    });
}