/**
 * Enhanced Exam Timer Module
 * This module provides advanced timer functionality for the exam interface
 */

// Timer configuration
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

class ExamTimer {
    constructor(options = {}) {
        // Configuration
        this.duration = options.duration || TimerConfig.DEFAULT_DURATION;
        this.timeRemaining = options.timeRemaining !== undefined ? options.timeRemaining : this.duration;
        this.timerElement = options.timerElement || document.getElementById('timer');
        this.onTimeUp = options.onTimeUp || this.defaultTimeUpHandler;
        this.onTick = options.onTick || (() => {});
        this.warningThresholds = options.warningThresholds || TimerConfig.WARNING_THRESHOLDS;
        
        // State
        this.timerInterval = null;
        this.isPaused = false;
        this.isFlashing = false;
        this.flashInterval = null;
        this.startTime = Date.now();
        this.lastTickTime = this.startTime;
    }

    // Start the timer with drift correction
    start() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        
        this.startTime = Date.now();
        this.lastTickTime = this.startTime;
        
        this.timerInterval = setInterval(() => {
            if (!this.isPaused) {
                const now = Date.now();
                const elapsedSeconds = Math.floor((now - this.lastTickTime) / 1000);
                
                if (elapsedSeconds >= 1) {
                    // Decrement by actual elapsed seconds (handles tab inactive/sleep)
                    this.timeRemaining = Math.max(0, this.timeRemaining - elapsedSeconds);
                    this.lastTickTime = now;
                    
                    this.updateDisplay();
                    this.checkWarnings();
                    this.onTick(this.timeRemaining);
                    
                    if (this.timeRemaining <= 0) {
                        this.stop();
                        this.onTimeUp();
                    }
                }
            }
        }, 500); // Check more frequently for better accuracy
        
        this.updateDisplay();
        return this;
    }

    // Stop the timer
    stop() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        
        if (this.flashInterval) {
            clearInterval(this.flashInterval);
            this.flashInterval = null;
            this.isFlashing = false;
            
            if (this.timerElement) {
                this.timerElement.classList.remove('flashing');
            }
        }
        
        return this;
    }

    // Pause the timer
    pause() {
        this.isPaused = true;
        return this;
    }

    // Resume the timer
    resume() {
        this.isPaused = false;
        return this;
    }

    // Toggle pause state
    togglePause() {
        this.isPaused = !this.isPaused;
        return this;
    }

    // Reset the timer
    reset(newDuration = null) {
        this.stop();
        this.timeRemaining = newDuration !== null ? newDuration : this.duration;
        this.updateDisplay();
        return this;
    }

    // Add time to the timer (in seconds)
    addTime(seconds) {
        this.timeRemaining += seconds;
        this.updateDisplay();
        return this;
    }

    // Update the timer display
    updateDisplay() {
        if (!this.timerElement) return;
        
        const hours = Math.floor(this.timeRemaining / 3600);
        const minutes = Math.floor((this.timeRemaining % 3600) / 60);
        const seconds = this.timeRemaining % 60;
        
        const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // Update main timer
        this.timerElement.textContent = timeString;
        
        // Also update the time remaining in the header if it exists
        const timeRemainingElement = document.getElementById('timeRemaining');
        if (timeRemainingElement) {
            timeRemainingElement.textContent = timeString;
        }
        
        // Apply visual indicators based on remaining time
        this.timerElement.classList.toggle('critical', this.timeRemaining <= TimerConfig.CRITICAL_TIME);
        
        // Start flashing when time is running out
        if (this.timeRemaining <= TimerConfig.FLASH_TIME && !this.isFlashing) {
            this.startFlashing();
        } else if (this.timeRemaining > TimerConfig.FLASH_TIME && this.isFlashing) {
            this.stopFlashing();
        }
    }

    // Check for time warnings
    checkWarnings() {
        this.warningThresholds.forEach(threshold => {
            if (this.timeRemaining === threshold.time) {
                this.showWarning(threshold.message);
            }
        });
    }

    // Show warning message
    showWarning(message) {
        // Default implementation uses alert, but can be overridden
        alert(message);
    }

    // Default handler when time is up
    defaultTimeUpHandler() {
        alert('Time is up! Your exam will be submitted automatically.');
        // In a real implementation, this would submit the exam
    }

    // Start flashing effect for critical time
    startFlashing() {
        if (this.isFlashing) return;
        
        this.isFlashing = true;
        let isVisible = true;
        
        this.flashInterval = setInterval(() => {
            if (!this.timerElement) return;
            
            isVisible = !isVisible;
            this.timerElement.style.opacity = isVisible ? '1' : '0.3';
        }, 500);
    }

    // Stop flashing effect
    stopFlashing() {
        if (!this.isFlashing) return;
        
        clearInterval(this.flashInterval);
        this.flashInterval = null;
        this.isFlashing = false;
        
        if (this.timerElement) {
            this.timerElement.style.opacity = '1';
        }
    }

    // Get remaining time in seconds
    getRemainingTime() {
        return this.timeRemaining;
    }

    // Get remaining time as formatted string
    getFormattedTime() {
        const hours = Math.floor(this.timeRemaining / 3600);
        const minutes = Math.floor((this.timeRemaining % 3600) / 60);
        const seconds = this.timeRemaining % 60;
        
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
}

// Add CSS for timer visual effects
function addTimerStyles() {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        #timer.critical {
            color: #ff3333 !important;
            font-weight: bold;
        }
        
        @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.3; }
            100% { opacity: 1; }
        }
        
        #timer.flashing {
            animation: pulse 1s infinite;
        }
    `;
    document.head.appendChild(styleElement);
}

// Initialize timer styles when DOM is loaded
document.addEventListener('DOMContentLoaded', addTimerStyles);

// Export the ExamTimer class
window.ExamTimer = ExamTimer;