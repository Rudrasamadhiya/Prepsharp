# PrepSharp Exam Timer

This module enhances the PrepSharp exam interface with an advanced timer functionality that synchronizes with a server for multiple concurrent users.

## Features

- Server-synchronized timer for multiple concurrent users
- Configurable exam duration
- Visual warnings when time is running low
- Timer color changes to red when time is critical
- Timer flashes in the final minute
- Customizable time warnings
- Timer state persists across page refreshes via server synchronization
- Auto-save progress at configurable intervals
- Custom notifications instead of alerts
- Graceful fallback to local timer if server is unavailable
- Timer resets only after exam completion

## Files

- `timer.js` - The main timer module that provides the `ExamTimer` class
- `timer-integration.js` - Shows how to integrate the timer with the existing exam interface
- `mains.html` - The main exam interface HTML file (updated to include the timer scripts)
- `exam-script.js` - The original exam script (modified to work with the new timer)
- `exam-style.css` - The exam styles (enhanced with timer-specific styles)

## Usage

The timer is automatically initialized when the page loads and synchronizes with the server. The timer state is saved in Firebase Firestore and will continue from where it left off if the page is refreshed.

```javascript
// Access the timer instance
const timer = window.examTimer;

// Get remaining time in seconds
const remainingSeconds = timer.getRemainingTime();

// Get formatted time string (HH:MM:SS)
const timeString = timer.getFormattedTime();
```

## Server Synchronization

The timer state is saved in Firebase Firestore in the `examSessions` collection. Each session document includes:

- `examId`: The ID of the exam
- `userId`: The ID of the user taking the exam
- `startTime`: When the exam session started
- `endTime`: When the exam session will end
- `timeRemaining`: Seconds remaining in the exam
- `answers`: User's answers to questions
- `markedQuestions`: Questions marked for review
- `completed`: Whether the exam is completed
- `lastSynced`: When the session was last synchronized

When the page is refreshed, the timer will fetch the session from the server and continue from where it left off, accounting for the time that passed while the page was closed.

## Customization

You can customize the timer by modifying the `TimerConfig` object in `timer.js`:

```javascript
const TimerConfig = {
    DEFAULT_DURATION: 3 * 60 * 60, // 3 hours in seconds
    WARNING_THRESHOLDS: [
        { time: 60 * 60, message: '1 hour remaining!' },
        { time: 30 * 60, message: '30 minutes remaining!' },
        { time: 15 * 60, message: '15 minutes remaining!' },
        { time: 5 * 60, message: '5 minutes remaining!' },
        { time: 60, message: '1 minute remaining!' }
    ],
    CRITICAL_TIME: 5 * 60, // 5 minutes - timer turns red
    FLASH_TIME: 60 // 1 minute - timer starts flashing
};
```

## Integration

The timer is designed to work with the existing exam interface and Firebase. It automatically:

1. Fetches the exam session from Firebase when the page loads
2. Creates a new session if one doesn't exist
3. Continues from where it left off if the page is refreshed
4. Automatically submits the exam when time runs out
5. Synchronizes with Firebase every 30 seconds
6. Resets only after the exam is completed

## Multiple Users

This implementation supports multiple users taking the exam simultaneously:

1. Each user has their own exam session in Firebase
2. Sessions are identified by both examId and userId
3. Timer state is synchronized independently for each user
4. Users can refresh the page or switch devices without losing progress

## Browser Support

This timer module works in all modern browsers (Chrome, Firefox, Safari, Edge).