<template>
  <header :class="['header-shell sticky top-0 z-50 w-full border-b', headerVisible ? '' : 'header-hidden']" :style="{ backgroundColor: 'var(--color-header-bg)', borderColor: 'var(--color-border)' }">
    <div class="mx-auto flex max-w-7xl items-center justify-start px-4 py-3 sm:px-6 lg:px-8">
      <NuxtLink to="/" class="brand-link flex items-center justify-center rounded-full border border-white/70 bg-white/80 px-4 py-3 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md sm:px-5 sm:py-4" aria-label="Home">
        <img src="/images/atlaslogo.png" alt="Atlas Logo" class="h-16 w-auto sm:h-20 lg:h-24" />
      </NuxtLink>
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
  border-color: rgba(148, 163, 184, 0.25);
}
.dark .brand-link {
  background: rgba(15, 23, 42, 0.7);
  border-color: rgba(148, 163, 184, 0.25);
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