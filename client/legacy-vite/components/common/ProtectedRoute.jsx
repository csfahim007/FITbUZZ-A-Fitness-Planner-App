// src/components/common/ProtectedRoute.jsx
import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

export default function ProtectedRoute() {
  const { token } = useSelector((state) => state.auth);
  const location = useLocation();

  // Debug logging
  useEffect(() => {
    console.log('ProtectedRoute - token:', token);
    console.log('ProtectedRoute - location:', location.pathname);
  }, [token, location]);

  if (!token) {
    console.log('No token, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}