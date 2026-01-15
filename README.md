# DevLearn - Learning Management System

A modern, full-stack learning management system built with React and Flask.

## Features

- 🎓 **Course Management** - Browse, enroll, and learn from various courses
- 👨‍🏫 **Instructor Dashboard** - Create and manage courses
- 👨‍💼 **Admin Panel** - Manage users and instructor applications
- 🔐 **Google OAuth** - Sign in with Google
- 💻 **Interactive Coding Challenges** - Practice coding with built-in challenges
- 📊 **Progress Tracking** - Track your learning progress
- 🎨 **Modern UI** - Glassmorphism design with dark theme
- ✨ **Animated Splash Screen** - Beautiful loading experience

## Tech Stack

### Frontend
- React 18
- React Router v6
- Tailwind CSS
- Formik & Yup (forms & validation)
- Google OAuth (@react-oauth/google)
- Axios

### Backend
- Flask 3.0
- SQLAlchemy
- Flask-JWT-Extended
- Flask-CORS
- Google Auth
- SQLite (development) / PostgreSQL (production)

## Getting Started

### Prerequisites
- Node.js 16+
- Python 3.8+
- pip

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd Dev-Learning-Projectt
```

2. **Setup Backend**
```bash
cd server
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python3 seed.py  # Seed the database
python3 app.py
```

3. **Setup Frontend**
```bash
cd client
npm install
npm start
```

4. **Environment Variables**

Create `.env` in the client folder:
```
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
```

Update `server/config.py` with your Google Client ID.

## Default Accounts (After Seeding)

- **Admin**: admin@example.com / admin123
- **Instructor**: john@example.com / password123
- **Student**: alice@example.com / password123

## Project Structure

```
Dev-Learning-Projectt/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   └── services/      # API & App logic
│   └── package.json
├── server/                # Flask backend
│   ├── app.py            # Main application
│   ├── models.py         # Database models
│   ├── config.py         # Configuration
│   ├── seed.py           # Database seeding
│   └── requirements.txt
├── database_schema.dbml  # Database schema
└── wireframes_updated.html # UI wireframes
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/google` - Google OAuth login
- `GET /api/auth/me` - Get current user

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get course details
- `POST /api/courses` - Create course (instructor)
- `PUT /api/courses/:id` - Update course (instructor)
- `DELETE /api/courses/:id` - Delete course (instructor)

### Enrollments
- `POST /api/enrollments` - Enroll in course
- `GET /api/enrollments` - Get user enrollments
- `PUT /api/enrollments/:id` - Update progress

### Admin
- `GET /api/instructor-applications` - Get applications (admin)
- `PUT /api/instructor-applications/:id` - Review application (admin)

## Deployment

### Frontend (Vercel)
- Build command: `npm run build`
- Output directory: `build`
- Environment variables: Add `REACT_APP_GOOGLE_CLIENT_ID`

### Backend (Vercel/Heroku)
- Add production database URL
- Set environment variables
- Update CORS settings

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Authors

- Your Name - Initial work

## Acknowledgments

- FreeCodeCamp for inspiration
- Unsplash for images
- Google Fonts
