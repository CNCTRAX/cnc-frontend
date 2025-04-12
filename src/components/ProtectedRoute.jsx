import React from 'react';
import { Navigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;

  try {
    const decoded = jwtDecode(token);
    const userRole = decoded?.role;

    // If specific roles are required, ensure user matches
    if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
      return <Navigate to="/" replace />;
    }

    return children;
  } catch (err) {
    console.error('Invalid or expired token:', err);
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;