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
      user.set_password(data['password'])
    
    db.session.add(user)
    db.session.commit()
    
    token = create_access_token(identity=str(user.id))
    return jsonify({'token': token, 'user': user.to_dict()}), 201

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    
    user = User.query.filter_by(email=data.get('email')).first()
    # print(f"Login attempt for: {data.get('email')}")
    
    if not user or not user.check_password(data.get('password', '')):
        return jsonify({'error': 'Invalid credentials'}), 401
    
    token = create_access_token(identity=str(user.id))
    return jsonify({'token': token, 'user': user.to_dict()}), 200

@app.route('/api/auth/me', methods=['GET'])
@jwt_required()
def get_me():
    user = User.query.get(int(get_jwt_identity()))
    return jsonify(user.to_dict()), 200

# COURSES
@app.route('/api/courses', methods=['GET'])
def get_courses():
    category = request.args.get('category')
    level = request.args.get('level')
    search = request.args.get('search')
    
    query = Course.query.filter_by(is_published=True)
      # filter courses based on params
    
    if category:
        query = query.filter_by(category=category)
    if level:
        query = query.filter_by(level=level)
    if search:
        # search in title
        query = query.filter(Course.title.ilike(f'%{search}%'))
    
    courseList = query.all()
    return jsonify([c.to_dict() for c in courseList]), 200

@app.route('/api/courses/<int:id>', methods=['GET'])
def get_course(id):
    course = Course.query.get_or_404(id)
    return jsonify(course.to_dict(include_modules=True)), 200

@app.route('/api/courses', methods=['POST'])
@jwt_required()
def create_course():
    user = User.query.get(int(get_jwt_identity()))
    
    if user.role != 'instructor':
        return jsonify({'error': 'Instructor access required'}), 403
    
    data = request.get_json()
    
    course = Course(
        title=data['title'],
        description=data['description'],
        price=float(data['price']),
        level=data['level'],
        category=data['category'],
        thumbnail=data.get('thumbnail', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3'),
        duration=int(data.get('duration', 0)),
        instructor_id=user.id
    )
    
    db.session.add(course)
    db.session.commit()
    
    return jsonify(course.to_dict()), 201

@app.route('/api/courses/<int:id>', methods=['PUT'])
@jwt_required()
def update_course(id):
    user = User.query.get(int(get_jwt_identity()))
    course = Course.query.get_or_404(id)
    
    if course.instructor_id != user.id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    data = request.get_json()
    
    for key in ['title', 'description', 'price', 'level', 'category', 'thumbnail', 'duration']:
        if key in data:
            setattr(course, key, data[key])
    
    db.session.commit()
    return jsonify(course.to_dict()), 200

@app.route('/api/courses/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_course(id):
    user = User.query.get(int(get_jwt_identity()))
    course = Course.query.get_or_404(id)
    
    if course.instructor_id != user.id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    db.session.delete(course)
    db.session.commit()
    
    return jsonify({'message': 'Course deleted'}), 200

# TODO: add course rating endpoint
# def rate_course(id):
#     pass

@app.route('/api/courses/instructor/my-courses', methods=['GET'])
@jwt_required()
def get_instructor_courses():
    user = User.query.get(int(get_jwt_identity()))
    courses = Course.query.filter_by(instructor_id=user.id).all()
    return jsonify([c.to_dict() for c in courses]), 200

# MODULES
@app.route('/api/courses/<int:course_id>/modules', methods=['POST'])
@jwt_required()
def create_module(course_id):
    user = User.query.get(int(get_jwt_identity()))
    course = Course.query.get_or_404(course_id)
    
    if course.instructor_id != user.id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    data = request.get_json()
    
    module = Module(
        title=data['title'],
        content=data['content'],
        video_url=data.get('video_url'),
        duration=int(data.get('duration', 0)),
