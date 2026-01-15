import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { GoogleLogin } from '@react-oauth/google';
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

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await api.post('/auth/google', {
        token: credentialResponse.credential
      });
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
      navigate('/courses');
    } catch (err) {
      console.error('Google login error:', err);
      setError(err.response?.data?.error || 'Google login failed');
    }
  };

  const handleGoogleError = () => {
    setError('Google login failed');
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    setError('');
    
    api.post('/auth/login', values)
      .then(response => {
        localStorage.setItem('token', response.data.token);
        console.log('Login successful, user:', response.data.user);
        setUser(response.data.user);
        navigate('/courses');
      })
      .catch(err => {
        console.error('Login error:', err);
        setError(err.response?.data?.error || 'Something went wrong');
        setSubmitting(false);
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{
      backgroundImage: 'url(https://images.unsplash.com/photo-1758270703286-6600f25efdbc?q=80&w=1631&auto=format&fit=crop)',
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}>
      <div className="w-full max-w-md">
        <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Sign in to DevLearn</h2>
            <p className="text-white/80">Continue learning to code</p>
          </div>

          <div>
            {error && (
              <div className="bg-red-500/20 backdrop-blur-sm border border-red-300/50 text-white px-4 py-3 rounded-lg mb-6">
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
                      className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm text-white border border-white/30 rounded-lg focus:border-white/60 focus:outline-none placeholder-white/60"
                      placeholder="Enter your email"
                    />
                    <ErrorMessage name="email" component="div" className="text-red-200 text-sm mt-1" />
                  </div>

                  <div>
                    <label className="block text-white font-bold mb-2">
                      Password
                    </label>
                    <Field
                      type="password"
                      name="password"
                      className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm text-white border border-white/30 rounded-lg focus:border-white/60 focus:outline-none placeholder-white/60"
                      placeholder="Enter your password"
                    />
                    <ErrorMessage name="password" component="div" className="text-red-200 text-sm mt-1" />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-white/30 backdrop-blur-sm hover:bg-white/40 text-white font-bold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed border border-white/40"
                  >
                    {isSubmitting ? 'Signing in...' : 'Sign in'}
                  </button>
                  
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-white/30"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white/10 text-white">Or continue with</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-center">
                    <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={handleGoogleError}
                      theme="filled_blue"
                      size="large"
                      width="100%"
                    />
                  </div>
                </Form>
              )}
            </Formik>
            
            <div className="mt-6 text-center">
              <p className="text-white/90">
                Don't have an account?{' '}
                <Link to="/register" className="text-white font-bold hover:underline">
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
