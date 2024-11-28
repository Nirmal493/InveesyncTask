/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'custom-blue': '#1E40AF',
        'custom-gray': '#F3F4F6',
      },
      spacing: {
        '128': '32rem',  // Example of adding a custom spacing value
        '144': '36rem',  // Another example for larger spacing
      },
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],  // Adding custom font
      },
      screens: {
        'sm': '480px',   // Small screens start from 480px
        'md': '768px',   // Medium screens from 768px
        'lg': '1024px',  // Large screens from 1024px
        'xl': '1280px',  // Extra large screens from 1280px
        '2xl': '1536px', // Even larger screens from 1536px
      },
      boxShadow: {
        'custom': '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',  // Adding a custom shadow
      },
    },
  },
  plugins: [
    // Example of including custom Tailwind plugins
    require('@tailwindcss/forms'),   // This plugin improves form elements' default styling
    require('@tailwindcss/typography'),  // For better typography styles (if you're working with rich text content)
    require('@tailwindcss/aspect-ratio')  // For aspect ratio utilities (helpful for responsive images)
  ],
}
