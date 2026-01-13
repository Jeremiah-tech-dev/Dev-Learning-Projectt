from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_migrate import Migrate
from config import Config
from models import db, bcrypt, User, Course, Module, Enrollment, InstructorApplication
from datetime import datetime
import re
import json  # not used yet but might need later

# TODO: add rate limiting later
# TODO: maybe add email verification?

app = Flask(__name__)
app.config.from_object(Config)

CORS(app, resources={r"/api/*": {"origins": "*"}})
db.init_app(app)
bcrypt.init_app(app)
jwt = JWTManager(app)
migrate = Migrate(app, db)

def is_valid_email(email):
    return re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', email)

@jwt.unauthorized_loader
def unauthorized_callback(callback):
    return jsonify({'error': 'Missing or invalid token'}), 401

@jwt.invalid_token_loader
def invalid_token_callback(callback):
    return jsonify({'error': 'Invalid token'}), 401

# AUTH
@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    # print(f"Registration attempt: {data.get('email')}")  # debug
    
    if not all(k in data for k in ['username', 'email', 'password', 'first_name', 'last_name']):
        return jsonify({'error': 'Missing required fields'}), 400
    
    if not is_valid_email(data['email']):
        return jsonify({'error': 'Invalid email'}), 400
    
    # check password lenght
    if len(data['password']) < 6:
        return jsonify({'error': 'Password must be at least 6 characters'}), 400
    
    # check if email already exists
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already exists'}), 400
    
    user = User(
        username=data['username'],
        email=data['email'],
        first_name=data['first_name'],
        last_name=data['last_name'],
        role='student',
        avatar=f"https://ui-avatars.com/api/?name={data['first_name']}+{data['last_name']}&background=random"
    )