import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { api } from '../services/api';

// form validation rules
const validationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

export default function Login({ setUser }) {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  // const [rememberMe, setRememberMe] = useState(false); // TODO: implement remember me

  const handleSubmit = async (values, { setSubmitting }) => {
    setError('');
    
    api.post('/auth/login', values)
      .then(response => {
        localStorage.setItem('token', response.data.token);
        console.log('Login successful, user:', response.data.user);
        setUser(response.data.user);
        // redirect to courses page
        window.location.href = '/courses';
      })
      .catch(err => {
        console.error('Login error:', err);
        setError(err.response?.data?.error || 'Something went wrong');
        setSubmitting(false);
      });
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-800 border border-gray-700 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Sign in to DevLearn</h2>
            <p className="text-gray-400">Continue learning to code</p>
          </div>

          <div>
            {error && (
              <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 mb-6">
                {error}
              </div>
            )}
            
            <Formik
              initialValues={{ email: '', password: '' }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-6">
                  <div>
                    <label className="block text-white font-bold mb-2">
                      Email
                    </label>
                    <Field
                      type="email"
                      name="email"
                      className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
                      placeholder="Enter your email"
                    />
                    <ErrorMessage name="email" component="div" className="text-red-400 text-sm mt-1" />
                  </div>

                  <div>
                    <label className="block text-white font-bold mb-2">
                      Password
                    </label>
                    <Field
                      type="password"
                      name="password"
                      className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
                      placeholder="Enter your password"
                    />
                    <ErrorMessage name="password" component="div" className="text-red-400 text-sm mt-1" />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Signing in...' : 'Sign in'}
                  </button>
                </Form>
              )}
            </Formik>
            
            <div className="mt-6 text-center">
              <p className="text-gray-400">
                Don't have an account?{' '}
                <Link to="/register" className="text-blue-400 hover:text-blue-300 font-bold">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
