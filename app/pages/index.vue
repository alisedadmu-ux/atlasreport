<template>
  <div class="news-portal-container">
    
    <div class="breaking-ticker">
      <span class="ticker-badge">FLASH</span>
      <p class="ticker-text">Live global updates rolling out in real-time across premium sectors...</p>
    </div>

    <header class="portal-header">
      <div class="header-brand-zone">
        <p class="header-date">{{ currentFormattedDate }}</p>
        <h1 class="portal-logo">ATLAS REPORT</h1>
        <p class="header-edition">GLOBAL INTELLIGENCE FEED</p>
      </div>

      <nav class="portal-nav">
        <div class="primary-nav-links">
          <button 
            v-for="cat in visibleCategories" 
            :key="cat.id" 
            :class="{ active: currentCategory === cat.id }"
            @click="selectCategory(cat.id)"
          >
            {{ cat.name }}
          </button>
          
          <div class="dropdown" :class="{ open: showDropdown }">
            <button class="dropdown-trigger" @click="showDropdown = !showDropdown">
              More Sectors ▾
            </button>
            <div class="dropdown-menu">
              <button 
                v-for="cat in dropdownCategories" 
                :key="cat.id" 
                :class="{ active: currentCategory === cat.id }"
                @click="selectCategory(cat.id); showDropdown = false"
              >
                {{ cat.emoji }} {{ cat.name }}
              </button>
            </div>
          </div>
        </div>

        <div class="utility-nav-links">
          <NuxtLink to="/about" class="util-link">About</NuxtLink>
          <NuxtLink to="/contact" class="util-link">Contact</NuxtLink>
        </div>
      </nav>
    </header>

    <main class="portal-layout">
      
      <div v-if="isLoading" class="loading-state">
        <div class="spinner"></div>
        <p>Loading morning dispatches...</p>
      </div>

      <div v-else-if="errorMessage" class="error-state">
        <p>⚠️ {{ errorMessage }}</p>
        <button @click="fetchNews" class="retry-btn">Reload Newsroom</button>
      </div>

      <div v-else class="news-editorial-grid">
        
        <section v-if="articles[0]" class="hero-column" @click="openArticle(articles[0].url)">
          <div class="hero-badge">TOP STORY</div>
          <div class="hero-image-wrapper">
            <img 
              :src="articles[0].image || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1200'" 
              alt="Hero Banner" 
              class="hero-img"
            />
          </div>
          <h2 class="hero-title">{{ articles[0].title }}</h2>
          <p class="hero-snippet">{{ articles[0].description }}</p>
          <span class="hero-meta">Reported by {{ articles[0].author || 'Global Newsroom' }}</span>
        </section>

        <section class="secondary-column">
          <div 
            v-for="(article, index) in articles.slice(1, 4)" 
            :key="index" 
            class="secondary-story-card"
            @click="openArticle(article.url)"
          >
            <div class="secondary-img-wrapper">
              <img 
                :src="article.image || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=400'" 
                alt="Story thumbnail"
              />
            </div>
            <div class="secondary-card-text">
              <h3 class="secondary-title">{{ article.title }}</h3>
              <p class="secondary-snippet">{{ truncateText(article.description, 90) }}</p>
            </div>
          </div>
        </section>

        <section class="bulletin-column">
          <h4 class="bulletin-heading">Latest Briefs</h4>
          <div class="bulletin-list">
            <div 
              v-for="(article, index) in articles.slice(4, 10)" 
              :key="index" 
              class="bulletin-item"
              @click="openArticle(article.url)"
            >
              <span class="bulletin-index">#{{ index + 5 }}</span>
              <div class="bulletin-content">
                <h5 class="bulletin-title">{{ article.title }}</h5>
                <span class="bulletin-source">{{ article.author || 'Associated Press' }}</span>
              </div>
            </div>
          </div>
        </section>

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
            <h4>📊 Editorial Context & In-Depth Reporting</h4>
            <p v-for="paragraph in extendedParagraphs" :key="paragraph">
              {{ paragraph }}
            </p>
          </div>
        </div>
        
        <footer class="modal-footer">
          <a :href="selectedArticle.url" target="_blank" class="source-link-btn">
            View Complete Press Release ↗
          </a>
        </footer>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// 🛠️ Disables the black global top bar layout so designs don't conflict
