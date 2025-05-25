// Numeric keyboard for integer and numerical inputs
class NumericKeyboard {
    constructor(options = {}) {
        this.options = {
            allowDecimal: true,
            maxLength: 10,
            ...options
        };
        
        this.targetInput = null;
    }
    
    // Attach keyboard to an input element
    attachTo(inputElement) {
        // Create keyboard container if it doesn't exist
        if (!document.getElementById('numeric-keyboard')) {
            this.createKeyboard();
        }
        
        this.targetInput = inputElement;
        
        // Position keyboard below the input
        const keyboard = document.getElementById('numeric-keyboard');
        const rect = inputElement.getBoundingClientRect();
        
        keyboard.style.display = 'grid';
        keyboard.style.top = (rect.bottom + window.scrollY + 5) + 'px';
        keyboard.style.left = rect.left + 'px';
        
        // Focus the input
        inputElement.focus();
    }
    
    // Create the keyboard UI
    createKeyboard() {
        const keyboard = document.createElement('div');
        keyboard.id = 'numeric-keyboard';
        keyboard.style.position = 'absolute';
        keyboard.style.display = 'none';
        keyboard.style.gridTemplateColumns = 'repeat(3, 1fr)';
        keyboard.style.gap = '5px';
        keyboard.style.padding = '10px';
        keyboard.style.backgroundColor = '#f0f0f0';
        keyboard.style.border = '1px solid #ccc';
        keyboard.style.borderRadius = '5px';
        keyboard.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        keyboard.style.zIndex = '1000';
        
        // Add number keys
        for (let i = 1; i <= 9; i++) {
            this.addKey(keyboard, i.toString());
        }
        
        // Add 0 key
        this.addKey(keyboard, '0');
        
        // Add decimal point if allowed
        if (this.options.allowDecimal) {
            this.addKey(keyboard, '.');
        } else {
            // Add empty space if decimal not allowed
            const spacer = document.createElement('div');
            spacer.style.gridColumn = '2 / 3';
            keyboard.appendChild(spacer);
        }
        
        // Add backspace key
        this.addKey(keyboard, '⌫');
        
        // Add to document
        document.body.appendChild(keyboard);
        
        // Close keyboard when clicking outside
        document.addEventListener('click', (e) => {
            if (e.target.closest('#numeric-keyboard') || 
                e.target === this.targetInput) {
                return;
            }
            this.hide();
        });
    }
    
    // Add a key to the keyboard
    addKey(keyboard, value) {
        const key = document.createElement('div');
        key.textContent = value;
        key.style.padding = '10px';
        key.style.textAlign = 'center';
        key.style.backgroundColor = '#fff';
        key.style.border = '1px solid #ddd';
        key.style.borderRadius = '4px';
        key.style.cursor = 'pointer';
        key.style.userSelect = 'none';
        
        key.addEventListener('click', () => {
            this.handleKeyPress(value);
        });
        
        keyboard.appendChild(key);
    }
    
    // Handle key press
    handleKeyPress(value) {
        if (!this.targetInput) return;
        
        if (value === '⌫') {
            // Backspace - remove last character
            this.targetInput.value = this.targetInput.value.slice(0, -1);
        } else if (value === '.') {
            // Decimal point - only add if not already present
            if (!this.targetInput.value.includes('.')) {
                this.targetInput.value += value;
            }
        } else {
            // Number - add if within max length
            if (this.targetInput.value.length < this.options.maxLength) {
                this.targetInput.value += value;
            }
        }
        
        // Trigger input event
        this.targetInput.dispatchEvent(new Event('input'));
        
        // Keep focus on the input
        this.targetInput.focus();
    }
    
    // Hide the keyboard
    hide() {
        const keyboard = document.getElementById('numeric-keyboard');
        if (keyboard) {
            keyboard.style.display = 'none';
        }
    }
}

// Create global instance
const numericKeyboard = new NumericKeyboard();