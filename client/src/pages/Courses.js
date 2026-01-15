import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

// Course listing page
export default function Courses({ user }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [level, setLevel] = useState('');
  // const [category, setCategory] = useState(''); // TODO: add category filter later

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await api.get('/courses');
      console.log('Fetched courses:', response.data.length);
      setCourses(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  // TODO: implement this later
  // const handleCategoryChange = (cat) => {
  //   setCategory(cat);
  // }

  const filteredCourses = courses.filter(courseItem => {
    const matchesSearch = courseItem.title.toLowerCase().includes(search.toLowerCase()) ||
                         courseItem.description.toLowerCase().includes(search.toLowerCase());
    const matchesLevel = !level || courseItem.level === level;
    return matchesSearch && matchesLevel;
  });

  // loading spinner
  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 pt-20">
      {/* Hero Section */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Learn to Code — For Free.
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            Build projects. Earn certifications.
          </p>
          
          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search courses"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-2xl px-4 py-3 bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-gray-800 border border-gray-700 p-4">
              <h3 className="text-white font-bold mb-4">Filter by Level</h3>
              <div className="space-y-2">
                {['', 'beginner', 'intermediate', 'advanced'].map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setLevel(lvl)}
                    className={`w-full text-left px-3 py-2 text-sm ${
                      level === lvl 
                        ? 'bg-blue-600 text-white' 
                        : 'text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {lvl === '' ? 'All Levels' : lvl.charAt(0).toUpperCase() + lvl.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Courses List */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white mb-6">
              Available Courses ({filteredCourses.length})
            </h2>

            {filteredCourses.length === 0 ? (
              <div className="bg-gray-800 border border-gray-700 p-8 text-center">
                <p className="text-gray-300">No courses found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredCourses.map((courseData) => (
                  <Link 
                    key={courseData.id} 
                    to={`/courses/${courseData.id}`} 
                    className="block bg-gray-800 border border-gray-700 hover:border-blue-500 transition-colors"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-xl font-bold text-white hover:text-blue-400">
                          {courseData.title}
                        </h3>
                        <span className={`px-3 py-1 text-xs font-bold ${
                          courseData.level === 'beginner' ? 'bg-green-600 text-white' :
                          courseData.level === 'intermediate' ? 'bg-yellow-600 text-white' :
                          'bg-red-600 text-white'
                        }`}>
                          {courseData.level.toUpperCase()}
                        </span>
                      </div>

                      <p className="text-gray-400 mb-4">
                        {courseData.description}
                      </p>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-blue-400">Start Course →</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
