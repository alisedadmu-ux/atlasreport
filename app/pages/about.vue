<template>
  <div class="about-page">
    <div class="site-container">
      <div class="about-hero fade-in-up">
        <NuxtLink to="/" class="about-logo" aria-label="Atlas Report — Home">
          <img src="/images/atlasreport.png" alt="Atlas Report" class="about-logo-img" />
        </NuxtLink>
        <p class="eyebrow">Our Mission</p>
        <h1 class="about-title">About Atlas Report</h1>
        <p class="about-lead">
          Atlas Report is an advanced global intelligence feed designed to deliver clean, real-time news insights across key international sectors.
        </p>
      </div>

      <div class="about-body reading-width">
        <p>
          By leveraging high-performance data processing pipelines, our platform organizes complex global dispatches into a highly structured, readable, and objective format.
        </p>
        <p>
          Built entirely using the Nuxt framework and powered by real-time newsroom APIs, Atlas Report provides unfiltered transparency for modern research, academic review, and everyday global awareness.
        </p>
      </div>

      <div class="about-values">
        <div class="value-item fade-in-up stagger-1">
          <span class="value-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
          </span>
          <h3 class="value-title">Verified reporting</h3>
          <p class="value-desc">Curated from trusted sources with editorial oversight.</p>
        </div>
        <div class="value-item fade-in-up stagger-2">
          <span class="value-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
          </span>
          <h3 class="value-title">Global perspective</h3>
          <p class="value-desc">Coverage spanning geopolitics, science, markets, and culture.</p>
        </div>
        <div class="value-item fade-in-up stagger-3">
          <span class="value-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </span>
          <h3 class="value-title">Community driven</h3>
          <p class="value-desc">A thoughtful space for readers to discuss and share perspectives.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.about-page {
  padding: 2rem 0;
  min-height: calc(100vh - 88px);
}

.about-hero {
  max-width: 760px;
  margin: 0 auto 2.5rem;
  padding: 2.5rem 2.25rem 2rem;
  border: 1px solid var(--color-border);
  border-top: 3px solid var(--color-accent);
  border-radius: var(--radius-xl);
  background: var(--color-card-bg);
  box-shadow: var(--shadow-xs);
  display: flex;
  flex-direction: column;
  gap: 1.35rem;
  position: sticky;
  top: 88px;
  z-index: 10;
}

.about-logo {
  display: inline-flex;
  width: fit-content;
}

.about-logo-img {
  width: 120px;
  height: auto;
  object-fit: contain;
}

.about-title {
  font-family: var(--font-serif);
  font-size: clamp(1.75rem, 3.5vw, 2.25rem);
  line-height: 1.15;
  margin: 0.25rem 0 0;
}

.about-lead {
  font-size: 1.0625rem;
  line-height: 1.7;
  color: var(--color-text-secondary);
}

.about-body {
  max-width: 720px;
  margin: 0 auto 2.5rem;
  font-size: 1rem;
  line-height: 1.8;
  color: var(--color-text);
}

.about-body p {
  margin-bottom: 1.1rem;
}

.about-body p:last-child {
  margin-bottom: 0;
}

.about-values {
  max-width: 760px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.5rem;
}

.value-item {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.value-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: var(--radius-sm);
  background: var(--color-accent);
  color: #fff;
  border: none;
}

.value-title {
  font-size: 0.9375rem;
  font-weight: 800;
  color: var(--color-text);
}

.value-desc {
  font-size: 0.875rem;
  line-height: 1.6;
  color: var(--color-text-secondary);
}

@media (max-width: 640px) {
  .about-hero {
    padding: 1.75rem 1.25rem;
    gap: 1.1rem;
    position: static;
  }

  .about-values {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }
}
</style>
