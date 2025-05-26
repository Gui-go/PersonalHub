import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
  },
  plugins: [react()],
  css: {
    postcss: {
      plugins: [
        require('tailwindcss'),
        require('autoprefixer')
      ],
    },
  }
})

// // // export default {
// // //   root: '.',
// // //   publicDir: 'public',
// // //   server: {
// // //     port: 3000,
// // //   },
// // // };

// // // vite.config.js
// // import { defineConfig } from 'vite'
// // import react from '@vitejs/plugin-react'

// export default defineConfig({
//   root: '.',
//   publicDir: 'public',
//   server: {
//     port: 3000,
//   },
//   plugins: [react()],
//   // Add this if you have CSS issues:
//   css: {
//     postcss: {
//       plugins: [require('tailwindcss'), require('autoprefixer')],
//     },
//   }
// })




// // import { defineConfig } from 'vite'
// // import react from '@vitejs/plugin-react'

// // export default defineConfig({
// //   plugins: [react()],
// //   css: {
// //     postcss: {
// //       plugins: [
// //         require('tailwindcss'),
// //         require('autoprefixer')
// //       ],
// //     },
// //   }
// // })