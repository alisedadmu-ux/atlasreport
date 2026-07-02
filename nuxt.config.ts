/// <reference types="node" />
import path from 'path'
import { fileURLToPath } from 'url'
import { config as loadEnv } from 'dotenv'
import tailwindcss from '@tailwindcss/vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
loadEnv({ path: path.resolve(__dirname, '.env.local') })

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // This line forces Nuxt to load your Tailwind styles on every page layout
  css: [
    '~/app.css'
  ],
  modules: [
    '@nuxtjs/supabase'
  ],
  runtimeConfig: {
    public: {
      supabase: {
        url: process.env.NUXT_PUBLIC_SUPABASE_URL,
        key: process.env.NUXT_PUBLIC_SUPABASE_KEY,
        redirect: false
      }
    }
  },
  vite: {
    plugins: [
      tailwindcss()
    ]
  },
  compatibilityDate: '2026-06-12'
})