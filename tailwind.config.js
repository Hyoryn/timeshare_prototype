/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          main: '#C9965F',
          light: '#E8C79A',
          cream: '#F5E6D3',
          accent: '#B8824A',
        },
        ui: {
          bg: '#FDFBF7',
          card: '#FFFFFF',
          border: '#E5DDD1',
          text: '#3D2F1F',
          textSecondary: '#8B7355',
        }
      },
      fontFamily: {
        sans: ['Pretendard', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
