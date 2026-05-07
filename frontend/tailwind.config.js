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
          DEFAULT: '#E6007E',
          light: '#FF4DB2',
          dark: '#B30062',
        },
        accent: '#FFD700',
      },
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
        playfair: ['Playfair Display', 'serif'],
      },
      animation: {
        'mesh-gradient': 'mesh 10s ease infinite',
      },
      keyframes: {
        mesh: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        }
      }
    },
  },
  plugins: [],
}
