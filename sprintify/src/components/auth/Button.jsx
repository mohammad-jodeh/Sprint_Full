import React from 'react';
import useThemeStore from '../../store/themeStore';

const Button = ({ 
  children, 
  type = 'button', 
  variant = 'primary', 
  fullWidth = true,
  isLoading = false,
  disabled = false,
  onClick,
  className = '',
}) => {
  const { theme } = useThemeStore();
  
  // Define styling based on variant and theme
  const getButtonStyles = () => {
    const baseClasses = `flex justify-center py-2 px-4 border rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${
      fullWidth ? 'w-full' : ''
    } ${disabled || isLoading ? 'opacity-70 cursor-not-allowed' : ''}`;

    // Style variants with theme support
    switch(variant) {
      case 'primary':
        return `${baseClasses} border-transparent bg-primary hover:bg-primary-hover focus:ring-primary text-white`;
      case 'secondary':
        return `${baseClasses} border-transparent bg-secondary hover:bg-secondary-hover focus:ring-secondary text-white`;
      case 'outline':
        return `${baseClasses} ${
          theme === 'dark' 
            ? 'border-gray-600 text-white hover:bg-gray-800' 
            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
        }`;
      case 'ghost':
        return `${baseClasses} border-transparent ${
          theme === 'dark' 
            ? 'text-white hover:bg-gray-800' 
            : 'text-gray-700 hover:bg-gray-100'
        }`;
      default:
        return baseClasses;
    }
  };

  return (
    <button
      type={type}
      className={`${getButtonStyles()} ${className}`}
      disabled={disabled || isLoading}
      onClick={onClick}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </div>
      ) : children}
    </button>
  );
};

export default Button;