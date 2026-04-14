import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ThemeToggle from '../../components/ThemeToggle';
import { Mail, ArrowLeft } from 'lucide-react';

const VerifyEmailPending = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  const email = location.state?.email || 'your email';

  const handleResendEmail = async () => {
    setResendLoading(true);
    try {
      // Call backend to resend verification email
      const response = await fetch('/api/v1/user/resend-verification-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      if (response.ok) {
        setResendMessage('✓ Verification email sent! Check your inbox.');
      } else {
        setResendMessage('⚠ Failed to resend email. Please try again.');
      }
    } catch (error) {
      setResendMessage('⚠ Error sending email. Please check your connection.');
    } finally {
      setResendLoading(false);
    }
  };

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
        {/* Email icon */}
        <div className="flex justify-center">
          <div className="h-16 w-16 rounded-full bg-gradient-radial from-primary to-primary-muted flex items-center justify-center animate-bounce">
            <Mail className="h-8 w-8 text-white" />
          </div>
        </div>
        
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">
          Verify your email
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          We've sent a verification link to:
        </p>
        <p className="mt-1 text-center text-sm font-medium text-gray-900 dark:text-gray-100">
          {email}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white dark:bg-gradient-card py-8 px-4 shadow sm:rounded-lg sm:px-10 border dark:border-gray-700 border-gray-200">
          <div className="space-y-6">
            {/* Instructions */}
            <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                What's next?
              </h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800 dark:text-blue-200">
                <li>Check your email inbox</li>
                <li>Click the verification link in the email</li>
                <li>You'll be redirected to confirm your email</li>
                <li>Sign in to your account</li>
              </ol>
            </div>

            {/* Tip */}
            <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                💡 <span className="font-semibold">Tip:</span> The email may take a few minutes to arrive. Check your spam folder if you don't see it.
              </p>
            </div>

            {/* Resend button */}
            <div className="pt-4">
              <button
                onClick={handleResendEmail}
                disabled={resendLoading}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {resendLoading ? 'Sending...' : 'Resend verification email'}
              </button>
              
              {resendMessage && (
                <p className={`mt-2 text-center text-sm ${resendMessage.includes('✓') ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}`}>
                  {resendMessage}
                </p>
              )}
            </div>

            {/* Back to login */}
            <div className="text-center">
              <button
                onClick={() => navigate('/login')}
                className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition"
              >
                <ArrowLeft size={16} />
                Back to Login
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer note */}
      <div className="mt-8 text-center text-xs text-gray-500 dark:text-gray-400 relative z-10">
        <p>This is a secure verification process to protect your account.</p>
      </div>
    </div>
  );
};

export default VerifyEmailPending;
