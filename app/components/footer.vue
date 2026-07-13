<template>
  <footer class="footer-shell">
    <div class="site-container">
      <div class="footer-grid">
        <div class="footer-brand">
          <NuxtLink to="/" aria-label="Atlas Report — Home" class="footer-logo">
            <img src="/images/atlaslogo.png" alt="Atlas Report" class="footer-logo-img" />
          </NuxtLink>
          <p class="footer-desc">
            Premium editorial coverage delivering verified reporting across geopolitics, science, and markets.
          </p>
          <div class="footer-social">
            <span class="footer-social-link footer-social-link-disabled" aria-disabled="true" title="Coming soon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 11a9 9 0 0 1 9 9"/><path d="M4 4a16 16 0 0 1 16 16"/><circle cx="5" cy="19" r="1"/></svg>
            </span>
            <span class="footer-social-link footer-social-link-disabled" aria-disabled="true" title="Coming soon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
            </span>
          </div>
        </div>

        <div class="footer-col">
          <h4 class="footer-heading">Sections</h4>
          <ul class="footer-list">
            <li v-for="link in sections" :key="link.to">
              <NuxtLink :to="link.to" class="footer-link">{{ link.label }}</NuxtLink>
            </li>
          </ul>
        </div>

        <div class="footer-col">
          <h4 class="footer-heading">Account</h4>
          <ul class="footer-list">
            <li v-for="link in account" :key="link.to">
              <NuxtLink :to="link.to" class="footer-link">{{ link.label }}</NuxtLink>
            </li>
          </ul>
        </div>

        <div class="footer-col">
          <h4 class="footer-heading">Stay informed</h4>
          <NewsletterSubscribe />
        </div>
      </div>

      <div class="footer-bottom">
        <p class="footer-copyright">&copy; {{ currentYear }} Atlas Report. All rights reserved.</p>
        <div class="footer-legal">
          <NuxtLink to="/privacy">Privacy</NuxtLink>
          <span class="footer-legal-dot">·</span>
          <NuxtLink to="/terms">Terms</NuxtLink>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
const currentYear = computed(() => new Date().getFullYear())

const sections = [
  { to: '/', label: 'Home' },
  { to: '/search', label: 'Search' },
  { to: '/archives', label: 'Archives' },
  { to: '/community', label: 'Community' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' }
]

const account = [
  { to: '/profile', label: 'Profile' },
  { to: '/auth', label: 'Sign in' },
  { to: '/privacy', label: 'Privacy Policy' },
  { to: '/terms', label: 'Terms of Service' }
]
</script>

<style scoped>
.footer-shell {
  width: 100%;
  border-top: 1px solid var(--color-border);
  background: var(--color-footer-bg);
  padding: 4rem 0 0;
  margin-top: auto;
}

.footer-grid {
  display: grid;
  grid-template-columns: 1.5fr repeat(3, minmax(0, 1fr));
  gap: 2.5rem;
  padding-bottom: 2.5rem;
  border-bottom: 1px solid var(--color-border);
}

.footer-brand {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-right: 1rem;
}

.footer-logo {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  width: fit-content;
  text-decoration: none;
}

.footer-logo-img {
  display: block;
  width: 120px;
  height: auto;
  flex-shrink: 0;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.footer-logo:hover .footer-logo-img {
  transform: scale(1.04) rotate(-1deg);
}

.footer-desc {
  font-size: 0.875rem;
  line-height: 1.7;
  color: var(--color-text-secondary);
  max-width: 300px;
}

.footer-social {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.25rem;
}

.footer-social-link-disabled {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: var(--radius-sm);
  color: var(--color-text-muted);
  border: 1px solid var(--color-border);
  opacity: 0.5;
  cursor: not-allowed;
  transition: all 0.2s ease;
}

.footer-col {
  display: flex;
  flex-direction: column;
}

.footer-heading {
  font-size: 0.6875rem;
  font-weight: 800;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--color-text);
  margin-bottom: 1.25rem;
}

.footer-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.footer-link {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-secondary);
  display: inline-block;
  padding: 0.2rem 0;
  transition: all 0.2s ease;
  text-decoration: none;
  position: relative;
}

.footer-link::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 0;
  height: 1px;
  background: var(--color-accent);
  transition: width 0.2s ease;
}

.footer-link:hover {
  color: var(--color-accent);
}

.footer-link:hover::after {
  width: 100%;
}

.footer-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 0;
}

.footer-copyright {
  font-size: 0.8125rem;
  color: var(--color-text-muted);
}

.footer-legal {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.footer-legal a {
  font-size: 0.8125rem;
  color: var(--color-text-muted);
  transition: color 0.2s ease;
  text-decoration: none;
}

.footer-legal a:hover {
  color: var(--color-text);
}

.footer-legal-dot {
  color: var(--color-border);
  font-size: 0.75rem;
}

@media (max-width: 1024px) {
  .footer-grid {
    grid-template-columns: 1fr 1fr;
    gap: 2.5rem 2rem;
  }
}

@media (max-width: 640px) {
  .footer-shell {
    padding-top: 2.5rem;
  }

  .footer-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .footer-bottom {
    flex-direction: column;
    gap: 0.75rem;
    text-align: center;
  }
}
</style>