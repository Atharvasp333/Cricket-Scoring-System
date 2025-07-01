
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
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        try {
          // First check localStorage for role (set during signup)
          const localRole = localStorage.getItem('userRole');
          
          // Then try to get user data from backend
          const response = await api.get(`/api/users/${user.uid}`);
          const userData = response.data;
          
          if (userData && userData.role) {
            setUserRole(userData.role);
            localStorage.setItem('userRole', userData.role);
          } else if (localRole) {
            setUserRole(localRole);
          } else {
            // Default to viewer if no role found
            setUserRole('viewer');
            localStorage.setItem('userRole', 'viewer');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          // Fallback to localStorage role or default to viewer
          const fallbackRole = localStorage.getItem('userRole') || 'viewer';
          setUserRole(fallbackRole);
        }
      } else {
        setUserRole(null);
        localStorage.removeItem('userRole');
      }
      
      setLoading(false);
    });
  
    return unsubscribe;
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