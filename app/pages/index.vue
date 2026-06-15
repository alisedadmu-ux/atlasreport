<template>
  <div class="news-app-container">
    
    <aside class="category-sidebar">
      <div class="sidebar-header">
        <span class="pulse-icon">🔴</span> liveNews
      </div>
      <nav class="category-list">
        <button 
          v-for="cat in categories" 
          :key="cat.id" 
          :class="{ active: currentCategory === cat.id }"
          @click="selectCategory(cat.id)"
        >
          <span class="cat-emoji">{{ cat.emoji }}</span>
          <span class="cat-name">{{ cat.name }}</span>
        </button>
      </nav>
    </aside>

    <main class="main-content">
      <header class="dashboard-header">
        <h1>Explore {{ activeCategoryName }}</h1>
        <p class="subtitle">Showing the top 10 fresh topics updated for today</p>
      </header>

      <div v-if="isLoading" class="loading-state">
        <div class="spinner"></div>
        <p>Fetching real-time updates...</p>
      </div>

      <div v-else-if="errorMessage" class="error-state">
        <p>⚠️ {{ errorMessage }}</p>
        <button @click="fetchNews">Try Again</button>
      </div>

      <div v-else class="articles-grid">
        <div 
          v-for="(article, index) in articles" 
          :key="index" 
          class="article-card"
          @click="openArticle(article)"
        >
          <div class="card-image-wrapper">
            <img 
              :src="article.image || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=600'" 
              alt="News Banner" 
              class="card-img"
            />
            <span class="source-tag">{{ article.author || 'Global News' }}</span>
          </div>
          <div class="card-body">
            <span class="topic-counter">TOPIC #{{ index + 1 }}</span>
            <h3 class="article-title">{{ article.title }}</h3>
            <p class="article-snippet">{{ truncateText(article.description, 100) }}</p>
            <div class="card-footer">
              <span class="read-more-lbl">Read Full Coverage ➔</span>
            </div>
          </div>
        </div>
      </div>
    </main>

    <div v-if="selectedArticle" class="modal-overlay" @click.self="closeArticle">
      <div class="modal-window">
        <button class="close-btn" @click="closeArticle">✕</button>
        
        <header class="modal-header">
          <div class="modal-meta">
            <span class="modal-source">{{ selectedArticle.author || 'Global Network' }}</span>
            <span class="modal-date">{{ formatDate(selectedArticle.published) }}</span>
          </div>
          <h2>{{ selectedArticle.title }}</h2>
        </header>

        <img 
          :src="selectedArticle.image || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1200'" 
          alt="Full Banner" 
          class="modal-hero-img"
        />

        <div class="modal-content-body">
          <p class="lead-text">{{ selectedArticle.description }}</p>
          
          <div class="deep-info-block">
            <h4>📊 Deep In-Sight Analysis & Background</h4>
            <p v-for="paragraph in extendedParagraphs" :key="paragraph">
              {{ paragraph }}
            </p>
          </div>
        </div>
        
        <footer class="modal-footer">
          <a :href="selectedArticle.url" target="_blank" class="source-link-btn">
            View Original Live Press Release ↗
          </a>
        </footer>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// 🔑 REPLACE THIS WITH YOUR CURRENTS API KEY!
const apiKey = 'RJA8PPXtWLNv1ZM96jH5K5wp0-gqbBi2sfhKNiSnUB0-_-ZK'

// 15 USER-FRIENDLY CATEGORIES
const categories = [
  { id: 'regional', name: 'World News', emoji: '🌍' },
  { id: 'technology', name: 'Technology', emoji: '💻' },
  { id: 'sports', name: 'Sports', emoji: '⚽' },
  { id: 'programming', name: 'Gaming & Dev', emoji: '🎮' },
  { id: 'science', name: 'Science', emoji: '🔬' },
  { id: 'finance', name: 'Finance', emoji: '📈' },
  { id: 'entertainment', name: 'Entertainment', emoji: '🎬' },
  { id: 'business', name: 'Business', emoji: '💼' },
  { id: 'health', name: 'Health & Medical', emoji: '🏥' },
  { id: 'space', name: 'Space Exploration', emoji: '🚀' },
  { id: 'lifestyle', name: 'Fashion & Style', emoji: '✨' },
  { id: 'food', name: 'Food & Culinary', emoji: '🍕' },
  { id: 'travel', name: 'Travel & Nature', emoji: '✈️' },
  { id: 'academia', name: 'Education', emoji: '📚' },
  { id: 'politics', name: 'Global Politics', emoji: '🏛️' }
]

