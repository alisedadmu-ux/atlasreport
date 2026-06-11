// nuxt.config.ts
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2026-06-11',

  // Ensure your custom root style path is loaded
  css: [
    './styles/main.css'
  ],

  // Inject the Tailwind v4 compiler into the Vite build engine
  vite: {
    plugins: [
      tailwindcss()
    ]
  },

  future: {
    compatibilityVersion: 4,
  }
})