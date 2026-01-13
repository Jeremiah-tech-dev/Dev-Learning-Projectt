from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from datetime import datetime

db = SQLAlchemy()
bcrypt = Bcrypt()

# User model - handles students, instructors, and admins
class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    role = db.Column(db.String(20), nullable=False, default='student')
    first_name = db.Column(db.String(50))
    last_name = db.Column(db.String(50))
    bio = db.Column(db.Text)
    avatar = db.Column(db.String(200), default='https://ui-avatars.com/api/?name=User')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    courses = db.relationship('Course', backref='instructor', lazy=True, cascade='all, delete-orphan')
    enrollments = db.relationship('Enrollment', backref='student', lazy=True, cascade='all, delete-orphan')
    instructor_application = db.relationship('InstructorApplication', backref='user', uselist=False, cascade='all, delete-orphan')
    
    def set_password(self, password):
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
    
    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'role': self.role,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'bio': self.bio,
            'avatar': self.avatar,
            'created_at': self.created_at.isoformat()
        }
        
        # Course model
class Course(db.Model):
    __tablename__ = 'courses'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    price = db.Column(db.Float, nullable=False)
    level = db.Column(db.String(20), nullable=False)
    category = db.Column(db.String(50), nullable=False)
    thumbnail = db.Column(db.String(500), default='https://images.unsplash.com/photo-1516321318423-f06f85e504b3')
    duration = db.Column(db.Integer, default=0)  # in hours
    instructor_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    is_published = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    modules = db.relationship('Module', backref='course', lazy=True, cascade='all, delete-orphan', order_by='Module.order')
    enrollments = db.relationship('Enrollment', backref='course', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self, include_modules=False):
        data = {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'price': self.price,
            'level': self.level,
            'category': self.category,
            'thumbnail': self.thumbnail,
            'duration': self.duration,
            'instructor_id': self.instructor_id,
            'instructor_name': f"{self.instructor.first_name} {self.instructor.last_name}" if self.instructor.first_name else self.instructor.username,
            'instructor_avatar': self.instructor.avatar,
            'is_published': self.is_published,
            'created_at': self.created_at.isoformat(),
            'module_count': len(self.modules),
            'student_count': len(self.enrollments)
        }
        if include_modules:
            data['modules'] = [m.to_dict() for m in self.modules]
        return data
    
    # Module/Lesson model - contains actual course content
class Module(db.Model):
    __tablename__ = 'modules'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text, nullable=False)
    video_url = db.Column(db.String(500))
    duration = db.Column(db.Integer, default=0)  # in minutes
    order = db.Column(db.Integer, nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    module_type = db.Column(db.String(20), default='lesson')  # lesson, challenge, project
    challenge_code = db.Column(db.Text)  # starter code for challenges
    challenge_tests = db.Column(db.Text)  # test cases
    challenge_solution = db.Column(db.Text)  # solution code
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'content': self.content,
            'video_url': self.video_url,
            'duration': self.duration,
            'order': self.order,
            'course_id': self.course_id,
            'module_type': self.module_type,
            'challenge_code': self.challenge_code,
            'challenge_tests': self.challenge_tests,
            'challenge_solution': self.challenge_solution
        }
        
class Enrollment(db.Model):
    __tablename__ = 'enrollments'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id'), nullable=False)
    enrollment_date = db.Column(db.DateTime, default=datetime.utcnow)
    progress_percentage = db.Column(db.Integer, default=0)
    completed_modules = db.Column(db.Integer, default=0)
    grade = db.Column(db.String(5))
    completion_status = db.Column(db.String(20), default='in_progress')
    last_accessed = db.Column(db.DateTime, default=datetime.utcnow)
    completed_module_ids = db.Column(db.Text, default='')  # comma-separated module IDs
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'course_id': self.course_id,
            'enrollment_date': self.enrollment_date.isoformat(),
            'progress_percentage': self.progress_percentage,
            'completed_modules': self.completed_modules,
            'grade': self.grade,
            'completion_status': self.completion_status,
            'last_accessed': self.last_accessed.isoformat(),
            'course_title': self.course.title if self.course else None,
            'course_description': self.course.description if self.course else None,
            'course': self.course.to_dict() if self.course else None,
            'completed_module_ids': self.completed_module_ids.split(',') if self.completed_module_ids else []
        }
class InstructorApplication(db.Model):
    __tablename__ = 'instructor_applications'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    qualifications = db.Column(db.Text, nullable=False)
    experience = db.Column(db.Text)
    linkedin_url = db.Column(db.String(200))
    status = db.Column(db.String(20), default='pending')
    applied_at = db.Column(db.DateTime, default=datetime.utcnow)
    reviewed_at = db.Column(db.DateTime)
    admin_notes = db.Column(db.Text)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'user': self.user.to_dict() if self.user else None,
            'qualifications': self.qualifications,
            'experience': self.experience,
            'linkedin_url': self.linkedin_url,
            'status': self.status,
            'applied_at': self.applied_at.isoformat(),
            'reviewed_at': self.reviewed_at.isoformat() if self.reviewed_at else None,
            'admin_notes': self.admin_notes
        } 
