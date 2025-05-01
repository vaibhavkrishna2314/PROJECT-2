/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Option 1: Named palette (used in main project)
        primary: {
          DEFAULT: 'rgb(var(--color-primary) / <alpha-value>)', // For bg-primary etc.
          green: '#88C9A1',
          blue: '#6FAEDB',
          beige: '#F5EFE6',
        },
        secondary: 'rgb(var(--color-secondary) / <alpha-value>)',
        accent: {
          DEFAULT: 'rgb(var(--color-accent) / <alpha-value>)',
          yellow: '#F2C94C',
          coral: '#F28C8C',
        },
        success: 'rgb(var(--color-success) / <alpha-value>)',
        warning: 'rgb(var(--color-warning) / <alpha-value>)',
        error: 'rgb(var(--color-error) / <alpha-value>)',
        neutral: {
          charcoal: '#4E4E50',
          light: '#D9D9D9',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
