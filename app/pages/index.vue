<template>
  <div class="news-portal-container">
    <main class="portal-layout">
      <section class="homepage-topbar">
        <div class="topbar-copy">
          <p class="home-kicker">Member briefing</p>
          <h1>Stay current with the Atlas Report feed</h1>
          <p>Follow the latest updates from your newsroom and keep your profile details close at hand.</p>
        </div>
      </section>

      <div class="category-filter-bar">
        <button
          v-for="cat in categories"
          :key="cat.id"
          :class="{ selected: currentCategory === cat.id }"
          @click="currentCategory = cat.id"
        >
          {{ cat.emoji }} {{ cat.name }}
        </button>
        <div class="ml-auto flex items-center gap-2">
          <button
            v-if="isAdmin"
            @click="fetchLatestNews"
            :disabled="fetchLoading"
            class="text-xs font-bold px-3 py-1.5 rounded-full border border-slate-300 text-slate-600 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all disabled:opacity-50"
          >
            {{ fetchLoading ? 'Fetching...' : '📡 Fetch News' }}
          </button>
          <span v-if="fetchStatus" class="text-[10px] font-semibold" :class="fetchStatus.includes('error') ? 'text-red-500' : 'text-emerald-600'">
            {{ fetchStatus }}
          </span>
        </div>
      </div>

      <!-- Load More Button (Pagination) -->
      <div v-if="filteredArticles.length > 0" class="flex justify-center mb-6">
        <button
          @click="toggleShowAll"
          class="text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded-full border transition-all"
          :style="{
            borderColor: 'var(--color-border)',
            color: showAll ? 'var(--color-accent)' : 'var(--color-text-muted)',
            backgroundColor: showAll ? 'rgba(163,0,0,0.05)' : 'transparent'
          }"
        >
          {{ showAll ? 'Show less' : `Show all ${filteredArticles.length} articles` }}
        </button>
      </div>

      <div class="news-editorial-grid">

        <section v-if="visibleArticles[0]" class="hero-column" @click="viewFullArticle(visibleArticles[0])">
          <div class="hero-badge">TOP STORY</div>
          <div class="hero-image-wrapper">
            <img :src="visibleArticles[0].image" alt="Hero Banner" class="hero-img" @error="onImageError($event, 'hero')" />
          </div>
          <h2 class="hero-title">{{ visibleArticles[0].title }}</h2>
          <p class="hero-snippet">{{ visibleArticles[0].description }}</p>
          <span class="hero-meta">Reported by {{ visibleArticles[0].author }} — CLICK TO READ</span>
        </section>

        <section class="secondary-column">
          <div
            v-for="(article, index) in visibleArticles.slice(1, 4)"
            :key="index"
            class="secondary-story-card"
            @click="viewFullArticle(article)"
          >
            <div class="secondary-img-wrapper">
              <img :src="article.image" alt="Story thumbnail" @error="onImageError($event, 'secondary')" />
            </div>
            <div class="secondary-card-text">
              <h3 class="secondary-title">{{ article.title }}</h3>
              <p class="secondary-snippet">{{ truncateText(article.description, 95) }}</p>
            </div>
          </div>
        </section>

        <section class="bulletin-column">
          <h4 class="bulletin-heading">Latest Briefs</h4>
          <div class="bulletin-list">
            <div
              v-for="(article, index) in visibleArticles.slice(4, 9)"
              :key="index"
              class="bulletin-item"
              @click="viewFullArticle(article)"
            >
              <span class="bulletin-index">#{{ index + 5 }}</span>
              <div class="bulletin-content">
                <h5 class="bulletin-title">{{ article.title }}</h5>
                <span class="bulletin-source">{{ article.author }}</span>
              </div>
            </div>
          </div>
        </section>

      </div>
    </main>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const supabase = useSupabaseClient()
const user = useSupabaseUser()

const articles = ref([])
const loading = ref(true)
const currentCategory = ref('general')
const fetchStatus = ref('')
const fetchLoading = ref(false)
const showFetchButton = ref(false)
const lastFetchTime = ref('')

// Check if user is admin (you can set your email here)
const isAdmin = computed(() => {
  return user.value?.email === 'alisedadmu@example.com' // Change this to your email
})

const fetchLatestNews = async () => {
  fetchLoading.value = true
  fetchStatus.value = ''

  try {
    const res = await fetch('/api/fetch-news?key=atlas-rss-secret')
    const data = await res.json()

    if (data.success) {
      fetchStatus.value = data.message
      await fetchArticles()
    } else {
      fetchStatus.value = `error: ${data.error || 'Unknown error'}`
    }
  } catch (err) {
    fetchStatus.value = 'error: Network error'
  }

  fetchLoading.value = false
  setTimeout(() => { fetchStatus.value = '' }, 5000)
}

const categories = [
  { id: 'general', name: 'World', emoji: '🌍' },
  { id: 'technology', name: 'Tech', emoji: '💻' },
  { id: 'sports', name: 'Sports', emoji: '⚽' },
  { id: 'science', name: 'Science', emoji: '🔬' },
  { id: 'business', name: 'Business', emoji: '📈' },
  { id: 'health', name: 'Health', emoji: '🏥' }
]

const currentFormattedDate = computed(() => {
  return new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase()
})

const showAll = ref(false)
const ARTICLES_PER_PAGE = 9

const filteredArticles = computed(() => {
  return articles.value.filter(art => art.category === currentCategory.value)
})

const visibleArticles = computed(() => {
  if (showAll.value) return filteredArticles.value
  return filteredArticles.value.slice(0, ARTICLES_PER_PAGE)
})

