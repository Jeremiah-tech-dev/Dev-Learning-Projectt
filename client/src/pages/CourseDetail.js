import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export default function CourseDetail({ user }) {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [enrolled, setEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  // const [reviews, setReviews] = useState([]); // TODO: add reviews feature later

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await api.get(`/courses/${id}`);
        const courseDetails = response.data;
        setCourse(courseDetails);
        console.log('Course loaded:', courseDetails.title);
        
        if (user) {
          // check if user is enrolled
          try {
            const enrollRes = await api.get(`/enrollments/check/${id}`);
            setEnrolled(enrollRes.data.enrolled);
          } catch (err) {
            console.error('Error checking enrollment:', err);
          }
        }
      } catch (error) {
        console.error('Error fetching course:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id, user]);

  const handleEnroll = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await api.post('/enrollments', { course_id: id });
      setEnrolled(true);
      console.log('Enrolled successfully');
      alert('Successfully enrolled in course!');
      // Navigate to first module
      if (course.modules && course.modules.length > 0) {
        navigate(`/learn/${id}/${course.modules[0].id}`);
      }
    } catch (error) {
      console.error('Enrollment failed:', error);
      alert(error.response?.data?.error || 'Failed to enroll');
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (!course) return <div className="text-center py-10">Course not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="h-96 bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
            <h1 className="text-4xl font-bold text-white text-center px-4">{course.title}</h1>
          </div>
          
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-8">
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-gray-600 text-sm">Level</p>
                <p className="text-lg font-semibold text-gray-900 capitalize">{course.level}</p>
              </div>
            </div>
            
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About this course</h2>
              <p className="text-gray-700 leading-relaxed">{course.description}</p>
            </div>
            
            {course.modules && course.modules.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Course Modules</h2>
                <div className="space-y-3">
                  {course.modules.map((module, idx) => (
                    <div key={module.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                      <p className="font-semibold text-gray-900">Module {idx + 1}: {module.title}</p>
                      <p className="text-gray-600 text-sm mt-1">{module.content.substring(0, 100)}...</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex gap-4">
              {enrolled ? (
                <button
                  onClick={() => {
                    if (course.modules && course.modules.length > 0) {
                      navigate(`/learn/${course.id}/${course.modules[0].id}`);
                    } else {
                      alert('No lessons available yet for this course.');
                    }
                  
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
