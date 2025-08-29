import React, { useEffect } from 'react';
import { SignIn, SignUp, useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { useClerkSync } from '../hooks/useClerkSync';

const ClerkAuth = ({ mode = 'signin', onSuccess, onShowSignup, onShowSignin }) => {
  const navigate = useNavigate();
  const { user, isSignedIn, isLoaded } = useUser();
  const { syncUser, loading: syncLoading, error: syncError } = useClerkSync();

  // Handle navigation after successful authentication
  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      // Check if email is verified
      const isEmailVerified = user.emailAddresses.some(email => email.verification?.status === 'verified');

      if (!isEmailVerified) {
        // If email is not verified, redirect to email verification page
        navigate('/email-verification');
        return;
      }

      // Sync user with backend database
      const handleUserSync = async () => {
        try {
          const syncedUser = await syncUser(user);

          // Check user role from Clerk metadata or default to student
          const userRole = user.publicMetadata?.role || 'student';

          // Check if this is a new user (first time signing up)
          // We can determine this by checking if the user has completed their profile
          const isNewUser = !syncedUser.institutionId || !syncedUser.studentId || !syncedUser.course;

          if (mode === 'signup' || isNewUser) {
            // After signup/Google sign-in and email verification, redirect to signup page to complete profile
            navigate('/signup');
          } else {
            // After signin and email verification, redirect based on role
            if (userRole === 'admin') {
              navigate('/admin');
            } else {
              // Default to student role and redirect to contact-choice
              navigate('/contact-choice');
            }
          }

          // Call onSuccess callback if provided
          if (onSuccess) {
            onSuccess(user, userRole);
          }
        } catch (error) {
          console.error('Error syncing user:', error);
          // If sync fails, assume it's a new user and redirect to signup
          navigate('/signup');
        }
      };

      handleUserSync();
    }
  }, [isLoaded, isSignedIn, user, mode, navigate, onSuccess, syncUser]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {mode === 'signin' ? 'Welcome Back' : 'Join MindCare'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {mode === 'signin' 
              ? 'Sign in to access your mental health resources' 
              : 'Create your account to get started with mental health support'
            }
          </p>
        </div>

        {/* Signup/Signin Toggle */}
        <div className="text-center">
          {mode === 'signin' ? (
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <button
                onClick={onShowSignup}
                className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
              >
                Sign up here
              </button>
            </p>
          ) : (
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <button
                onClick={onShowSignin}
                className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
              >
                Sign in here
              </button>
            </p>
          )}
        </div>

        {/* Clerk Components */}
        <div className="mt-8">
          {mode === 'signin' ? (
            <SignIn
              routing="path"
              path="/clerk-signin"
              signUpUrl="/clerk-signup"
              fallbackRedirectUrl="/signup"
            />
          ) : (
            <SignUp
              routing="path"
              path="/clerk-signup"
              signInUrl="/clerk-signin"
              fallbackRedirectUrl="/signup"
            />
          )}
        </div>

        {/* Loading State */}
        {syncLoading && (
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 text-sm text-blue-600">
              <div className="w-4 h-4 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin mr-2"></div>
              Syncing your account...
            </div>
          </div>
        )}

        {/* Error State */}
        {syncError && (
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 text-sm text-red-600 bg-red-50 rounded-md">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {syncError}
            </div>
          </div>
        )}

        {/* Features */}
        <div className="mt-8 space-y-4">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900">Why Choose MindCare?</h3>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center p-3 bg-white rounded-lg shadow-sm">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Professional Support</p>
                <p className="text-xs text-gray-500">Access to qualified mental health professionals</p>
              </div>
            </div>
            <div className="flex items-center p-3 bg-white rounded-lg shadow-sm">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Secure & Private</p>
                <p className="text-xs text-gray-500">Your data is protected with industry-standard security</p>
              </div>
            </div>
            <div className="flex items-center p-3 bg-white rounded-lg shadow-sm">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">24/7 Access</p>
                <p className="text-xs text-gray-500">Get help whenever you need it, day or night</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClerkAuth;
