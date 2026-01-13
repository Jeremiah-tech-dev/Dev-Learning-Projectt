import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Navigation bar component
export default function Navbar({ user, setUser }) {
  const navigate = useNavigate();
