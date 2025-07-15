/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      // 👇 Add your custom screens alongside the default ones
      screens: {
        xs: '480px',   // Custom small screen (optional)
        sm: '640px',   // Tailwind default
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px'
      },
      fontSize: {
        '2xs': '0.7rem',    // Increased from 0.625rem (10px -> ~11.2px)
        'xs': '0.8rem',     // Increased from 0.75rem (12px -> ~12.8px)
        'sm': '0.9rem',     // Increased from 0.875rem (14px -> ~14.4px)
        'base': '1.25rem',  // SIGNIFICANTLY increased from 1.1rem (17.6px -> 20px)
        'lg': '1.5rem',     // Increased from 1.25rem (20px -> 24px)
        'xl': '1.75rem',    // Increased from 1.5rem (24px -> 28px)
        '2xl': '2.25rem',   // Increased from 1.875rem (30px -> 36px)
        '3xl': '2.75rem',   // Increased from 2.25rem (36px -> 44px)
        '4xl': '3.5rem',    // Increased from 3rem (48px -> 56px)
        '5xl': '4.5rem',    // Increased from 3.75rem (60px -> 72px)
        '6xl': '6rem',      // Added for even larger headings
        '7xl': '7rem',
        '8xl': '8rem',
        '9xl': '9rem'
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    // require('@tailwindcss/aspect-ratio'),

    // Add Tailwind plugins here, like:
    // require('@tailwindcss/forms'),
    // require('@tailwindcss/typography'),
    // require('@tailwindcss/aspect-ratio'),
  ]

};