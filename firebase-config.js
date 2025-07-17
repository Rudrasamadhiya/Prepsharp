// Firebase configuration for PrepSharp
// IMPORTANT: This file should be loaded from a secure source in production
// For local development, you can use environment variables or a secure local config

// Function to load Firebase config securely
async function loadFirebaseConfig() {
  try {
    // Wait for environment variables to be loaded
    if (!window.env) {
      await new Promise(resolve => {
        if (document.readyState === 'loading') {
          document.addEventListener('envVariablesLoaded', resolve);
          // Set a timeout in case the event never fires
          setTimeout(resolve, 5000);
        } else if (window.loadEnvVariables) {
          window.loadEnvVariables().then(resolve);
        } else {
          // If env-loader.js is not included, resolve immediately
          resolve();
        }
      });
    }
    
    // In production, you should fetch this from a secure API endpoint
    // that requires proper authentication
    // const response = await fetch('/api/get-firebase-config', {
    //   headers: { 'Authorization': 'Bearer ' + userToken }
    // });
    // return await response.json();
    
    // Get config from environment variables
    const env = window.env || {};
    
    return {
      apiKey: env.FIREBASE_API_KEY || 'AIzaSyCtkee-Lv8lEMestaSVJxx7yvKB-lBygPQ',
      authDomain: env.FIREBASE_AUTH_DOMAIN || 'prepsharp.in',
      projectId: env.FIREBASE_PROJECT_ID || 'prepsharp-c91fd',
      storageBucket: env.FIREBASE_STORAGE_BUCKET || 'prepsharp-c91fd.firebasestorage.app',
      messagingSenderId: env.FIREBASE_MESSAGING_SENDER_ID || '688294848433',
      appId: env.FIREBASE_APP_ID || '1:688294848433:web:dd93fc6d61d62392473f90',
      measurementId: env.FIREBASE_MEASUREMENT_ID || 'G-LLJSLMXMNY'
    };
  } catch (error) {
    console.error("Error loading Firebase config:", error);
    throw error;
  }
}

// Load config asynchronously
let firebaseConfig = null;

// Initialize Firebase and make db globally accessible
let db, auth;

// Async initialization function
async function initializeFirebase() {
  try {
    // Load config first
    firebaseConfig = await loadFirebaseConfig();
    
    // Check if config is valid
    if (!firebaseConfig || !firebaseConfig.apiKey || firebaseConfig.apiKey.includes('<')) {
      throw new Error('Invalid Firebase configuration. Please set up environment variables.');
    }
    
    // Initialize Firebase
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    
    db = firebase.firestore();
    auth = firebase.auth();
    console.log("Firebase initialized successfully");
    
    // Dispatch event to notify app that Firebase is ready
    document.dispatchEvent(new Event('firebaseReady'));
    
    return { db, auth };
  } catch (error) {
    console.error("Firebase initialization error:", error);
    db = null;
    auth = null;
    
    // Dispatch event to notify app that Firebase failed to initialize
    document.dispatchEvent(new CustomEvent('firebaseError', { detail: error }));
    
    throw error;
  }
}

// Initialize Firebase when the script loads
initializeFirebase().catch(error => {
  console.error('Failed to initialize Firebase:', error);
  // Show user-friendly error message
  setTimeout(() => {
    alert('Failed to connect to the database. Please contact the administrator.');
  }, 1000);
});

// Helper function to add sample data to Firestore
async function addSampleData() {
  // Make sure Firebase is initialized
  if (!db) {
    try {
      const { db: firestore } = await initializeFirebase();
      if (!firestore) throw new Error('Firebase not initialized');
      db = firestore;
    } catch (error) {
      console.error('Cannot add sample data:', error);
      return;
    }
  }
  
  const sampleUsers = {
    "user1": {
      name: "John Doe",
      email: "john.doe@example.com",
      mobile: "9876543210",
      subscriptionPlan: "Premium",
      class: "12th",
      createdAt: new Date("2024-01-15T10:30:00Z"),
      subscriptionEndDate: new Date("2024-02-15T10:30:00Z")
    },
    "user2": {
      name: "Jane Smith",
      email: "jane.smith@example.com",
      mobile: "9876543211",
      subscriptionPlan: "Free",
      class: "11th",
      createdAt: new Date("2024-01-20T14:15:00Z")
    },
    "user3": {
      name: "Mike Johnson",
      email: "mike.johnson@example.com",
      mobile: "9876543212",
      subscriptionPlan: "Standard",
      class: "12th",
      createdAt: new Date("2024-02-01T09:45:00Z"),
      subscriptionEndDate: new Date("2024-03-01T09:45:00Z")
    }
  };
  
  // Use Promise.all to add all users in parallel
  try {
    const promises = Object.entries(sampleUsers).map(([id, userData]) => {
      return db.collection("users").doc(id).set(userData)
        .then(() => console.log(`User ${id} added successfully`))
        .catch(error => {
          console.error(`Error adding user ${id}:`, error);
          throw error;
        });
    });
    
    await Promise.all(promises);
    console.log('All sample users added successfully');
  } catch (error) {
    console.error('Error adding sample data:', error);
  }
}