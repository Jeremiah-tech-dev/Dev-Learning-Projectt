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

  