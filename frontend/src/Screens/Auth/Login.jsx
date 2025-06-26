// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
// import { auth, googleProvider } from '../../firebase';
// import api from '../../utils/api';

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleEmailLogin = async (e) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);

//     try {
//       console.log('Login - Attempting email login for:', email);
//       // Sign in with Firebase
//       const userCredential = await signInWithEmailAndPassword(auth, email, password);
//       const user = userCredential.user;
//       console.log('Login - Firebase authentication successful for user:', user.uid);

//       // Get user data from our backend
//       console.log('Login - Fetching user data from backend for:', user.uid);
//       const response = await api.get(`/api/users/${user.uid}`);
//       const userData = response.data;
//       console.log('Login - User data received from backend:', userData);
//       console.log('Login - User role from backend:', userData.role, 'Type:', typeof userData.role);

//       // Redirect based on user role
//       redirectBasedOnRole(userData.role);
//     } catch (error) {
//       console.error('Login error:', error);
//       console.error('Login error response:', error.response?.data);
//       setError('Invalid email or password. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleGoogleLogin = async () => {
//     setError('');
//     setLoading(true);

//     try {
//       console.log('Login - Attempting Google login');
//       // Sign in with Google
//       const result = await signInWithPopup(auth, googleProvider);
//       const user = result.user;
//       console.log('Login - Google authentication successful for user:', user.uid);

//       try {
//         // Check if user exists in our database
//         console.log('Login - Checking if Google user exists in database:', user.uid);
//         const response = await api.get(`/api/users/${user.uid}`);
//         const userData = response.data;
//         console.log('Login - Google user found in database:', userData);
//         console.log('Login - Google user role from database:', userData.role, 'Type:', typeof userData.role);
        
//         // Redirect based on user role
//         redirectBasedOnRole(userData.role);
//       } catch (error) {
//         console.error('Login - Error checking Google user in database:', error);
//         console.error('Login - Error response:', error.response?.data);
        
//         if (error.response && error.response.status === 404) {
//           // User doesn't exist in our database, redirect to signup to select role
//           console.log('Login - Google user not found in database, redirecting to signup');
//           navigate('/signup', { 
//             state: { 
//               fromGoogle: true,
//               email: user.email,
//               displayName: user.displayName,
//               photoURL: user.photoURL,
//               firebaseUID: user.uid
//             } 
//           });
//         } else {
//           throw error;
//         }
//       }
//     } catch (error) {
//       console.error('Google login error:', error);
//       setError('Failed to sign in with Google. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const redirectBasedOnRole = (role) => {
//     console.log('Login - Redirecting based on role:', role, 'Type:', typeof role);
    
//     // Validate role
//     const validRoles = ['viewer', 'scorer', 'organiser'];
//     const validatedRole = validRoles.includes(role) ? role : 'viewer';
//     console.log('Login - Validated role for redirection:', validatedRole);
    
//     switch (validatedRole) {
//       case 'scorer':
//         console.log('Login - Redirecting to scorer home');
//         navigate('/scorer-home');
//         break;
//       case 'organiser':
//         console.log('Login - Redirecting to organiser homepage');
//         navigate('/organiser-homepage');
//         break;
//       case 'viewer':
//       default:
//         console.log('Login - Redirecting to viewer home');
//         navigate('/viewer-home');
//         break;
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-md w-full space-y-8">
//         <div>
//           <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
//           <p className="mt-2 text-center text-sm text-gray-600">
//             Or{' '}
//             <Link to="/signup" className="font-medium text-[#16638A] hover:text-[#0f4c6a]">
//               create a new account
//             </Link>
//           </p>
//         </div>

//         {error && (
//           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
//             <span className="block sm:inline">{error}</span>
//           </div>
//         )}

