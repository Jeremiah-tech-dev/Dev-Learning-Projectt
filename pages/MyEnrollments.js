import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function MyEnrollments() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const res = await api.get('/enrollments/my-enrollments');
        setEnrollments(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('Error fetching enrollments:', err);
        setEnrollments([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEnrollments();
  }, []);