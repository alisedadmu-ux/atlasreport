/// <reference types="node" />
import path from 'path'
import { fileURLToPath } from 'url'
import { config as loadEnv } from 'dotenv'
import { defineNuxtConfig } from 'nuxt/config'

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
    '@vite-pwa/nuxt',
    '@nuxtjs/color-mode'
  ],
  runtimeConfig: {
    stripeSecretKey: process.env.stripe_secret_key,
    public: {
      supabase: {
        url: process.env.NUXT_PUBLIC_SUPABASE_URL,
        key: process.env.NUXT_PUBLIC_SUPABASE_KEY,
        redirect: false
      },
      adminEmail: process.env.NUXT_ADMIN_EMAIL || 'alisedadmu@gmail.com',
      stripePublishableKey: process.env.stripe_publishable_key || '',
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || ''
    }
  },
  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'light'
  },
  compatibilityDate: '2026-06-12',
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      htmlAttrs: {
        lang: 'en'
      },
      title: 'Atlas Report — Global Intelligence Feed',
      meta: [
        { name: 'description', content: 'Premium editorial coverage delivering verified reporting across geopolitics, science, and markets. Stay current with the Atlas Report feed.' },
        { name: 'keywords', content: 'news, global intelligence, geopolitics, science, technology, business, health, sports' },
        { name: 'author', content: 'Atlas Report' },
        { name: 'robots', content: 'index, follow' },
        { name: 'theme-color', content: '#1E3A5F' },
        { name: 'format-detection', content: 'telephone=no' },
        { 'http-equiv': 'x-ua-compatible', content: 'IE=edge' },
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
        { rel: 'canonical', href: 'https://atlasreport.com' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Source+Serif+4:opsz,wght@8..60,400;8..60,600;8..60,700&display=swap' }
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
      theme_color: '#1E3A5F',
      background_color: '#F4F1EB',
      display: 'standalone',
      orientation: 'portrait-primary',
      start_url: '/',
      icons: [
        {
          src: '/images/atlasreport.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: '/images/atlasreport.png',
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