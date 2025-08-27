/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./screens/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        // Нейморфная палитра
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          900: '#0c4a6e',
        },
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          850: '#1e1e1e',
          900: '#171717',
          950: '#0a0a0a',
        },
        success: {
          500: '#10b981',
          600: '#059669',
        },
        error: {
          500: '#ef4444',
          600: '#dc2626',
        },
        warning: {
          500: '#f59e0b',
          600: '#d97706',
        }
      },
      boxShadow: {
        'neomorph-light': '6px 6px 12px #d1d1d1, -6px -6px 12px #ffffff',
        'neomorph-dark': '6px 6px 12px #0a0a0a, -6px -6px 12px #2a2a2a',
        'neomorph-inset-light': 'inset 6px 6px 12px #d1d1d1, inset -6px -6px 12px #ffffff',
        'neomorph-inset-dark': 'inset 6px 6px 12px #0a0a0a, inset -6px -6px 12px #2a2a2a',
      },
      borderRadius: {
        'neomorph': '16px',
        'neomorph-lg': '24px',
      },
      fontFamily: {
        'sans': ['SF Pro Display', 'Roboto', 'Arial', 'sans-serif'],
      }
    },
  },
  plugins: [],
}