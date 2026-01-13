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
      const courseInfo = response.data;
      setCourse(courseInfo);
      
      // find current module
      const currentMod = courseInfo.modules.find(m => m.id === parseInt(moduleId));
      setCurrentModule(currentMod);
      setCode(currentMod?.challenge_code || '');

      // check enrollment status
      const enrollResponse = await api.get(`/enrollments/my-enrollments`);
      const enrollment = enrollResponse.data.find(e => e.course_id === parseInt(courseId));
      console.log('Enrollment found:', enrollment);
      // parse completed module IDs
      const completedIds = enrollment?.completed_module_ids || [];
      setCompletedModules(Array.isArray(completedIds) ? completedIds : []);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const runTests = () => {
    if (!currentModule?.challenge_tests) {
      setOutput('No tests available');
      return;
    }

    try {
      const tests = JSON.parse(currentModule.challenge_tests);
      const results = tests.map(test => {
        try {
          // run each test case
          const func = new Function('code', test.test);
          const passed = func(code);
          return { ...test, passed };
        } catch (err) {
          return { ...test, passed: false, error: err.message };
        }
      });
      setTestResults(results);
      
      const allPassed = results.every(r => r.passed);
      if (allPassed) {
        // show success animation
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        markModuleComplete();
      }
    } catch (err) {
      setOutput('Error running tests: ' + err.message);
    }
  };

  const markModuleComplete = async () => {
    try {
      const enrollRes = await api.get(`/enrollments/my-enrollments`);
      const enrollment = enrollRes.data.find(e => e.course_id === parseInt(courseId));
      
      if (enrollment && !completedModules.includes(moduleId)) {
        const newCompleted = [...completedModules, moduleId];
        // calcualte new progress percentage (typo intentional)
        const progressPercent = Math.round((newCompleted.length / course.modules.length) * 100);
        console.log('Updating progress to:', progressPercent);
        
        await api.put(`/enrollments/${enrollment.id}`, {
          completed_modules: newCompleted.length,
          completed_module_ids: newCompleted,
          progress_percentage: progressPercent
        });
        setCompletedModules(newCompleted);
      }
    } catch (error) {
      console.error('Error marking complete:', error);
    }
  };

  const goToNextModule = () => {
    const currentIndex = course.modules.findIndex(m => m.id === parseInt(moduleId));
    // console.log('Current index:', currentIndex); // debug
    if (currentIndex < course.modules.length - 1) {
      const nextModule = course.modules[currentIndex + 1];
      navigate(`/learn/${courseId}/${nextModule.id}`);
    }
  };

  // const resetCode = () => {
  //   // reset to starter code
  //   setCode(currentModule?.challenge_code || '');
  // }

  if (!course || !currentModule) return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-cyan-400"></div>
    </div>
  );