//         <form className="mt-8 space-y-6" onSubmit={handleEmailLogin}>
//           <div className="rounded-md shadow-sm -space-y-px">
//             <div>
//               <label htmlFor="email-address" className="sr-only">Email address</label>
//               <input
//                 id="email-address"
//                 name="email"
//                 type="email"
//                 autoComplete="email"
//                 required
//                 className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-[#16638A] focus:border-[#16638A] focus:z-10 sm:text-sm"
//                 placeholder="Email address"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//               />
//             </div>
//             <div>
//               <label htmlFor="password" className="sr-only">Password</label>
//               <input
//                 id="password"
//                 name="password"
//                 type="password"
//                 autoComplete="current-password"
//                 required
//                 className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-[#16638A] focus:border-[#16638A] focus:z-10 sm:text-sm"
//                 placeholder="Password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//               />
//             </div>
//           </div>

//           <div>
//             <button
//               type="submit"
//               disabled={loading}
//               className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#16638A] hover:bg-[#0f4c6a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#16638A]"
//             >
//               {loading ? 'Signing in...' : 'Sign in'}
//             </button>
//           </div>
//         </form>

//         <div className="mt-6">
//           <div className="relative">
//             <div className="absolute inset-0 flex items-center">
//               <div className="w-full border-t border-gray-300"></div>
//             </div>
//             <div className="relative flex justify-center text-sm">
//               <span className="px-2 bg-gray-50 text-gray-500">Or continue with</span>
//             </div>
//           </div>

//           <div className="mt-6">
//             <button
//               onClick={handleGoogleLogin}
//               disabled={loading}
//               className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#16638A]"
//             >
//               <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" width="24" height="24">
//                 <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
//                   <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z" />
//                   <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z" />
//                   <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z" />
//                   <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z" />
//                 </g>
//               </svg>
//               Sign in with Google
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;


import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../../firebase';
import api from '../../utils/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Sign in with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Get user data from our backend
      const response = await api.get(`/api/users/${user.uid}`);
      const userData = response.data;

      // Store role in sessionStorage for consistency
      sessionStorage.setItem('userSignupRole', userData.role);
      
      // Redirect based on user role
      redirectBasedOnRole(userData.role);
    } catch (error) {
      console.error('Login error:', error);
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);

    try {
      // Sign in with Google
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      try {
        // Check if user exists in our database
        const response = await api.get(`/api/users/${user.uid}`);
        const userData = response.data;
        
        // Store role in sessionStorage for consistency
        sessionStorage.setItem('userSignupRole', userData.role);
        
        // Redirect based on user role
        redirectBasedOnRole(userData.role);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          // User doesn't exist in our database, redirect to signup to select role
          navigate('/signup', { 
            state: { 
              fromGoogle: true,
              email: user.email,
              displayName: user.displayName,
              photoURL: user.photoURL,
              firebaseUID: user.uid
            },
            replace: true
          });
        } else {
          throw error;
        }
      }
    } catch (error) {
      console.error('Google login error:', error);
      setError('Failed to sign in with Google. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const redirectBasedOnRole = (role) => {
    // Validate role to ensure it's one of the expected values
    const validRole = ['scorer', 'organiser', 'viewer'].includes(role) ? role : 'viewer';
    
    // Store the role in sessionStorage for consistency
    sessionStorage.setItem('userSignupRole', validRole);
    
    // Redirect based on role with replace to prevent back navigation
    switch (validRole) {
      case 'scorer':
        navigate('/scorer-home', { replace: true });
        break;
      case 'organiser':
        navigate('/organiser-homepage', { replace: true });
        break;
      case 'viewer':
      default:
        navigate('/viewer-home', { replace: true });
        break;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link to="/signup" className="font-medium text-[#16638A] hover:text-[#0f4c6a]">
              create a new account
            </Link>
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleEmailLogin}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-[#16638A] focus:border-[#16638A] focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-[#16638A] focus:border-[#16638A] focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#16638A] hover:bg-[#0f4c6a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#16638A]"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#16638A]"
            >
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" width="24" height="24">
                <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                  <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z" />
                  <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z" />
                  <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z" />
                  <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z" />
                </g>
              </svg>
              Sign in with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;