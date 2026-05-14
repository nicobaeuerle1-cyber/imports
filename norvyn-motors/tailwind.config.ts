import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#080808',
        surface: {
          DEFAULT: '#111111',
          elevated: '#1A1A1A',
          high: '#242424',
        },
        border: {
          DEFAULT: '#262626',
          subtle: '#1A1A1A',
        },
        foreground: '#FAFAFA',
        muted: '#888888',
        subtle: '#444444',
        gold: {
          DEFAULT: '#C9A96E',
          light: '#D4B896',
          dark: '#A8834A',
        },
        success: '#22C55E',
        warning: '#F59E0B',
        destructive: '#EF4444',
        status: {
          available: '#22C55E',
          reserved: '#F59E0B',
          sold: '#EF4444',
          draft: '#6B7280',
        },
      },
      fontFamily: {
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
        sans: ['var(--font-geist)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '1rem' }],
      },
      letterSpacing: {
        widest: '0.3em',
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
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'line-grow': {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s ease forwards',
        'fade-in': 'fade-in 0.4s ease forwards',
        shimmer: 'shimmer 2s linear infinite',
        'line-grow': 'line-grow 0.8s ease forwards',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'noise': "url('/images/noise.png')",
        'hero-gradient':
          'linear-gradient(to bottom, transparent 60%, #080808 100%)',
      },
      transitionTimingFunction: {
        luxury: 'cubic-bezier(0.25, 0, 0, 1)',
      },
    },
  },
  plugins: [],
}

export default config
