<template>
  <header :class="['header-shell w-full border-b sticky top-0 z-50', headerVisible ? '' : 'header-hidden']" :style="{ backgroundColor: 'var(--color-header-bg)', borderColor: 'var(--color-border)' }">
    <div class="max-w-7xl mx-auto px-6">
      <div class="flex items-center justify-between py-3 text-[11px] uppercase tracking-[0.25em]" :style="{ color: 'var(--color-text-muted)' }">
        <NuxtLink to="/"><img src="/images/atlaslogo.png" alt="Atlas Logo" class="h-[150px] w-auto" /></NuxtLink>
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
            to="/search"
            :class="['header-nav-link', { 'header-nav-link-active': route.path === '/search' }]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 inline-block mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
            </svg>
            Search
          </NuxtLink>
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
        <NuxtLink to="/" class="font-serif text-4xl md:text-5xl font-black tracking-[0.08em]" :style="{ color: 'var(--color-text)' }">ATLAS REPORT</NuxtLink>
        <p class="mt-2 text-xs uppercase tracking-[0.35em]" :style="{ color: 'var(--color-text-muted)' }">Global Intelligence Feed</p>
      </div>

      <nav class="flex flex-wrap justify-center gap-4 border-t pt-4 pb-5 text-xs uppercase tracking-[0.2em]" :style="{ borderColor: 'var(--color-border)', color: 'var(--color-text-secondary)' }">
        <NuxtLink to="/search" class="hover:text-slate-900 transition-colors" :style="{ color: 'var(--color-text-muted)' }">All News</NuxtLink>
        <NuxtLink to="/archives" class="hover:text-slate-900 transition-colors" :style="{ color: 'var(--color-text-muted)' }">Archives</NuxtLink>
        <NuxtLink to="/community" class="hover:text-slate-900 transition-colors" :style="{ color: 'var(--color-text-muted)' }">Community</NuxtLink>
        <NuxtLink to="/about" class="hover:text-slate-900 transition-colors" :style="{ color: 'var(--color-text-muted)' }">About</NuxtLink>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

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
  background: rgba(15, 23, 42, 0.05);
}
.header-nav-link-active {
  color: #0f172a;
  background: rgba(15, 23, 42, 0.1);
  border-color: rgba(148, 163, 184, 0.25);
}
.dark .header-nav-link {
  color: #94a3b8;
}
.dark .header-nav-link:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #f1f5f9;
}
.dark .header-nav-link-active {
  color: #f1f5f9;
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(148, 163, 184, 0.25);
}
</style>