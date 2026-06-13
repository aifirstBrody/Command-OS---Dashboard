import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
  ],
  theme: {
    container: { center: true, padding: '2rem', screens: { '2xl': '1400px' } },
    extend: {
      colors: {
        brand: {
          orange:       '#FF671F',
          'deep-orange':'#D6562B',
          green:        '#ACBF37',
          black:        '#231F20',
          'off-white':  '#E9E9E9',
        },
        border:     'rgba(255,255,255,0.08)',
        input:      'rgba(255,255,255,0.08)',
        ring:       '#FF671F',
        background: '#0c0a09',
        foreground: '#E9E9E9',
        primary:    { DEFAULT: '#FF671F', foreground: '#ffffff' },
        secondary:  { DEFAULT: '#ACBF37', foreground: '#0c0a09' },
        destructive:{ DEFAULT: '#ef4444', foreground: '#ffffff' },
        muted:      { DEFAULT: 'rgba(255,255,255,0.05)', foreground: '#9a9491' },
        accent:     { DEFAULT: 'rgba(255,103,31,0.12)', foreground: '#FF671F' },
        card:       { DEFAULT: '#1a1714', foreground: '#E9E9E9' },
        popover:    { DEFAULT: '#231F20', foreground: '#E9E9E9' },
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Barlow Condensed"', 'sans-serif'],
        mono:    ['ui-monospace', 'monospace'],
      },
      borderRadius: { lg: '0.625rem', md: '0.5rem', sm: '0.375rem' },
      keyframes: {
        'pulse-dot':      { '0%,100%': { opacity: '1', transform: 'scale(1)' }, '50%': { opacity: '0.5', transform: 'scale(1.4)' } },
        'fade-up':        { from: { opacity: '0', transform: 'translateY(16px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        'slide-in-right': { from: { transform: 'translateX(100%)' }, to: { transform: 'translateX(0)' } },
        'shimmer':        { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
      },
      animation: {
        'pulse-dot':      'pulse-dot 2s infinite',
        'fade-up':        'fade-up 0.4s ease-out',
        'slide-in-right': 'slide-in-right 0.3s ease-out',
        'shimmer':        'shimmer 2s linear infinite',
      },
      boxShadow: {
        card:         '0 1px 3px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.06)',
        'card-hover': '0 4px 16px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,103,31,0.2)',
        orange:       '0 0 20px rgba(255,103,31,0.35)',
      },
    },
  },
  plugins: [],
}

export default config
