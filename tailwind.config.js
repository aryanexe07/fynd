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
          950: '#041811',
          900: '#07281d', // Primary Dark Brand
          800: '#0c3b2c',
          700: '#11523e',
          600: '#176b51',
          500: '#059669', // Emerald
          400: '#10b981',
          100: '#e6f7f0',
          50: '#f0fdf7',
        },
        lime: {
          300: '#bef264',
          400: '#a3e635',
          500: '#84cc16', // Highlight Accent
          600: '#65a30d',
          100: '#f7fee7',
        },
        surface: {
          DEFAULT: '#ffffff',
          muted: '#f8faf9',
          subtle: '#f1f5f3',
          border: '#e2e8f0',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Plus Jakarta Sans', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '18px',
        '3xl': '24px',
        '4xl': '32px',
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(7, 40, 29, 0.05)',
        'card': '0 6px 24px -4px rgba(7, 40, 29, 0.08)',
        'floating': '0 10px 30px -5px rgba(7, 40, 29, 0.12)',
        'glow-lime': '0 0 20px -3px rgba(132, 204, 22, 0.4)',
      }
    },
  },
  plugins: [],
}
