/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        plum: {
          50: '#f7f3f9',
          100: '#ece2f0',
          200: '#d9c6e1',
          300: '#bd9ecb',
          400: '#9c70ad',
          500: '#7e4d92',
          600: '#5B2C6F',
          700: '#4a2458',
          800: '#3c1d48',
          900: '#321a3d',
          950: '#1f0f26',
        },
        cream: {
          50: '#FFF8F1',
          100: '#fdf0e4',
          200: '#fae0c9',
          300: '#f5c99e',
          400: '#efa86c',
          500: '#e88a45',
        },
        gold: {
          50: '#fdf8ed',
          100: '#f9edcf',
          200: '#f2d99e',
          300: '#e9c065',
          400: '#D4A017',
          500: '#bf8f12',
          600: '#a07310',
          700: '#7e5712',
          800: '#694615',
          900: '#593b16',
        },
        charcoal: {
          50: '#f7f7f7',
          100: '#ededed',
          200: '#dcdcdc',
          300: '#bfbfbf',
          400: '#9a9a9a',
          500: '#737373',
          600: '#5c5c5c',
          700: '#424242',
          800: '#2E2E2E',
          900: '#1f1f1f',
          950: '#121212',
        },
      },
      fontFamily: {
        spartan: ['League Spartan', 'sans-serif'],
        playfair: ['"Playfair Display"', 'serif'],
        cormorant: ['"Cormorant Garamond"', 'serif'],
        lato: ['Lato', 'sans-serif'],
        sans: ['Lato', 'sans-serif'],
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'slide-down': {
          '0%': { opacity: '0', transform: 'translateY(-100%)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        'gold-line': {
          '0%': { transform: 'scaleX(0)' },
          '100%': { transform: 'scaleX(1)' },
        },
        'letter-in': {
          '0%': { opacity: '0', letterSpacing: '0.6em' },
          '100%': { opacity: '1', letterSpacing: '0.35em' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s ease-out forwards',
        'fade-in': 'fade-in 0.8s ease-out forwards',
        'scale-in': 'scale-in 0.5s ease-out forwards',
        float: 'float 6s ease-in-out infinite',
        'slide-down': 'slide-down 0.3s ease-out forwards',
        shimmer: 'shimmer 2s linear infinite',
        'gold-line': 'gold-line 1.1s cubic-bezier(0.65, 0, 0.35, 1) forwards',
        'letter-in': 'letter-in 0.9s ease-out forwards',
      },
    },
  },
  plugins: [],
};
