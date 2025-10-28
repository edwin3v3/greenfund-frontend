/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#22c55e',       // A vibrant green (green-500)
        'secondary': '#3b82f6',     // A calm blue (blue-500)
        'accent': '#f97316',        // Orange for highlights
        'background': '#f8fafc',    // Very light gray (slate-50)
        'surface': '#ffffff',       // White for cards
        'text-primary': '#1e293b',  // Dark gray/charcoal (slate-800)
        'text-secondary': '#64748b', // Lighter gray (slate-500)
      },
    },
  },
  plugins: [],
