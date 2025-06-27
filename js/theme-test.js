// Test script to verify theme and font size functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('Theme and font size test script loaded');
    
    // Test theme application
    function testTheme() {
        const themeSelect = document.getElementById('theme');
        if (themeSelect) {
            console.log('Current theme:', themeSelect.value);
            
            // Force theme application
            const theme = themeSelect.value;
            console.log('Applying theme:', theme);
            applyTheme(theme);
        }
    }
    
    // Test font size application
    function testFontSize() {
        const fontSizeSelect = document.getElementById('fontSize');
        if (fontSizeSelect) {
            console.log('Current font size:', fontSizeSelect.value);
            
            // Force font size application
            const fontSize = fontSizeSelect.value;
            console.log('Applying font size:', fontSize);
            applyFontSize(fontSize);
        }
    }
    
    // Run tests after a short delay to ensure other scripts have loaded
    setTimeout(() => {
        testTheme();
        testFontSize();
        console.log('Theme and font size tests completed');
    }, 1000);
});