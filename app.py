from flask import Flask, request, jsonify
from pymemcache.client import base
import cx_Oracle
import uuid

app = Flask(__name__)
app.secret_key = 'your_secret_key'  # Set a secret key for session encryption
memcached_client = base.Client(('localhost', 11211))  # Connect to Memcached server

# Connect to Oracle database
connection = cx_Oracle.connect("username", "password", "localhost:1521/orcl")

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    # Save user data to Oracle database
    cursor = connection.cursor()
    cursor.execute("INSERT INTO users (username, password) VALUES (:username, :password)", (username, password))
    connection.commit()

    response = {
        'message': 'Registration successful!'
    }
    return jsonify(response), 200

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    # Check if the username and password are valid
    # Your authentication logic here

    # If authentication is successful, create a session and store it in Memcached
    session_id = generate_session_id()  # Generate a unique session ID
    session_data = {
        'username': username,
        'authenticated': True
    }
    memcached_client.set(session_id, session_data)

    response = {
        'message': 'Login successful!',
        'session_id': session_id
    }
    return jsonify(response), 200

if __name__ == '__main__':
    app.run()
    def generate_session_id():
        return str(uuid.uuid4())