// Clear all user data from localStorage
function clearAllUserData() {
  localStorage.removeItem('currentUser');
  localStorage.removeItem('users');
  console.log('All user data has been cleared');
  alert('All student login data has been deleted successfully');
}

// Execute immediately
clearAllUserData();