import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from '../../components/ThemeToggle';
import { forgotPassword } from '../../api/auth';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      await forgotPassword(email);
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-background-dark flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Background elements */}
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
        <div className="flex justify-center">
          <div className="h-12 w-12 rounded-full bg-gradient-radial from-primary to-secondary flex items-center justify-center">
            <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">Forgot your password?</h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white dark:bg-gradient-card py-8 px-4 shadow sm:rounded-lg sm:px-10 border dark:border-gray-700 border-gray-200">
          {success ? (
            <div className="text-center">
              <div className="mb-6">
                <svg className="mx-auto h-16 w-16 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                We've sent a password reset link to <span className="font-medium">{email}</span>. Please check your email and follow the instructions.
              </p>
              <div>
                <Link to="/login">
                  <button
                    type="button"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    Back to login
                  </button>
                </Link>
              </div>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-900/30 border border-red-500 text-red-400 px-4 py-3 rounded relative" role="alert">
                  <span className="block sm:inline">{error}</span>
                </div>
              )}
          
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-800 dark:text-white bg-white text-gray-900"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    'Send reset link'
                  )}
                </button>
              </div>
              
              <div className="mt-6 flex justify-center">
                <div className="text-sm">
                  <Link to="/login" className="font-medium text-primary hover:text-primary-hover">
                    Back to login
                  </Link>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;