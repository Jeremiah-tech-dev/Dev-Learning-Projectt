from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_migrate import Migrate
from config import Config
from models import db, bcrypt, User, Course, Module, Enrollment, InstructorApplication, RedFlag
from datetime import datetime
import re
import json
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

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
    
    if not all(k in data for k in ['username', 'email', 'password', 'first_name', 'last_name']):
        return jsonify({'error': 'Missing required fields'}), 400
    
    if not is_valid_email(data['email']):
        return jsonify({'error': 'Invalid email'}), 400
    
    # Check red flag
    red_flag = RedFlag.query.filter_by(email=data['email']).first()
    if red_flag:
        return jsonify({'error': 'Account creation denied. Contact support.'}), 403
    
    if len(data['password']) < 6:
        return jsonify({'error': 'Password must be at least 6 characters'}), 400
    
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already exists'}), 400
    
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'error': 'Username already exists'}), 400
    
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

@app.route('/api/auth/google', methods=['POST'])
def google_login():
    data = request.get_json()
    token = data.get('token')
    
    try:
        idinfo = id_token.verify_oauth2_token(token, google_requests.Request(), Config.GOOGLE_CLIENT_ID)
        
        email = idinfo['email']
        user = User.query.filter_by(email=email).first()
        
        if not user:
            user = User(
                username=email.split('@')[0],
                email=email,
                first_name=idinfo.get('given_name', ''),
                last_name=idinfo.get('family_name', ''),
                role='student',
                avatar=idinfo.get('picture', f"https://ui-avatars.com/api/?name={idinfo.get('given_name', 'User')}&background=random")
            )
            user.set_password('google_oauth_' + email)
            db.session.add(user)
            db.session.commit()
        
        access_token = create_access_token(identity=str(user.id))
        return jsonify({'token': access_token, 'user': user.to_dict()}), 200
        
    except ValueError:
        return jsonify({'error': 'Invalid token'}), 401

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
        order=data['order'],
        course_id=course_id
    )
    
    db.session.add(module)
    db.session.commit()
    
    return jsonify(module.to_dict()), 201

# ENROLLMENTS
@app.route('/api/enrollments', methods=['POST'])
@jwt_required()
def enroll():
    user = User.query.get(int(get_jwt_identity()))
    data = request.get_json()
    
    if user.role != 'student':
        return jsonify({'error': 'Access denied'}), 403
    
    if Enrollment.query.filter_by(user_id=user.id, course_id=data['course_id']).first():
        return jsonify({'error': 'Already enrolled'}), 400
    
    enrollment = Enrollment(user_id=user.id, course_id=data['course_id'])
    db.session.add(enrollment)
    db.session.commit()
    
    return jsonify(enrollment.to_dict()), 201

@app.route('/api/enrollments', methods=['GET'])
@jwt_required()
def get_enrollments():
    user = User.query.get(int(get_jwt_identity()))
    enrollments = Enrollment.query.filter_by(user_id=user.id).all()
    return jsonify([e.to_dict() for e in enrollments]), 200

@app.route('/api/enrollments/check/<int:course_id>', methods=['GET'])
@jwt_required()
def check_enrollment(course_id):
    user = User.query.get(int(get_jwt_identity()))
    enrollment = Enrollment.query.filter_by(user_id=user.id, course_id=course_id).first()
    return jsonify({'enrolled': enrollment is not None}), 200

@app.route('/api/enrollments/my-enrollments', methods=['GET'])
@jwt_required()
def get_my_enrollments():
    user = User.query.get(int(get_jwt_identity()))
    enrollments = Enrollment.query.filter_by(user_id=user.id).all()
    result = []
    for e in enrollments:
        data = e.to_dict()
        data['course_title'] = e.course.title
        data['course_description'] = e.course.description
        result.append(data)
    return jsonify(result), 200

@app.route('/api/enrollments/<int:id>', methods=['PUT'])
@jwt_required()
def update_enrollment(id):
    current_user = User.query.get(int(get_jwt_identity()))
    enrollment = Enrollment.query.get_or_404(id)
    
    if enrollment.user_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    requestData = request.get_json()
    
    # update progress tracking
    if 'progress_percentage' in requestData:
        enrollment.progress_percentage = requestData['progress_percentage']
        if requestData['progress_percentage'] >= 100:  # changed from == to >= just in case
            enrollment.completion_status = 'completed'
            # print('Course completed!')  # debug
    
    if 'completed_modules' in requestData:
        enrollment.completed_modules = requestData['completed_modules']
        # store module IDs as comma-separated string
        if isinstance(requestData.get('completed_module_ids'), list):
            enrollment.completed_module_ids = ','.join(map(str, requestData['completed_module_ids']))
    
    enrollment.last_accessed = datetime.utcnow()
    
    db.session.commit()
    return jsonify(enrollment.to_dict()), 200

