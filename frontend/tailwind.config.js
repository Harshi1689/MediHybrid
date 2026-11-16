/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          500: '#2563eb',
          600: '#1d4ed8',
          700: '#1e40af',
          900: '#0f172a',
        },
        navy: {
          950: '#0b1120',
          900: '#0f172a',
          800: '#1e293b',
          700: '#334155',
          600: '#475569',
          500: '#64748b'
        },
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          500: '#4f46e5',
          600: '#4338ca',
          700: '#3730a3',
        },
        teal: {
          900: '#134e4a',
          800: '#115e59',
          700: '#0f766e',
          600: '#0d9488',
          500: '#14b8a6',
          400: '#2dd4bf',
          300: '#5eead4',
          100: '#ccfbf1',
          50: '#f0fdfa'
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.35s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-subtle': 'pulseSubtle 2.5s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.65' },
        }
      }
    },
  },
  plugins: [],
}
