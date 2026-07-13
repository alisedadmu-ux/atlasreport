<template>
  <header
    :class="['nav-shell', { 'nav-hidden': !headerVisible, 'nav-scrolled': scrolled }]"
    role="banner"
  >
    <div class="site-container">
      <div class="nav-inner">
        <NuxtLink to="/" class="brand" aria-label="Atlas Report — Home">
          <img src="/images/atlaslogo.png" alt="Atlas Report" class="brand-logo-img" />
        </NuxtLink>

        <nav class="nav-links hidden md:flex" aria-label="Primary navigation">
          <NuxtLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            class="nav-link"
            active-class="nav-link-active"
            :exact-active-class="link.to === '/' ? 'nav-link-active' : ''"
          >
            {{ link.label }}
          </NuxtLink>
        </nav>

        <div class="nav-actions">
          <NuxtLink to="/search" class="nav-icon-btn" aria-label="Search articles">
            <Search class="nav-icon" />
          </NuxtLink>
          <button
            @click="toggleColorMode"
            class="nav-icon-btn"
            :aria-label="colorMode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
          >
            <Sun v-if="colorMode === 'dark'" class="nav-icon" />
            <Moon v-else class="nav-icon" />
          </button>
          <NuxtLink v-if="user" to="/profile" class="nav-avatar" :aria-label="user.email || 'Profile'">
            <span class="avatar-initials">{{ userInitials }}</span>
          </NuxtLink>
          <NuxtLink v-if="!user" to="/auth" class="btn btn-primary btn-sm nav-signin">
            Sign in
          </NuxtLink>
          <button
            class="md:hidden nav-burger"
            @click="mobileOpen = !mobileOpen"
            :aria-expanded="mobileOpen"
            aria-label="Toggle navigation menu"
          >
            <Menu v-if="!mobileOpen" class="nav-icon" />
            <X v-else class="nav-icon" />
          </button>
        </div>
      </div>

      <!-- Mobile Menu -->
      <transition name="nav-mobile">
        <div v-if="mobileOpen" class="mobile-menu" role="navigation" aria-label="Mobile navigation">
          <div class="mobile-links">
            <NuxtLink
              v-for="link in navLinks"
              :key="link.to"
              :to="link.to"
              class="mobile-link"
              @click="mobileOpen = false"
            >
              <span class="mobile-link-text">{{ link.label }}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mobile-link-arrow">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </NuxtLink>
          </div>
          <div class="mobile-divider"></div>
          <div class="mobile-actions">
            <NuxtLink
              v-if="user"
              to="/profile"
              class="mobile-user"
              @click="mobileOpen = false"
            >
              <span class="avatar-initials mobile-avatar-initials">{{ userInitials }}</span>
              <div class="mobile-user-info">
                <span class="mobile-user-name">{{ user.user_metadata?.display_name || 'Reader' }}</span>
                <span class="mobile-user-email">{{ user.email }}</span>
              </div>
            </NuxtLink>
            <NuxtLink v-if="!user" to="/auth" class="btn btn-primary w-full" @click="mobileOpen = false">
              Sign in
            </NuxtLink>
            <button v-if="user" @click="handleSignOut" class="btn btn-ghost w-full">
              <LogOut class="nav-icon" />
              Sign out
            </button>
          </div>
        </div>
      </transition>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onBeforeUnmount, onMounted } from 'vue'
import { Search, Menu, X, Sun, Moon, LogOut } from '@lucide/vue'

const user = useSupabaseUser()
const supabase = useSupabaseClient()
const colorMode = useColorMode()
const headerVisible = ref(true)
const scrolled = ref(false)
const mobileOpen = ref(false)
let lastScrollY = 0

const toggleColorMode = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/search', label: 'Search' },
  { to: '/archives', label: 'Archives' },
  { to: '/community', label: 'Community' },
  { to: '/about', label: 'About' }
]

const userInitials = computed(() => {
  const name = user.value?.user_metadata?.display_name || user.value?.email || 'AR'
  return name.split(/[ @._-]/).filter(Boolean).slice(0, 2).map(p => p.charAt(0).toUpperCase()).join('') || 'AR'
})

