import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { api } from '../services/api';

const validationSchema = Yup.object().shape({
  qualifications: Yup.string().min(50, 'Qualifications must be at least 50 characters').required('Qualifications are required'),
});

export default function ApplyInstructor({ user }) {
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await api.post('/instructor-applications', values);
      setMessage('Application submitted successfully! Awaiting admin approval.');
      setTimeout(() => navigate('/courses'), 2000);
    } catch (err) {
      setMessage(err.response?.data?.error || 'Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

   return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Become an Instructor</h1>
          <p className="text-gray-600 mb-8">Share your knowledge and create courses for our community</p>

          {message && (
            <div className={`p-4 rounded-lg mb-6 ${
              message.includes('successfully') 
                ? 'bg-green-50 border border-green-200 text-green-700'
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}>
              {message}
            </div>
          )}

          <Formik
            initialValues={{ qualifications: '' }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >