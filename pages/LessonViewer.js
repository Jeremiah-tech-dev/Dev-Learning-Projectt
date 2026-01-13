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

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-gray-800 border-2 border-green-500 p-8 max-w-md">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">Challenge Passed!</h2>
              <p className="text-gray-300">All tests passed successfully.</p>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <div className="w-80 bg-gray-800 border-r border-gray-700 overflow-y-auto">
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-white font-bold text-lg mb-2">{course.title}</h2>
          <div className="text-gray-400 text-sm mb-3">
            {course.modules.length} Lessons
          </div>
          
          {/* Progress Bar */}
          <div className="mb-2">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Progress</span>
              <span>{Math.round((completedModules.length / course.modules.length) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-700 h-2">
              <div
                className="bg-green-500 h-2 transition-all"
                style={{ width: `${(completedModules.length / course.modules.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        <div className="p-2">
          {course.modules.map((module, idx) => {
            const isCompleted = completedModules.includes(String(module.id)) || completedModules.includes(module.id);
            const isCurrent = module.id === parseInt(moduleId);
            
            return (
              <button
                key={module.id}
                onClick={() => navigate(`/learn/${courseId}/${module.id}`)}
                className={`w-full text-left p-3 mb-1 text-sm ${
                  isCurrent
                    ? 'bg-blue-600 text-white'
                    : isCompleted
                    ? 'bg-green-700 text-white hover:bg-green-600'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}