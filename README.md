# DevLearn - Interactive Programming Platform

A full-stack learning management system for programming education. Built with Flask and React.

## Features

### For Students
- Interactive coding challenges with real-time feedback
- Progress tracking and completion badges
- Multiple programming courses (JavaScript, Python, Web Dev, etc.)
- Works on desktop and mobile

## Tech Stack

**Backend:**
- Flask (Python)
- SQLAlchemy ORM
- JWT Authentication
- SQLite database

**Frontend:**
- React 18
- React Router
- Axios
- Tailwind CSS
- Formik + Yup validation

## Installation

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm

### Backend Setup
```bash
cd server
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python seed.py
python app.py
```

### Frontend Setup
```bash
cd client
npm install
npm start
```


## Available Courses

1. JavaScript Programming Fundamentals
2. Web Development Essentials
3. Python Programming Bootcamp
4. Data Structures & Problem Solving
5. Modern React Development

## Project Structure

```
learning-platform/
├── server/                 # Flask backend
│   ├── app.py             # Main app
│   ├── models.py          # DB models
│   ├── config.py          # Config
│   ├── seed.py            # Sample data
│   └── requirements.txt
├── client/                # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.js
│   └── package.json
└── README.md
```

## Database Models

- **User** - Students, instructors, admins
- **Course** - Programming courses
- **Module** - Lessons and challenges
- **Enrollment** - Student registrations with progress tracking
- **InstructorApplication** - Instructor requests

### Relationships
- One-to-Many: User → Course (instructors create courses)
- One-to-Many: Course → Module
- Many-to-Many: User ↔ Course (via Enrollment)

## Key Features

- JWT authentication
- Role-based access control
- Interactive code editor
- Real-time test execution
- Progress tracking
- Responsive design

## Deployment

### Backend (Render/Heroku)
1. Create web service
2. Connect repo
3. Set env variables:
   - `FLASK_ENV=production`
   - `DATABASE_URL=your_db_url`
   - `SECRET_KEY=your_secret`

### Frontend (Vercel/Netlify)
1. Connect repo
2. Build command: `npm run build`
3. Set `REACT_APP_API_URL=your_backend_url`

## Development

### Adding Courses
1. Login as instructor
2. Create course via dashboard
3. Add modules with content
4. Set up test cases for challenges
5. Publish course

### Creating Challenges
```python
challenge_tests = json.dumps([
    {
        'description': 'Variable should be declared',
        'test': 'return code.includes("var myVar");'
    }
])
```

## Future Ideas

- Video lessons
- Multi-language code execution
- Peer code reviews
- Certificates
- Mobile app
- Better analytics

## License

MIT License

## Support

For issues:
1. Check docs
2. Search existing issues
3. Create new issue with details