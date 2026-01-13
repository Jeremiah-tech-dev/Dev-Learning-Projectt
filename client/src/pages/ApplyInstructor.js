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