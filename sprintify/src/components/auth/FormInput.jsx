import React from 'react';
import useThemeStore from '../../store/themeStore';

const FormInput = ({
  id,
  name,
  type = 'text',
  autoComplete,
  required = false,
  className = '',
  placeholder = '',
  label,
  value,
  onChange,
  error,
  helperText
}) => {
  const { theme } = useThemeStore();
  
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
          type={type}
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
        {error && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      {helperText && !error && <p className="mt-1 text-xs dark:text-gray-400 text-gray-600">{helperText}</p>}
    </div>
  );
};

export default FormInput;