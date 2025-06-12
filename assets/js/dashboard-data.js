/**
 * Dashboard Data Service
 * Handles fetching and processing data for all dashboard types
 */

class DashboardDataService {
    constructor() {
        this.apiBaseUrl = '../../backend/api';
        this.userData = null;
        this.studyData = null;
        this.examData = null;
    }

    // Fetch user data from the server or use mock data if in development
    async getUserData() {
        if (this.userData) return this.userData;
        
        try {
            const response = await fetch(`${this.apiBaseUrl}/user-data.json`);
            if (response.ok) {
                this.userData = await response.json();
            } else {
                // Fallback to mock data
                this.userData = this.getMockUserData();
            }
        } catch (error) {
            console.log('Error fetching user data, using mock data instead', error);
            this.userData = this.getMockUserData();
        }
        
        return this.userData;
    }
    
    // Fetch study plan data
    async getStudyPlanData() {
        if (this.studyData) return this.studyData;
        
        try {
            const response = await fetch(`${this.apiBaseUrl}/study-plan.json`);
            if (response.ok) {
                this.studyData = await response.json();
            } else {
                // Fallback to mock data
                this.studyData = this.getMockStudyPlanData();
            }
        } catch (error) {
            console.log('Error fetching study data, using mock data instead', error);
            this.studyData = this.getMockStudyPlanData();
        }
        
        return this.studyData;
    }
    
    // Fetch exam and performance data
    async getExamData() {
        if (this.examData) return this.examData;
        
        try {
            const response = await fetch(`${this.apiBaseUrl}/exam-data.json`);
            if (response.ok) {
                this.examData = await response.json();
            } else {
                // Fallback to mock data
                this.examData = this.getMockExamData();
            }
        } catch (error) {
            console.log('Error fetching exam data, using mock data instead', error);
            this.examData = this.getMockExamData();
        }
        
        return this.examData;
    }
    
    // Generate mock user data for development
    getMockUserData() {
        return {
            id: 'usr12345',
            name: 'John Smith',
            email: 'john.smith@example.com',
            phone: '+91 9876543210',
            institution: 'Delhi Public School',
            targetExam: 'JEE Advanced',
            planType: 'premium', // 'basic', 'standard', or 'premium'
            planStartDate: '2023-06-15',
            planEndDate: '2024-06-15',
            profileImage: '../../assets/images/user-avatar.png',
            stats: {
                overallProgress: 85,
                performanceRank: 8, // Top 8%
                papersCompleted: 42,
                studyHours: 128,
                planAdherence: 85,
                dailyAvgHours: 4.2
            },
            notifications: 7
        };
    }
    
    // Generate mock study plan data
    getMockStudyPlanData() {
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        
        // Generate calendar days for current month
        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();
        
        const calendarDays = [];
        
        // Previous month days
        for (let i = firstDay - 1; i >= 0; i--) {
            calendarDays.push({
                day: prevMonthDays - i,
                currentMonth: false,
                subjects: []
            });
        }
        
        // Current month days
        for (let i = 1; i <= daysInMonth; i++) {
            const subjects = [];
            
            // Add random subjects for demonstration
            if (i % 2 === 0) subjects.push('physics');
            if (i % 3 === 0) subjects.push('chemistry');
            if (i % 4 === 0) subjects.push('mathematics');
            
            calendarDays.push({
                day: i,
                currentMonth: true,
                today: i === today.getDate(),
                subjects: subjects
            });
        }
        
        // Generate tasks for today
        const tasks = [
            {
                id: 'task1',
                title: 'Complete Kinematics Practice Set',
                startTime: '10:00 AM',
                endTime: '12:00 PM',
                subject: 'physics',
                completed: false
            },
            {
                id: 'task2',
                title: 'Organic Chemistry Revision',
                startTime: '2:00 PM',
                endTime: '4:00 PM',
                subject: 'chemistry',
                completed: false
            },
            {
                id: 'task3',
                title: 'Calculus Problem Set',
                startTime: '5:00 PM',
                endTime: '7:00 PM',
                subject: 'mathematics',
                completed: false
            },
            {
                id: 'task4',
                title: 'Mock Interview Session',
                startTime: '8:00 PM',
                endTime: '9:00 PM',
                subject: 'interview',
                completed: false
            }
        ];
        
        // AI recommendations
        const recommendations = [
            {
                icon: 'lightbulb',
                text: 'Based on your recent performance, we recommend focusing on Organic Chemistry reactions for the next 3 days.'
            },
            {
                icon: 'chart-line',
                text: 'Your study consistency has improved by 15% this month. Keep maintaining your daily 4-hour study routine.'
            },
            {
                icon: 'clock',
                text: 'You\'re most productive between 9 AM and 11 AM. We\'ve scheduled your most challenging topics during this time.'
            }
        ];
        
        return {
            currentMonth: today.toLocaleString('default', { month: 'long' }),
            currentYear: currentYear,
            calendarDays: calendarDays,
            tasks: tasks,
            recommendations: recommendations
        };
    }
    
    // Generate mock exam and performance data
    getMockExamData() {
        return {
            performanceTrends: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
                datasets: [
                    {
                        label: 'Physics',
                        data: [65, 68, 72, 75, 82, 85, 88],
                        color: '#4f46e5'
                    },
                    {
                        label: 'Chemistry',
                        data: [70, 72, 75, 78, 80, 85, 88],
                        color: '#f97316'
                    },
                    {
                        label: 'Mathematics',
                        data: [60, 65, 68, 72, 75, 80, 85],
                        color: '#9333ea'
                    }
                ]
            },
            insights: [
                {
                    icon: 'arrow-trend-up',
                    text: 'Your performance in Physics has improved by 12% in the last month. Keep focusing on Electromagnetism to maintain this trend.'
                },
                {
                    icon: 'lightbulb',
                    text: 'Based on your recent practice tests, we recommend spending more time on Organic Chemistry reactions and mechanisms.'
                },
                {
                    icon: 'clock',
                    text: 'Your average time per question in Mathematics has decreased from 2.5 minutes to 1.8 minutes. This improvement in speed is significant.'
                }
            ],
            upcomingExams: [
                {
                    title: 'JEE Advanced Mock Test',
                    date: 'September 20, 2023',
                    time: '10:00 AM - 1:00 PM',
                    questions: 60,
                    duration: '3 hours'
                },
                {
                    title: 'Physics Sectional Test',
                    date: 'September 25, 2023',
                    time: '2:00 PM - 4:00 PM',
                    questions: 30,
                    duration: '2 hours'
                },
                {
                    title: 'Chemistry Comprehensive Test',
                    date: 'October 2, 2023',
                    time: '10:00 AM - 1:00 PM',
                    questions: 45,
                    duration: '3 hours'
                }
            ]
        };
    }
    
    // Get subject class name for styling
    getSubjectClass(subject) {
        switch(subject.toLowerCase()) {
            case 'physics': return 'subject-physics';
            case 'chemistry': return 'subject-chemistry';
            case 'mathematics': return 'subject-mathematics';
            default: return 'subject-mathematics'; // Default for other subjects
        }
    }
}

// Create a global instance
const dashboardData = new DashboardDataService();