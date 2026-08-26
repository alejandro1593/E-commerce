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
          50: '#FFFEF9',
          100: '#FFF8F0',
          200: '#FFF1E0',
          300: '#FFE8CC',
          400: '#FFDEB3',
          500: '#F5D5A8',
          DEFAULT: '#FFF8F0',
        },
        dark: {
          900: '#1a1a25',
          800: '#252530',
          700: '#2a2a35',
          600: '#35354a',
        },
        neon: {
          cyan: '#00b4d8',
          magenta: '#e040a0',
          purple: '#7c3aed',
          green: '#10b981',
        },
      },
      boxShadow: {
        'neon-cyan': '0 0 20px rgba(0, 180, 216, 0.15)',
        'neon-magenta': '0 0 20px rgba(224, 64, 160, 0.15)',
        'neon-purple': '0 0 20px rgba(124, 58, 237, 0.15)',
        'glow': '0 4px 30px rgba(0, 180, 216, 0.1)',
        'card': '0 4px 20px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 8px 40px rgba(0, 180, 216, 0.12)',
      },
      backgroundImage: {
        'gradient-neon': 'linear-gradient(135deg, #00b4d8 0%, #7c3aed 100%)',
        'gradient-cream': 'linear-gradient(135deg, #FFF8F0 0%, #FFE8CC 100%)',
        'gradient-hero': 'linear-gradient(135deg, #FFF8F0 0%, #FFE8CC 50%, #FFF1E0 100%)',
      },
      animation: {
        'glow': 'glow 3s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(0, 180, 216, 0.1)' },
          '100%': { boxShadow: '0 0 40px rgba(0, 180, 216, 0.2)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}
