<template>
  <header :class="['header-shell', { 'header-hidden': !headerVisible }]" class="w-full bg-white border-b border-slate-200 sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-6">
      <div class="flex items-center justify-between py-3 text-[11px] uppercase tracking-[0.25em] text-slate-500">
        <span>{{ today }}</span>
        <div class="flex items-center gap-4">
          <NuxtLink
            to="/"
            :class="['header-nav-link', { 'header-nav-link-active': route.path === '/' }]"
          >Home</NuxtLink>
          <NuxtLink
            to="/about"
            :class="['header-nav-link', { 'header-nav-link-active': route.path === '/about' }]"
          >About</NuxtLink>
          <NuxtLink
            to="/contact"
            :class="['header-nav-link', { 'header-nav-link-active': route.path === '/contact' }]"
          >Contact</NuxtLink>
          <NuxtLink
            to="/community"
            :class="['header-nav-link', { 'header-nav-link-active': route.path === '/community' }]"
          >Community</NuxtLink>
          <NuxtLink
            v-if="user"
            to="/profile"
            :class="['header-nav-link', { 'header-nav-link-active': route.path === '/profile' }]"
          >Profile</NuxtLink>
          <NuxtLink
            to="/auth"
            :class="['header-nav-link', { 'header-nav-link-active': route.path === '/auth' }]"
          >{{ user ? 'Account' : 'Login' }}</NuxtLink>
        </div>
      </div>

      <div class="flex flex-col items-center py-6">
        <NuxtLink to="/" class="font-serif text-4xl md:text-5xl font-black tracking-[0.08em] text-slate-900">ATLAS REPORT</NuxtLink>
        <p class="mt-2 text-xs uppercase tracking-[0.35em] text-slate-500">Global Intelligence Feed</p>
      </div>

      <nav class="flex flex-wrap justify-center gap-4 border-t border-slate-200 pt-4 pb-5 text-xs uppercase tracking-[0.2em] text-slate-600">
        <a href="#" class="hover:text-slate-900 transition-colors">World</a>
        <a href="#" class="hover:text-slate-900 transition-colors">U.S.</a>
        <a href="#" class="hover:text-slate-900 transition-colors">Politics</a>
        <a href="#" class="hover:text-slate-900 transition-colors">Business</a>
        <a href="#" class="hover:text-slate-900 transition-colors">Opinion</a>
        <a href="#" class="hover:text-slate-900 transition-colors">Science</a>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const today = new Date().toLocaleDateString(undefined, {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
  year: 'numeric'
})

const route = useRoute()
const user = useSupabaseUser()
const headerVisible = ref(true)
let lastScrollY = 0

const handleScroll = () => {
  const currentScrollY = window.scrollY
  const shouldShow = currentScrollY <= 90 || currentScrollY < lastScrollY - 8

  if (shouldShow !== headerVisible.value) {
    headerVisible.value = shouldShow
  }

  lastScrollY = currentScrollY
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  handleScroll()
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.header-shell {
  transition: transform 0.25s ease, opacity 0.25s ease;
}
.header-hidden {
  transform: translateY(-100%);
  opacity: 0;
  pointer-events: none;
}
.header-nav-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.65rem 0.95rem;
  border-radius: 9999px;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #475569;
  text-decoration: none;
  border: 1px solid transparent;
  transition: color 0.2s ease, background-color 0.2s ease, border-color 0.2s ease;
}
.header-nav-link:hover {
  color: #0f172a;
  background: rgba(15, 23, 42, 0.05);
}
.header-nav-link-active {
  color: #0f172a;
  background: rgba(15, 23, 42, 0.1);
  border-color: rgba(148, 163, 184, 0.25);
}
</style>
