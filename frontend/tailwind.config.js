/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FCFBF9',
          100: '#FAF7F0',
          200: '#F3EDE2',
          300: '#E7DDD0',
          400: '#D7C7B6',
          500: '#C2AD96',
        },
        gold: {
          50: '#FDFBF7',
          100: '#FAF2E3',
          200: '#F4E4C2',
          500: '#D4AF37', // metallic rose-gold/bronze-gold
          600: '#C29F2F',
          700: '#A48422',
        },
        rose: {
          50: '#FDF6F7',
          100: '#FBE9EC',
          200: '#E8C5C8', // soft pink/rose-gold accent
          300: '#DAAAAE',
          400: '#C48A90',
          500: '#AB6970',
        },
        charcoal: {
          50: '#F6F6F6',
          100: '#E7E7E7',
          200: '#CFCFCF',
          800: '#2A2A2A',
          900: '#1E1E1E',
          950: '#121212',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Montserrat"', 'system-ui', 'sans-serif'],
      },
      height: {
        '90vh': '90vh',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'zoom-in': 'zoomIn 10s ease-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        zoomIn: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.08)' },
        }
      }
    },
  },
  plugins: [],
}
