import React, { useState, useEffect } from 'react';
import { useToast } from '../components/Toast';
import { api } from '../services/api';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [redFlags, setRedFlags] = useState([]);
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [activeTab, setActiveTab] = useState('users');
  const toast = useToast();

  useEffect(() => {
    fetchUsers();
    fetchRedFlags();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data);
    } catch (err) {
      toast.error('Failed to fetch users');
    }
  };

  const fetchRedFlags = async () => {
    try {
      const res = await api.get('/admin/red-flags');
      setRedFlags(res.data);
    } catch (err) {
      toast.error('Failed to fetch red flags');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Delete this user? They will be red flagged and cannot create new accounts.')) {
      try {
        await api.delete(`/admin/users/${userId}`);
        toast.success('User deleted and red flagged');
        fetchUsers();
        fetchRedFlags();
      } catch (err) {
        toast.error('Failed to delete user');
      }
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      title: formData.get('title'),
      description: formData.get('description'),
      price: formData.get('price'),
      level: formData.get('level'),
      category: formData.get('category'),
      duration: formData.get('duration')
    };

    try {
      await api.post('/admin/courses', data);
      toast.success('Course created successfully');
      setShowCourseForm(false);
      e.target.reset();
    } catch (err) {
      toast.error('Failed to create course');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-2 rounded-lg font-semibold ${activeTab === 'users' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700'}`}
          >
            Users
          </button>
          <button
            onClick={() => setActiveTab('redflags')}
            className={`px-6 py-2 rounded-lg font-semibold ${activeTab === 'redflags' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700'}`}
          >
            Red Flags
          </button>
          <button
            onClick={() => setActiveTab('courses')}
            className={`px-6 py-2 rounded-lg font-semibold ${activeTab === 'courses' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700'}`}
          >
            Add Course
          </button>
        </div>

        {activeTab === 'users' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4">User Accounts</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Name</th>
                    <th className="text-left py-3 px-4">Email</th>
                    <th className="text-left py-3 px-4">Role</th>
                    <th className="text-left py-3 px-4">Created</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{user.first_name} {user.last_name}</td>
                      <td className="py-3 px-4">{user.email}</td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                          user.role === 'instructor' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3 px-4">{new Date(user.created_at).toLocaleDateString()}</td>
                      <td className="py-3 px-4">
                        {user.role !== 'admin' && (
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'redflags' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Red Flagged Users</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Username</th>
                    <th className="text-left py-3 px-4">Email</th>
                    <th className="text-left py-3 px-4">Reason</th>
                    <th className="text-left py-3 px-4">Flagged At</th>
                  </tr>
                </thead>
                <tbody>
                  {redFlags.map(flag => (
                    <tr key={flag.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{flag.username}</td>
                      <td className="py-3 px-4">{flag.email}</td>
                      <td className="py-3 px-4">{flag.reason}</td>
                      <td className="py-3 px-4">{new Date(flag.flagged_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'courses' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Create New Course</h2>
            <form onSubmit={handleCreateCourse} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Course Title</label>
                <input
                  type="text"
                  name="title"
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  name="description"
                  required
                  rows="4"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Price</label>
                  <input
                    type="number"
                    name="price"
                    step="0.01"
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Duration (hours)</label>
                  <input
                    type="number"
                    name="duration"
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Level</label>
                  <select
                    name="level"
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <input
                    type="text"
                    name="category"
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 font-semibold"
              >
                Create Course
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
