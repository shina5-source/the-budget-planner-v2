import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class', // Enable dark mode based on class
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './contexts/**/*.{js,ts,jsx,tsx,mdx}', // Added contexts directory for scanning
  ],
  theme: {
    extend: {
      colors: {
        // Color definitions will be handled by CSS variables set from the theme context
      },
    },
  },
  plugins: [],
};
export default config;
