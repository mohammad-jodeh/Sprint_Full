import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import ThemeToggle from '../../components/ThemeToggle';
import { verifyEmail } from '../../api/auth';
import useAuthStore from '../../store/authstore';

const ConfirmEmail = () => {
  const [verifying, setVerifying] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const updateUser = useAuthStore((state) => state.updateUser);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    const verifyUserEmail = async () => {
      const queryParams = new URLSearchParams(location.search);
      const token = queryParams.get('token');
      
      if (!token) {
        setError('Email verification token is missing');
        setVerifying(false);
        return;
      }
      
      try {
        const result = await verifyEmail(token);
        setSuccess(true);
        
        // Update user data in store
        if (user) {
          updateUser({ isEmailVerified: true });
        }
      } catch (error) {
        setError(error.message || 'Failed to verify email');
      } finally {
        setVerifying(false);
      }
    };
    
    verifyUserEmail();
  }, [location, updateUser, user]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-background-dark flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Background overlay elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary opacity-10 dark:opacity-10 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-600 opacity-10 dark:opacity-10 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3"></div>
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-purple-600 opacity-10 dark:opacity-10 rounded-full blur-3xl"></div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      </div>
      
      {/* Theme toggle button */}
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10 relative">
        {verifying ? (
          <>
            <div className="flex justify-center">
              <div className="h-12 w-12 rounded-full bg-gradient-radial from-primary to-primary-muted flex items-center justify-center animate-pulse">
                <svg className="h-8 w-8 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">Verifying Email</h2>
            <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
              Please wait while we verify your email address...
            </p>
          </>
        ) : success ? (
          <>
            <div className="flex justify-center">
              <div className="h-12 w-12 rounded-full bg-gradient-radial from-success to-success-muted flex items-center justify-center">
                <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">Email Confirmed!</h2>
            <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
              Your email has been successfully verified.
            </p>
          </>
        ) : (
          <>
            <div className="flex justify-center">
              <div className="h-12 w-12 rounded-full bg-gradient-radial from-error to-error-muted flex items-center justify-center">
                <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">Verification Failed</h2>
            <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
              {error || "We couldn't verify your email address. The link may have expired."}
            </p>
          </>
        )}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white dark:bg-gradient-card py-8 px-4 shadow sm:rounded-lg sm:px-10 border dark:border-gray-700 border-gray-200">
          <div className="text-center">
            <div className="mb-6">              {success ? (
                <svg className="mx-auto h-16 w-16 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="mx-auto h-16 w-16 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              {success
                ? "Thank you for confirming your email address. Your account is now fully activated and ready to use."
                : error || "We couldn't verify your email address. The link may have expired or is invalid."}
            </p>
            <div>
              <Link to={success ? "/login" : "/register"}>
                <button
                  type="button"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  {success ? "Continue to Login" : "Back to Registration"}
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmEmail;