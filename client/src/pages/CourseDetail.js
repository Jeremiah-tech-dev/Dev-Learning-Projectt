import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export default function CourseDetail({ user }) {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [enrolled, setEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  // const [reviews, setReviews] = useState([]); // TODO: add reviews feature later

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await api.get(`/courses/${id}`);
        const courseDetails = response.data;
        setCourse(courseDetails);
        console.log('Course loaded:', courseDetails.title);
        
        if (user) {
          // check if user is enrolled
          try {
            const enrollRes = await api.get(`/enrollments/check/${id}`);
            setEnrolled(enrollRes.data.enrolled);
          } catch (err) {
            console.error('Error checking enrollment:', err);
          }
        }
      } catch (error) {
        console.error('Error fetching course:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id, user]);

  const handleEnroll = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await api.post('/enrollments', { course_id: id });
      setEnrolled(true);
      console.log('Enrolled successfully');
      alert('Successfully enrolled in course!');
      // Navigate to first module
      if (course.modules && course.modules.length > 0) {
        navigate(`/learn/${id}/${course.modules[0].id}`);
      }
    } catch (error) {
      console.error('Enrollment failed:', error);
      alert(error.response?.data?.error || 'Failed to enroll');
    }
  };