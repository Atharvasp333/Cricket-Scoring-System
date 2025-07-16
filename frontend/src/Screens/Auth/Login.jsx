import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from 'firebase/auth';
import { auth, googleProvider } from '../../firebase';
import api from '../../utils/api';
import { Components, Icons } from '../../exports';

const { 
  Button, 
  Input, 
  Alert, 
  Toast,
  Card,
  LoadingSpinner,
  GoogleSignInButton,
  FormField
} = Components;

const { 
  FiMail, 
  FiLock, 
  FiAlertCircle, 
  FiArrowRight 
} = Icons;

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setIsSubmitting(true);

    try {
      // Sign in with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;
      
      // Wait for auth state to be fully initialized
      await new Promise((resolve) => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
          if (currentUser && currentUser.uid === user.uid) {
            unsubscribe();
            resolve();
          }
        });
      });

      // Get user data from our backend with retry logic
      let userData = null;
      let retries = 0;
      const maxRetries = 3;
      
      while (retries < maxRetries && !userData) {
        try {
          const response = await api.get(`/api/users/${user.uid}`);
          if (response.data) {
            userData = response.data.data || response.data;
            // Set role in localStorage as soon as we have it
            if (userData.role) {
              localStorage.setItem('userRole', userData.role);
              // Force a small delay to ensure localStorage is updated
              await new Promise(resolve => setTimeout(resolve, 100));
            }
            break;
          }
        } catch (error) {
          console.error(`Attempt ${retries + 1} - Error fetching user data:`, error);
          if (retries === maxRetries - 1) {
            throw new Error('Failed to fetch user data after multiple attempts');
          }
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
        retries++;
      }
      
      if (!userData) {
        throw new Error('User data not found');
      }
      
      redirectBasedOnRole(userData.role);
      
    } catch (error) {
      console.error('Login error:', error);
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Check if user exists in our database with retry logic
      let userData = null;
      let retries = 0;
      const maxRetries = 3;
      
      while (retries < maxRetries) {
        try {
          const response = await api.get(`/api/users/${user.uid}`);
          if (response.data) {
            userData = response.data;
            // Set role in localStorage as soon as we have it
            if (userData.role) {
              localStorage.setItem('userRole', userData.role);
            }
            break;
          }
        } catch (error) {
          console.error(`Attempt ${retries + 1} - Error fetching user data:`, error);
          if (retries === maxRetries - 1) {
            // User not found, redirect to signup with Google data
            navigate('/signup', {
              state: {
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL
              },
              replace: true
            });
            return;
          }
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
        retries++;
      }
      
      if (userData) {
        redirectBasedOnRole(userData.role);
      }
    } catch (error) {
      console.error('Google sign-in error:', error);
      setError('Failed to sign in with Google. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const redirectBasedOnRole = (role) => {
    // Set the role in localStorage before navigation
    localStorage.setItem('userRole', role);
    
    // Determine the correct home route based on role
    let homeRoute = '/viewer-home';
    switch(role) {
      case 'organiser':
        homeRoute = '/organiser-homepage';
        break;
      case 'scorer':
        homeRoute = '/scorer-home';
        break;
      case 'player':
        homeRoute = '/player-home';
        break;
      default:
        homeRoute = '/viewer-home';
    }
    
    // Force a full page reload to ensure AuthContext picks up the role
    window.location.href = homeRoute;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link to="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
            create a new account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <Alert type="error" className="mb-4">
              <FiAlertCircle className="h-5 w-5" />
              <span>{error}</span>
            </Alert>
          )}

          <form onSubmit={handleEmailLogin} className="space-y-6">
            <FormField
              id="email"
              name="email"
              type="email"
              label="Email address"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              autoComplete="email"
            />

            <FormField
              id="password"
              name="password"
              type="password"
              label="Password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              autoComplete="current-password"
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link to="/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Forgot your password?
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={loading || isSubmitting}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <span>Sign in with Google</span>
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;