// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCtkee-Lv8lEMestaSVJxx7yvKB-lBygPQ",
    authDomain: "prepsharp-c91fd.firebaseapp.com",
    projectId: "prepsharp-c91fd",
    storageBucket: "prepsharp-c91fd.firebasestorage.app",
    messagingSenderId: "688294848433",
    appId: "1:688294848433:web:dd93fc6d61d62392473f90",
    measurementId: "G-LLJSLMXMNY"
};

// Initialize Firebase
window.db = null;
try {
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    window.db = firebase.firestore();
    console.log("Firebase initialized successfully");
} catch (error) {
    console.error("Firebase initialization error:", error);
}