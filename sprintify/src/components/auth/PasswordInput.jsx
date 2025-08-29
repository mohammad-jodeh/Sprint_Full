import React, { useState } from 'react';
import useThemeStore from '../../store/themeStore';
import { validatePassword, getStrengthLabel } from '../../utils/passwordUtils';

const PasswordInput = ({
  id,
  name,
  autoComplete,
  required = false,
  className = '',
  placeholder = '••••••••',
  label,
  value,
  onChange,
  error,
  helperText,
  showStrengthMeter = false
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const { theme } = useThemeStore();
  
  // Calculate strength only if needed
  const strength = showStrengthMeter && value ? validatePassword(value).strength : 0;
  const strengthInfo = showStrengthMeter && value ? getStrengthLabel(strength) : null;

  // Determine bar color based on strength
  const getBarColor = () => {
    if (!strength) return theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300';
    if (strength < 30) return 'bg-red-500';
    if (strength < 50) return 'bg-orange-500';
    if (strength < 70) return 'bg-yellow-500';
    if (strength < 90) return 'bg-green-400';
    return 'bg-green-500';
  };

  const toggleShowPassword = () => {
    setShowPassword(prev => !prev);
  };

  return (
    <div>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium dark:text-gray-300 text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="mt-1 relative">
        <input
          id={id}
          name={name}
          type={showPassword ? 'text' : 'password'}
          autoComplete={autoComplete}
          required={required}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${
            theme === 'dark' 
              ? 'border-gray-700 bg-gray-800 text-white' 
              : 'border-gray-300 bg-white text-gray-900'
          } ${error ? 'border-red-500' : ''} ${className}`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
        <button
          type="button"
          onClick={toggleShowPassword}
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
        >
          {showPassword ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 dark:text-gray-400 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 dark:text-gray-400 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
              <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
            </svg>
          )}
        </button>
      </div>

      {showStrengthMeter && value && (
        <div className="mt-2">
          <div className={`w-full h-1.5 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded-full overflow-hidden`}>
            <div 
              className={`h-full ${getBarColor()}`} 
              style={{ width: `${strength}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-xs dark:text-gray-400 text-gray-500">Weak</span>
            <span className="text-xs dark:text-gray-400 text-gray-500">Strong</span>
          </div>
        </div>
      )}

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      {helperText && !error && <p className="mt-1 text-xs dark:text-gray-400 text-gray-500">{helperText}</p>}
    </div>
  );
};

export default PasswordInput;