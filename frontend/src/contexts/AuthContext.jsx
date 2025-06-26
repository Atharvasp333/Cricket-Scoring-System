// // import React, { createContext, useContext, useState, useEffect } from 'react';
// // import { onAuthStateChanged } from 'firebase/auth';
// // import { auth } from '../firebase';
// // import api from '../utils/api';

// // const AuthContext = createContext();

// // export const useAuth = () => {
// //   return useContext(AuthContext);
// // };

// // export const AuthProvider = ({ children }) => {
// //   const [currentUser, setCurrentUser] = useState(null);
// //   const [userRole, setUserRole] = useState(null);
// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     const unsubscribe = onAuthStateChanged(auth, async (user) => {
// //       console.log('Auth state changed, user:', user ? user.uid : 'none');
// //       setCurrentUser(user);
      
// //       if (user) {
// //         // First check if we have a role in sessionStorage from the signup process
// //         const storedRole = sessionStorage.getItem('userSignupRole');
// //         if (storedRole) {
// //           console.log('Found role in sessionStorage, setting user role to:', storedRole);
// //           setUserRole(storedRole);
// //           // Don't remove from sessionStorage - we'll keep it as a backup
// //           console.log('Keeping userSignupRole in sessionStorage as backup');
// //         }
        
// //         try {
// //           // Try to get existing user
// //           console.log('Fetching user data for UID:', user.uid);
// //           const response = await api.get(`/api/users/${user.uid}`);
// //           const userData = response.data;
// //           console.log('User data received from backend:', userData);
          
// //           if (!userData || !userData.role) {
// //             console.log('User exists but has no role, creating/updating with default role');
// //             // If user exists but has no role, create/update with default role
// //             await handleNewUser(user);
// //           } else {
// //             console.log('Setting user role from backend data:', userData.role);
// //             setUserRole(userData.role);
// //             console.log('User role set to:', userData.role);
            
// //             // Keep the role in sessionStorage as a backup, even after getting it from backend
// //             if (!sessionStorage.getItem('userSignupRole')) {
// //               console.log('Storing backend role in sessionStorage as backup');
// //               sessionStorage.setItem('userSignupRole', userData.role);
// //             }
// //           }
// //         } catch (error) {
// //           console.error('Error fetching user data:', error);
// //           console.error('Error response:', error.response?.data);
// //           console.error('Error status:', error.response?.status);
          
// //           if (error.response?.status === 404) {
// //             console.log('User not found in database, creating new user');
// //             // User doesn't exist in our DB yet, create them
// //             await handleNewUser(user);
// //           } else {
// //             console.error('Error fetching user data, attempting to create/update user');
// //             // Instead of defaulting to viewer, try to create/update the user
// //             try {
// //               console.log('Attempting to create/update user after fetch error');
// //               await handleNewUser(user);
// //             } catch (createError) {
// //               console.error('Failed to create/update user after fetch error:', createError);
              
// //               // Check if we have a role in sessionStorage before defaulting to viewer
// //               if (!storedRole) { // Only check again if we didn't already set it above
// //                 const fallbackRole = sessionStorage.getItem('userSignupRole');
// //                 if (fallbackRole) {
// //                   console.log('Using role from session storage after error:', fallbackRole);
// //                   setUserRole(fallbackRole);
// //                 } else {
// //                   console.error('Defaulting to viewer role as last resort');
// //                   setUserRole('viewer');
// //                 }
// //               }
// //             }
// //           }
// //         }
// //       } else {
// //         console.log('No user logged in, setting role to null');
// //         setUserRole(null);
// //       }
      
// //       setLoading(false);
// //     });
  
// //     return unsubscribe;
// //   }, []);
  
// //   const handleNewUser = async (firebaseUser) => {
// //     try {
// //       console.log('Creating/updating user with Firebase UID:', firebaseUser.uid);
      
// //       // First check if we have a role in sessionStorage from the signup process
// //       let userRole = sessionStorage.getItem('userSignupRole');
// //       if (userRole) {
// //         console.log('Found role in sessionStorage for new user:', userRole);
// //       }
      
// //       // If no role in sessionStorage, try to get it from the database
// //       if (!userRole) {
// //         try {
// //           // Make a direct database query without going through the authenticated route
// //           const existingUserResponse = await fetch(`http://localhost:5000/api/users/${firebaseUser.uid}`, {
// //             method: 'GET',
// //             headers: {
// //               'Content-Type': 'application/json',
// //               'Authorization': `Bearer ${await firebaseUser.getIdToken()}`
// //             }
// //           });
          
