/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          950: '#091510',
          900: '#111827', // Clean deep charcoal
          800: '#1f2937',
          700: '#1c8c5c',
          600: '#22a36b', // Vibrant Emerald Brand Green
          500: '#22a36b', // Main Emerald Brand
          400: '#34d399',
          100: '#e8f7ee',
          50: '#f0fdf4',
        },
        emerald: {
          DEFAULT: '#22a36b',
          50: '#f0fdf4',
          100: '#e8f7ee',
          200: '#c6f3d9',
          300: '#86efac',
          400: '#4ade80',
          500: '#22a36b',
          600: '#1c8c5c',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        lime: {
          300: '#86efac',
          400: '#22a36b',
          500: '#22a36b',
          600: '#1c8c5c',
          100: '#e8f7ee',
        },
        surface: {
          DEFAULT: '#ffffff',
          muted: '#f5f6f8',
          subtle: '#eef1f4',
          border: '#e5e7eb',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Outfit', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '18px',
        '3xl': '24px',
        '4xl': '32px',
        '5xl': '40px',
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(17, 24, 39, 0.05)',
        'card': '0 8px 30px -4px rgba(17, 24, 39, 0.06)',
        'floating': '0 14px 35px -5px rgba(34, 163, 107, 0.25)',
        'glow-green': '0 0 24px -2px rgba(34, 163, 107, 0.35)',
      }
    },
  },
  plugins: [],
}

