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