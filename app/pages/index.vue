<template>
  <div class="content-area">
    <div class="hero-banner">
      <h1>Welcome to Our Website</h1>
      <p>Your definitive corporate compass for real-time global news, breaking insights, and comprehensive marketplace analysis.</p>
      <NuxtLink to="/about" class="btn-main">Get Started</NuxtLink>
    </div>

    <div class="services-grid">
      <div class="service-card">
        <div class="card-header">
          <h3>Global Politics</h3>
          <div class="card-icons">
            <span class="icon">&#128100;</span>
            <span class="icon">&#9993;</span>
          </div>
        </div>
        <ul class="news-list">
          <li v-for="article in politicsArticles" :key="article.id">
            <NuxtLink :to="`/news/${article.id}`">{{ article.title }}</NuxtLink>
          </li>
        </ul>
      </div>

      <div class="service-card">
        <div class="card-header">
          <h3>Market Intelligence</h3>
          <div class="card-icons">
            <span class="icon">&#128100;</span>
            <span class="icon">&#9993;</span>
          </div>
        </div>
        <ul class="news-list">
          <li v-for="article in marketArticles" :key="article.id">
            <NuxtLink :to="`/news/${article.id}`">{{ article.title }}</NuxtLink>
          </li>
        </ul>
      </div>

      <div class="service-card">
        <div class="card-header">
          <h3>Technology Pulse</h3>
          <div class="card-icons">
            <span class="icon">&#128100;</span>
            <span class="icon">&#9993;</span>
          </div>
        </div>
        <ul class="news-list">
          <li v-for="article in techArticles" :key="article.id">
            <NuxtLink :to="`/news/${article.id}`">{{ article.title }}</NuxtLink>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
const politicsArticles = [
  { id: 'trade-treaty', title: 'Breakthrough international trade treaties signed in Geneva summit.' },
  { id: 'elections-report', title: 'Elections baseline report: Shift patterns observed across major regions.' },
  { id: 'policy-analysis', title: 'Policy analysis: New environmental regulations on global shipping tracks.' }
]

const marketArticles = [
  { id: 'commodity-rally', title: 'Commodity indexes rally as tech supply networks stabilize.' },
  { id: 'quarterly-projections', title: 'Quarterly projections: Central banks signal adjusted interest pacing.' }
]

const techArticles = [
  { id: 'computing-arrays', title: 'Next-generation computing arrays complete localized grid tests.' },
  { id: 'cyber-standards', title: 'Cyber-governance standards updated for multinational entities.' }
]
</script>

<style scoped>
.content-area {
  padding: 60px 5%;
  max-width: 1200px;
  margin: 0 auto;
}

.hero-banner {
  background: linear-gradient(135deg, rgba(15,44,89,0.95) 0%, rgba(30,60,110,0.85) 100%), 
              url('https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1350&q=80');
  background-size: cover;
  background-position: center;
  color: white;
  text-align: center;
  padding: 80px 20px;
  border-radius: 8px;
  margin-bottom: 40px;
}

.hero-banner h1 {
  font-size: 2.8rem;
  margin-bottom: 15px;
  text-transform: uppercase;
}

.hero-banner p {
  font-size: 1.2rem;
  margin-bottom: 30px;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  opacity: 0.9;
}

.btn-main {
  background-color: #cc0000;
  color: white;
  padding: 12px 30px;
  text-decoration: none;
  font-weight: bold;
  border-radius: 4px;
  text-transform: uppercase;
  display: inline-block;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}

.service-card {
  border: 1px solid #dddddd;
  border-top: 4px solid #0f2c59;
  border-radius: 4px;
  padding: 25px;
  background: #f8f9fa;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  border-bottom: 1px solid #dddddd;
  padding-bottom: 10px;
}

.card-header h3 {
  color: #0f2c59;
  font-size: 1.4rem;
}

.card-icons {
  display: flex;
  gap: 10px;
  font-size: 1.2rem;
}

.news-list {
  list-style: none;
}

.news-list li {
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px dashed #e0e0e0;
}

.news-list a {
  color: #222222;
  text-decoration: none;
  transition: color 0.2s;
}

.news-list a:hover {
  color: #cc0000;
}
</style>