import React from 'react';
import useThemeStore from '../store/themeStore';
import { MoonStar, SunMoon } from 'lucide-react';

const ThemeToggle = ({ className = '' }) => {
  const { theme, toggleTheme } = useThemeStore();
  const isDark = theme === 'dark';

  return (
    <div className={`flex items-center ${className}`}>
      <button
        onClick={toggleTheme}
        className="p-1.5 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      >
        {isDark ? (
          <SunMoon className="h-5 w-5 text-amber-500" />
        ) : (
          <MoonStar className="h-5 w-5 text-indigo-500" />
        )}
      </button>
    </div>
  );
};

export default ThemeToggle;