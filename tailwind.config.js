/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        crust: {
          50: '#fdf8f0',
          100: '#faf0dc',
          200: '#f3ddb3',
          300: '#e9c485',
          400: '#dba455',
          500: '#cc8a3a',
          600: '#b06f2c',
          700: '#8c5524',
          800: '#6f4422',
          900: '#5c391f'
        },
        oven: {
          500: '#e8702a',
          600: '#d6551a',
          700: '#b2430f'
        }
      },
      fontFamily: {
        display: ['Quicksand', 'sans-serif'],
        body: ['Nunito', 'sans-serif']
      }
    }
  },
  plugins: []
}
