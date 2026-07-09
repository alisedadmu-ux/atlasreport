<template>
  <div class="site-shell">
    <Header />
    <main class="site-main">
      <div class="news-portal-container">
        <slot />
      </div>
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
  background: linear-gradient(180deg, #fcfbf7 0%, #f7efe2 100%);
}

.site-main {
  flex: 1;
  width: 100%;
  padding: 0 1rem 3.5rem;
}

.news-portal-container {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
}

@media (max-width: 640px) {
  .site-main {
    padding: 0 0.8rem 2.5rem;
  }
}
</style>