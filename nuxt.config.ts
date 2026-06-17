import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // This line forces Nuxt to load your Tailwind styles on every page layout
  css: [
    '~/app.css'
  ],
  modules: [
    '@nuxtjs/supabase'
  ],
  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY,
    redirect: false
  },
  vite: {
    plugins: [
      tailwindcss()
    ]
  },
  compatibilityDate: '2026-06-12'
})