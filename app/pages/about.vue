<template>
  <div class="news-app-container">
    
    <aside class="category-sidebar">
      <div class="sidebar-header">
        <span class="pulse-icon">🔴</span> liveNews
      </div>
      <nav class="category-list">
        <NuxtLink to="/" class="nav-btn">📰 Home Dashboard</NuxtLink>
        <NuxtLink to="/about" class="nav-btn active">ℹ️ About Platform</NuxtLink>
        <NuxtLink to="/contact" class="nav-btn">📞 Contact Support</NuxtLink>
      </nav>
    </aside>

    <main class="main-content">
      <header class="dashboard-header">
        <h1>About This Platform</h1>
        <p class="subtitle">Custom engineered to provide clean and user-friendly news delivery.</p>
      </header>

      <div class="info-card">
        <h3>✨ Designed for Simplicity</h3>
        <p>Traditional news sites are often cluttered with invasive ads, pop-ups, and confusing layouts that make navigating complex topics difficult. This application focuses entirely on clarity by providing an easy-to-use sidebar and a structured grid format.</p>
        
        <h3>🔌 Real-Time Cloud Integration</h3>
        <p>By connecting directly to real-time content aggregation pipelines, this platform automatically draws daily headlines from certified world networks across 15 comprehensive categories. Each selected topic includes immersive backgrounds and detailed content without overwhelming the main interface.</p>
      </div>
    </main>

  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.news-app-container {
  display: flex;
  background-color: #f8fafc;
  font-family: 'Plus Jakarta Sans', sans-serif;
  min-height: 100vh;
  color: #0f172a;
}

.category-sidebar {
  width: 280px;
  background-color: #ffffff;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 0;
  height: 100vh;
}

.sidebar-header {
  font-size: 1.5rem;
  font-weight: 800;
  padding: 2rem 1.5rem;
  color: #1e40af;
  border-bottom: 1px solid #f1f5f9;
}

.category-list {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.nav-btn {
  display: block;
  text-decoration: none;
  padding: 0.85rem 1rem;
  border-radius: 10px;
  font-weight: 600;
  color: #475569;
  font-size: 0.95rem;
  transition: all 0.2s ease;
}
.nav-btn:hover { background-color: #f1f5f9; }
.nav-btn.active { background-color: #e0f2fe; color: #0369a1; }

.main-content {
  flex: 1;
  padding: 3rem;
  overflow-y: auto;
}

.dashboard-header { margin-bottom: 2.5rem; }
.dashboard-header h1 { font-size: 2.5rem; font-weight: 800; letter-spacing: -1px; }
.subtitle { color: #64748b; font-size: 1.1rem; margin-top: 0.25rem; }

.info-card {
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 2.5rem;
  max-width: 800px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.info-card h3 {
  font-size: 1.3rem;
  font-weight: 700;
  color: #1e293b;
  margin-top: 0;
  margin-bottom: 0.75rem;
}
.info-card h3:not(:first-child) { margin-top: 2rem; }

.info-card p {
  font-size: 1.05rem;
  line-height: 1.7;
  color: #475569;
  margin: 0;
}
</style>