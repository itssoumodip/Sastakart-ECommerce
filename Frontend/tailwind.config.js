/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#000000',
        'secondary': '#333333',
        'accent': '#666666',
        'light': '#f5f5f5',
        'white': '#ffffff',
        'black': '#000000',
      },
      fontFamily: {
        'sans': ['Inter', 'ui-sans-serif', 'system-ui'],
        'heading': ['Montserrat', 'ui-sans-serif', 'system-ui'],
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        'custom': '0 4px 6px rgba(0, 0, 0, 0.1)',
        'custom-lg': '0 10px 15px rgba(0, 0, 0, 0.1)',
      },
      backgroundColor: {
        'white': '#ffffff',
        'black': '#000000',
        'gray-50': '#f9fafb',
        'gray-100': '#f3f4f6',
      },
      textColor: {
        'white': '#ffffff',
        'black': '#000000',
      },
    },
  },
  plugins: [],
}
