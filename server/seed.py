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
        
          # Course 5: React Development
        react_course = Course(
            title='Modern React Development',
            description='Build dynamic user interfaces with React. Learn components, hooks, state management, and create professional web applications.',
            price=0,
            level='intermediate',
            category='Web Development',
            thumbnail='https://images.unsplash.com/photo-1633356122544-f134324a6cee',
            duration=300,
            instructor_id=sarah.id
        )
        
        db.session.add_all([js_course, html_course, python_course, dsa_course, react_course])
        db.session.commit()
        
        print('Creating course modules...')
        
        # JavaScript modules
        js_modules = [
            {
                'title': 'Getting Started with JavaScript',
                'content': '''Welcome to JavaScript Programming!

JavaScript is one of the most popular programming languages in the world. It powers websites, mobile apps, desktop applications, and even servers.

In this course, you'll learn:
- Variables and data types
- Functions and control flow
- Objects and arrays
- Modern JavaScript features
- Real-world programming techniques

Let's start your coding journey!''',
                'module_type': 'lesson',
                'order': 1
            },
            {
                'title': 'Writing Your First Code Comments',
                'content': '''Comments are essential for writing maintainable code. They help you and other developers understand what your code does.

JavaScript supports two types of comments:

Single-line comments start with //:
// This explains what the next line does

Multi-line comments are wrapped in /* */:
/* This comment can span
   multiple lines */

Good comments explain WHY you're doing something, not just WHAT you're doing.

Task: Add both types of comments to practice.''',
                'module_type': 'challenge',
                'challenge_code': '''// Add a single-line comment here

/* Add a multi-line
   comment here */''',
                'challenge_tests': json.dumps([
                    {'description': 'Code should contain a single-line comment (//))', 'test': 'return code.includes("//");'},
                    {'description': 'Code should contain a multi-line comment (/* */)', 'test': 'return code.includes("/*") && code.includes("*/");'}
                ]),
                'order': 2
            },
            {
                'title': 'Creating Variables',
                'content': '''Variables are containers that store data values. In JavaScript, you can create variables using the 'var' keyword.

Think of variables like labeled boxes where you can store information and retrieve it later.

Syntax:
var variableName;

This creates a variable but doesn't assign a value yet.

Task: Create a variable called myName using the var keyword.''',
                'module_type': 'challenge',
                'challenge_code': '''// Create a variable called myName here

''',
                'challenge_tests': json.dumps([
                    {'description': 'You should declare a variable named myName', 'test': 'return code.includes("var myName");'}
                ]),
                'order': 3
            },
            {
                'title': 'Assigning Values to Variables',
                'content': '''Once you've created a variable, you can store data in it using the assignment operator (=).

The equals sign doesn't mean "equal to" in programming - it means "assign the value on the right to the variable on the left."

Example:
var age;
age = 25;

You can also declare and assign in one line:
var name = "John";

Task: Assign the number 7 to variable a, then assign a's value to variable b.''',
                'module_type': 'challenge',
                'challenge_code': '''// Setup
var a;
var b;

// Assign 7 to variable a


// Assign a's value to variable b

''',
                'challenge_tests': json.dumps([
                    {'description': 'Variable a should equal 7', 'test': 'return code.includes("a = 7") || code.includes("a=7");'},
                    {'description': 'Variable b should equal a', 'test': 'return code.includes("b = a") || code.includes("b=a");'}
                ]),
                'order': 4
            },
            {
                'title': 'Basic Math Operations',
                'content': '''JavaScript can perform mathematical calculations using arithmetic operators.

Addition uses the + symbol:
var result = 5 + 3; // result is 8

Other operators include:
- Subtraction: -
- Multiplication: *
- Division: /

Task: Change the 0 in the code so that sum equals 20.''',
                'module_type': 'challenge',
                'challenge_code': '''const sum = 10 + 0;
''',
                'challenge_tests': json.dumps([
                    {'description': 'sum should equal 20', 'test': 'return code.includes("10 + 10") || code.includes("10+10");'}
                ]),
                'order': 5
            }
        ]
        