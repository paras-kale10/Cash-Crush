import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import useStore from '../store/useStore';

/**
 * ProtectedRoute - Ensures user is logged in and properly onboarded
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Routes to protect
 * @param {boolean} props.requireOnboarded - Whether to require onboarding completion
 */
export default function ProtectedRoute({ children, requireOnboarded = true }) {
  const isLoggedIn = useStore((s) => s.isLoggedIn);
  const isOnboarded = useStore((s) => s.isOnboarded);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Small delay to allow store to hydrate from localStorage
    const timer = setTimeout(() => setIsLoading(false), 100);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;
  }

  // Redirect to login if not authenticated
  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  // Redirect to onboarding if not completed and required
  if (requireOnboarded && !isOnboarded) {
    return <Navigate to="/onboarding" replace />;
  }

  return children;
}