definePageMeta({
  layout: false
})

// 🔑 PASTE YOUR NEW GNEWS API KEY HERE!
const apiKey = '20b66473c224d35e265f8665816fa8dd'

// Structured category mapping formatted explicitly for GNews endpoints
const categories = [
  { id: 'general', name: 'World', emoji: '🌍' },
  { id: 'technology', name: 'Tech', emoji: '💻' },
  { id: 'sports', name: 'Sports', emoji: '⚽' },
  { id: 'entertainment', name: 'Gaming & Ent', emoji: '🎮' },
  { id: 'science', name: 'Science', emoji: '🔬' },
  { id: 'business', name: 'Finance & Biz', emoji: '📈' },
  { id: 'health', name: 'Health', emoji: '🏥' }
]

const currentCategory = ref('general')
const articles = ref([])
const isLoading = ref(false)
const errorMessage = ref('')
const selectedArticle = ref(null)
const showDropdown = ref(false)

const visibleCategories = computed(() => categories.slice(0, 5))
const dropdownCategories = computed(() => categories.slice(5))

const currentFormattedDate = computed(() => {
  return new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase()
})

const extendedParagraphs = [
  "This unfolding story highlights a key shift in current international trends, signaling rapid changes across both local industries and global markets. Analysts note that tactical adjustments being deployed today will likely dictate resource distribution over the next fiscal decade.",
  "Historically, comparable occurrences faced heavy systemic bottlenecks; however, modern technological infrastructure and fluid asset communication networks are allowing updates to propagate across consumer brackets seamlessly.",
  "Industry headers are urging caution among retail adapters, noting that volatile consumer responses can sometimes distort primary analytical projections. Operational frameworks must remain completely agile to insulate against collateral macro-market dips.",
  "As full field disclosures continue to develop over the upcoming hours, field teams remain highly focused on regulatory reviews. Follow-up investigations are scheduled to verify standard long-term resilience frameworks across active nodes."
]

const fetchNews = async () => {
  isLoading.value = true
  errorMessage.value = ''
  
  if (apiKey === '' || !apiKey) {
    errorMessage.value = 'New API Key missing. Please paste your GNews token into the script block.'
    isLoading.value = false
    return
  }

  try {
    const url = `https://gnews.io/api/v4/top-headlines?category=${currentCategory.value}&lang=en&max=10&apikey=${apiKey}`
    const response = await fetch(url)
    const data = await response.json()
    
    if (response.ok && data.articles) {
      articles.value = data.articles.map(art => ({
        title: art.title,
        description: art.description || art.content,
        image: art.image,
        url: art.url,
        author: art.source ? art.source.name : 'Global News',
        published: art.publishedAt
      }))
    } else if (data.errors) {
      throw new Error(data.errors[0] || 'API Authentication issue.')
    } else {
      throw new Error('Failed to load fresh headlines from the newsroom server.')
    }
  } catch (err) {
    errorMessage.value = err.message || 'Error connecting to news server.'
    console.error('API Error details:', err)
  } finally {
    isLoading.value = false
  }
}

const selectCategory = (categoryId) => {
  currentCategory.value = categoryId
  fetchNews()
}

