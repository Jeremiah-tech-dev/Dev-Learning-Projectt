from app import app, db
from models import User, Course, Module, Enrollment, InstructorApplication
import json

def seed():
    with app.app_context():
        # drop and recreate all tables
        db.drop_all()
        db.create_all()
        
        print('Creating users...')
        
        # Admin account
        admin = User(username='admin', email='admin@example.com', first_name='Admin', last_name='User', role='admin',
                    avatar='https://ui-avatars.com/api/?name=Admin+User&background=4F46E5')
        admin.set_password('admin123')
        db.session.add(admin)
        
        # Instructors
        john = User(username='john_dev', email='john@example.com', first_name='John', last_name='Smith', role='instructor',
                   bio='Senior Software Engineer with 10+ years experience', avatar='https://ui-avatars.com/api/?name=John+Smith&background=10B981')
        john.set_password('password123')
        
        sarah = User(username='sarah_design', email='sarah@example.com', first_name='Sarah', last_name='Johnson', role='instructor',
                    bio='UX/UI Designer and Product Manager', avatar='https://ui-avatars.com/api/?name=Sarah+Johnson&background=F59E0B')
        sarah.set_password('password123')
        
        db.session.add_all([john, sarah])
        
        # Student accounts
        alice = User(username='alice', email='alice@example.com', first_name='Alice', last_name='Williams', role='student',
                    avatar='https://ui-avatars.com/api/?name=Alice+Williams&background=EC4899')
        alice.set_password('password123')
        
        bob = User(username='bob', email='bob@example.com', first_name='Bob', last_name='Brown', role='student',
                  avatar='https://ui-avatars.com/api/?name=Bob+Brown&background=8B5CF6')
        bob.set_password('password123')
        
        db.session.add_all([alice, bob])
        db.session.commit()
        
        print('Creating courses...')
        
         # JavaScript course
        js_course = Course(
            title='JavaScript Programming Fundamentals',
            description='Master JavaScript from basics to advanced concepts. Learn variables, functions, objects, and modern ES6+ features through hands-on coding exercises.',
            price=0,
            level='beginner',
            category='Programming',
            thumbnail='https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a',
            duration=300,
            instructor_id=john.id
        )
        
        # Web dev course
        html_course = Course(
            title='Web Development Essentials',
            description='Build modern websites with HTML5, CSS3, and responsive design. Create beautiful, functional web pages that work on all devices.',
            price=0,
            level='beginner',
            category='Web Development',
            thumbnail='https://images.unsplash.com/photo-1498050108023-c5249f4df085',
            duration=200,
            instructor_id=sarah.id
        )
        
        # Course 3: Python Programming
        python_course = Course(
            title='Python Programming Bootcamp',
            description='Learn Python programming from scratch. Build real applications, work with data, and master one of the most popular programming languages.',
            price=0,
            level='beginner',
            category='Programming',
            thumbnail='https://images.unsplash.com/photo-1526379095098-d400fd0bf935',
            duration=250,
            instructor_id=john.id
        )
        
        # Course 4: Data Structures
        dsa_course = Course(
            title='Data Structures & Problem Solving',
            description='Master fundamental computer science concepts. Learn arrays, linked lists, trees, graphs, and algorithms to solve complex programming problems.',
            price=0,
            level='intermediate',
            category='Computer Science',
            thumbnail='https://images.unsplash.com/photo-1555949963-aa79dcee981c',
            duration=400,
            instructor_id=john.id
        )
        