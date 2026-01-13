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