const handleScroll = () => {
  const currentScrollY = window.scrollY
  scrolled.value = currentScrollY > 10
  const shouldShow = currentScrollY <= 80 || currentScrollY < lastScrollY - 6
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

const handleSignOut = async () => {
  mobileOpen.value = false
  await supabase.auth.signOut()
  await navigateTo('/')
}
</script>

<style scoped>
.nav-shell {
  position: sticky;
  top: 0;
  z-index: 50;
  width: 100%;
  background: var(--color-header-bg);
  backdrop-filter: saturate(180%) blur(20px);
  -webkit-backdrop-filter: saturate(180%) blur(20px);
  border-bottom: 1px solid transparent;
  transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease;
}

.nav-scrolled {
  border-bottom-color: var(--color-border);
  box-shadow: var(--shadow-sm);
}

.nav-hidden {
  transform: translateY(-100%);
  opacity: 0;
  pointer-events: none;
}

.nav-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  padding: 0.75rem 0;
}

/* Brand */
.brand {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  flex-shrink: 0;
  text-decoration: none;
}

.brand-logo-img {
  display: block;
  width: 120px;
  height: auto;
  flex-shrink: 0;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.brand:hover .brand-logo-img {
  transform: scale(1.04) rotate(-1deg);
}

/* Nav Links */
.nav-links {
  gap: 0.15rem;
  align-items: center;
}

.nav-link {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 0.85rem;
  border-radius: var(--radius-sm);
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-text-secondary);
  border: 1px solid transparent;
  transition: all 0.2s ease;
  position: relative;
  text-decoration: none;
}

.nav-link:hover {
  color: var(--color-text);
  background: var(--color-bg-alt);
}

.nav-link-active {
  color: var(--color-accent);
  background: var(--color-accent-subtle);
  font-weight: 700;
}

/* Actions */
.nav-actions {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.nav-icon {
  width: 18px;
  height: 18px;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  transition: transform 0.2s ease;
}

.nav-icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: var(--radius-sm);
  color: var(--color-text-secondary);
  border: 1px solid transparent;
  background: transparent;
  transition: all 0.2s ease;
}

.nav-icon-btn:hover {
  color: var(--color-text);
  background: var(--color-bg-alt);
  border-color: var(--color-border);
}

.nav-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 9999px;
  background: var(--color-accent);
  color: #fff;
  font-size: 0.6875rem;
  font-weight: 800;
  transition: all 0.2s ease;
  overflow: hidden;
  border: 2px solid transparent;
}

.nav-avatar:hover {
  transform: scale(1.05);
  border-color: var(--color-accent-light);
}

.avatar-initials {
  line-height: 1;
}

.nav-signin {
  margin-left: 0.25rem;
}

/* Mobile burger */
.nav-burger {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: var(--radius-sm);
  color: var(--color-text-secondary);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.nav-burger:hover {
  background: var(--color-bg-alt);
  color: var(--color-text);
}

/* Mobile Menu */
.mobile-menu {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.5rem 0 1.25rem;
  border-top: 1px solid var(--color-border);
  animation: mobileSlideIn 0.25s ease;
}

@keyframes mobileSlideIn {
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
}

.mobile-links {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.mobile-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 0.75rem;
  border-radius: var(--radius-sm);
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--color-text);
  transition: all 0.2s ease;
  text-decoration: none;
}

.mobile-link:hover,
.mobile-link:active {
  background: var(--color-accent-subtle);
  color: var(--color-accent);
}

.mobile-link-arrow {
  color: var(--color-text-muted);
  opacity: 0;
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.mobile-link:hover .mobile-link-arrow {
  opacity: 1;
  transform: translateX(2px);
}

.mobile-divider {
  height: 1px;
  background: var(--color-border);
  margin: 0.25rem 0;
}

.mobile-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.mobile-user {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.65rem 0.75rem;
  border-radius: var(--radius-sm);
  transition: background-color 0.2s ease;
  text-decoration: none;
}

.mobile-user:hover {
  background: var(--color-bg-alt);
}

.mobile-avatar-initials {
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  background: var(--color-accent);
  color: #fff;
  font-size: 0.75rem;
  font-weight: 800;
  flex-shrink: 0;
}

.mobile-user-info {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  min-width: 0;
}

.mobile-user-name {
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--color-text);
}

.mobile-user-email {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Transitions */
.nav-mobile-enter-active,
.nav-mobile-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.nav-mobile-enter-from,
.nav-mobile-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

@media (max-width: 640px) {
  .nav-inner {
    padding: 0.6rem 0;
  }
}
</style>