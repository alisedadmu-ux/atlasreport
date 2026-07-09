<template>
  <header :class="['header-shell sticky top-0 z-50 w-full border-b', headerVisible ? '' : 'header-hidden']" :style="{ backgroundColor: 'var(--color-header-bg)', borderColor: 'var(--color-border)' }">
    <div class="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
      <NuxtLink to="/" class="brand-link flex items-center gap-3 rounded-full bg-white/85 px-3 py-2 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur-xl sm:px-4 sm:py-3" aria-label="Home">
        <img src="/images/atlaslogo.png" alt="Atlas Logo" class="h-14 w-auto sm:h-16 lg:h-20" />
        <div class="hidden sm:flex sm:flex-col">
          <span class="text-[11px] font-black uppercase tracking-[0.32em] text-slate-700">Atlas Report</span>
          <span class="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-500">Independent Briefing</span>
        </div>
      </NuxtLink>

      <div class="flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/80 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-slate-600 shadow-sm backdrop-blur-xl sm:px-4">
        <span class="h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
        <NuxtLink to="/contact" class="transition-colors hover:text-red-700">Contact</NuxtLink>
      </div>
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
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
}
.header-hidden {
  transform: translateY(-100%);
  opacity: 0;
  pointer-events: none;
}
.brand-link {
  border: none;
}
.dark .brand-link {
  background: rgba(15, 23, 42, 0.7);
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