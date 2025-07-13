import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { createUserWithEmailAndPassword, signInWithRedirect, GoogleAuthProvider } from 'firebase/auth';
import { auth, googleProvider } from '../../firebase';
import api from '../../utils/api';
import { Components, Icons } from '../../exports';

// Destructure components with their exact export names
const {
  Button,
  Alert,
  Card,
  Tabs,
  Tab,
  FormCheckbox,
  LoadingSpinner,
  GoogleSignInButton,
  FormField
} = Components;

// Destructure icons
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

// Create a local alias for FormCheckbox
const Checkbox = FormCheckbox;

const Signup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const googleUserData = location.state || {};

  const [activeTab, setActiveTab] = useState('viewer');
  const [formData, setFormData] = useState({
    email: googleUserData.email || '',
    password: '',
    confirmPassword: '',
    displayName: googleUserData.displayName || '',
    phone: '',
    dob: '',
    agreeToTerms: false
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    console.log('Active tab (role) changed to:', activeTab);
  }, [activeTab]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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
    if (!formData.agreeToTerms) {
      setError('You must agree to the terms and conditions');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) return;
    
    setLoading(true);

    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      );

      const user = userCredential.user;

      // Save user data to our backend
      await api.post('/api/users', {
        uid: user.uid,
        email: formData.email,
        displayName: formData.displayName,
        phone: formData.phone,
        dob: formData.dob,
        role: activeTab,
        photoURL: googleUserData.photoURL || ''
      });

      // Store role in sessionStorage for redirection
      sessionStorage.setItem('userSignupRole', activeTab);
      
      // Show success message
      setSuccess('Account created successfully! Redirecting...');
      
      // Redirect based on role
      setTimeout(() => {
        navigate(`/${activeTab}/dashboard`);
      }, 1500);

    } catch (error) {
      console.error('Signup error:', error);
      setError(error.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Use redirect instead of popup
      const result = await signInWithRedirect(auth, googleProvider);
      
      // This will be handled by the auth state change listener in your app's root
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
          <Tabs 
            activeTab={activeTab} 
            onChange={setActiveTab}
            className="mb-8"
          >
            <Tab label="Viewer" value="viewer" />
            <Tab label="Player" value="player" />
            <Tab label="Scorer" value="scorer" />
            <Tab label="Organizer" value="organizer" />
          </Tabs>

          {error && (
            <Alert type="error" className="mb-6">
              <FiAlertCircle className="h-5 w-5" />
              <span>{error}</span>
            </Alert>
          )}

          {success && (
            <Alert type="success" className="mb-6">
              <FiCheck className="h-5 w-5" />
              <span>{success}</span>
            </Alert>
          )}

          <div className="mt-6">
            <GoogleSignInButton
              onClick={handleGoogleSignUp}
              loading={loading}
              className="w-full"
              text={`Sign up with Google as ${String(activeTab || 'user').charAt(0).toUpperCase()}${String(activeTab || 'user').slice(1)}`}
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

              <FormField
                id="dob"
                name="dob"
                type="date"
                label="Date of Birth"
                value={formData.dob}
                onChange={handleChange}
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