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
          <div className="flex items-center">
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
            
            <div className="hidden md:flex ml-12 space-x-1">
              <Link 
                to="/courses" 
                className="px-4 py-2 text-white hover:bg-gray-700"
              >
                Courses
              </Link>
              {user?.role === 'student' && (
                <Link 
                  to="/my-enrollments" 
                  className="px-4 py-2 text-white hover:bg-gray-700"
                >
                  My Learning
                </Link>
              )}
              {user?.role === 'instructor' && (
                <Link 
                  to="/instructor/dashboard" 
                  className="px-4 py-2 text-white hover:bg-gray-700"
                >
                  Dashboard
                </Link>
              )}
              {user?.role === 'admin' && (
                <Link 
                  to="/admin/dashboard" 
                  className="px-4 py-2 text-white hover:bg-gray-700"
                >
                  Admin
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <div className="flex items-center space-x-4">
                  <div className="hidden md:block text-right">
                    <div className="text-white font-semibold">{user.first_name} {user.last_name}</div>
                    <div className="text-xs text-gray-400">{user.email}</div>
                  </div>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                    user.role === 'admin' ? 'bg-red-600' :
                    user.role === 'instructor' ? 'bg-green-600' :
                    'bg-blue-600'
                  }`}>
                    {user.role === 'admin' ? 'A' : user.role === 'instructor' ? 'I' : 'S'}
                  </div>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="px-4 py-2 text-white hover:bg-gray-700"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}