/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Obsidian Dark Theme Color Palette
        obsidian: {
          50: '#f5f5f5',
          100: '#e6e6e6',
          200: '#c2c2c2',
          300: '#b3b3b3',
          400: '#999999',
          500: '#808080',
          600: '#666666',
          700: '#4d4d4d',
          800: '#333333',
          850: '#262626',
          900: '#1a1a1a',
          950: '#0d0d0d',
        },
        // Accent Colors - Purple/Blue Theme
        accent: {
          purple: '#8b5cf6',
          'purple-light': '#a78bfa',
          'purple-dark': '#7c3aed',
          blue: '#6366f1',
          'blue-light': '#818cf8',
          'blue-dark': '#4f46e5',
          green: '#10b981',
          orange: '#f59e0b',
          pink: '#ec4899',
          red: '#ef4444',
          yellow: '#eab308',
        },
        // Semantic Colors
        surface: {
          primary: '#0d0d0d',
          secondary: '#141414',
          tertiary: '#1a1a1a',
          elevated: '#1e1e1e',
          hover: '#1f1f1f',
          active: '#262626',
        },
        content: {
          primary: '#e6e6e6',
          secondary: '#b3b3b3',
          muted: '#808080',
          faint: '#666666',
        },
        border: {
          subtle: '#2a2a2a',
          DEFAULT: '#333333',
          hover: '#404040',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'SF Mono', 'monospace'],
      },
      fontSize: {
        '2xs': '0.625rem',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'glow-purple': '0 0 20px rgba(139, 92, 246, 0.3)',
        'glow-purple-lg': '0 0 40px rgba(139, 92, 246, 0.4)',
        'glow-blue': '0 0 20px rgba(99, 102, 241, 0.3)',
        'inner-light': 'inset 0 1px 1px rgba(255, 255, 255, 0.05)',
      },
      transitionTimingFunction: {
        'bounce-subtle': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(139, 92, 246, 0.5)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
