import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';

// Main lesson viewer component - handles both reading lessons and coding challenges
export default function LessonViewer({ user }) {
  const { courseId, moduleId } = useParams();
  const [course, setCourse] = useState(null);
  const [currentModule, setCurrentModule] = useState(null);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [testResults, setTestResults] = useState([]);
  const [completedModules, setCompletedModules] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  // TODO: add hints feature
  // const [showHints, setShowHints] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchCourse();
  }, [courseId, moduleId, user]);

  const fetchCourse = async () => {
    try {
      const response = await api.get(`/courses/${courseId}`);