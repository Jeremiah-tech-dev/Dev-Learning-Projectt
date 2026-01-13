import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function MyEnrollments() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const res = await api.get('/enrollments/my-enrollments');
        setEnrollments(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('Error fetching enrollments:', err);
        setEnrollments([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEnrollments();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Courses</h1>
        
        {enrollments.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600">You haven't enrolled in any courses yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrollments.map((enrollment) => (
              <div key={enrollment.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
                <div className="h-40 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {enrollment.course_title || 'Untitled Course'}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {enrollment.course_description 
                      ? enrollment.course_description.substring(0, 80) + '...' 
                      : 'No description available'}
                  </p>
                  
                  <div className="mb-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Progress</span>
                      <span className="text-sm font-medium text-gray-700">{enrollment.progress_percentage || 0}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-indigo-600 h-2 rounded-full transition-all"
                        style={{ width: `${enrollment.progress_percentage || 0}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  {enrollment.grade && (
                    <div className="bg-blue-50 p-3 rounded mb-4">
                      <p className="text-sm text-gray-600">Grade: <span className="font-bold text-blue-600">{enrollment.grade}</span></p>
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      enrollment.completion_status === 'completed' ? 'bg-green-100 text-green-800' :
                      enrollment.completion_status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {enrollment.completion_status ? enrollment.completion_status.replace('_', ' ') : 'enrolled'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}