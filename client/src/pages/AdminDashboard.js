import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function AdminDashboard() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await api.get('/instructor-applications');
      setApplications(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Error fetching applications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await api.put(`/instructor-applications/${id}`, { status: 'approved' });
      fetchApplications();
    } catch (err) {
      alert('Failed to approve application');
    }
  };

  const handleReject = async (id) => {
    try {
      await api.put(`/instructor-applications/${id}`, { status: 'rejected' });
      fetchApplications();
    } catch (err) {
      alert('Failed to reject application');
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  const pending = applications.filter(app => app.status === 'pending');
  const approved = applications.filter(app => app.status === 'approved');
  const rejected = applications.filter(app => app.status === 'rejected');

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Instructor Applications</h1>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800 text-sm font-medium">Pending</p>
            <p className="text-3xl font-bold text-yellow-600">{pending.length}</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800 text-sm font-medium">Approved</p>
            <p className="text-3xl font-bold text-green-600">{approved.length}</p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 text-sm font-medium">Rejected</p>
            <p className="text-3xl font-bold text-red-600">{rejected.length}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Qualifications</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {app.user?.first_name} {app.user?.last_name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{app.user?.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{app.qualifications.substring(0, 50)}...</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        app.status === 'approved' ? 'bg-green-100 text-green-800' :
                        app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {app.status === 'pending' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApprove(app.id)}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs font-semibold transition"
                          
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}