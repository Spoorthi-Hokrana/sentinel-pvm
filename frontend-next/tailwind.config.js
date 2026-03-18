/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#F8FAF5',
        ivory: '#F0F4EB',
        sage: '#DCE4D4',
        bark: '#2C3E2D',
        moss: '#5A6B5C',
        soil: '#1A2B1C',
        forest: '#0D1F10',
        sentinel: {
          50: '#EDFCF2',
          100: '#D4F7E0',
          200: '#ACF0C6',
          300: '#75E3A2',
          400: '#3DCE79',
          500: '#1DBF60',
          600: '#109A4B',
          700: '#0F7A3E',
          800: '#116034',
          900: '#104F2C',
          950: '#042C17',
        },
        warning: '#E6A817',
        danger: '#DC4545',
        info: '#3B82F6',
      },
      fontFamily: {
        editorial: ['"DM Serif Display"', 'serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      fontSize: {
        hero: 'clamp(2.5rem, 8vw, 6rem)',
        display: 'clamp(3rem, 8vw, 8rem)',
        section: 'clamp(2rem, 5vw, 5rem)',
      },
      letterSpacing: {
        tight: '-0.03em',
      },
      borderRadius: {
        '2xl': '20px',
        '3xl': '24px',
      },
      animation: {
        'ping-slow': 'ping 3s cubic-bezier(0, 0, 0.2, 1) infinite',
        'bounce-slow': 'bounce 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};