# INSTRUCTOR APPLICATIONS
@app.route('/api/instructor-applications', methods=['POST'])
@jwt_required()
def apply_instructor():
    user = User.query.get(int(get_jwt_identity()))
    
    if user.role != 'student':
        return jsonify({'error': 'Only students can apply'}), 403
    
    if user.instructor_application:
        return jsonify({'error': 'Application already exists'}), 400
    
    data = request.get_json()
    
    app_obj = InstructorApplication(
        user_id=user.id,
        qualifications=data['qualifications'],
        experience=data.get('experience'),
        linkedin_url=data.get('linkedin_url')
    )
    
    db.session.add(app_obj)
    db.session.commit()
    return jsonify(app_obj.to_dict()), 201

@app.route('/api/instructor-applications', methods=['GET'])
@jwt_required()
def get_applications():
    user = User.query.get(int(get_jwt_identity()))
    
    if user.role != 'admin':
        return jsonify({'error': 'Admin access required'}), 403
    
    apps = InstructorApplication.query.all()
    return jsonify([a.to_dict() for a in apps]), 200

@app.route('/api/instructor-applications/<int:id>', methods=['PUT'])
@jwt_required()
def review_application(id):
    user = User.query.get(int(get_jwt_identity()))
    
    if user.role != 'admin':
        return jsonify({'error': 'Admin access required'}), 403
    
    app_obj = InstructorApplication.query.get_or_404(id)
    data = request.get_json()
    
    app_obj.status = data['status']
    app_obj.reviewed_at = datetime.utcnow()
    app_obj.admin_notes = data.get('notes')
    
    if data['status'] == 'approved':
        applicant = User.query.get(app_obj.user_id)
        applicant.role = 'instructor'
    
    db.session.commit()
    return jsonify(app_obj.to_dict()), 200

# STATS
@app.route('/api/stats', methods=['GET'])
@jwt_required()
def get_stats():
    user = User.query.get(int(get_jwt_identity()))
    
    if user.role == 'instructor':
        courses = Course.query.filter_by(instructor_id=user.id).count()
        students = db.session.query(Enrollment).join(Course).filter(Course.instructor_id == user.id).count()
        return jsonify({'courses': courses, 'students': students}), 200
    
    elif user.role == 'student':
        enrollments = Enrollment.query.filter_by(user_id=user.id).count()
        completed = Enrollment.query.filter_by(user_id=user.id, completion_status='completed').count()
        return jsonify({'enrollments': enrollments, 'completed': completed}), 200
    
    return jsonify({}), 200

# ADMIN ENDPOINTS
@app.route('/api/admin/users', methods=['GET'])
@jwt_required()
def get_all_users():
    user = User.query.get(int(get_jwt_identity()))
    
    if user.role != 'admin':
        return jsonify({'error': 'Admin access required'}), 403
    
    users = User.query.all()
    return jsonify([u.to_dict() for u in users]), 200

@app.route('/api/admin/users/<int:user_id>', methods=['DELETE'])
@jwt_required()
def delete_user(user_id):
    admin = User.query.get(int(get_jwt_identity()))
    
    if admin.role != 'admin':
        return jsonify({'error': 'Admin access required'}), 403
    
    user = User.query.get_or_404(user_id)
    
    if user.role == 'admin':
        return jsonify({'error': 'Cannot delete admin'}), 403
    
    red_flag = RedFlag(
        email=user.email,
        username=user.username,
        reason='Account deleted by admin'
    )
    db.session.add(red_flag)
    db.session.delete(user)
    db.session.commit()
    
    return jsonify({'message': 'User deleted and red flagged'}), 200

@app.route('/api/admin/red-flags', methods=['GET'])
@jwt_required()
def get_red_flags():
    user = User.query.get(int(get_jwt_identity()))
    
    if user.role != 'admin':
        return jsonify({'error': 'Admin access required'}), 403
    
    flags = RedFlag.query.all()
    return jsonify([f.to_dict() for f in flags]), 200

@app.route('/api/admin/courses', methods=['POST'])
@jwt_required()
def admin_create_course():
    user = User.query.get(int(get_jwt_identity()))
    
    if user.role != 'admin':
        return jsonify({'error': 'Admin access required'}), 403
    
    data = request.get_json()
    
    course = Course(
        title=data['title'],
        description=data['description'],
        price=float(data['price']),
        level=data['level'],
        category=data['category'],
        thumbnail=data.get('thumbnail', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3'),
        duration=int(data.get('duration', 0)),
        instructor_id=user.id,
        is_published=True
    )
    
    db.session.add(course)
    db.session.commit()
    
    return jsonify(course.to_dict()), 201

@app.route('/api/admin/courses/<int:course_id>', methods=['DELETE'])
@jwt_required()
def admin_delete_course(course_id):
    user = User.query.get(int(get_jwt_identity()))
    
    if user.role != 'admin':
        return jsonify({'error': 'Admin access required'}), 403
    
    course = Course.query.get_or_404(course_id)
    db.session.delete(course)
    db.session.commit()
    
    return jsonify({'message': 'Course deleted'}), 200

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=5000)
 