const openArticle = (articleUrl) => {
  if (!articleUrl) return
  window.open(articleUrl, '_blank')
}
const closeArticle = () => { selectedArticle.value = null }
const truncateText = (text, maxLen) => {
  if (!text) return 'No further text context summary available.'
  return text.length > maxLen ? text.substring(0, maxLen) + '...' : text
}
const formatDate = (dateStr) => {
  if (!dateStr) return 'Today'
  return new Date(dateStr).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

onMounted(() => { fetchNews() })
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700;800&family=Playfair+Display:ital,wght@0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

.news-portal-container {
  background-color: #fcfbf7;
  font-family: 'Plus Jakarta Sans', sans-serif;
  min-height: 100vh;
  color: #111111;
}

/* BREAKING TICKER */
.breaking-ticker {
  background-color: #a30000;
  color: white;
  padding: 0.5rem 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.85rem;
  font-weight: 700;
}
.ticker-badge {
  background: white;
  color: #a30000;
  padding: 0.1rem 0.4rem;
  border-radius: 3px;
  font-size: 0.75rem;
}

/* EDITORIAL HEADERS */
.portal-header {
  border-bottom: 3px double #111111;
  margin: 0 2rem;
}
.header-brand-zone {
  text-align: center;
  padding: 2rem 0;
  border-bottom: 1px solid #e5e5e5;
}
.portal-logo {
  font-family: 'Cinzel', serif;
  font-size: 3.5rem;
  font-weight: 800;
  letter-spacing: -1px;
  margin: 0.5rem 0;
}
.header-date, .header-edition {
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 1.5px;
  color: #555555;
}

/* NAVIGATION */
.portal-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
}
.primary-nav-links {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}
.primary-nav-links button {
  background: none;
  border: none;
  font-family: inherit;
  font-weight: 700;
  font-size: 0.95rem;
  color: #333333;
  cursor: pointer;
  padding: 0.25rem 0;
}
.primary-nav-links button:hover, .primary-nav-links button.active {
  color: #a30000;
  border-bottom: 2px solid #a30000;
}
.util-link {
  text-decoration: none;
  color: #666666;
  font-size: 0.9rem;
  margin-left: 1.25rem;
  font-weight: 600;
}

