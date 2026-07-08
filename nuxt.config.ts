/// <reference types="node" />
import path from 'path'
import { fileURLToPath } from 'url'
import { config as loadEnv } from 'dotenv'
import tailwindcss from '@tailwindcss/vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
loadEnv({ path: path.resolve(__dirname, '.env.local') })
// Also load root .env as a fallback when .env.local is not present
loadEnv()

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // This line forces Nuxt to load your Tailwind styles on every page layout
  css: [
    '~/app.css'
  ],
  modules: [
    '@nuxtjs/supabase',
    '@vite-pwa/nuxt'
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
  compatibilityDate: '2026-06-12',
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: 'Atlas Report — Global Intelligence Feed',
      meta: [
        { name: 'description', content: 'Premium editorial coverage delivering verified reporting across geopolitics, science, and markets. Stay current with the Atlas Report feed.' },
        { name: 'keywords', content: 'news, global intelligence, geopolitics, science, technology, business, health, sports' },
        { name: 'author', content: 'Atlas Report' },
        { name: 'robots', content: 'index, follow' },
        { property: 'og:title', content: 'Atlas Report — Global Intelligence Feed' },
        { property: 'og:description', content: 'Premium editorial coverage delivering verified reporting across geopolitics, science, and markets.' },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'Atlas Report' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Atlas Report — Global Intelligence Feed' },
        { name: 'twitter:description', content: 'Premium editorial coverage delivering verified reporting across geopolitics, science, and markets.' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'canonical', href: 'https://atlasreport.com' }
      ]
    },
    pageTransition: { name: 'page', mode: 'out-in' }
  },
  pwa: {
    registerType: 'autoUpdate',
    includeAssets: ['favicon.ico', 'robots.txt', 'images/*'],
    manifest: {
      name: 'Atlas Report — Global Intelligence Feed',
      short_name: 'Atlas Report',
      description: 'Premium editorial coverage delivering verified reporting across geopolitics, science, and markets.',
      theme_color: '#0f172a',
      background_color: '#fcfbf7',
      display: 'standalone',
      orientation: 'portrait-primary',
      start_url: '/',
      icons: [
        {
          src: '/images/atlaslogo.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: '/images/atlaslogo.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable'
        }
      ]
    },
    workbox: {
      maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
      globPatterns: ['**/*.{js,css,html,png,svg,ico,woff2}'],
      runtimeCaching: [
        {
          urlPattern: /^https?:\/\/.*\/api\/.*/i,
          handler: 'NetworkFirst',
          options: {
            cacheName: 'api-cache',
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 60 * 60
            }
          }
        },
        {
          urlPattern: /^https?:\/\/.*\.(png|jpg|jpeg|webp|svg|gif|ico)$/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'image-cache',
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 60 * 60 * 24 * 7
            }
          }
        }
      ]
    }
  }
})