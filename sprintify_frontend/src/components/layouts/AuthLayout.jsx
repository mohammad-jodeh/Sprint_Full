import React from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from '../ThemeToggle';
import useThemeStore from '../../store/themeStore';

const AuthLayout = ({ children, title, subtitle, subtitleLink, subtitleLinkText }) => {
  const { theme } = useThemeStore();
  
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-background-dark flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Background elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary opacity-10 dark:opacity-10 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-600 opacity-10 dark:opacity-10 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3"></div>
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-custom-600 opacity-10 dark:opacity-10 rounded-full blur-3xl"></div>
        
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
            </svg>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">{title}</h2>
        {subtitle && (
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            {subtitle}{' '}
            {subtitleLink && (
              <Link to={subtitleLink} className="font-medium text-primary hover:text-primary-hover">
                {subtitleLinkText}
              </Link>
            )}
          </p>
        )}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white dark:bg-gradient-card py-8 px-4 shadow sm:rounded-lg sm:px-10 border dark:border-gray-700 border-gray-200">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;