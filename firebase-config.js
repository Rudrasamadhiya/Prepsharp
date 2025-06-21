// Firebase configuration for PrepSharp - REAL CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyCtkee-Lv8lEMestaSVJxx7yvKB-lBygPQ",
  authDomain: "prepsharp-c91fd.firebaseapp.com",
  projectId: "prepsharp-c91fd",
  storageBucket: "prepsharp-c91fd.firebasestorage.app",
  messagingSenderId: "688294848433",
  appId: "1:688294848433:web:dd93fc6d61d62392473f90",
  measurementId: "G-LLJSLMXMNY"
};

// Initialize Firebase and make db globally accessible
let db, auth;
try {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  db = firebase.firestore();
  auth = firebase.auth();
  console.log("Firebase initialized successfully");
} catch (error) {
  console.error("Firebase initialization error:", error);
  db = null;
  auth = null;
}

// Helper function to add sample data to Firestore
function addSampleData() {
  if (!db) return;
  
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
  
  Object.entries(sampleUsers).forEach(([id, userData]) => {
    db.collection("users").doc(id).set(userData)
      .then(() => console.log(`User ${id} added successfully`))
      .catch(error => console.error(`Error adding user ${id}:`, error));
  });
}