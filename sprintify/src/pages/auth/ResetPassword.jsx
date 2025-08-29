import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import ThemeToggle from "../../components/ThemeToggle";
import useThemeStore from "../../store/themeStore";
import { validatePassword, passwordsMatch } from "../../utils/passwordUtils";
import { resetPassword } from "../../api/auth";

const ResetPassword = () => {
  const { theme } = useThemeStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Extract token from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlToken = params.get("token");
    if (!urlToken) {
      setError("Reset token is missing. Please use the link from your email.");
    } else {
      setToken(urlToken);
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate password
    const passwordResult = validatePassword(password);
    if (!passwordResult.isValid) {
      setError("Password does not meet requirements");
      return;
    }

    // Check if passwords match
    if (!passwordsMatch(password, confirmPassword)) {
      setError("Passwords do not match");
      return;
    }

    if (!token) {
      setError("Reset token is missing. Please use the link from your email.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await resetPassword(token, password);
      setSuccess(true);

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      setError(err.message || "Failed to reset password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-background-dark flex flex-col justify-center py-12 sm:px-6 lg:px-8">
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
            <svg
              className="h-8 w-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
              />
            </svg>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">
          Reset your password
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Enter your new password below.
        </p>
      </div>{" "}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white dark:bg-gradient-card py-8 px-4 shadow sm:rounded-lg sm:px-10 border dark:border-gray-700 border-gray-200">
          {success ? (
            <div className="text-center">
              <div className="mb-6">
                <svg
                  className="mx-auto h-16 w-16 text-success"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Password reset successful!
              </h3>
              <p className="mt-2 text-gray-700 dark:text-gray-300 mb-6">
                Your password has been successfully reset. You'll be redirected
                to the login page shortly.
              </p>
              <div>
                <Link to="/login">
                  <button
                    type="button"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    Go to Login
                  </button>
                </Link>
              </div>
            </div>
          ) : (
            <>
              {error && (
                <div
                  className="mb-4 bg-red-50 dark:bg-red-900/30 border border-red-400 dark:border-red-500 text-red-700 dark:text-red-400 px-4 py-3 rounded relative"
                  role="alert"
                >
                  <span className="block sm:inline">{error}</span>
                </div>
              )}

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    New Password
                  </label>
                  <div className="mt-1">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-800 dark:text-white bg-white text-gray-900"
                      placeholder="••••••••"
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Password must be at least 8 characters long and include a
                      number and a special character.
                    </p>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="confirm-password"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Confirm new password
                  </label>
                  <div className="mt-1">
                    <input
                      id="confirm-password"
                      name="confirm-password"
                      type="password"
                      autoComplete="new-password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-800 dark:text-white bg-white text-gray-900"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    Reset Password
                  </button>
                </div>
              </form>

              <div className="mt-6 flex justify-center">
                <div className="text-sm">
                  <Link
                    to="/login"
                    className="font-medium text-primary hover:text-primary-hover"
                  >
                    Back to login
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
