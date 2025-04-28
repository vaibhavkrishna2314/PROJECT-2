/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          green: '#88C9A1',
          blue: '#6FAEDB',
          beige: '#F5EFE6',
        },
        accent: {
          yellow: '#F2C94C',
          coral: '#F28C8C',
        },
        neutral: {
          charcoal: '#4E4E50',
          light: '#D9D9D9',
        },
      },
    },
  },
  plugins: [],
};