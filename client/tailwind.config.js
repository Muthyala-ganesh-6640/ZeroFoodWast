/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          green: '#0f8a5f',
          dark: '#123524',
          orange: '#f59e0b',
          yellow: '#facc15',
          cream: '#fff7ed',
        },
      },
      boxShadow: {
        soft: '0 12px 35px rgba(15, 138, 95, 0.12)',
      },
    },
  },
  plugins: [],
};
