// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCtkee-Lv8lEMestaSVJxx7yvKB-lBygPQ",
  authDomain: "prepsharp-c91fd.firebaseapp.com",
  projectId: "prepsharp-c91fd",
  storageBucket: "prepsharp-c91fd.firebasestorage.app",
  messagingSenderId: "688294848433",
  appId: "1:688294848433:web:dd93fc6d61d62392473f90"
};

// Initialize Firebase (using compat version for easier integration)
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();