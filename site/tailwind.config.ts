import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    colors: {
      /* Color Theme Swatches in Hex */
      primary: ' #F57C4C',
      red: '#F54C70',
      green: ' #4DF5A2',
      secondary: '#404040',
      grey: ' #5D5D5D',
      white: '#e6e6e6',
      gold: ' #C9B037',
      silver: ' #B4B4B4',
      bronze: ' #AD8A56',
    },
    fontFamily: {
      custom: ['var(--font-noto_Sans_Display)'],
      playfair: ['Playfair Display', 'serif'],
      sans: ['Noto Sans', 'sans-serif'],
    },
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};
export default config;
