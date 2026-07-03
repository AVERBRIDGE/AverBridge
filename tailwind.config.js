/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // AVERBRIDGE Design System
        bg: {
          base: '#0A0E17',
          surface: '#0D1220',
          card: '#111827',
          elevated: '#161E30',
          border: '#1E2D45',
        },
        gold: {
          DEFAULT: '#F5C542',
          50: '#FEFBEC',
          100: '#FDF4C7',
          200: '#FAE889',
          300: '#F8D94B',
          400: '#F5C542',
          500: '#E8A800',
          600: '#B88200',
          700: '#8A6100',
        },
        violet: {
          DEFAULT: '#7C5CFF',
          50: '#F3F0FF',
          100: '#E9E3FF',
          200: '#D4CAFF',
          300: '#B4A3FF',
          400: '#9070FF',
          500: '#7C5CFF',
          600: '#6340F0',
          700: '#4F2CD0',
        },
        cyan: {
          DEFAULT: '#38D9C9',
          50: '#ECFDF8',
          100: '#D1FAF4',
          200: '#A3F4E9',
          300: '#6FEADE',
          400: '#38D9C9',
          500: '#22C0B0',
          600: '#19938A',
        },
        success: '#22C55E',
        warning: '#F59E0B',
        danger: '#EF4444',
        info: '#38BDF8',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '1rem' }],
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.25rem', { lineHeight: '1.75rem' }],
        xl: ['1.5rem', { lineHeight: '2rem' }],
        '2xl': ['2rem', { lineHeight: '2.5rem' }],
        '3xl': ['2.5rem', { lineHeight: '3rem' }],
      },
      borderRadius: {
        card: '12px',
        'card-lg': '20px',
      },
      boxShadow: {
        glow: '0 0 20px rgba(124, 92, 255, 0.15)',
        'glow-gold': '0 0 20px rgba(245, 197, 66, 0.15)',
        card: '0 4px 24px rgba(0, 0, 0, 0.4)',
      },
      backdropBlur: {
        xs: '2px',
      },
      spacing: {
        1: '4px',
        2: '8px',
        3: '12px',
        4: '16px',
        6: '24px',
        8: '32px',
        12: '48px',
        16: '64px',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.25s ease-out',
        'shimmer': 'shimmer 1.5s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
