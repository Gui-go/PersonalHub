// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: [
//     "./index.html",
//     "./src/**/*.{js,ts,jsx,tsx}",
//   ],
//   theme: {
//     extend: {
//       fontSize: {
//         '2xs': '0.625rem',
//         'xs': '0.75rem',
//         'sm': '0.875rem',
//         'base': '1.1rem',
//         'lg': '1.25rem',
//         'xl': '1.5rem',
//         '2xl': '1.875rem',
//         '3xl': '2.25rem',
//         '4xl': '3rem',
//         '5xl': '3.75rem'
//       },
//       screens: {
//         'xs': '480px',
//         'sm': '640px',
//         'md': '768px',
//         'lg': '1024px',
//         'xl': '1280px'
//       }
//     },
//   },
//   plugins: [],
// }


module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontSize: {
        '2xs': '0.625rem',
        'xs': '0.75rem',
        'sm': '0.875rem',
        'base': '1.1rem',
        'lg': '1.25rem',   
        'xl': '1.5rem',    
        '2xl': '1.875rem', 
        '3xl': '2.25rem',  
        '4xl': '3rem',     
        '5xl': '3.75rem'   
      }
    }
  }
}