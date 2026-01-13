import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { api } from '../services/api';

const validationSchema = Yup.object().shape({
  title: Yup.string().min(5, 'Title must be at least 5 characters').required('Title is required'),
  description: Yup.string().min(20, 'Description must be at least 20 characters').required('Description is required'),
  price: Yup.number().min(0, 'Price must be 0 or greater').required('Price is required'),
  level: Yup.string().oneOf(['beginner', 'intermediate', 'advanced']).required('Level is required'),
  category: Yup.string().required('Category is required'),
});

export default function InstructorDashboard() {
  const [courses, setCourses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();