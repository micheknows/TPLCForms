document.addEventListener('DOMContentLoaded', function() {
    const logoutButton = document.getElementById('logoutBtn');
    const addTeacherLink = document.getElementById('addTeacherLink');
    const mainContent = document.getElementById('mainContent');

    // Function to handle logout button click
    function handleLogout(event) {
        event.preventDefault(); // Prevent button's default behavior

        // Send a request to the server to logout
        fetch('/logout', {
            method: 'POST'
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Logout successful, redirect to the login page
                window.location.href = '/';
            } else {
                console.error('Logout failed:', data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    // Function to show the form to add a teacher
    function showAddTeacherForm(event) {
        event.preventDefault(); // Prevent link's default behavior

        // Create the form elements for adding a teacher
        const form = document.createElement('form');
        form.id = 'addTeacherForm';
        form.classList.add('p-3');

        const fields = ['firstname', 'lastname', 'email', 'grade', 'password'];
        const labels = ['First Name', 'Last Name', 'Email', 'Grade', 'Password'];

        for (let i = 0; i < fields.length; i++) {
            const div = document.createElement('div');
            div.classList.add('mb-3');

            const label = document.createElement('label');
            label.classList.add('form-label');
            label.textContent = labels[i];
            div.appendChild(label);

            const input = document.createElement('input');
            input.type = (fields[i] === 'password') ? 'password' : 'text';
            input.classList.add('form-control');
            input.id = fields[i];
            input.required = true;
            div.appendChild(input);

            form.appendChild(div);
        }

        const userTypeDiv = document.createElement('div');
        userTypeDiv.classList.add('mb-3');

        const userTypeLabel = document.createElement('label');
        userTypeLabel.classList.add('form-label');
        userTypeLabel.textContent = 'User Type';
        userTypeDiv.appendChild(userTypeLabel);

        const userTypeSelect = document.createElement('select');
        userTypeSelect.classList.add('form-select');
        userTypeSelect.id = 'userType';

        const userTypeOptions = ['Teacher', 'Administrator'];

        for (const option of userTypeOptions) {
            const userTypeOption = document.createElement('option');
            userTypeOption.value = option.toLowerCase();
            userTypeOption.textContent = option;
            userTypeSelect.appendChild(userTypeOption);
        }

        userTypeDiv.appendChild(userTypeSelect);
        form.appendChild(userTypeDiv);

        const submitBtn = document.createElement('button');
        submitBtn.type = 'submit';
        submitBtn.classList.add('btn', 'btn-primary');
        submitBtn.id = 'addTeacherBtn';
        submitBtn.textContent = 'Add';
        form.appendChild(submitBtn);

        // Clear the main content and insert the form
        mainContent.innerHTML = '';
        mainContent.appendChild(form);

        // Add an event listener for the form submission
        form.addEventListener('submit', handleAddTeacher);
    }

    // Function to handle adding a teacher
    function handleAddTeacher(event) {
        event.preventDefault(); // Prevent form submission

        const formData = new FormData(event.target);
        const user = {
            firstname: formData.get('firstname'),
            lastname: formData.get('lastname'),
            email: formData.get('email'),
            grade: formData.get('grade'),
            password: formData.get('password'),
            userType: formData.get('userType')
        };

        // Send the data to the server to add the teacher
        fetch('/add_teacher', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Teacher added successfully, show success message and clear the form
                alert('Teacher added successfully!');
                event.target.reset();
            } else {
                // Teacher addition failed, show error message
                alert(`Teacher addition failed: ${data.message}`);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    // Add event listeners for the logout button and "Add Teacher" link
    logoutButton.addEventListener('click', handleLogout);
    addTeacherLink.addEventListener('click', showAddTeacherForm);
});
