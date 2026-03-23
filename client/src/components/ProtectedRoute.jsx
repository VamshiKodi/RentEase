import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PageLoader } from './Loader';

const ProtectedRoute = ({ children, requireOwner = false, requireAdmin = false }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <PageLoader text="Checking authentication..." />;
  }

  if (!isAuthenticated) {
    // Redirect to auth page with return url
    return <Navigate to={`/auth?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  if (requireOwner && user?.userType !== 'owner') {
    // Redirect to dashboard if user is not an owner
    return <Navigate to="/dashboard" replace />;
  }

  if (requireAdmin && user?.userType !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