const toggleShowAll = () => {
  showAll.value = !showAll.value
}

const fetchArticles = async () => {
  loading.value = true
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .order('published', { ascending: false })

  if (!error && data) {
    articles.value = data
  }
  loading.value = false
}

const viewFullArticle = (article) => {
  navigateTo(`/news/${article.id}`)
}

const truncateText = (text, maxLen) => {
  if (!text) return ''
  return text.length > maxLen ? text.substring(0, maxLen) + '...' : text
}

const categoryGradients = {
  general: { bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', emoji: '🌍' },
  technology: { bg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', emoji: '💻' },
  sports: { bg: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', emoji: '⚽' },
  science: { bg: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', emoji: '🔬' },
  business: { bg: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', emoji: '📈' },
  health: { bg: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', emoji: '🏥' }
}

const onImageError = (event, type) => {
  const img = event.target
  // Replace the img with a styled gradient placeholder immediately
  const wrapper = img.closest('.hero-image-wrapper, .secondary-img-wrapper')
  if (wrapper) {
    const article = articles.value.find(a => a.image === img.src)
    const category = article?.category || currentCategory.value
    const gradient = categoryGradients[category] || categoryGradients.general
    wrapper.innerHTML = `<div class="category-placeholder" style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:${gradient.bg};font-size:${type === 'hero' ? '4rem' : '2.5rem'};">${gradient.emoji}</div>`
  }
}

const handleSignOut = async () => {
  await supabase.auth.signOut()
  await navigateTo('/auth')
}

// Real-time subscription for articles
let subscription = null

onMounted(async () => {
  await fetchArticles()

  subscription = supabase
    .channel('articles-feed')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'articles'
    }, async () => {
      await fetchArticles()
    })
    .subscribe()
})

onBeforeUnmount(() => {
  if (subscription) {
    supabase.removeChannel(subscription)
  }
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700;800&family=Playfair+Display:ital,wght@0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

.news-portal-container {
  background-color: var(--color-bg);
  font-family: 'Plus Jakarta Sans', sans-serif;
  min-height: 100vh;
  color: var(--color-text);
}

/* HOMEPAGE TOPBAR */
.homepage-topbar {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: 1fr;
  align-items: stretch;
  margin-bottom: 2rem;
}
.topbar-copy {
  border: 1px solid var(--color-border);
  background: linear-gradient(135deg, #fffdf8 0%, #f7f1e7 100%);
  padding: 2rem;
}
.home-kicker {
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.24em;
  text-transform: uppercase;
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

/* NAVIGATION TABS */
.portal-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
}
.primary-nav-links {
  display: flex;
  gap: 1.5rem;
}
.primary-nav-links button {
  background: none;
  border: none;
  font-family: inherit;
  font-weight: 700;
  font-size: 1rem;
  color: #666666;
  cursor: pointer;
  padding: 0.5rem 0;
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

/* INNER CATEGORY SUB-BAR */
.category-filter-bar {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid #e5e5e5;
  padding-bottom: 1rem;
}
.category-filter-bar button {
  background: #f4f1ea;
  border: 1px solid #e5e5e5;
  padding: 0.5rem 1rem;
  font-family: inherit;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  border-radius: 4px;
}
.category-filter-bar button.selected {
  background: #111111;
  color: white;
  border-color: #111111;
}

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
  width: 100%; height: 100%; object-fit: cover; margin-bottom: 1.25rem;
}
.hero-title {
  font-family: 'Playfair Display', serif;
  font-size: 2.2rem; font-weight: 700; line-height: 1.2; margin: 1rem 0;
}
.hero-snippet { font-size: 1.05rem; line-height: 1.6; color: var(--color-text-secondary); margin-bottom: 1rem; }
.hero-meta { font-size: 0.8rem; font-weight: 700; color: #a30000; text-transform: uppercase; }

/* COLUMN 2: SECONDARY POSTS */
.secondary-column {
  border-right: 1px solid #e5e5e5;
  padding-right: 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}
.secondary-story-card {
  cursor: pointer; display: flex; flex-direction: column; gap: 1rem;
  padding-bottom: 1.75rem; border-bottom: 1px solid #eeeeee;
}
.secondary-img-wrapper { width: 100%; height: 160px; overflow: hidden; }
.secondary-story-card img { width: 100%; height: 100%; object-fit: cover; }
.secondary-title { font-family: 'Playfair Display', serif; font-size: 1.25rem; line-height: 1.3; }
.secondary-snippet { font-size: 0.9rem; color: var(--color-text-secondary); margin-top: 0.25rem; }

/* COLUMN 3: SIDE TICKER BULLETIN LIST */
.bulletin-column { padding-left: 0.5rem; }
.bulletin-heading {
  font-family: 'Cinzel', serif; border-bottom: 2px solid #111111;
  padding-bottom: 0.5rem; margin-bottom: 1.25rem; font-size: 1.1rem;
}
.bulletin-list { display: flex; flex-direction: column; gap: 1.25rem; }
.bulletin-item {
  display: flex; gap: 1rem; cursor: pointer; padding-bottom: 1rem; border-bottom: 1px dashed #dddddd;
}
.bulletin-index { font-size: 1.25rem; font-weight: 800; color: #a30000; }
.bulletin-title { font-size: 0.95rem; font-weight: 700; line-height: 1.4; }
.bulletin-source { font-size: 0.75rem; color: var(--color-text-muted); font-weight: 600; display: block; margin-top: 0.25rem; }

/* (dead CSS removed - article viewer moved to /news/[id]) */
</style>