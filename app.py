from flask import Flask, render_template, request, redirect, url_for, session, jsonify

import json
import bcrypt
import os

app = Flask(__name__)
app.secret_key = 'super_secret_key'

TEACHERS_FILE_PATH = 'teachers.json'

# Helper function to read JSON data from a file
def read_json(file_path):
    with open(file_path, 'r') as file:
        data = json.load(file)
    return data

# Helper function to write JSON data to a file
def write_json(file_path, data):
    with open(file_path, 'w') as file:
        json.dump(data, file)

# Check if the 'teachers.json' file exists, if not, create it and add a default teacher
if not os.path.exists(TEACHERS_FILE_PATH):
    # Create a default teacher with the provided data and hash the password
    default_teacher = {
        'mrogers': {
            'password': bcrypt.hashpw(b'Ph0nics!!!', bcrypt.gensalt()).decode('utf-8'),
            'level': 0,
            'grade': 13,
            'firstname': 'Michelle',
            'lastname': 'Rogers',
            'email': 'arogers@wrschool.net'
        }
    }

    write_json(TEACHERS_FILE_PATH, default_teacher)

# Route for the login form and displaying the dropdown menu after successful login
@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        teachers = read_json(TEACHERS_FILE_PATH)

        email = request.form['email']
        password = request.form['password'].encode('utf-8')

        for username, teacher_info in teachers.items():
            if teacher_info['email'] == email and bcrypt.checkpw(password, teacher_info['password'].encode('utf-8')):
                # Store the logged-in user's username in session
                session['username'] = username
                # Return a JSON response for successful login
                return jsonify({'success': True})

        # If login is unsuccessful, return a JSON response with an error message
        return jsonify({'success': False, 'message': 'Invalid email or password.'})

    return render_template('login.html')


# Route for the dashboard (displaying the dropdown menu and logout button)
@app.route('/dashboard')
def dashboard():

    print("Dashboard route accessed.")
    # Rest of the code remains the same

    # Check if the user is logged in by checking if the 'username' key exists in the session
    if 'username' in session:
        # Get the user's info from the 'teachers.json' file based on the stored username
        teachers = read_json(TEACHERS_FILE_PATH)
        teacher_info = teachers.get(session['username'])

        if teacher_info:
            # Pass the user's info to the template to display the dropdown menu and logout button
            return render_template('dashboard.html', teacher_info=teacher_info)

    # If the user is not logged in or the stored username is not found in 'teachers.json', redirect to the login page
    print("Dashboard route accessed.")
    return redirect(url_for('index'))

# Route for handling logout request
@app.route('/logout', methods=['POST'])
def logout():
    # Clear the user's session data to log them out
    session.clear()
    return jsonify({'success': True})

# Route for handling teacher addition request
@app.route('/add_teacher', methods=['POST'])
def add_teacher():
    data = request.json

    teachers = read_json(TEACHERS_FILE_PATH)

    # Check if the user is logged in and has the required level to add a teacher
    if 'username' in session and teachers.get(session['username'], {}).get('level', 0) < 2:
        user_type = data.get('userType', 'teacher')  # Default to 'teacher' if not provided

        print("Received data:", data)

        # Hash the password before storing in teachers.json
        hashed_password = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

        # Create the new teacher
        new_teacher = {
            'password': hashed_password,
            'level': 10 if user_type == 'teacher' else 1,
            'grade': data.get('grade', 0),
            'firstname': data.get('firstname', ''),
            'lastname': data.get('lastname', ''),
            'email': data.get('email', '')
        }

        # Add the new teacher to teachers.json
        teachers[data['email']] = new_teacher

        # Write the updated teachers.json to disk
        write_json(TEACHERS_FILE_PATH, teachers)

        return jsonify({'success': True})

    return jsonify({'success': False, 'message': 'Unauthorized'})

if __name__ == '__main__':
    app.run(debug=True)
