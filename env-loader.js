/**
 * Simple environment variable loader for browser
 * This is a basic implementation - for production, use a proper build process
 * with tools like Webpack, Parcel, or Vite that handle environment variables securely
 */

// Function to load environment variables from .env file
async function loadEnvVariables() {
  try {
    const response = await fetch('./.env');
    if (!response.ok) {
      throw new Error('Failed to load .env file');
    }
    
    const text = await response.text();
    const env = {};
    
    // Parse .env file content
    text.split('\n').forEach(line => {
      // Skip comments and empty lines
      if (!line || line.startsWith('#')) return;
      
      // Parse key=value pairs
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length) {
        const value = valueParts.join('=').trim();
        env[key.trim()] = value;
      }
    });
    
    // Add to window object for global access
    window.env = env;
    return env;
  } catch (error) {
    console.error('Error loading environment variables:', error);
    return {};
  }
}

// Export the function
window.loadEnvVariables = loadEnvVariables;

// Auto-load environment variables
document.addEventListener('DOMContentLoaded', () => {
  loadEnvVariables().then(env => {
    console.log('Environment variables loaded');
    // Dispatch event to notify app that env variables are loaded
    document.dispatchEvent(new Event('envVariablesLoaded'));
  });
});