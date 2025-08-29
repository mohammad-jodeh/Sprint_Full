/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        background: {
          dark: '#0F172A',
          DEFAULT: '#1E293B',
          light: '#334155'
        },
        primary: {
          DEFAULT: '#6366F1',
          hover: '#4F46E5',
          muted: '#818CF8'
        },
        secondary: {
          DEFAULT: '#8B5CF6',
          hover: '#7C3AED',
          muted: '#A78BFA'
        },        success: {
          DEFAULT: '#10B981',
          hover: '#059669',
          muted: '#34D399'
        },
        warning: {
          DEFAULT: '#F59E0B',
          hover: '#D97706',
          muted: '#FBBF24'
        },
        error: {
          DEFAULT: '#EF4444',
          hover: '#DC2626',
          muted: '#F87171'
        },        accent: {
          DEFAULT: '#EC4899', // Pink color for accent
          hover: '#DB2777',
          muted: '#F472B6'
        },        custom: {
          DEFAULT: '#5e62e3', // Custom purple color
          50: '#f0f1ff',
          100: '#e4e6ff',
          200: '#cdd2ff',
          300: '#adb4ff',
          400: '#8b92ff',
          500: '#7076ff',
          600: '#5e62e3',
          700: '#4f51d1',
          800: '#403fb8',
          900: '#383794'
        },
        gray: {
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827'
        }
      },
      fontFamily: {
        sans: [
          'Inter var, sans-serif',
          'system-ui',
          'sans-serif'
        ]
      },      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-in-out',
        'slide-down': 'slideDown 0.3s ease-in-out',
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out infinite 2s',
        'float-slow': 'float 8s ease-in-out infinite 1s',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(5deg)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-primary': 'linear-gradient(to bottom, #1E293B, #0F172A)',
        'gradient-card': 'linear-gradient(to bottom right, #1E293B, #0F172A)',
        'gradient-header': 'linear-gradient(to right, #1E293B, #334155)',
      }
    },
  },  plugins: [
    require('tailwind-scrollbar'),
  ],
};