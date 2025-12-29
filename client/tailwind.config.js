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
        primary: {
          50: '#f3f7f5',
          100: '#d9e5dd',
          200: '#b5ccc1',
          300: '#90b3a3',
          400: '#6b9482',
          500: '#4f7967',
          600: '#3d5f51',
          700: '#324b40',
          800: '#283732',
          900: '#1b2420',
        },
        accent: {
          50: '#fdf4ed',
          100: '#f8e0cf',
          200: '#f0c0a0',
          300: '#e39a74',
          400: '#d4774f',
          500: '#b95e3a',
          600: '#944731',
          700: '#72362b',
          800: '#4b241f',
          900: '#321616',
        },
        luxury: {
          50: '#f2f0f5',
          100: '#dcd6e6',
          200: '#beb5ce',
          300: '#9a8eb4',
          400: '#7a6a9c',
          500: '#5f517f',
          600: '#4b3f63',
          700: '#3a314c',
          800: '#272034',
          900: '#171020',
        },
        gold: {
          50: '#fdf7e8',
          100: '#f8ebc5',
          200: '#f0d590',
          300: '#e3bd5e',
          400: '#d4a53b',
          500: '#b78526',
          600: '#93671e',
          700: '#725018',
          800: '#4c3510',
          900: '#32240c',
        },
        slate: {
          50: '#faf6ef',
          100: '#f3e9d7',
          200: '#e6d3b5',
          300: '#d5bc90',
          400: '#c29f6b',
          500: '#a37e4e',
          600: '#81613d',
          700: '#62482f',
          800: '#443022',
          900: '#281c14',
          950: '#120c08',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-luxury': 'linear-gradient(135deg, #f3e5c7 0%, #b78526 40%, #4b3f63 100%)',
        'gradient-sunset': 'linear-gradient(135deg, #f6d4a3 0%, #b95e3a 100%)',
        'gradient-ocean': 'linear-gradient(135deg, #c0d6c5 0%, #4f7967 100%)',
        'gradient-fire': 'linear-gradient(135deg, #e6c89b 0%, #b78526 100%)',
        'mesh-gradient': 'radial-gradient(at 10% 20%, #f7e2c4 0px, transparent 50%), radial-gradient(at 80% 0%, #c79a5b 0px, transparent 50%), radial-gradient(at 0% 50%, #e6d7b0 0px, transparent 50%), radial-gradient(at 80% 50%, #a6794d 0px, transparent 50%), radial-gradient(at 0% 100%, #d5b37a 0px, transparent 50%), radial-gradient(at 80% 100%, #5f4a3a 0px, transparent 50%), radial-gradient(at 0% 0%, #b48b5d 0px, transparent 50%)',
      },
      boxShadow: {
        'luxury': '0 10px 40px rgba(0, 0, 0, 0.1)',
        'luxury-lg': '0 20px 60px rgba(0, 0, 0, 0.15)',
        'glow': '0 0 20px rgba(239, 68, 68, 0.5)',
        'glow-lg': '0 0 40px rgba(239, 68, 68, 0.6)',
        'inner-luxury': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-in-out',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-down': 'slideDown 0.4s ease-out',
        'bounce-slow': 'bounce 3s infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'scale-in': 'scaleIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        }
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
