// Logout function
function handleLogout() {
    // Clear localStorage session or login status
    localStorage.removeItem('isLoggedIn');

    // Redirect to login page
    window.location.href = "login.html";
}

// Add an event listener to the icon image for logout
document.getElementById("logout-btn").addEventListener("click", handleLogout);
