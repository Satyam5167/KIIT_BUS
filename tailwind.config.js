export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563EB', // Blue
        secondary: '#0F172A', // Dark
        accent: '#10B981', // Green
        background: '#F8FAFC',
        surface: '#FFFFFF',
        dark: '#0F172A', // Keeping legacy 'dark' mapping just in case, but mapped to new secondary
        slate: '#E2E8F0', // Updated slate
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card': '0 0 0 1px rgba(0, 0, 0, 0.05), 0 2px 4px rgba(0, 0, 0, 0.1)',
      }
    },
  },
  plugins: [],
}
