/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5f7ff',
          100: '#ebedff',
          200: '#d9deff',
          300: '#b8c2ff',
          400: '#8c9cff',
          500: '#5c6cff', // Premium Indigo
          600: '#3d49f5',
          700: '#2c34db',
          800: '#242ab3',
          900: '#21258f',
        },
        darkBg: '#0b0f19',
        darkCard: 'rgba(15, 23, 42, 0.65)',
        lightBg: '#f1f5f9',
        lightCard: 'rgba(255, 255, 255, 0.75)',
      },
      backdropBlur: {
        xs: '2px',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    },
  },
  plugins: [],
}
