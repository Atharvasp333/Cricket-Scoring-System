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
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!isMounted) return;
      
      setCurrentUser(user);
      
      if (user) {
        try {
          // First check localStorage for role (set during signup)
          const localRole = localStorage.getItem('userRole');
          
          // Try to get user data from backend with retry logic
          let userData = null;
          let retries = 0;
          const maxRetries = 3;
          
          while (retries < maxRetries) {
            try {
              const response = await api.get(`/api/users/${user.uid}`);
              if (response.data) {
                // Handle both direct role and nested data.role
                userData = response.data.data || response.data;
                console.log('Fetched user data:', userData);
                break;
              }
            } catch (error) {
              console.error(`Attempt ${retries + 1} - Error fetching user data:`, error);
              if (retries === maxRetries - 1) {
                console.error('Max retries reached, using local role');
              }
              // Wait before retrying
              await new Promise(resolve => setTimeout(resolve, 1000));
            }
            retries++;
          }
          
          // Handle different possible response formats
          let role = null;
          if (userData?.role) {
            role = userData.role;
          } else if (userData?.data?.role) {
            role = userData.data.role;
          } else if (localRole) {
            role = localRole;
          } else {
            role = 'viewer';
          }
          
          console.log('Setting user role to:', role);
          setUserRole(role);
          localStorage.setItem('userRole', role);
        } catch (error) {
          console.error('Error in auth state change:', error);
          // Fallback to localStorage role or default to viewer
          const fallbackRole = localStorage.getItem('userRole') || 'viewer';
          setUserRole(fallbackRole);
        }
      } else {
        // User signed out
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
    setUserRole // Expose setter function
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;