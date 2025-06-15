// PrepSharp Database Management
// This file handles all database operations for the application using GitHub-compatible approach

// Database structure
const DB = {
    // Test papers data
    papers: [
        {
            id: "jee-main-2023-p1",
            title: "JEE Main 2023 Paper 1",
            date: "January 2023",
            type: "JEE Main",
            questions: 90,
            duration: "3h",
            marks: 300,
            isNew: true,
            popularity: 2400,
            rating: 4.8,
            subjects: ["Physics", "Chemistry", "Mathematics"]
        },
        {
            id: "jee-main-2023-p2",
            title: "JEE Main 2023 Paper 2",
            date: "April 2023",
            type: "JEE Main",
            questions: 90,
            duration: "3h",
            marks: 300,
            isNew: false,
            popularity: 1800,
            rating: 4.5,
            subjects: ["Physics", "Chemistry", "Mathematics"]
        },
        {
            id: "jee-main-2022-p1",
            title: "JEE Main 2022 Paper 1",
            date: "January 2022",
            type: "JEE Main",
            questions: 90,
            duration: "3h",
            marks: 300,
            isNew: false,
            isPopular: true,
            popularity: 3200,
            rating: 4.9,
            subjects: ["Physics", "Chemistry", "Mathematics"]
        },
        {
            id: "jee-main-2022-p2",
            title: "JEE Main 2022 Paper 2",
            date: "April 2022",
            type: "JEE Main",
            questions: 90,
            duration: "3h",
            marks: 300,
            isNew: false,
            popularity: 1500,
            rating: 4.3,
            subjects: ["Physics", "Chemistry", "Mathematics"]
        },
        {
            id: "jee-main-2021-p1",
            title: "JEE Main 2021 Paper 1",
            date: "February 2021",
            type: "JEE Main",
            questions: 90,
            duration: "3h",
            marks: 300,
            isNew: false,
            popularity: 2100,
            rating: 4.6,
            subjects: ["Physics", "Chemistry", "Mathematics"]
        },
        {
            id: "jee-main-2021-p2",
            title: "JEE Main 2021 Paper 2",
            date: "March 2021",
            type: "JEE Main",
            questions: 90,
            duration: "3h",
            marks: 300,
            isNew: false,
            popularity: 1900,
            rating: 4.4,
            subjects: ["Physics", "Chemistry", "Mathematics"]
        }
    ]
};

// Initialize database from localStorage
function initDatabase() {
    try {
        // Try to fetch from server first (for GitHub integration)
        fetch('/api/users')
            .then(response => response.json())
            .then(data => {
                if (data.success && data.users) {
                    DB.users = data.users;
                    console.log('Users loaded from API');
                }
            })
            .catch(error => {
                console.log("Server fetch failed, using localStorage:", error);
                loadFromLocalStorage();
            });
    } catch (error) {
        console.error("Error initializing database:", error);
        loadFromLocalStorage();
    }
}

// Load data from localStorage as fallback
function loadFromLocalStorage() {
    // Load users
    const usersJson = localStorage.getItem('users');
    if (usersJson) {
        try {
            DB.users = JSON.parse(usersJson);
        } catch (e) {
            console.error("Error parsing users JSON:", e);
            DB.users = {};
        }
    } else {
        DB.users = {};
    }
    
    // Load user performance data
    const performanceJson = localStorage.getItem('userPerformance');
    if (performanceJson) {
        try {
            DB.userPerformance = JSON.parse(performanceJson);
        } catch (e) {
            DB.userPerformance = {};
        }
    } else {
        DB.userPerformance = {};
    }
}

// Get current logged in user
function getCurrentUser() {
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (loggedInUser) {
        return JSON.parse(loggedInUser);
    }
    return null;
}

// Get user performance data
function getUserPerformance(email) {
    if (!DB.userPerformance) {
        DB.userPerformance = {};
    }
    
    if (!DB.userPerformance[email]) {
        // Initialize with default data if not exists
        DB.userPerformance[email] = {
            overallScore: 68,
            subjectScores: {
                Physics: 65,
                Chemistry: 72,
                Mathematics: 58
            },
            completedPapers: 3,
            totalStudyTime: 12,
            questionsAnswered: 42,
            recentPerformance: [
                {
                    paperId: "jee-main-2023-p1",
                    date: "July 10, 2023",
                    score: 85,
                    timeTaken: "2h 45m",
                    status: "Completed"
                },
                {
                    paperId: "jee-main-2022-p2",
                    date: "July 5, 2023",
                    score: 72,
                    timeTaken: "2h 50m",
                    status: "Completed"
                },
                {
                    paperId: "jee-main-2022-p1",
                    date: "June 28, 2023",
                    score: 58,
                    timeTaken: "2h 30m",
                    status: "Completed"
                }
            ],
            monthlyScores: [55, 60, 58, 65, 68, 72, 75]
        };
        
        // Save to localStorage
        localStorage.setItem('userPerformance', JSON.stringify(DB.userPerformance));
    }
    
    return DB.userPerformance[email];
}

// Get available papers for user based on subscription
function getAvailablePapers(subscription = 'free') {
    // For free users, return only 2 papers
    if (subscription === 'free') {
        return DB.papers.slice(0, 2);
    }
    
    // For basic users, return all papers
    if (subscription === 'basic') {
        return DB.papers;
    }
    
    // For standard and premium users, return all papers
    return DB.papers;
}

// Initialize database on script load
initDatabase();

// Export database functions
window.DB = {
    getCurrentUser,
    getUserPerformance,
    getAvailablePapers,
    papers: DB.papers
};