/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Salesforce-inspired Theme Colors
        primary: {
          50: '#F0F9FF',
          100: '#E0F2FE',
          200: '#BAE6FD',
          300: '#7DD3FC',
          400: '#38BDF8',
          500: '#0EA5E9',
          600: '#0284C7',
          700: '#0369A1',
          800: '#075985',
          900: '#0C4A6E',
        },
        secondary: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
        },
        accent: '#06B6D4',
        background: {
          DEFAULT: '#FFFFFF',
          secondary: '#FAFBFC',
          tertiary: '#F4F6F9',
        },
        surface: '#FFFFFF',
        error: '#EF4444',
        success: '#10B981',
        warning: '#F59E0B',
        text: {
          primary: '#181818',
          secondary: '#706E6B',
          tertiary: '#8E8D89',
        },
        border: {
          DEFAULT: '#DDDBDA',
          light: '#E5E5E5',
        },
      },
      fontFamily: {
        'sans': ['Salesforce Sans', 'Arial', 'sans-serif'],
        'heading': ['Salesforce Sans', 'Arial', 'sans-serif'],
      },
      borderRadius: {
        'xs': '0.125rem',
        'sm': '0.25rem',
        'md': '0.375rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
      },
      boxShadow: {
        'sf': '0 2px 4px 0 rgba(0, 0, 0, 0.10)',
        'sf-lg': '0 2px 8px 0 rgba(0, 0, 0, 0.16)',
      },
    },
  },
  plugins: [],
}