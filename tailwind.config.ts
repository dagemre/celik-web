import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          900: '#071628',
          800: '#0A1F44',
          700: '#0D2857',
          600: '#103270',
          500: '#1E54C8',
          100: '#E8EDF7',
          50:  '#F0F3FA',
        },
        accent: {
          500: '#F59E0B',
          400: '#FBBF24',
        },
        success: {
          700: '#0F6E56',
          600: '#0F7B60',
          100: '#C8EDE5',
          50:  '#E8F7F3',
        },
        danger: {
          700: '#A32D2D',
          600: '#B83232',
          100: '#F5CECE',
          50:  '#FBF0F0',
        },
        warning: {
          700: '#BA7517',
          600: '#C97D1A',
          100: '#FAE4BC',
          50:  '#FDF5E7',
        },
        info: {
          700: '#155A9E',
          600: '#185FA5',
          100: '#C3DAEF',
          50:  '#EBF3FB',
        },
        neutral: {
          600: '#6B6A63',
          500: '#888780',
          400: '#A5A49C',
          200: '#D3D1C7',
          100: '#EDECE8',
          50:  '#F7F6F3',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        marquee: 'marquee 35s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%':   { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
}
export default config
