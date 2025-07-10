/**
 * Timer Integration Script
 * Server-synchronized timer for multiple concurrent users
 */

document.addEventListener('DOMContentLoaded', () => {
    // Get exam and user IDs from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const examId = urlParams.get('paperId') || urlParams.get('id') || urlParams.get('examId') || 'default-exam';
    
    // Get user ID from session or generate one
    const userId = getUserId();
    
    // Default duration (will be overridden by server value)
    const defaultDuration = parseInt(urlParams.get('duration') || '180') * 60; // Convert minutes to seconds
    
    // Initialize timer with server synchronization
    initializeExamTimer(examId, userId, defaultDuration);
    
    // Function to get or create user ID
    function getUserId() {
        // Try to get from session storage first
        let userId = sessionStorage.getItem('examUserId');
        
        // If not found, check localStorage
        if (!userId) {
            userId = localStorage.getItem('examUserId');
        }
        
        // If still not found, get from logged in user or generate new ID
        if (!userId) {
            const loggedInUser = localStorage.getItem('loggedInUser') || sessionStorage.getItem('loggedInUser');
            if (loggedInUser) {
                try {
                    const userData = JSON.parse(loggedInUser);
                    userId = userData.email || userData.uid;
                } catch (e) {
                    console.error('Error parsing user data:', e);
                }
            }
            
            // If still no user ID, generate a random one
            if (!userId) {
                userId = 'user_' + Math.random().toString(36).substring(2, 15);
                localStorage.setItem('examUserId', userId);
                sessionStorage.setItem('examUserId', userId);
            }
        }
        
        return userId;
    }
    
    // Initialize timer with server synchronization
    function initializeExamTimer(examId, userId, defaultDuration) {
        // First, try to get exam session from server
        fetchExamSession(examId, userId)
            .then(sessionData => {
                // Initialize timer with server data
                initializeTimer(sessionData);
            })
            .catch(error => {
                console.error('Error fetching exam session:', error);
                // Fallback to default duration if server fetch fails
                initializeTimer({
                    examId: examId,
                    userId: userId,
                    timeRemaining: defaultDuration,
                    startTime: new Date().toISOString(),
                    endTime: new Date(Date.now() + defaultDuration * 1000).toISOString(),
                    completed: false
                });
            });
    }
    
    // Fetch exam session from server
    function fetchExamSession(examId, userId) {
        return new Promise((resolve, reject) => {
            // If Firebase is available, use it
            if (window.db) {
                window.db.collection('examSessions')
                    .where('examId', '==', examId)
                    .where('userId', '==', userId)
                    .limit(1)
                    .get()
                    .then(snapshot => {
                        if (!snapshot.empty) {
                            // Session exists, use it
                            const sessionData = snapshot.docs[0].data();
                            sessionData.id = snapshot.docs[0].id;
                            resolve(sessionData);
                        } else {
                            // No session, create a new one
                            const newSession = {
                                examId: examId,
                                userId: userId,
                                startTime: new Date().toISOString(),
                                endTime: new Date(Date.now() + defaultDuration * 1000).toISOString(),
                                timeRemaining: defaultDuration,
                                completed: false,
                                answers: {},
                                markedQuestions: {},
                                lastSynced: new Date().toISOString()
                            };
                            
                            // Save to Firebase
                            window.db.collection('examSessions').add(newSession)
                                .then(docRef => {
                                    newSession.id = docRef.id;
                                    resolve(newSession);
                                })
                                .catch(reject);
                        }
                    })
                    .catch(reject);
            } else {
                // No Firebase, use default values
                reject(new Error('Firebase not available'));
            }
        });
    }
    
    // Initialize timer with session data
    function initializeTimer(sessionData) {
        // Calculate remaining time based on end time
        let timeRemaining = sessionData.timeRemaining;
        
        if (sessionData.endTime) {
            const endTime = new Date(sessionData.endTime).getTime();
            const now = Date.now();
            timeRemaining = Math.max(0, Math.floor((endTime - now) / 1000));
        }
        
        // If exam is completed or time is up, use default duration
        if (sessionData.completed || timeRemaining <= 0) {
            // Check if this is a new attempt
            if (confirm('Your previous exam session has ended. Start a new attempt?')) {
                // Create new session with default duration
                createNewSession(sessionData.examId, sessionData.userId, defaultDuration);
                return;
            }
        }
        
        // Initialize the timer
        const examTimer = new ExamTimer({
            duration: defaultDuration,
            timeRemaining: timeRemaining,
            timerElement: document.getElementById('timer'),
            onTimeUp: () => {
                // Time's up handler
                document.getElementById('submitModal').classList.add('active');
                document.getElementById('summaryText').textContent = 'Time is up! Your exam will be submitted automatically.';
                
                // Auto-submit after 5 seconds
                setTimeout(() => {
                    if (typeof submitExam === 'function') {
                        submitExam();
                        
                        // Mark as completed on server
                        syncWithServer(sessionData, true);
                    }
                }, 5000);
            },
            onTick: (remainingTime) => {
                // Sync with server every 30 seconds
                if (remainingTime % 30 === 0) {
                    syncWithServer(sessionData, false);
                }
            },
            warningThresholds: [
                { time: 60 * 60, message: '1 hour remaining!' },
                { time: 30 * 60, message: '30 minutes remaining!' },
                { time: 15 * 60, message: '15 minutes remaining!' },
                { time: 5 * 60, message: '5 minutes remaining!' },
                { time: 60, message: '1 minute remaining!' }
            ]
        });
        
        // Override the default warning method
        examTimer.showWarning = (message) => {
            showNotification(message);
        };
        
        // Start the timer
        examTimer.start();
        
        // Make timer accessible globally
        window.examTimer = examTimer;
        
        // Load answers from session if available
        if (sessionData.answers) {
            window.userAnswers = sessionData.answers;
        }
        
        // Load marked questions if available
        if (sessionData.markedQuestions) {
            window.markedQuestions = sessionData.markedQuestions;
        }
        
        // When exam is submitted, mark as completed
        const confirmSubmit = document.getElementById('confirmSubmit');
        if (confirmSubmit) {
            confirmSubmit.addEventListener('click', () => {
                syncWithServer(sessionData, true);
            });
        }
        
        // Also handle the original submitExam function
        if (typeof window.submitExam === 'function') {
            const originalSubmitExam = window.submitExam;
            window.submitExam = function() {
                syncWithServer(sessionData, true);
                return originalSubmitExam.apply(this, arguments);
            };
        }
    }
    
    // Create a new exam session
    function createNewSession(examId, userId, duration) {
        if (window.db) {
            const newSession = {
                examId: examId,
                userId: userId,
                startTime: new Date().toISOString(),
                endTime: new Date(Date.now() + duration * 1000).toISOString(),
                timeRemaining: duration,
                completed: false,
                answers: {},
                markedQuestions: {},
                lastSynced: new Date().toISOString()
            };
            
            window.db.collection('examSessions').add(newSession)
                .then(docRef => {
                    newSession.id = docRef.id;
                    initializeTimer(newSession);
                })
                .catch(error => {
                    console.error('Error creating new session:', error);
                    // Fallback to local timer
                    initializeTimer(newSession);
                });
        }
    }
    
    // Sync exam progress with server
    function syncWithServer(sessionData, completed = false) {
        if (!window.db || !sessionData.id) return;
        
        const examTimer = window.examTimer;
        if (!examTimer) return;
        
        // Calculate new end time based on remaining time
        const remainingTime = examTimer.getRemainingTime();
        const endTime = new Date(Date.now() + remainingTime * 1000).toISOString();
        
        const updates = {
            timeRemaining: remainingTime,
            endTime: endTime,
            answers: window.userAnswers || {},
            markedQuestions: window.markedQuestions || {},
            lastSynced: new Date().toISOString(),
            completed: completed
        };
        
        // If completed, add score
        if (completed) {
            updates.score = Math.floor(Math.random() * 100); // Demo score
            updates.completedAt = new Date().toISOString();
        }
        
        // Update in Firebase
        window.db.collection('examSessions').doc(sessionData.id).update(updates)
            .catch(error => {
                console.error('Error syncing with server:', error);
            });
    }
    
    // Function to show custom notification
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'exam-notification';
        notification.textContent = message;
        
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.left = '50%';
        notification.style.transform = 'translateX(-50%)';
        notification.style.backgroundColor = '#0066cc';
        notification.style.color = 'white';
        notification.style.padding = '10px 20px';
        notification.style.borderRadius = '5px';
        notification.style.boxShadow = '0 3px 10px rgba(0,0,0,0.2)';
        notification.style.zIndex = '1000';
        notification.style.transition = 'all 0.3s ease';
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
});