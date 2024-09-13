// Function to toggle between login and signup forms
function toggleForm() {
    document.getElementById("login-form").classList.toggle("hidden");
    document.getElementById("signup-form").classList.toggle("hidden");

    // Clear the input fields when toggling forms
    clearFormInputs();
}

// Function to clear input fields
function clearFormInputs() {
    document.getElementById('login-email').value = '';
    document.getElementById('login-password').value = '';
    document.getElementById('signup-email').value = '';
    document.getElementById('signup-password').value = '';
}

// Handle signup and store user in localStorage
function handleSignup(event) {
    event.preventDefault();

    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    if (email && password) {
        const users = JSON.parse(localStorage.getItem('users')) || [];

        // Check if email already exists
        if (users.find(user => user.email === email)) {
            alert("User with this email already exists. Please login.");
            return;
        }

        // Add new user to localStorage
        users.push({ email, password });
        localStorage.setItem('users', JSON.stringify(users));
        alert("Sign up successful. Please login.");

        // Switch to login form and clear input fields
        toggleForm();
    }
}

// Handle login
function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const users = JSON.parse(localStorage.getItem('users')) || [];

    const user = users.find(user => user.email === email && user.password === password);

    if (user) {
        alert("Login successful! Welcome " + email);
        // Redirect to another page after login, e.g., dashboard.html
        window.location.href = "home.html";
    } else {
        alert("Incorrect email or password. Please try again.");
    }
}

// After successful login
if (user) {
    // Store a flag in localStorage to indicate the user is logged in
    localStorage.setItem('isLoggedIn', 'true');
    alert("Login successful! Welcome " + email);
    window.location.href = "dashboard.html"; // Redirect to dashboard
}