const currentCategory = ref('technology')
const articles = ref([])
const isLoading = ref(false)
const errorMessage = ref('')
const selectedArticle = ref(null)

const activeCategoryName = computed(() => {
  const matched = categories.find(c => c.id === currentCategory.value)
  return matched ? matched.name : 'News'
})

// Extended information context to add extra reading lines per article
const extendedParagraphs = [
  "This unfolding story highlights a key shift in current international trends, signaling rapid changes across both local industries and global markets. Analysts note that tactical adjustments being deployed today will likely dictate resource distribution over the next fiscal decade.",
  "Historically, comparable occurrences faced heavy systemic bottlenecks; however, modern technological infrastructure and fluid asset communication networks are allowing updates to propagate across consumer brackets seamlessly.",
  "Industry headers are urging caution among retail adapters, noting that volatile consumer responses can sometimes distort primary analytical projections. Operational frameworks must remain completely agile to insulate against collateral macro-market dips.",
  "As full field disclosures continue to develop over the upcoming hours, field teams remain highly focused on regulatory reviews. Follow-up investigations are scheduled to verify standard long-term resilience frameworks across active nodes."
]

const fetchNews = async () => {
  isLoading.value = true
  errorMessage.value = ''
  
  try {
    const response = await fetch(
      `https://api.currentsapi.services/v1/latest-news?category=${currentCategory.value}&language=en&page_size=10&apiKey=${apiKey}`
    )
    
    if (!response.ok) throw new Error('Failed to retrieve live news records.')
    const data = await response.json()
    articles.value = data.news || []
  } catch (err) {
    errorMessage.value = err.message || 'An error occurred while contacting the news engine.'
  } finally {
    isLoading.value = false
  }
}

const selectCategory = (categoryId) => {
  currentCategory.value = categoryId
  fetchNews()
}

const openArticle = (article) => { selectedArticle.value = article }
const closeArticle = () => { selectedArticle.value = null }

const truncateText = (text, maxLen) => {
  if (!text) return 'No context description available.'
  return text.length > maxLen ? text.substring(0, maxLen) + '...' : text
}

