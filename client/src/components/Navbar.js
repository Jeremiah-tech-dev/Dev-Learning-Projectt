import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Navigation bar component
export default function Navbar({ user, setUser }) {
  const navigate = useNavigate();
const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-gray-800 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center"></div>
           <Link to="/courses" className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2">
                <span className="text-white text-xl font-bold">DL</span>
              </div>
              <div>
                <span className="text-xl font-bold text-white">
                  DevLearn
                </span>
              </div>
            </Link>