// //           if (existingUserResponse.ok) {
// //             const existingUserData = await existingUserResponse.json();
// //             console.log('Existing user data found:', existingUserData);
// //             if (existingUserData && existingUserData.role) {
// //               userRole = existingUserData.role;
// //               console.log('Using existing role from database:', userRole);
// //             }
// //           } else {
// //             console.log('No existing user found or error fetching');
// //           }
// //         } catch (fetchError) {
// //           console.error('Error fetching existing user data:', fetchError);
// //         }
// //       }
      
// //       // If we still don't have a role, default to viewer
// //       if (!userRole) {
// //         userRole = 'viewer';
// //         console.log('No role found in session storage or database, defaulting to viewer');
// //       }
      
// //       const userData = {
// //         email: firebaseUser.email,
// //         displayName: firebaseUser.displayName || '',
// //         role: userRole,
// //         photoURL: firebaseUser.photoURL || '',
// //         firebaseUID: firebaseUser.uid
// //       };
      
// //       console.log('Sending user data to backend:', userData);
// //       console.log('Role being sent to backend:', userData.role);
      
// //       const response = await api.post('/api/users', userData);
// //       console.log('User creation/update response:', response.data);
// //       console.log('Role received from backend:', response.data.role);
      
// //       if (response.data && response.data.role) {
// //         console.log('Setting user role to:', response.data.role);
// //         setUserRole(response.data.role);
// //         console.log('User role has been set to:', response.data.role);
        
// //         // Keep the role in sessionStorage as a backup, even if it matches the backend role
// //         if (!sessionStorage.getItem('userSignupRole')) {
// //           console.log('Storing backend role in sessionStorage as backup');
// //           sessionStorage.setItem('userSignupRole', response.data.role);
// //         } else {
// //           console.log('Keeping existing userSignupRole in sessionStorage as backup');
// //         }
// //       } else {
// //         console.warn('No role in response data, using existing role:', userRole);
// //         setUserRole(userRole);
// //         console.log('User role has been set to:', userRole);
// //       }
      
// //       return response.data;
// //     } catch (error) {
// //       console.error('Error creating/updating user:', error);
// //       console.error('Error response data:', error.response?.data);
// //       console.error('Error status:', error.response?.status);
      
// //       // Try to use the role from session storage as a fallback
// //       const storedRole = sessionStorage.getItem('userSignupRole');
// //       if (storedRole) {
// //         console.log('Error occurred, but using role from session storage:', storedRole);
// //         setUserRole(storedRole);
// //         console.log('User role has been set to:', storedRole);
// //         // Don't clear sessionStorage here since we're using it as a fallback
// //       } else {
// //         console.error('Setting default role: viewer');
// //         setUserRole('viewer');
// //         console.log('User role has been set to: viewer');
// //       }
      
// //       throw error; // Re-throw to allow caller to handle
// //     }
// //   };

// //   const value = {
// //     currentUser,
// //     userRole,
// //     loading,
// //   }
// //   return (
// //     <AuthContext.Provider value={value}>
// //       {!loading && children}
// //     </AuthContext.Provider>
// //   )
// // };

// // export default AuthContext;


// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { onAuthStateChanged } from 'firebase/auth';
// import { auth } from '../firebase';
// import api from '../utils/api';

// const AuthContext = createContext();

// export const useAuth = () => {
//   return useContext(AuthContext);
// };

// export const AuthProvider = ({ children }) => {
//   const [currentUser, setCurrentUser] = useState(null);
//   const [userRole, setUserRole] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (user) => {
//       setCurrentUser(user);
      
//       if (user) {
//         try {
//           // First check sessionStorage for role from signup
//           const signupRole = sessionStorage.getItem('userSignupRole');
//           if (signupRole) {
//             setUserRole(signupRole);
//           }
          
//           // Then try to get user data from backend
//           const response = await api.get(`/api/users/${user.uid}`);
//           const userData = response.data;
          
//           if (userData && userData.role) {
//             setUserRole(userData.role);
//             // Update sessionStorage with the role from backend
//             sessionStorage.setItem('userSignupRole', userData.role);
//           } else if (!signupRole) {
//             // If no role from backend and no signup role, default to viewer
//             setUserRole('viewer');
//             sessionStorage.setItem('userSignupRole', 'viewer');
//           }
//         } catch (error) {
//           console.error('Error fetching user data:', error);
//           // If error, use role from sessionStorage or default to viewer
//           const fallbackRole = sessionStorage.getItem('userSignupRole') || 'viewer';
//           setUserRole(fallbackRole);
//         }
//       } else {
//         setUserRole(null);
//         sessionStorage.removeItem('userSignupRole');
//       }
      
//       setLoading(false);
//     });
  
//     return unsubscribe;
//   }, []);

//   const value = {
//     currentUser,
//     userRole,
//     loading,
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {!loading && children}
//     </AuthContext.Provider>
//   );
// };

// export default AuthContext;

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