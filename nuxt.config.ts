import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // This line forces Nuxt to load your Tailwind styles on every page layout
  css: [
    '~/app.css'
  ],
  vite: {
    plugins: [
      tailwindcss()
    ]
  },
  compatibilityDate: '2026-06-12'
})