import { useToast } from '../components/Toast';
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { api } from '../services/api';

const validationSchema = Yup.object().shape({
  username: Yup.string().min(3, 'Username must be at least 3 characters').required('Username is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  first_name: Yup.string().required('First name is required'),
  last_name: Yup.string().required('Last name is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: Yup.string().oneOf([Yup.ref('password')], 'Passwords must match').required('Confirm password is required'),
});

export default function Register() {
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting }) => {
    setError('');
    try {
      await api.post('/auth/register', {
        username: values.username,
        email: values.email,
        first_name: values.first_name,
        last_name: values.last_name,
        password: values.password,
      });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{
      backgroundImage: 'url(https://images.unsplash.com/photo-1758270703286-6600f25efdbc?q=80&w=1631&auto=format&fit=crop)',
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}>
      <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-8 w-full max-w-md shadow-2xl">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Create Account</h2>
        
        {error && <div className="bg-red-500/20 backdrop-blur-sm border border-red-300/50 text-white px-4 py-3 rounded-lg mb-4">{error}</div>}
        
        <Formik
          initialValues={{ username: '', email: '', first_name: '', last_name: '', password: '', confirmPassword: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-1">Username</label>
                <Field
                  type="text"
                  name="username"
                  className="w-full px-4 py-2 bg-white/20 backdrop-blur-sm text-white border border-white/30 rounded-lg focus:border-white/60 focus:outline-none placeholder-white/60"
                />
                <ErrorMessage name="username" component="div" className="text-red-200 text-sm mt-1" />
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-white mb-1">First Name</label>
                  <Field
                    type="text"
                    name="first_name"
                    className="w-full px-4 py-2 bg-white/20 backdrop-blur-sm text-white border border-white/30 rounded-lg focus:border-white/60 focus:outline-none placeholder-white/60"
                  />
                  <ErrorMessage name="first_name" component="div" className="text-red-200 text-sm mt-1" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-1">Last Name</label>
                  <Field
                    type="text"
                    name="last_name"
                    className="w-full px-4 py-2 bg-white/20 backdrop-blur-sm text-white border border-white/30 rounded-lg focus:border-white/60 focus:outline-none placeholder-white/60"
                  />
                  <ErrorMessage name="last_name" component="div" className="text-red-200 text-sm mt-1" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white mb-1">Email</label>
                <Field
                  type="email"
                  name="email"
                  className="w-full px-4 py-2 bg-white/20 backdrop-blur-sm text-white border border-white/30 rounded-lg focus:border-white/60 focus:outline-none placeholder-white/60"
                />
                <ErrorMessage name="email" component="div" className="text-red-200 text-sm mt-1" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white mb-1">Password</label>
                <Field
                  type="password"
                  name="password"
                  className="w-full px-4 py-2 bg-white/20 backdrop-blur-sm text-white border border-white/30 rounded-lg focus:border-white/60 focus:outline-none placeholder-white/60"
                />
                <ErrorMessage name="password" component="div" className="text-red-200 text-sm mt-1" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white mb-1">Confirm Password</label>
                <Field
                  type="password"
                  name="confirmPassword"
                  className="w-full px-4 py-2 bg-white/20 backdrop-blur-sm text-white border border-white/30 rounded-lg focus:border-white/60 focus:outline-none placeholder-white/60"
                />
                <ErrorMessage name="confirmPassword" component="div" className="text-red-200 text-sm mt-1" />
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-white/30 backdrop-blur-sm hover:bg-white/40 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50 border border-white/40"
              >
                {isSubmitting ? 'Creating account...' : 'Register'}
              </button>
            </Form>
          )}
        </Formik>
        
        <p className="text-center text-white/90 mt-4">
          Already have an account? <Link to="/login" className="text-white font-bold hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}