const formatDate = (dateStr) => {
  if (!dateStr) return 'Today'
  return new Date(dateStr).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

onMounted(() => {
  fetchNews()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.news-app-container {
  display: flex;
  background-color: #f8fafc;
  font-family: 'Plus Jakarta Sans', sans-serif;
  min-height: 100vh;
  color: #0f172a;
}

/* SIDEBAR STYLES */
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
  letter-spacing: -0.5px;
  color: #1e40af;
  border-bottom: 1px solid #f1f5f9;
}
.pulse-icon { font-size: 1rem; animation: blink 1.5s infinite; }
@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }

.category-list {
  padding: 1rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.category-list button {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  background: none;
  border: none;
  padding: 0.85rem 1rem;
  border-radius: 10px;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s ease;
}
.cat-emoji { font-size: 1.25rem; }
.cat-name { font-size: 0.95rem; font-weight: 600; color: #475569; }

.category-list button:hover { background-color: #f1f5f9; }
.category-list button.active { background-color: #e0f2fe; }
.category-list button.active .cat-name { color: #0369a1; }

/* MAIN DASHBOARD */
.main-content {
  flex: 1;
  padding: 3rem;
  overflow-y: auto;
}

.dashboard-header { margin-bottom: 2.5rem; }
.dashboard-header h1 { font-size: 2.5rem; font-weight: 800; letter-spacing: -1px; }
.subtitle { color: #64748b; font-size: 1.1rem; margin-top: 0.25rem; }

/* LOADING/ERROR */
.loading-state, .error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5rem 0;
  color: #64748b;
}
.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e2e8f0;
  border-top-color: #2563eb;
  border-radius: 50%;
  animation: spin 1s infinite linear;
  margin-bottom: 1rem;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* 10 TOPICS GRID */
.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;
}

.article-card {
  background-color: #ffffff;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  transition: transform 0.25s, box-shadow 0.25s;
  display: flex;
  flex-direction: column;
}
.article-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.card-image-wrapper { position: relative; height: 180px; width: 100%; }
.card-img { width: 100%; height: 100%; object-fit: cover; }
.source-tag {
  position: absolute;
  bottom: 0.75rem;
  left: 0.75rem;
  background-color: rgba(15, 23, 42, 0.85);
  color: #ffffff;
  padding: 0.25rem 0.6rem;
  font-size: 0.75rem;
  font-weight: 700;
  border-radius: 6px;
  backdrop-filter: blur(4px);
}

.card-body { padding: 1.5rem; display: flex; flex-direction: column; flex: 1; }
.topic-counter { color: #2563eb; font-weight: 800; font-size: 0.75rem; letter-spacing: 1px; }
.article-title { font-size: 1.15rem; font-weight: 700; margin: 0.5rem 0; line-height: 1.4; color: #1e293b; }
.article-snippet { color: #64748b; font-size: 0.9rem; line-height: 1.5; margin-bottom: 1.5rem; }
.card-footer { margin-top: auto; border-top: 1px solid #f1f5f9; padding-top: 1rem; }
.read-more-lbl { font-size: 0.9rem; font-weight: 700; color: #2563eb; }

/* MODAL OVERLAY STYLES */
.modal-overlay {
  position: fixed;
  top: 0; left: 0; width: 100vw; height: 100vh;
  background-color: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(8px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.modal-window {
  background-color: #ffffff;
  width: 100%;
  max-width: 800px;
  max-height: 85vh;
  border-radius: 24px;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  padding: 2.5rem;
}

.close-btn {
  position: absolute;
  top: 1.5rem; right: 1.5rem;
  background: #f1f5f9; border: none;
  width: 36px; height: 36px; border-radius: 50%;
  font-size: 1.1rem; cursor: pointer; color: #64748b;
  display: flex; align-items: center; justify-content: center;
}

.modal-header { margin-bottom: 1.5rem; padding-right: 2rem; }
.modal-meta { display: flex; gap: 1rem; font-size: 0.85rem; color: #64748b; margin-bottom: 0.5rem; font-weight: 600; }
.modal-source { color: #2563eb; }
.modal-header h2 { font-size: 1.8rem; font-weight: 800; line-height: 1.3; }

.modal-hero-img { width: 100%; height: 320px; object-fit: cover; border-radius: 16px; margin-bottom: 2rem; }

.modal-content-body { font-size: 1.1rem; line-height: 1.8; color: #334155; }
.lead-text { font-weight: 600; color: #1e293b; margin-bottom: 1.5rem; font-size: 1.2rem; }

.deep-info-block {
  background-color: #f8fafc;
  border-left: 4px solid #2563eb;
  padding: 1.5rem;
  border-radius: 0 12px 12px 0;
  margin-top: 2rem;
}
.deep-info-block h4 { margin: 0 0 1rem 0; font-size: 1.1rem; color: #1e293b; }
.deep-info-block p { font-size: 0.95rem; margin-bottom: 1rem; color: #475569; }

.modal-footer { margin-top: 3rem; border-top: 1px solid #e2e8f0; padding-top: 1.5rem; text-align: right; }
.source-link-btn {
  display: inline-block;
  background-color: #0f172a;
  color: #ffffff;
  padding: 0.8rem 1.5rem;
  border-radius: 10px;
  text-decoration: none;
  font-weight: 700;
  font-size: 0.95rem;
  transition: background 0.2s;
}
.source-link-btn:hover { background-color: #1e293b; }
</style>