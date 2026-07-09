<template>
  <div class="portal-shell">
    <section class="hero-intro">
      <div class="intro-copy">
        <p class="eyebrow">Member briefing</p>
        <h1>Stay current with the latest global reporting.</h1>
        <p>Verified journalism, sharp analysis, and a beautifully paced reading experience designed for modern readers.</p>
      </div>
      <div class="intro-aside">
        <div class="insight-pill">{{ currentFormattedDate }}</div>
        <div class="insight-card">
          <span>Live updates</span>
          <strong>Fresh reporting from Atlas Report</strong>
        </div>
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
          class="action-pill"
        >
          {{ fetchLoading ? 'Fetching...' : '📡 Fetch News' }}
        </button>
        <span v-if="fetchStatus" class="status-pill" :class="fetchStatus.includes('error') ? 'status-error' : 'status-success'">
          {{ fetchStatus }}
        </span>
      </div>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="loading-card primary"></div>
      <div class="loading-grid">
        <div v-for="i in 3" :key="i" class="loading-card"></div>
      </div>
    </div>

    <div v-else-if="filteredArticles.length > 0">
      <div class="show-all-row">
        <p class="section-label">Featured coverage</p>
        <button @click="toggleShowAll" class="show-all-btn">
          {{ showAll ? 'Show less' : `Show all ${filteredArticles.length} stories` }}
        </button>
      </div>

      <div class="news-editorial-grid">
        <section class="left-column">
          <div v-if="visibleArticles[0]" class="hero-block" @click="viewFullArticle(visibleArticles[0])">
            <div class="hero-media">
              <img :src="visibleArticles[0].image" alt="Hero Banner" class="hero-img" @error="onImageError($event)" />
            </div>
            <div class="hero-body">
              <div class="hero-badge">Top story</div>
              <h2 class="hero-title">{{ visibleArticles[0].title }}</h2>
              <p class="hero-snippet">{{ visibleArticles[0].description }}</p>
              <div class="hero-meta">
                <span>By {{ visibleArticles[0].author }}</span>
                <span>{{ formatDate(visibleArticles[0].published) }}</span>
              </div>
            </div>
          </div>

          <div class="left-sub-grid">
            <div
              v-for="(article, index) in visibleArticles.slice(1, 4)"
              :key="'left-' + index"
              class="secondary-story-card"
              @click="viewFullArticle(article)"
            >
              <div class="featured-media">
                <img :src="article.image" alt="Story thumbnail" @error="onImageError($event)" />
              </div>
              <div class="secondary-card-text">
                <p class="card-kicker">{{ article.category }}</p>
                <h3 class="secondary-title">{{ article.title }}</h3>
                <p class="secondary-snippet">{{ truncateText(article.description, 95) }}</p>
              </div>
            </div>
          </div>
        </section>

        <aside class="right-column">
          <div class="sidebar-heading">
            <p class="section-label">Trending now</p>
            <span class="sidebar-pill">Updated</span>
          </div>
          <div
            v-for="(article, index) in visibleArticles.slice(4, 8)"
            :key="'right-' + index"
            class="secondary-story-card compact"
            @click="viewFullArticle(article)"
          >
            <div class="featured-media small">
              <img :src="article.image" alt="Story thumbnail" @error="onImageError($event)" />
            </div>
            <div class="secondary-card-text">
              <p class="card-kicker">{{ article.category }}</p>
              <h3 class="secondary-title">{{ article.title }}</h3>
              <p class="secondary-snippet">{{ truncateText(article.description, 95) }}</p>
            </div>
          </div>
        </aside>
      </div>

      <div v-if="showAll && visibleArticles.length > ARTICLES_PER_PAGE" class="all-articles-list">
        <div class="all-articles-header">
          <h3 class="all-articles-title">More stories</h3>
          <p class="section-label">Continue reading</p>
        </div>
        <div class="all-articles-grid">
          <div
            v-for="article in visibleArticles.slice(ARTICLES_PER_PAGE)"
            :key="article.id"
            class="more-article-card"
            @click="viewFullArticle(article)"
          >
            <div class="more-media">
              <img :src="article.image" alt="More story" @error="onImageError($event)" />
            </div>
            <div class="more-card-text">
              <p class="card-kicker">{{ article.category }}</p>
              <h4 class="more-title">{{ article.title }}</h4>
              <p class="more-snippet">{{ truncateText(article.description, 140) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="empty-state">
      <p>No stories are available in this section yet.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRoute } from 'vue-router'
import { fallbackArticles } from '~/data/fallback-articles'

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const route = useRoute()

const articles = ref([])
const loading = ref(true)
const currentCategory = ref(route.query.cat || 'general')

watch(() => route.query.cat, (newCat) => {
  if (newCat) currentCategory.value = newCat
})

const fetchStatus = ref('')
const fetchLoading = ref(false)

const isAdmin = computed(() => {
  return user.value?.email === 'alisedadmu@gmail.com'
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
const ARTICLES_PER_PAGE = 8

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
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('published', { ascending: false })

    if (!error && data?.length) {
      articles.value = data
    } else {
      articles.value = fallbackArticles
    }
  } catch (err) {
    console.warn('Supabase feed unavailable, using fallback articles.', err)
    articles.value = fallbackArticles
  } finally {
    loading.value = false
  }
}

const viewFullArticle = (article) => {
  navigateTo(`/news/${article.id}`)
}

const truncateText = (text, maxLen) => {
  if (!text) return ''
  return text.length > maxLen ? text.substring(0, maxLen) + '...' : text
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const categoryGradients = {
  general: { bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', emoji: '🌍' },
  technology: { bg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', emoji: '💻' },
  sports: { bg: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', emoji: '⚽' },
  science: { bg: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', emoji: '🔬' },
  business: { bg: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', emoji: '📈' },
  health: { bg: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', emoji: '🏥' }
}

const onImageError = (event) => {
  const img = event.target
  const wrapper = img.closest('.hero-media, .featured-media, .more-media')
  if (wrapper) {
    const article = articles.value.find(a => a.image === img.src)
    const category = article?.category || currentCategory.value
    const gradient = categoryGradients[category] || categoryGradients.general
    wrapper.innerHTML = `<div class="category-placeholder" style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:${gradient.bg};font-size:2.5rem;">${gradient.emoji}</div>`
  }
}

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
.portal-shell {
  padding: 1.25rem 0 0;
}

.hero-intro {
  display: grid;
  gap: 1.25rem;
  grid-template-columns: 1.6fr 0.85fr;
  padding: 2rem;
  margin-bottom: 1.5rem;
  border: 1px solid var(--color-border);
  border-radius: 32px;
  background: linear-gradient(135deg, #fffdf8 0%, #f5ebdc 100%);
  box-shadow: 0 24px 80px rgba(17, 17, 17, 0.05);
}

.intro-copy h1 {
  margin: 0.35rem 0 0.8rem;
  font-size: clamp(1.9rem, 3vw, 2.7rem);
  line-height: 1.05;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: #111111;
  font-family: 'Playfair Display', serif;
}

.intro-copy p {
  margin: 0;
  max-width: 640px;
  color: var(--color-text-secondary);
  font-size: 1rem;
  line-height: 1.7;
}

.eyebrow,
.section-label,
.card-kicker {
  font-size: 0.76rem;
  font-weight: 800;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: var(--color-accent);
}

.intro-aside {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  justify-content: flex-end;
}

.insight-pill,
.sidebar-pill {
  display: inline-flex;
  align-self: flex-start;
  padding: 0.5rem 0.8rem;
  border-radius: 999px;
  background: rgba(17, 17, 17, 0.06);
  color: #222222;
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.insight-card {
  border-radius: 20px;
  border: 1px solid rgba(232, 224, 212, 0.9);
  background: rgba(255, 255, 255, 0.75);
  padding: 1rem 1.1rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.insight-card span {
  color: var(--color-text-muted);
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.22em;
}

.insight-card strong {
  font-size: 0.95rem;
  font-weight: 700;
  color: #111111;
}

.category-filter-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.7rem;
  padding: 1rem 0 1.3rem;
  margin-bottom: 1.25rem;
  border-bottom: 1px solid var(--color-border);
}

.category-filter-bar button {
  border: 1px solid var(--color-border);
  background: rgba(255, 255, 255, 0.7);
  color: var(--color-text-secondary);
  padding: 0.6rem 0.95rem;
  border-radius: 999px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.category-filter-bar button:hover,
.category-filter-bar button.selected {
  background: #111111;
  color: white;
  border-color: #111111;
}

.action-pill,
.show-all-btn {
  border: 1px solid var(--color-border);
  background: white;
  color: var(--color-text-secondary);
  padding: 0.55rem 0.9rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-pill:hover,
.show-all-btn:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
}

.status-pill {
  font-size: 0.78rem;
  font-weight: 700;
}

.status-error {
  color: var(--color-accent);
}

.status-success {
  color: #0f766e;
}

.loading-state {
  display: grid;
  gap: 1rem;
}

.loading-card {
  border-radius: 24px;
  min-height: 180px;
  background: linear-gradient(90deg, #f0e8da 0%, #f8f4ea 50%, #f0e8da 100%);
  background-size: 200% 100%;
  animation: shimmer 1.3s infinite;
}

.loading-card.primary {
  min-height: 320px;
}

.loading-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
}

.show-all-row,
.all-articles-header,
.sidebar-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
}

.news-editorial-grid {
  display: grid;
  grid-template-columns: 1.8fr 0.95fr;
  gap: 1.4rem;
}

.left-column {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.hero-block,
.secondary-story-card,
.more-article-card {
  border: 1px solid var(--color-border);
  background: rgba(255, 255, 255, 0.85);
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(17, 17, 17, 0.04);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.hero-block:hover,
.secondary-story-card:hover,
.more-article-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 16px 40px rgba(17, 17, 17, 0.08);
}

.hero-media {
  height: 320px;
  overflow: hidden;
  background: #efe6d7;
}

.hero-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-body {
  padding: 1.15rem 1.25rem 1.3rem;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.35rem 0.65rem;
  margin-bottom: 0.85rem;
  border-radius: 999px;
  background: #111111;
  color: white;
  font-size: 0.7rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.18em;
}

.hero-title {
  margin: 0 0 0.6rem;
  font-size: 1.55rem;
  font-weight: 800;
  line-height: 1.2;
  color: #111111;
  font-family: 'Playfair Display', serif;
}

.hero-snippet {
  margin: 0 0 0.8rem;
  color: var(--color-text-secondary);
  font-size: 0.96rem;
  line-height: 1.65;
}

.hero-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.85rem;
  color: var(--color-text-muted);
  font-size: 0.8rem;
  font-weight: 600;
}

.left-sub-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
}

.secondary-story-card {
  cursor: pointer;
  display: flex;
  flex-direction: column;
}

.secondary-story-card.compact {
  flex-direction: row;
  align-items: flex-start;
  gap: 0.8rem;
  padding: 0.8rem;
}

.featured-media {
  height: 150px;
  overflow: hidden;
  background: #efe6d7;
}

.featured-media.small {
  height: 92px;
  width: 92px;
  flex-shrink: 0;
  border-radius: 16px;
}

.featured-media img,
.more-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.secondary-card-text {
  padding: 0.95rem 0.95rem 1rem;
}

.secondary-title,
.more-title {
  margin: 0.1rem 0 0.35rem;
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.35;
  color: #111111;
}

.secondary-snippet,
.more-snippet {
  margin: 0;
  color: var(--color-text-secondary);
  font-size: 0.9rem;
  line-height: 1.6;
}

.right-column {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.all-articles-list {
  margin-top: 1.4rem;
  padding-top: 1rem;
  border-top: 1px solid var(--color-border);
}

.all-articles-title {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 800;
  font-family: 'Playfair Display', serif;
}

.all-articles-grid {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.more-article-card {
  display: grid;
  grid-template-columns: 180px minmax(0, 1fr);
  gap: 1rem;
  cursor: pointer;
}

.more-media {
  height: 120px;
  overflow: hidden;
  background: #efe6d7;
}

.more-card-text {
  padding: 0.95rem 0.95rem 0.95rem 0;
}

.empty-state {
  padding: 3rem 1rem;
  border: 1px dashed var(--color-border);
  border-radius: 24px;
  text-align: center;
  color: var(--color-text-secondary);
  background: rgba(255, 255, 255, 0.5);
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

@media (max-width: 1024px) {
  .hero-intro,
  .news-editorial-grid {
    grid-template-columns: 1fr;
  }

  .intro-aside {
    max-width: 420px;
  }
}

@media (max-width: 820px) {
  .left-sub-grid {
    grid-template-columns: 1fr;
  }

  .more-article-card {
    grid-template-columns: 1fr;
  }

  .more-card-text {
    padding: 0 0.95rem 0.95rem;
  }
}

@media (max-width: 640px) {
  .portal-shell {
    padding-top: 0.5rem;
  }

  .hero-intro {
    padding: 1.2rem;
    border-radius: 22px;
  }

  .loading-grid {
    grid-template-columns: 1fr;
  }

  .secondary-story-card.compact {
    flex-direction: column;
  }

  .featured-media.small {
    width: 100%;
    height: 140px;
  }
}
</style>
