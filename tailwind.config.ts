import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1e3a5f',
        accent: '#2563eb',
        success: '#16a34a',
        background: '#f8fafc',
      },
    },
  },
  plugins: [],
};

export default config;
