// Firebase configuration for PrepSharp - Replace with your actual config
const firebaseConfig = {
  apiKey: "AIzaSyBvOkBY0rlczrnyg4X2t2H1XqCt2H1XqCt",
  authDomain: "prepsharp-default-rtdb.firebaseapp.com",
  projectId: "prepsharp-default-rtdb",
  storageBucket: "prepsharp-default-rtdb.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
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