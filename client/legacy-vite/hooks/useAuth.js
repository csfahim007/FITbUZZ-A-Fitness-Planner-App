// src/hooks/useAuth.js
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../features/auth/authSlice';

export default function useAuth(requireAuth = true) {
  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (requireAuth && !token) {
      navigate('/login');
    } else if (!requireAuth && token) {
      navigate('/dashboard');
    }
  }, [token, requireAuth, navigate]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return { user, token, handleLogout };
}