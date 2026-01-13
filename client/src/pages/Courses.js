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
    <div className="min-h-screen bg-gray-900">
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
