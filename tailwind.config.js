/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: {
          DEFAULT: '#1A1814',
          light: '#2A2620',
          muted: '#3D3830',
        },
        ivory: {
          DEFAULT: '#FAF7F2',
          dark: '#F0EBE3',
          warm: '#FFFCF7',
        },
        gold: {
          DEFAULT: '#C9A962',
          light: '#E8D5A3',
          dark: '#9A7B3C',
          muted: '#B8956A',
        },
        champagne: '#F5EDD6',
        bronze: '#8B7355',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        luxury: '0.08em',
        wide: '0.04em',
      },
      boxShadow: {
        gold: '0 4px 24px -4px rgba(201, 169, 98, 0.25)',
        'gold-lg': '0 8px 40px -8px rgba(201, 169, 98, 0.35)',
        luxury: '0 2px 40px -12px rgba(26, 24, 20, 0.12)',
        'inner-gold': 'inset 0 1px 0 0 rgba(232, 213, 163, 0.4)',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #E8D5A3 0%, #C9A962 50%, #9A7B3C 100%)',
        'dark-gradient': 'linear-gradient(180deg, #1A1814 0%, #2A2620 100%)',
        'ivory-texture': 'radial-gradient(ellipse at 50% 0%, rgba(201, 169, 98, 0.06) 0%, transparent 60%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
