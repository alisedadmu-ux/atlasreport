<template>
  <div class="site-shell">
    <a href="#main-content" class="skip-link">Skip to content</a>
    <Header />
    <main class="site-main" id="main-content" role="main" tabindex="-1">
      <NuxtPage />
    </main>
    <Footer />
  </div>
</template>

<script setup></script>

<style scoped>
.site-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--color-bg);
}

.site-main {
  flex: 1;
  width: 100%;
  padding: 0 0 4rem;
}

.skip-link {
  position: absolute;
  left: 50%;
  top: -3rem;
  transform: translateX(-50%);
  z-index: 100;
  background: var(--color-text);
  color: #fff;
  padding: 0.6rem 1.1rem;
  border-radius: 0 0 0.6rem 0.6rem;
  font-size: 0.8125rem;
  font-weight: 700;
  transition: top 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.skip-link:focus {
  top: 0;
}

@media (max-width: 640px) {
  .site-main {
    padding-bottom: 2.5rem;
  }
}
</style>
