document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');

      // Function to handle login form submission
    function handleLogin(event) {
        event.preventDefault(); // Prevent form submission

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Create a new FormData object and append the login data
        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);

        // ... (Previous code)

        // Send the form data via POST using fetch
        fetch('/', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Login successful, redirect to dashboard
                window.location.href = '/dashboard';
            } else {
                // Login failed, display error message
                const errorElement = document.getElementById('error-message');
                errorElement.textContent = data.message;
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });

        // ... (Remaining code)

    }


    // Event listener for login form submission
    loginForm.addEventListener('submit', handleLogin);
});
