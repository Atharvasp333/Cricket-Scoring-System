import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../../firebase';
import api from '../../utils/api';

const Signup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const googleUserData = location.state || {};
  
  const [activeTab, setActiveTab] = useState('viewer');
  const [email, setEmail] = useState(googleUserData.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState(googleUserData.displayName || '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log('Active tab (role) changed to:', activeTab);
  }, [activeTab]);

  const validateForm = () => {
    if (!email || !displayName) {
      setError('All fields are required');
      return false;
    }
    
    if (!googleUserData.fromGoogle) {
      if (!password) {
        setError('Password is required');
        return false;
      }
      
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return false;
      }
      
      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        return false;
      }
    }
    
    return true;
  };

  const handleEmailSignup = async (e) => {
    e.preventDefault();
    
    console.log('Attempting signup with role:', activeTab);
    if (!validateForm()) return;
    
    setLoading(true);
    setError('');
    
    try {
      let user;
      if (!googleUserData.fromGoogle) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        user = userCredential.user;
      } else {
        user = auth.currentUser;
      }

      // Ensure role is explicitly set to activeTab
      const selectedRole = activeTab;
      console.log('Selected role for email signup:', selectedRole);
      
      const userData = {
        email,
        displayName,
        role: selectedRole, // Explicitly using the selected role
        photoURL: user?.photoURL || '',
        firebaseUID: user?.uid
      };

      console.log('User data being sent to backend (Signup):', userData);
      console.log('Creating user with data:', userData);
      const createdUser = await createUserInDatabase(userData);
      
      console.log('User created, redirecting with role:', createdUser.role);
      // Use the role from backend response, fallback to selected role if not available
      redirectBasedOnRole(createdUser.role || selectedRole);
    } catch (error) {
      console.error('Signup error:', error);
      if (error.code === 'auth/email-already-in-use') {
        setError('Email is already in use. Please use a different email or login.');
      } else {
        setError(error.message || 'Failed to create account. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Ensure role is explicitly set to activeTab
      const selectedRole = activeTab;
      console.log('Selected role for Google signup:', selectedRole);
      
      let userData;
      if (googleUserData.fromGoogle) {
        // User already authenticated with Google
        userData = {
          email: googleUserData.email,
          displayName: googleUserData.displayName,
          role: selectedRole, // Use selected role
          photoURL: googleUserData.photoURL || '',
          firebaseUID: googleUserData.firebaseUID
        };
      } else {
        // New Google signup
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        userData = {
          email: user.email,
          displayName: user.displayName,
          role: selectedRole, // Use selected role
          photoURL: user.photoURL || '',
          firebaseUID: user.uid
        };
      }

      console.log('User data being sent to backend (Signup):', userData);
      console.log('Creating Google user with role:', selectedRole);
      const createdUser = await createUserInDatabase(userData);
      console.log('Google user created, redirecting with role:', createdUser.role);
      // Use the role from backend response, fallback to selected role if not available
      redirectBasedOnRole(createdUser.role || selectedRole);
    } catch (error) {
      console.error('Google signup error:', error);
      setError(error.message || 'Failed to sign up with Google. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const createUserInDatabase = async (userData) => {
    try {
      // Ensure role is explicitly set and not undefined or null
      if (!userData.role) {
        console.warn('Role not set in userData, defaulting to activeTab:', activeTab);
        userData.role = activeTab;
      }
      
      console.log('Sending to backend:', userData);
      console.log('Role being sent:', userData.role, 'Type:', typeof userData.role);
      console.log('Sending user data to backend API:', JSON.stringify(userData));
      
      // Verify all required fields are present
      if (!userData.email || !userData.displayName || !userData.firebaseUID) {
        console.error('Missing required fields before API call:', userData);
        throw new Error('Missing required fields: email, displayName, or firebaseUID');
      }
      
      const response = await api.post('/api/users', userData);
      console.log('Backend response:', response.data);
      console.log('Role returned from backend:', response.data.role);
      console.log('Backend API response:', response.data);
      
      // Validate that the response contains the expected user data
      if (!response.data || !response.data.role) {
        console.error('Backend response missing role information:', response.data);
        // Use the role from the original request as fallback
        return { ...response.data, role: userData.role };
      }
      
      return response.data;
    } catch (error) {
      console.error('API Error:', error.response?.data || error.message);
      console.error('Error status:', error.response?.status);
      console.error('Error response:', error.response?.data);
      console.error('Request that caused error:', userData);
      throw error;
    }
  };

  const redirectBasedOnRole = (role) => {
    console.log('Final role before redirect:', role);
    
    // Validate role to ensure it's one of the expected values
    const validRole = ['scorer', 'organiser', 'viewer'].includes(role) ? role : activeTab;
    console.log('Using role for redirection:', validRole, 
                '(activeTab was:', activeTab, 
                'received role was:', role, ')');
    
    // Store the role in sessionStorage so AuthContext can use it if the API call fails
    // Make sure to clear any existing value first
    sessionStorage.removeItem('userSignupRole');
    sessionStorage.setItem('userSignupRole', validRole);
    console.log('Stored role in sessionStorage:', validRole);
    console.log('Verifying sessionStorage value:', sessionStorage.getItem('userSignupRole'));
    
    switch (validRole) {
      case 'scorer':
        console.log('Redirecting to scorer home');
        navigate('/scorer-home');
        break;
      case 'organiser':
        console.log('Redirecting to organiser homepage');
        navigate('/organiser-homepage');
        break;
      case 'viewer':
      default:
        console.log('Redirecting to viewer home');
        navigate('/viewer-home');
        break;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {googleUserData.fromGoogle ? 'Complete your signup' : 'Create your account'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link to="/login" className="font-medium text-[#16638A] hover:text-[#0f4c6a]">
              sign in to your existing account
            </Link>
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <div className="mt-6">
          <div className="text-center mb-4">
            <p className="text-sm font-medium text-gray-700">I want to:</p>
          </div>
          
          <div className="flex rounded-md shadow-sm mb-6" role="group">
            <button
              type="button"
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-l-md ${
                activeTab === 'viewer' 
                  ? 'bg-[#16638A] text-white' 
                  : 'bg-white text-gray-700 border border-gray-300'
              }`}
              onClick={() => setActiveTab('viewer')}
            >
              View Matches
            </button>
            <button
              type="button"
              className={`flex-1 py-2 px-4 text-sm font-medium ${
                activeTab === 'scorer' 
                  ? 'bg-[#16638A] text-white' 
                  : 'bg-white text-gray-700 border-t border-b border-gray-300'
              }`}
              onClick={() => setActiveTab('scorer')}
            >
              Score Matches
            </button>
            <button
              type="button"
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-r-md ${
                activeTab === 'organiser' 
                  ? 'bg-[#16638A] text-white' 
                  : 'bg-white text-gray-700 border border-gray-300'
              }`}
              onClick={() => setActiveTab('organiser')}
            >
              Create Tournaments
            </button>
          </div>
        </div>

        {!googleUserData.fromGoogle ? (
          <form className="mt-8 space-y-6" onSubmit={handleEmailSignup}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="display-name" className="sr-only">Full Name</label>
                <input
                  id="display-name"
                  name="displayName"
                  type="text"
                  autoComplete="name"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-[#16638A] focus:border-[#16638A] focus:z-10 sm:text-sm"
                  placeholder="Full Name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="email-address" className="sr-only">Email address</label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#16638A] focus:border-[#16638A] focus:z-10 sm:text-sm"
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
                  autoComplete="new-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#16638A] focus:border-[#16638A] focus:z-10 sm:text-sm"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="confirm-password" className="sr-only">Confirm Password</label>
                <input
                  id="confirm-password"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-[#16638A] focus:border-[#16638A] focus:z-10 sm:text-sm"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#16638A] hover:bg-[#0f4c6a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#16638A]"
              >
                {loading ? 'Creating account...' : 'Sign up'}
              </button>
            </div>

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
                  type="button"
                  onClick={handleGoogleSignup}
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
                  Sign up with Google
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="mt-8 space-y-6">
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
              <p className="text-sm text-gray-700">You're signing up with:</p>
              <div className="flex items-center mt-2">
                {googleUserData.photoURL && (
                  <img src={googleUserData.photoURL} alt="Profile" className="h-10 w-10 rounded-full mr-3" />
                )}
                <div>
                  <p className="text-sm font-medium text-gray-900">{googleUserData.displayName}</p>
                  <p className="text-sm text-gray-500">{googleUserData.email}</p>
                </div>
              </div>
            </div>
            
            <button
              type="button"
              onClick={handleGoogleSignup}
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#16638A] hover:bg-[#0f4c6a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#16638A]"
            >
              {loading ? 'Completing signup...' : 'Complete signup'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Signup;