import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { PageLoader } from './Loader';
import { useAdminAuth } from '../context/AdminAuthContext';

const AdminProtectedRoute = ({ children }) => {
  const { isAuthenticated, admin, loading } = useAdminAuth();
  const location = useLocation();

  if (loading) {
    return <PageLoader text="Checking admin authentication..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to={`/admin/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  if (admin?.userType !== 'admin') {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default AdminProtectedRoute;
