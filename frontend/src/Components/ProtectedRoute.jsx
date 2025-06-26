import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { currentUser, userRole: contextUserRole, loading } = useAuth();
  const [effectiveUserRole, setEffectiveUserRole] = useState(null);
  
  // Use effect to check sessionStorage if contextUserRole is null
  useEffect(() => {
    // First check if we have a role in context
    if (contextUserRole) {
      console.log('ProtectedRoute - Using role from context:', contextUserRole);
      setEffectiveUserRole(contextUserRole);
    } else if (currentUser) {
      // If we have a user but no role in context, check sessionStorage
      const storedRole = sessionStorage.getItem('userSignupRole');
      if (storedRole) {
        console.log('ProtectedRoute - Using role from sessionStorage:', storedRole);
        setEffectiveUserRole(storedRole);
      } else {
        // If no role in sessionStorage, default to viewer
        console.log('ProtectedRoute - No role found, defaulting to viewer');
        setEffectiveUserRole('viewer');
      }
    } else {
      setEffectiveUserRole(null);
    }
  }, [contextUserRole, currentUser]);

  console.log('ProtectedRoute - Rendering');
  console.log('ProtectedRoute - Context user role:', contextUserRole);
  console.log('ProtectedRoute - Current user:', currentUser ? currentUser.uid : 'none');
  console.log('ProtectedRoute - Effective user role:', effectiveUserRole);
  console.log('ProtectedRoute - Allowed roles:', allowedRoles);
  console.log('ProtectedRoute - Loading state:', loading);

  // If still loading, show nothing or a loading spinner
  if (loading) {
    console.log('ProtectedRoute - Still loading, showing spinner');
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#16638A]"></div>
      </div>
    );
  }

  // If no user is logged in, redirect to login
  if (!currentUser) {
    console.log('ProtectedRoute - No user logged in, redirecting to login');
    return <Navigate to="/login" />;
  }

  // If roles are specified and user's role is not in the allowed roles, redirect to appropriate home
  if (allowedRoles.length > 0 && !allowedRoles.includes(effectiveUserRole)) {
    console.log(`ProtectedRoute - User role ${effectiveUserRole} not in allowed roles, redirecting to appropriate home`);
    // Redirect based on user's role
    switch (effectiveUserRole) {
      case 'scorer':
        console.log('ProtectedRoute - Redirecting to scorer home');
        return <Navigate to="/scorer-home" />;
      case 'organiser':
        console.log('ProtectedRoute - Redirecting to organiser home');
        return <Navigate to="/organiser-homepage" />;
      case 'viewer':
      default:
        console.log('ProtectedRoute - Redirecting to viewer home');
        return <Navigate to="/viewer-home" />;
    }
  }

  // If user is authenticated and authorized (or no roles specified), render the children
  console.log('ProtectedRoute - User is authenticated and authorized with role:', effectiveUserRole, ', rendering children');
  return children;
};

export default ProtectedRoute;