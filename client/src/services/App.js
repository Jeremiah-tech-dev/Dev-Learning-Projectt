import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import MyEnrollments from './pages/MyEnrollments';
import InstructorDashboard from './pages/InstructorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ApplyInstructor from './pages/ApplyInstructor';
import LessonViewer from './pages/LessonViewer';
import { api } from './services/api';
// import Footer from './components/Footer'; // TODO: create footer component

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.get('/auth/me')
        .then(res => setUser(res.data))
        .catch(() => {
          localStorage.removeItem('token');
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);
  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Navbar user={user} setUser={setUser} />
      <Routes>
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/courses" element={<Courses user={user} />} />
        <Route path="/courses/:id" element={<CourseDetail user={user} />} />
        <Route path="/learn/:courseId/:moduleId" element={<LessonViewer user={user} />} />
        <Route path="/my-enrollments" element={user?.role === 'student' ? <MyEnrollments /> : <Navigate to="/courses" />} />
        <Route path="/instructor/dashboard" element={user?.role === 'instructor' ? <InstructorDashboard /> : <Navigate to="/courses" />} />
        <Route path="/admin/dashboard" element={user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/courses" />} />
        <Route path="/apply-instructor" element={user ? <ApplyInstructor user={user} /> : <Navigate to="/login" />} />
        <Route path="/" element={<Navigate to="/courses" />} />
      </Routes>
    </Router>
      );
}
