import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#17211f',
        mint: '#0f766e',
        lime: '#b7e46c',
        paper: '#f4f7f6',
      },
    },
  },
  plugins: [],
};

export default config;
