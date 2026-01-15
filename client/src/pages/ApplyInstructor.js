import { useToast } from '../components/Toast';
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
            {({ isSubmitting, values }) => (
              <Form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                  <input
                    type="text"
                    value={user?.first_name + ' ' + user?.last_name}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={user?.email}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Qualifications & Experience
                  </label>
                  <Field
                    as="textarea"
                    name="qualifications"
                    rows="6"
                    placeholder="Tell us about your expertise, certifications, years of experience, and why you'd be a great instructor..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <ErrorMessage name="qualifications" component="div" className="text-red-600 text-sm mt-1" />
                  <p className="text-sm text-gray-500 mt-2">
                    {values.qualifications.length}/50 characters minimum
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> Your application will be reviewed by our admin team. You'll be notified once approved.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || values.qualifications.length < 50}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}