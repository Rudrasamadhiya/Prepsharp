// This file contains hardcoded papers data for fallback
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the manage-exams or exam-list page
    const isManageExams = window.location.href.includes('manage-exams.html');
    const isExamList = window.location.href.includes('exam-list.html');
    
    if (!isManageExams && !isExamList) return;
    
    // Define hardcoded papers
    const hardcodedPapers = [
        {
            "id": "jee-adv-2024-p1",
            "name": "JEE Advanced 2024 Paper 1",
            "year": 2024,
            "paperNumber": 1,
            "totalQuestions": 51,
            "subjects": ["Physics", "Chemistry", "Mathematics"],
            "type": "jee-advanced",
            "examDate": "May 26, 2024",
            "pdfPath": "papers/2024_1_English.pdf"
        },
        {
            "id": "jee-adv-2024-p2",
            "name": "JEE Advanced 2024 Paper 2",
            "year": 2024,
            "paperNumber": 2,
            "totalQuestions": 51,
            "subjects": ["Physics", "Chemistry", "Mathematics"],
            "type": "jee-advanced",
            "examDate": "May 26, 2024",
            "pdfPath": "papers/2024_2_English.pdf"
        },
        {
            "id": "jee-adv-2023-p1",
            "name": "JEE Advanced 2023 Paper 1",
            "year": 2023,
            "paperNumber": 1,
            "totalQuestions": 51,
            "subjects": ["Physics", "Chemistry", "Mathematics"],
            "type": "jee-advanced"
        },
        {
            "id": "jee-adv-2023-p2",
            "name": "JEE Advanced 2023 Paper 2",
            "year": 2023,
            "paperNumber": 2,
            "totalQuestions": 51,
            "subjects": ["Physics", "Chemistry", "Mathematics"],
            "type": "jee-advanced"
        },
        {
            "id": "jee-adv-2022-p1",
            "name": "JEE Advanced 2022 Paper 1",
            "year": 2022,
            "paperNumber": 1,
            "totalQuestions": 54,
            "subjects": ["Physics", "Chemistry", "Mathematics"],
            "type": "jee-advanced"
        },
        {
            "id": "jee-adv-2022-p2",
            "name": "JEE Advanced 2022 Paper 2",
            "year": 2022,
            "paperNumber": 2,
            "totalQuestions": 54,
            "subjects": ["Physics", "Chemistry", "Mathematics"],
            "type": "jee-advanced"
        },
        {
            "id": "jee-adv-2021-p1",
            "name": "JEE Advanced 2021 Paper 1",
            "year": 2021,
            "paperNumber": 1,
            "totalQuestions": 57,
            "subjects": ["Physics", "Chemistry", "Mathematics"],
            "type": "jee-advanced"
        },
        {
            "id": "jee-adv-2021-p2",
            "name": "JEE Advanced 2021 Paper 2",
            "year": 2021,
            "paperNumber": 2,
            "totalQuestions": 57,
            "subjects": ["Physics", "Chemistry", "Mathematics"],
            "type": "jee-advanced"
        },
        {
            "id": "jee-adv-2020-p1",
            "name": "JEE Advanced 2020 Paper 1",
            "year": 2020,
            "paperNumber": 1,
            "totalQuestions": 54,
            "subjects": ["Physics", "Chemistry", "Mathematics"],
            "type": "jee-advanced"
        },
        {
            "id": "jee-adv-2020-p2",
            "name": "JEE Advanced 2020 Paper 2",
            "year": 2020,
            "paperNumber": 2,
            "totalQuestions": 54,
            "subjects": ["Physics", "Chemistry", "Mathematics"],
            "type": "jee-advanced"
        },
        {
            "id": "jee-adv-2019-p1",
            "name": "JEE Advanced 2019 Paper 1",
            "year": 2019,
            "paperNumber": 1,
            "totalQuestions": 54,
            "subjects": ["Physics", "Chemistry", "Mathematics"],
            "type": "jee-advanced"
        },
        {
            "id": "jee-adv-2019-p2",
            "name": "JEE Advanced 2019 Paper 2",
            "year": 2019,
            "paperNumber": 2,
            "totalQuestions": 54,
            "subjects": ["Physics", "Chemistry", "Mathematics"],
            "type": "jee-advanced"
        },
        {
            "id": "jee-adv-2018-p1",
            "name": "JEE Advanced 2018 Paper 1",
            "year": 2018,
            "paperNumber": 1,
            "totalQuestions": 54,
            "subjects": ["Physics", "Chemistry", "Mathematics"],
            "type": "jee-advanced"
        },
        {
            "id": "jee-adv-2018-p2",
            "name": "JEE Advanced 2018 Paper 2",
            "year": 2018,
            "paperNumber": 2,
            "totalQuestions": 54,
            "subjects": ["Physics", "Chemistry", "Mathematics"],
            "type": "jee-advanced"
        }
    ];
    
    // Add existing papers that might be in the system
    const existingPapers = [
        {
            "id": "1007",
            "name": "JEE Advanced - Paper 1 2024",
            "type": "jee-advanced",
            "year": "2024",
            "subjects": ["Physics", "Chemistry", "Mathematics"]
        },
        {
            "id": "1008",
            "name": "JEE Main - 15/Apr Shift 1 2024",
            "type": "jee-main",
            "year": "2024",
            "subjects": ["Physics", "Chemistry", "Mathematics"]
        },
        {
            "id": "1009",
            "name": "JEE Advanced - Paper 2 2024",
            "type": "jee-advanced",
            "year": "2024",
            "subjects": ["Physics", "Chemistry", "Mathematics"]
        },
        {
            "id": "1010",
            "name": "NEET 2024",
            "type": "neet",
            "year": "2024",
            "subjects": ["Physics", "Chemistry", "Biology"]
        },
        {
            "id": "1011",
            "name": "JEE Advanced - Paper 1 2023",
            "type": "jee-advanced",
            "year": "2023",
            "subjects": ["Physics", "Chemistry", "Mathematics"]
        },
        {
            "id": "1012",
            "name": "NEET 2023",
            "type": "neet",
            "year": "2023",
            "subjects": ["Physics", "Chemistry", "Biology"]
        }
    ];
    
    // Combine all papers
    const allPapers = [...hardcodedPapers, ...existingPapers];
    
    // Store in localStorage
    localStorage.setItem('papers', JSON.stringify(allPapers));
    
    // If we're on the manage-exams page, call renderPapers directly
    if (isManageExams && typeof renderPapers === 'function') {
        renderPapers(allPapers);
    }
    
    // If we're on the exam-list page, call renderPapers directly
    if (isExamList && typeof renderPapers === 'function') {
        renderPapers(allPapers);
    }
});