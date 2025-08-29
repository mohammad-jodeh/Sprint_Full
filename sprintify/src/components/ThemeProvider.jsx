import React, { useEffect } from 'react';
import useThemeStore from '../store/themeStore';

const ThemeProvider = ({ children }) => {
  const { theme } = useThemeStore();

  useEffect(() => {
    // Apply theme class to the document root element
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [theme]);

  return <>{children}</>;
};

export default ThemeProvider;