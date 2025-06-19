// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA1234567890abcdefghijklmnopqrstuv",
  authDomain: "prepsharp-demo.firebaseapp.com",
  projectId: "prepsharp-demo",
  storageBucket: "prepsharp-demo.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123def456ghi789jkl"
};

// Initialize Firebase
try {
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
  console.log("Firebase initialized successfully");
} catch (error) {
  console.error("Firebase initialization error:", error);
}