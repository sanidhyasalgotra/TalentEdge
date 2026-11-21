/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#F6F4EF',
        ink: { DEFAULT: '#14213D', soft: '#4A5568', faint: '#8A93A3' },
        edge: { DEFAULT: '#0E7C66', dark: '#0A5F4E', light: '#E3F2EE' },
        amber: { soft: '#FBF0DA' },
        // aliases used by the login, password and account pages
        surface: '#F6F4EF',
        body: '#4A5568',
        muted: '#5F6B7D',
        line: 'rgba(20, 33, 61, 0.12)',
        brand: { DEFAULT: '#0E7C66', dark: '#0A5F4E', light: '#E3F2EE' },
        good: '#0E7C66',
        warn: '#B7791F',
        bad: '#B83232',
      },
      fontFamily: {
        display: ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
        sans: ['ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
