import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import api from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole') || null);
  const [loading, setLoading] = useState(true);

  const fetchUserRole = async (user) => {
    if (!user) return null;
    
    try {
      // Try to get user data from backend
      const response = await api.get(`/api/users/${user.uid}`);
      
      if (response.data && response.data.success) {
        const userData = response.data.data;
        // Ensure we have a role, default to 'viewer' if not found
        const role = userData?.role || 'viewer';
        console.log('Fetched user role:', role);
        return role;
      }
      
      console.warn('Unexpected API response format:', response.data);
      return 'viewer';
      
    } catch (error) {
      console.error('Error fetching user role:', error);
      return localStorage.getItem('userRole') || 'viewer';
    }
  };

  useEffect(() => {
    let isMounted = true;
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!isMounted) return;
      
      if (user) {
        try {
          const role = await fetchUserRole(user);
          if (isMounted) {
            setCurrentUser(user);
            setUserRole(role);
            localStorage.setItem('userRole', role);
            // Force a small delay to ensure state is updated
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        } catch (error) {
          console.error('Error in auth state change:', error);
          if (isMounted) {
            const fallbackRole = localStorage.getItem('userRole') || 'viewer';
            setUserRole(fallbackRole);
          }
        }
      } else {
        // User signed out
        setCurrentUser(null);
        setUserRole(null);
        // Don't remove userRole from localStorage here as it's needed for future logins
      }
      
      if (isMounted) {
        setLoading(false);
      }
    });
  
    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const value = {
    currentUser,
    userRole,
    loading,
    setUserRole: (role) => {
      setUserRole(role);
      localStorage.setItem('userRole', role);
    }
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;