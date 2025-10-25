/** @type {import('tailwindcss').Config} */
import colors from 'tailwindcss/colors';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    colors: {
      // Keep Tailwind's default essential colors
      transparent: 'transparent',
      current: 'currentColor',
      black: '#000000',
      white: '#ffffff',
      // Add gray scale from Tailwind (needed by many components)
      gray: colors.gray,
      // Light Theme (Material You)
      'primary': '#6750A4',
      'on-primary': '#FFFFFF',
      'primary-container': '#EADDFF',
      'on-primary-container': '#21005E',
      'secondary': '#625B71',
      'on-secondary': '#FFFFFF',
      'secondary-container': '#E8DEF8',
      'on-secondary-container': '#1E192B',
      'tertiary': '#7D5260',
      'on-tertiary': '#FFFFFF',
      'tertiary-container': '#FFD8E4',
      'on-tertiary-container': '#370B1E',
      'error': '#B3261E',
      'on-error': '#FFFFFF',
      'error-container': '#F9DEDC',
      'on-error-container': '#410E0B',
      'background': '#FFFBFE',
      'on-background': '#1C1B1F',
      'surface': '#FFFBFE',
      'on-surface': '#1C1B1F',
      'surface-variant': '#E7E0EC',
      'on-surface-variant': '#49454E',
      'outline': '#79747E',
      'shadow': '#000000',
      'surface-tint': '#6750A4',
      'inverse-surface': '#313033',
      'inverse-on-surface': '#F4EFF4',
      'inverse-primary': '#D0BCFF',

      // Dark Theme (Material You)
      'dark-primary': '#D0BCFF',
      'dark-on-primary': '#371E73',
      'dark-primary-container': '#4F378B',
      'dark-on-primary-container': '#EADDFF',
      'dark-secondary': '#CCC2DC',
      'dark-on-secondary': '#332D41',
      'dark-secondary-container': '#4A4458',
      'dark-on-secondary-container': '#E8DEF8',
      'dark-tertiary': '#EFB8C8',
      'dark-on-tertiary': '#492532',
      'dark-tertiary-container': '#633B48',
      'dark-on-tertiary-container': '#FFD8E4',
      'dark-error': '#F2B8B5',
      'dark-on-error': '#601410',
      'dark-error-container': '#8C1D18',
      'dark-on-error-container': '#F9DEDC',
      'dark-background': '#1C1B1F',
      'dark-on-background': '#E6E1E5',
      'dark-surface': '#1C1B1F',
      'dark-on-surface': '#E6E1E5',
      'dark-surface-variant': '#49454E',
      'dark-on-surface-variant': '#CAC4D0',
      'dark-outline': '#938F99',
      'dark-inverse-surface': '#E6E1E5',
      'dark-inverse-on-surface': '#313033',
      'dark-inverse-primary': '#6750A4',
    },
    extend: {
      borderRadius: {
        'xl': '1.0rem',
        '2xl': '1.5rem',
        '3xl': '2.0rem',
        '4xl': '2.5rem',
      },
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out forwards',
      }
    },
  },
  plugins: [],
};