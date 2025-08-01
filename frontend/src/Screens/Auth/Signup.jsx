import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { createUserWithEmailAndPassword, signInWithRedirect, GoogleAuthProvider } from 'firebase/auth';
import { auth, googleProvider } from '../../firebase';
import api from '../../utils/api';
import { Components, Icons } from '../../exports';

const {
  Button,
  Card,
  GoogleSignInButton,
  FormField,
  LoadingSpinner,
  ErrorAlert,
  SuccessAlert,
} = Components;

const {
  FiMail,
  FiLock,
  FiUser,
  FiPhone,
  FiCalendar,
  FiAlertCircle,
  FiCheck,
  FiArrowRight
} = Icons;

const Checkbox = Components.FormCheckbox;

const Signup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const googleUserData = location.state || {};

  const [formData, setFormData] = useState({
    email: googleUserData.email || '',
    password: '',
    confirmPassword: '',
    displayName: googleUserData.displayName || '',
    phone: '',
    role: '' // Initialize role as empty string
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleRoleChange = (role) => {
    setFormData(prev => ({
      ...prev,
      role: role
    }));
  };

  const validateForm = () => {
    if (!formData.email) {
      setError('Email is required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (!formData.displayName) {
      setError('Display name is required');
      return false;
    }
    if (!formData.role) {
      setError('Please select a role');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!validateForm()) return;
    
    setLoading(true);

    try {
      // First, set the role in localStorage before creating the user
      localStorage.setItem('userRole', formData.role);
      
      // Create user in Firebase
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      );

      const user = userCredential.user;

      // Prepare user data for backend
      const userData = {
        firebaseUID: user.uid,
        email: formData.email,
        displayName: formData.displayName,
        phoneNumber: formData.phone || '',
        role: formData.role,
        photoURL: googleUserData.photoURL || ''
      };

      console.log('Submitting user data:', userData);

      try {
        const response = await api.post('/api/users', userData);
        console.log('User created successfully:', response.data);
        
        // Update the role in localStorage with the confirmed role from the server
        const confirmedRole = response.data.data?.role || response.data.role || formData.role;
        localStorage.setItem('userRole', confirmedRole);
        
        setSuccess('Account created successfully! Redirecting...');
        
        // Get the correct home route based on role
        const getHomeRoute = (role) => {
          switch(role) {
            case 'organiser':
              return '/organiser-homepage';
            case 'scorer':
              return '/scorer-home';
            case 'player':
              return '/player-home';
            default:
              return '/';
          }
        };
        
        // Redirect after a short delay
        setTimeout(() => {
          const homeRoute = getHomeRoute(confirmedRole);
          window.location.href = homeRoute;
        }, 1500);

      } catch (apiError) {
        console.error('API Error:', apiError);
        // Delete the Firebase user if API call fails
        await user.delete();
        
        if (apiError.response) {
          // Server responded with an error status code
          if (apiError.response.data && apiError.response.data.error) {
            setError(apiError.response.data.error);
          } else if (apiError.response.data && apiError.response.data.message) {
            setError(apiError.response.data.message);
          } else {
            setError('Failed to create user profile. Please try again.');
          }
        } else if (apiError.request) {
          // Request was made but no response received
          setError('No response from server. Please check your connection.');
        } else {
          // Something else happened
          setError(apiError.message || 'An error occurred during signup');
        }
        
        localStorage.removeItem('userRole');
      }
    } catch (error) {
      console.error('Signup error:', error);
      localStorage.removeItem('userRole');
      setError(error.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      if (!formData.role) {
        setError('Please select a role before signing up with Google');
        return;
      }
      
      setLoading(true);
      setError('');
      await signInWithRedirect(auth, googleProvider);
    } catch (error) {
      console.error('Google sign-up error:', error);
      setError('Failed to sign up with Google. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              Sign in
            </Link>
          </p>
        </div>

        <Card className="p-6 md:p-8">
          {error && (
            <ErrorAlert className="mb-6">
              <FiAlertCircle className="h-5 w-5" />
              <span>{error}</span>
            </ErrorAlert>
          )}

          {success && (
            <SuccessAlert className="mb-6">
              <FiCheck className="h-5 w-5" />
              <span>{success}</span>
            </SuccessAlert>
          )}

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Your Role (Choose one)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <div 
                className={`border rounded-lg p-4 cursor-pointer ${formData.role === 'viewer' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'}`}
                onClick={() => handleRoleChange('viewer')}
              >
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="role-viewer"
                    name="role"
                    checked={formData.role === 'viewer'}
                    onChange={() => handleRoleChange('viewer')}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="role-viewer" className="ml-2 block text-sm font-medium text-gray-700">
                    Viewer
                  </label>
                </div>
                <p className="mt-1 text-xs text-gray-500">Browse matches and view stats</p>
              </div>

              <div 
                className={`border rounded-lg p-4 cursor-pointer ${formData.role === 'player' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'}`}
                onClick={() => handleRoleChange('player')}
              >
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="role-player"
                    name="role"
                    checked={formData.role === 'player'}
                    onChange={() => handleRoleChange('player')}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="role-player" className="ml-2 block text-sm font-medium text-gray-700">
                    Player
                  </label>
                </div>
                <p className="mt-1 text-xs text-gray-500">Play in matches and track performance</p>
              </div>

              <div 
                className={`border rounded-lg p-4 cursor-pointer ${formData.role === 'scorer' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'}`}
                onClick={() => handleRoleChange('scorer')}
              >
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="role-scorer"
                    name="role"
                    checked={formData.role === 'scorer'}
                    onChange={() => handleRoleChange('scorer')}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="role-scorer" className="ml-2 block text-sm font-medium text-gray-700">
                    Scorer
                  </label>
                </div>
                <p className="mt-1 text-xs text-gray-500">Score matches and update stats</p>
              </div>

              <div 
                className={`border rounded-lg p-4 cursor-pointer ${formData.role === 'organiser' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'}`}
                onClick={() => handleRoleChange('organiser')}
              >
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="role-organiser"
                    name="role"
                    checked={formData.role === 'organiser'}
                    onChange={() => handleRoleChange('organiser')}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="role-organiser" className="ml-2 block text-sm font-medium text-gray-700">
                    Organiser
                  </label>
                </div>
                <p className="mt-1 text-xs text-gray-500">Organise matches and tournaments</p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <GoogleSignInButton
              onClick={handleGoogleSignUp}
              loading={loading}
              className="w-full"
              text={`Sign up with Google as ${formData.role ? formData.role.charAt(0).toUpperCase() + formData.role.slice(1) : 'user'}`}
            />
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or sign up with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <FormField
                id="email"
                name="email"
                type="email"
                label="Email address"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                disabled={!!googleUserData.email}
                required
                autoComplete="email"
              />

              <FormField
                id="displayName"
                name="displayName"
                type="text"
                label="Display Name"
                value={formData.displayName}
                onChange={handleChange}
                placeholder="Enter your name"
                required
                autoComplete="name"
              />

              <FormField
                id="password"
                name="password"
                type="password"
                label="Password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                required
                autoComplete="new-password"
              />

              <FormField
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                label="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                required
                autoComplete="new-password"
              />

              <FormField
                id="phone"
                name="phone"
                type="tel"
                label="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
              />
            </div>

            <div className="mt-6">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <Checkbox
                    id="agreeToTerms"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="agreeToTerms" className="font-medium text-gray-700">
                    I agree to the{' '}
                    <Link to="/terms" className="text-indigo-600 hover:text-indigo-500">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link to="/privacy" className="text-indigo-600 hover:text-indigo-500">
                      Privacy Policy
                    </Link>
                  </label>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full flex justify-center"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <LoadingSpinner className="h-5 w-5 text-white mr-2" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account <FiArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Signup;