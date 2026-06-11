// nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: '2026-06-11',

  // Tailwind v4 uses Vite integration directly instead of Nuxt modules!
  vite: {
    plugins: [
      // If your starter project needs explicit registration, it happens here.
      // But usually Tailwind v4 hooks into Nuxt 4 directly via your main CSS file.
    ]
  },

  future: {
    compatibilityVersion: 4,
  }
})