/* DROPDOWN MENU SECTORS */
.dropdown { position: relative; display: inline-block; }
.dropdown-trigger { font-weight: 700; color: #a30000 !important; background: none; border: none; cursor: pointer; font-family: inherit; font-size: 0.95rem; }
.dropdown-menu {
  display: none;
  position: absolute;
  top: 100%; left: 0;
  background-color: #ffffff;
  box-shadow: 0 8px 16px rgba(0,0,0,0.1);
  border: 1px solid #e5e5e5;
  z-index: 10;
  width: 200px;
  border-radius: 6px;
}
.dropdown.open .dropdown-menu { display: block; }
.dropdown-menu button {
  display: block;
  width: 100%;
  text-align: left;
  padding: 0.75rem 1rem !important;
  border: none !important;
}
.dropdown-menu button:hover { background-color: #f7f7f7; }

/* EDITORIAL GRID SYSTEM */
.portal-layout { padding: 2rem; }
.news-editorial-grid {
  display: grid;
  grid-template-columns: 2fr 1.25fr 1fr;
  gap: 2.5rem;
}

/* COLUMN 1: HERO TOP STORY */
.hero-column {
  cursor: pointer;
  border-right: 1px solid #e5e5e5;
  padding-right: 2.5rem;
}
.hero-badge {
  background-color: #111111;
  color: white;
  display: inline-block;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 700;
  margin-bottom: 1rem;
}
.hero-image-wrapper { width: 100%; height: 380px; overflow: hidden; }
.hero-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  margin-bottom: 1.25rem;
}
.hero-title {
  font-family: 'Playfair Display', serif;
  font-size: 2.2rem;
  font-weight: 700;
  line-height: 1.2;
  margin-top: 1rem;
  margin-bottom: 1rem;
}
.hero-snippet {
  font-size: 1.05rem;
  line-height: 1.6;
  color: #333333;
  margin-bottom: 1rem;
}
.hero-meta { font-size: 0.8rem; font-weight: 700; color: #666666; }

/* COLUMN 2: SECONDARY POSTS */
.secondary-column {
  border-right: 1px solid #e5e5e5;
  padding-right: 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}
.secondary-story-card {
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-bottom: 1.75rem;
  border-bottom: 1px solid #eeeeee;
}
.secondary-img-wrapper { width: 100%; height: 160px; overflow: hidden; }
.secondary-story-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.secondary-title {
  font-family: 'Playfair Display', serif;
  font-size: 1.25rem;
  line-height: 1.3;
}
.secondary-snippet { font-size: 0.9rem; color: #555555; margin-top: 0.25rem; }

/* COLUMN 3: SIDE TICKER BULLETIN LIST */
.bulletin-column { padding-left: 0.5rem; }
.bulletin-heading {
  font-family: 'Cinzel', serif;
  border-bottom: 2px solid #111111;
  padding-bottom: 0.5rem;
  margin-bottom: 1.25rem;
  font-size: 1.1rem;
}
.bulletin-list { display: flex; flex-direction: column; gap: 1.25rem; }
.bulletin-item {
  display: flex;
  gap: 1rem;
  cursor: pointer;
  padding-bottom: 1rem;
  border-bottom: 1px dashed #dddddd;
}
.bulletin-index {
  font-size: 1.25rem;
  font-weight: 800;
  color: #a30000;
}
.bulletin-title {
  font-size: 0.95rem;
  font-weight: 700;
  line-height: 1.4;
}
.bulletin-source { font-size: 0.75rem; color: #777777; font-weight: 600; display: block; margin-top: 0.25rem; }

/* LOADING/ERRORS */
.loading-state, .error-state { text-align: center; padding: 6rem; color: #555555; }
.spinner {
  width: 40px; height: 40px; border: 3px solid #e5e5e5;
  border-top-color: #a30000; border-radius: 50%;
  animation: spin 1s infinite linear; margin: 0 auto 1rem;
}
.retry-btn { background: #111111; color: white; padding: 0.5rem 1rem; border: none; cursor: pointer; font-weight: 700; margin-top: 1rem; }
@keyframes spin { to { transform: rotate(360deg); } }

/* MODAL FULL DISPLAY OVERLAYS */
.modal-overlay {
  position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
  background-color: rgba(0, 0, 0, 0.5); backdrop-filter: blur(4px);
  z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 2rem;
}
.modal-window {
  background-color: #fcfbf7; width: 100%; max-width: 750px;
  max-height: 85vh; border-radius: 0; overflow-y: auto;
  position: relative; padding: 3rem; border: 4px solid #111111;
}
.close-btn {
  position: absolute; top: 1rem; right: 1rem; background: #111111;
  border: none; color: white; width: 32px; height: 32px; cursor: pointer;
}
.modal-header h2 { font-family: 'Playfair Display', serif; font-size: 2rem; margin-top: 0.5rem; }
.modal-meta { display: flex; gap: 1rem; font-size: 0.8rem; color: #666666; font-weight: 700; }
.modal-source { color: #a30000; }
.modal-hero-img { width: 100%; height: 300px; object-fit: cover; margin: 1.5rem 0; }
.modal-content-body { font-size: 1.05rem; line-height: 1.7; color: #222222; }
.lead-text { font-family: 'Playfair Display', serif; font-size: 1.25rem; font-style: italic; margin-bottom: 1.5rem; }
.deep-info-block { background: #f4f1ea; padding: 1.5rem; border-top: 2px solid #a30000; margin-top: 2rem; }
.deep-info-block h4 { font-family: 'Cinzel', serif; margin-bottom: 0.75rem; }
.deep-info-block p { font-size: 0.95rem; margin-bottom: 0.75rem; color: #444444; }
.modal-footer { margin-top: 2.5rem; text-align: right; border-top: 1px solid #e5e5e5; padding-top: 1.5rem; }
.source-link-btn { background: #111111; color: white; padding: 0.75rem 1.2rem; text-decoration: none; font-weight: 700; font-size: 0.9rem; }
</style>