// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Define Ecospha Organics custom palette for an earthy, natural feel
        'eco-green-dark': '#2E473C',    // Deep, rich forest green for headings, strong accents
        'eco-green-medium': '#4A7C59',  // Primary green for buttons, highlights, links
        'eco-green-light': '#8DBE98',   // Lighter green for subtle accents, borders, backgrounds
        'eco-brown-dark': '#5A4A3C',    // Dark soft brown for primary text, strong elements
        'eco-brown-light': '#A38B7D',   // Muted beige/light brown for secondary text, subtle elements
        'eco-off-white': '#F8F5F0',     // Soft, organic white for main backgrounds
        'eco-cream': '#EDE8E0',         // Creamy tone for card backgrounds, softer than off-white
      },
      fontFamily: {
        // Using 'Lora' for serif headings to convey trust and 'Inter' for sans-serif body for clarity
        heading: ['Lora', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'eco-soft': '0 4px 12px rgba(0, 0, 0, 0.08)', // Softer, more natural shadow
        'eco-subtle': '0 2px 6px rgba(0, 0, 0, 0.05)', // Even more subtle shadow
      }
    },
  },
  plugins: [],
}
