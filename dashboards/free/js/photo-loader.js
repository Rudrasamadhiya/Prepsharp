// Firebase photo loading functionality
const firebaseConfig = {
    apiKey: "AIzaSyCtkee-Lv8lEMestaSVJxx7yvKB-lBygPQ",
    authDomain: "prepsharp-c91fd.firebaseapp.com",
    projectId: "prepsharp-c91fd",
    storageBucket: "prepsharp-c91fd.firebasestorage.app",
    messagingSenderId: "688294848433",
    appId: "1:688294848433:web:dd93fc6d61d62392473f90"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

function getUserId() {
    const loggedInUser = localStorage.getItem('loggedInUser') || sessionStorage.getItem('loggedInUser');
    if (loggedInUser) {
        const userData = JSON.parse(loggedInUser);
        return userData.email || 'default-user';
    }
    return 'default-user';
}

async function loadUserInfo() {
    const loggedInUser = localStorage.getItem('loggedInUser') || sessionStorage.getItem('loggedInUser');
    if (loggedInUser) {
        const userData = JSON.parse(loggedInUser);
        const userName = userData.name || userData.email || 'User';
        const initials = userName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
        
        const nameElement = document.getElementById('loggedInUserName');
        const initialsElement = document.getElementById('userInitials');
        
        if (nameElement) nameElement.textContent = userName;
        if (initialsElement) initialsElement.textContent = initials;
        
        try {
            const userId = getUserId();
            const doc = await db.collection('users').doc(userId).get();
            if (doc.exists && doc.data().photo && initialsElement) {
                initialsElement.style.backgroundImage = `url(${doc.data().photo})`;
                initialsElement.style.backgroundSize = 'cover';
                initialsElement.textContent = '';
                
                if (doc.data().cropPosition) {
                    const pos = doc.data().cropPosition;
                    initialsElement.style.backgroundPosition = `${pos.x}% ${pos.y}%`;
                } else {
                    initialsElement.style.backgroundPosition = 'center';
                }
            }
        } catch (error) {
            console.log('No photo found');
        }
    }
}

function logout() {
    localStorage.removeItem('loggedInUser');
    sessionStorage.removeItem('loggedInUser');
    window.location.href = '../../login.html';
}

// Auto-load on DOM ready
document.addEventListener('DOMContentLoaded', loadUserInfo);