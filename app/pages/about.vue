<template>
  <div class="news-portal-container" :style="{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }">
    <main class="portal-layout">
      <div class="editorial-card" :style="{ background: 'var(--color-card-bg)', borderColor: 'var(--color-border)' }">
        <span class="section-badge">OUR MISSION</span>
        <h1 class="page-title">About Atlas Report</h1>
        <p class="lead-text" :style="{ color: 'var(--color-text-secondary)' }">
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
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700;800&family=Playfair+Display:ital,wght@0,600;0,700&family=Plus+Jakarta+Sans:wght@400;600;700&display=swap');

.news-portal-container {
  background-color: var(--color-bg);
  font-family: 'Plus Jakarta Sans', sans-serif;
  min-height: 100vh;
  color: var(--color-text);
}
.portal-layout {
  padding: 3rem 2rem;
  display: flex;
  justify-content: center;
}
.editorial-card {
  max-width: 700px;
  background: var(--color-card-bg);
  border: 1px solid var(--color-border);
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
  color: var(--color-text-secondary);
  margin-bottom: 1rem;
}
</style>