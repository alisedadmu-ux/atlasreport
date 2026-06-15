<template>
  <div class="news-portal-container">
    <nav class="portal-nav">
      <div class="primary-nav-links">
        <NuxtLink to="/" class="nav-brand-link">◀ ATLAS REPORT</NuxtLink>
      </div>
      <div class="utility-nav-links">
        <NuxtLink to="/" class="util-link">Home Dashboard</NuxtLink>
        <NuxtLink to="/about" class="util-link active">About</NuxtLink>
        <NuxtLink to="/contact" class="util-link">Contact</NuxtLink>
      </div>
    </nav>

    <main class="portal-layout">
      <div class="editorial-card">
        <span class="section-badge">OUR MISSION</span>
        <h1 class="page-title">About Atlas Report</h1>
        <p class="lead-text">
          Atlas Report is an advanced global intelligence feed designed to deliver clean, 
          real-time news insights across key international sectors.
        </p>
        <div class="content-body">
          <p>
            By leveraging high-performance data processing pipelines, our platform organizes complex global dispatches 
            into a highly structured, readable, and objective format. 
          </p>
          <p>
            Built entirely using the Nuxt framework and powered by real-time newsroom APIs, Atlas Report provides 
            unfiltered transparency for modern research, academic review, and everyday global awareness.
          </p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
definePageMeta({
  layout: false
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700;800&family=Playfair+Display:ital,wght@0,600;0,700&family=Plus+Jakarta+Sans:wght@400;600;700&display=swap');

.news-portal-container {
  background-color: #fcfbf7;
  font-family: 'Plus Jakarta Sans', sans-serif;
  min-height: 100vh;
  color: #111111;
}
.portal-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e5e5e5;
  margin: 0 2rem;
}
.nav-brand-link {
  font-family: 'Cinzel', serif;
  text-decoration: none;
  color: #a30000;
  font-weight: 800;
  font-size: 1.1rem;
}
.util-link {
  text-decoration: none;
  color: #666666;
  font-size: 0.9rem;
  margin-left: 1.5rem;
  font-weight: 600;
}
.util-link.active {
  color: #a30000;
}
.portal-layout {
  padding: 3rem 2rem;
  display: flex;
  justify-content: center;
}
.editorial-card {
  max-width: 700px;
  background: #ffffff;
  border: 1px solid #e5e5e5;
  padding: 3rem;
}
.section-badge {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 1px;
  color: #a30000;
}
.page-title {
  font-family: 'Playfair Display', serif;
  font-size: 2.5rem;
  margin: 0.5rem 0 1.5rem;
}
.lead-text {
  font-family: 'Playfair Display', serif;
  font-size: 1.25rem;
  font-style: italic;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  color: #333333;
}
.content-body p {
  font-size: 1rem;
  line-height: 1.7;
  color: #555555;
  margin-bottom: 1rem;
}
</style>