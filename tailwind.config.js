/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    fontFamily: {
      primary: ['Orbitron', 'sans-serif'], // Used for headings or important text
      secondary: ['Rajdhani', 'sans-serif'], // Used for body text
      inter: ['Inter', 'sans-serif'], // Modern font for specific sections
    },
    extend: {
      colors: {
        lightBlue: '#e4ecfa', // Start of gradient background
        lightYellow: '#fefae0', // End of gradient background
        primary: '#1e3a8a', // Primary blue for buttons or key elements
        secondary: '#6b7280', // Neutral gray for secondary elements
      },
      backgroundImage: {
        gradient: 'linear-gradient(to bottom, #e4ecfa, #fefae0)', // Custom gradient background
      },
      borderRadius: {
        card: '1.875rem', // For rounded cards
        button: '0.625rem', // For rounded buttons
      },
      boxShadow: {
        card: '0 4px 6px rgba(0, 0, 0, 0.1)', // Subtle shadow for cards
        modal: '8px 8px 10px rgba(0, 0, 0, 0.4)', // Stronger shadow for modals
      },
      spacing: {
        cardPadding: '2rem', // Consistent padding for cards
        inputSpacing: '1.5rem', // Consistent spacing for input fields
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'), // Clean form styling
    require('@tailwindcss/typography'), // Enhanced typography
  ],
};
