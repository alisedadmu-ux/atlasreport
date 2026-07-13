<template>
  <div class="home-page">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-content">
        <div class="hero-eyebrow">
          <span class="live-indicator" aria-label="Live updates">
            <span class="live-dot" aria-hidden="true"></span>
            Live updates
          </span>
          <span class="hero-date">{{ currentFormattedDate }}</span>
        </div>
        <h1 class="hero-title">
          <span class="hero-title-accent">Stay current</span> with the latest global reporting.
        </h1>
        <p class="hero-subtitle">Verified journalism, sharp analysis, and a beautifully paced reading experience designed for modern readers.</p>
      </div>
      <div class="hero-stats">
        <div class="hero-stat">
          <span class="hero-stat-value">{{ filteredArticles.length }}</span>
          <span class="hero-stat-label">stories</span>
        </div>
        <div class="hero-stat">
          <span class="hero-stat-value">{{ categories.length }}</span>
          <span class="hero-stat-label">categories</span>
        </div>
      </div>
    </section>

    <!-- Category Bar -->
    <div class="category-bar">
      <div class="category-pills" role="tablist" aria-label="News categories">
        <button
          v-for="cat in categories"
          :key="cat.id"
          :class="['cat-pill', { 'cat-pill-active': currentCategory === cat.id }]"
          @click="currentCategory = cat.id"
          role="tab"
          :aria-selected="currentCategory === cat.id"
        >
          <span class="cat-emoji" aria-hidden="true">{{ cat.emoji }}</span>
          {{ cat.name }}
        </button>
      </div>
      <div class="category-actions">
        <button v-if="isAdmin" @click="fetchLatestNews" :disabled="fetchLoading" class="btn btn-secondary btn-sm fetch-btn">
          <RefreshCw v-if="fetchLoading" class="spin-icon" />
          <RefreshCw v-else class="fetch-icon" />
          {{ fetchLoading ? 'Fetching' : 'Fetch News' }}
        </button>
        <span v-if="fetchStatus" :class="['fetch-status', fetchStatus.includes('error') ? 'status-error' : 'status-success']" role="status">
          {{ fetchStatus }}
        </span>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-states" aria-busy="true" aria-label="Loading articles">
      <div class="skeleton-grid">
        <div class="skeleton-main-col">
          <div class="skeleton-card-hero">
            <div class="skeleton skeleton-media-hero"></div>
            <div class="skeleton-card-body">
              <div class="skeleton skeleton-badge" style="width: 100px;"></div>
              <div class="skeleton skeleton-title-lg" style="width: 90%;"></div>
              <div class="skeleton skeleton-text" style="width: 70%;"></div>
              <div class="skeleton skeleton-text-sm" style="width: 40%;"></div>
            </div>
          </div>
          <div class="skeleton-secondary-grid">
            <div v-for="i in 3" :key="'sec-sk-' + i" class="skeleton-card-sm">
              <div class="skeleton skeleton-media-sm"></div>
              <div class="skeleton skeleton-title" style="width: 80%;"></div>
              <div class="skeleton skeleton-text" style="width: 100%;"></div>
            </div>
          </div>
        </div>
        <div class="skeleton-sidebar-col">
          <div v-for="i in 3" :key="'side-sk-' + i" class="skeleton-card-trend">
            <div class="skeleton skeleton-rank"></div>
            <div class="skeleton skeleton-media-xs"></div>
            <div class="skeleton skeleton-title" style="width: 60%;"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Articles Grid -->
    <div v-else-if="filteredArticles.length > 0">
      <div class="section-header">
        <div>
          <p class="section-eyebrow">Featured coverage</p>
          <h2 class="section-title">{{ filteredArticles.length }} stor{{ filteredArticles.length === 1 ? 'y' : 'ies' }} in {{ currentCategoryLabel }}</h2>
        </div>
        <button v-if="filteredArticles.length > ARTICLES_PER_PAGE" @click="showAll = !showAll" class="btn btn-ghost btn-sm view-toggle">
          {{ showAll ? 'Show less' : 'View all' }}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" :class="['view-toggle-icon', { 'rotated': showAll }]">
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </button>
      </div>

      <div class="editorial-grid">
        <section class="editorial-main">
          <!-- Hero Card (first article) -->
          <NuxtLink
            v-if="visibleArticles[0]"
            :to="`/news/${visibleArticles[0].id}`"
            class="hero-card card-interactive"
            :aria-label="'Read article: ' + visibleArticles[0].title"
          >
            <div class="hero-card-media">
              <img :src="visibleArticles[0].image" :alt="visibleArticles[0].title" loading="eager" @error="onImageError($event, visibleArticles[0])" />
              <div class="hero-card-overlay">
                <span class="hero-card-badge">Top story</span>
              </div>
            </div>
            <div class="hero-card-body">
              <div class="card-kicker">{{ visibleArticles[0].category }}</div>
              <h3 class="hero-card-title">{{ visibleArticles[0].title }}</h3>
              <p class="card-excerpt">{{ visibleArticles[0].description }}</p>
              <div class="card-meta">
                <span class="card-author">By {{ visibleArticles[0].author }}</span>
                <span class="meta-sep">·</span>
                <time class="card-time">{{ formatDate(visibleArticles[0].published) }}</time>
              </div>
            </div>
          </NuxtLink>

          <!-- Secondary Grid (articles 2-4) -->
          <div class="secondary-grid">
            <NuxtLink
              v-for="(article, index) in visibleArticles.slice(1, 4)"
              :key="'sec-' + index"
              :to="`/news/${article.id}`"
              class="secondary-card card-interactive"
              :aria-label="'Read article: ' + article.title"
            >
              <div class="secondary-card-media">
                <img :src="article.image" :alt="article.title" loading="lazy" @error="onImageError($event, article)" />
              </div>
              <div class="secondary-card-body">
                <div class="card-kicker">{{ article.category }}</div>
                <h4 class="secondary-card-title">{{ article.title }}</h4>
                <p class="card-excerpt">{{ truncateText(article.description, 110) }}</p>
                <div class="card-meta">
                  <span>{{ formatDate(article.published) }}</span>
                </div>
              </div>
            </NuxtLink>
          </div>

           <!-- More Stories (everything beyond the initial page) -->
           <div v-if="showAll" class="more-stories">
            <NuxtLink
              v-for="article in visibleArticles.slice(10)"
              :key="article.id"
              :to="`/news/${article.id}`"
              class="list-card card-interactive"
              :aria-label="'Read article: ' + article.title"
            >
              <div class="list-card-media">
                <img :src="article.image" :alt="article.title" loading="lazy" @error="onImageError($event, article)" />
              </div>
              <div class="list-card-body">
                <div class="card-kicker">{{ article.category }}</div>
                <h4 class="list-card-title">{{ article.title }}</h4>
                <p class="card-excerpt">{{ truncateText(article.description, 160) }}</p>
                <div class="card-meta">
                  <span class="card-author">By {{ article.author }}</span>
                  <span class="meta-sep">·</span>
                  <time>{{ formatDate(article.published) }}</time>
                </div>
              </div>
            </NuxtLink>
          </div>
        </section>

        <!-- Sidebar: Trending + supplementary widgets -->
        <aside class="editorial-sidebar">
          <div class="sidebar-card">
            <div class="sidebar-header">
              <p class="sidebar-label">Trending now</p>
              <span class="badge badge-accent">Updated</span>
            </div>
            <div class="trending-list">
              <NuxtLink
                v-for="(article, index) in visibleArticles.slice(4, 10)"
                :key="'trend-' + index"
                :to="`/news/${article.id}`"
                class="trending-card card-interactive"
                :aria-label="'Read article: ' + article.title"
              >
                <span class="trending-rank" :class="'trending-rank-' + (index + 1)">{{ index + 1 }}</span>
                <div class="trending-media">
                  <img :src="article.image" :alt="article.title" loading="lazy" @error="onImageError($event, article)" />
                </div>
                <div class="trending-body">
                  <div class="card-kicker">{{ article.category }}</div>
                  <h5 class="trending-title">{{ article.title }}</h5>
                </div>
              </NuxtLink>
            </div>
          </div>

          <!-- Newsletter signup -->
          <div class="sidebar-card sidebar-newsletter">
            <p class="sidebar-label sidebar-newsletter-label">The Daily Brief</p>
            <h4 class="sidebar-newsletter-title">Stay ahead of the story</h4>
            <p class="sidebar-newsletter-desc">Get the day's most important reporting delivered to your inbox. No noise, just signal.</p>
            <NewsletterSubscribe compact />
          </div>

          <!-- Popular Topics -->
          <div class="sidebar-card">
            <div class="sidebar-header">
              <p class="sidebar-label">Popular topics</p>
            </div>
            <div class="topic-chips">
              <button
                v-for="cat in categories"
                :key="'topic-' + cat.id"
                :class="['topic-chip', { 'topic-chip-active': currentCategory === cat.id }]"
                @click="currentCategory = cat.id"
              >
                <span class="topic-emoji" aria-hidden="true">{{ cat.emoji }}</span>
                {{ cat.name }}
              </button>
            </div>
          </div>

          <!-- Editor's Picks -->
          <div v-if="editorsPicks.length" class="sidebar-card">
            <div class="sidebar-header">
              <p class="sidebar-label">Editor's picks</p>
              <span class="badge badge-dark">Curated</span>
            </div>
            <div class="picks-list">
              <NuxtLink
                v-for="article in editorsPicks"
                :key="'pick-' + article.id"
                :to="`/news/${article.id}`"
                class="pick-card card-interactive"
                :aria-label="'Read article: ' + article.title"
              >
                <div class="pick-media">
                  <img :src="article.image" :alt="article.title" loading="lazy" @error="onImageError($event, article)" />
                </div>
                <div class="pick-body">
                  <div class="card-kicker">{{ article.category }}</div>
                  <h5 class="pick-title">{{ article.title }}</h5>
                  <span class="pick-time">{{ formatDate(article.published) }}</span>
                </div>
              </NuxtLink>
            </div>
          </div>
        </aside>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state">
      <div class="empty-icon">
        <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          <path d="M12 6v7" />
          <path d="M9 9l3-3 3 3" />
        </svg>
      </div>
      <p class="empty-title">No stories in this section yet</p>
      <p class="empty-desc">Check back soon for the latest coverage. We're curating the most important stories for you.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRoute } from 'vue-router'
import { fallbackArticles } from '~/data/fallback-articles'
import { truncateText, CATEGORY_GRADIENTS } from '~/utils/format'
import { RefreshCw } from '@lucide/vue'
import NewsletterSubscribe from '~/components/NewsletterSubscribe.vue'

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const route = useRoute()
const config = useRuntimeConfig()

const articles = ref([])
const loading = ref(true)
const currentCategory = ref(route.query.cat || 'general')
const fetchStatus = ref('')
const fetchLoading = ref(false)
const showAll = ref(false)
const ARTICLES_PER_PAGE = 8

watch(() => route.query.cat, (newCat) => {
  if (newCat) currentCategory.value = newCat
  showAll.value = false
})

const adminEmails = computed(() => {
  const raw = config.public.adminEmail || 'alisedadmu@gmail.com'
  return raw.split(',').map(e => e.trim()).filter(Boolean)
})
const isAdmin = computed(() => user.value?.email ? adminEmails.value.includes(user.value.email) : false)

const categories = [
  { id: 'general', name: 'World', emoji: '🌍' },
  { id: 'technology', name: 'Tech', emoji: '💻' },
  { id: 'sports', name: 'Sports', emoji: '⚽' },
  { id: 'science', name: 'Science', emoji: '🔬' },
  { id: 'business', name: 'Business', emoji: '📈' },
  { id: 'health', name: 'Health', emoji: '🏥' }
]

const currentCategoryLabel = computed(() => {
  const cat = categories.find(c => c.id === currentCategory.value)
  return cat ? cat.name : 'General'
})

const filteredArticles = computed(() => {
  return articles.value.filter(art => art.category === currentCategory.value)
})

const visibleArticles = computed(() => {
  if (showAll.value) return filteredArticles.value
  return filteredArticles.value.slice(0, ARTICLES_PER_PAGE)
})

const editorsPicks = computed(() => {
  const topIds = new Set(filteredArticles.value.slice(0, 10).map(a => a.id))
  return filteredArticles.value.filter(a => !topIds.has(a.id)).slice(0, 3)
})

const currentFormattedDate = ref('')

const updateFormattedDate = () => {
  currentFormattedDate.value = new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
}

const fetchLatestNews = async () => {
  fetchLoading.value = true
  fetchStatus.value = ''
  try {
    const res = await fetch('/api/fetch-news')
    const data = await res.json()
    if (data.success) {
      fetchStatus.value = data.message
      await fetchArticles()
    } else {
      fetchStatus.value = `Error: ${data.error || 'Unknown error'}`
    }
  } catch (err) {
    fetchStatus.value = 'Error: Network error'
  }
  fetchLoading.value = false
  setTimeout(() => { fetchStatus.value = '' }, 5000)
}

const fetchArticles = async (showLoading = true) => {
  if (showLoading) loading.value = true
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

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

const categoryGradients = CATEGORY_GRADIENTS

const onImageError = (event, article) => {
  const img = event.target
  const wrapper = img.closest('.hero-card-media, .secondary-card-media, .list-card-media, .trending-media')
  if (wrapper) {
    const category = article?.category || currentCategory.value
    const gradient = categoryGradients[category] || categoryGradients.general
    wrapper.innerHTML = `<div class="img-placeholder" style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:${gradient.bg};font-size:2.5rem;">${gradient.emoji}</div>`
  }
}

let subscription = null

onMounted(async () => {
  updateFormattedDate()
  await fetchArticles()
  subscription = supabase
    .channel('articles-feed')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'articles' }, async () => await fetchArticles(false))
    .subscribe()
})

onBeforeUnmount(() => {
  if (subscription) supabase.removeChannel(subscription)
})
</script>

<style scoped>
.home-page {
  padding: 2rem 0 0;
}

/* ===== Hero Section ===== */
.hero-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  padding: 2.5rem 2.5rem;
  margin-bottom: 2rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-2xl);
  background: linear-gradient(135deg, var(--color-bg-alt) 0%, var(--color-bg) 100%);
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -20%;
  width: 50%;
  height: 200%;
  background: radial-gradient(ellipse at center, rgba(37, 99, 235, 0.04) 0%, transparent 70%);
  pointer-events: none;
}

.hero-content {
  flex: 1;
  min-width: 0;
  position: relative;
  z-index: 1;
}

.hero-eyebrow {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.75rem;
  flex-wrap: wrap;
}

.hero-date {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-text-muted);
  letter-spacing: 0.02em;
}

.live-indicator {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.6875rem;
  font-weight: 800;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--color-text);
  padding: 0.4rem 0.85rem;
  border-radius: 9999px;
  border: 1px solid var(--color-border);
  background: var(--color-card-bg);
  box-shadow: var(--shadow-xs);
}

.live-dot {
  width: 7px;
  height: 7px;
  border-radius: 9999px;
  background: var(--color-success);
  animation: pulse-dot 2s ease-in-out infinite;
}

.hero-title {
  margin: 0.6rem 0 0.9rem;
  font-size: clamp(1.875rem, 3.5vw, 2.75rem);
  line-height: 1.1;
  max-width: 680px;
  font-family: 'Playfair Display', Georgia, serif;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.hero-title-accent {
  display: block;
  color: var(--color-accent);
}

.hero-subtitle {
  font-size: 1.0625rem;
  line-height: 1.7;
  color: var(--color-text-secondary);
  max-width: 540px;
}

.hero-stats {
  display: flex;
  gap: 0.75rem;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
}

.hero-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
  padding: 0.85rem 1.25rem;
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  background: var(--color-card-bg);
  box-shadow: var(--shadow-xs);
}

.hero-stat-value {
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--color-text);
  line-height: 1;
}

.hero-stat-label {
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-text-muted);
}

/* ===== Category Bar ===== */
.category-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0 0 1.25rem;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid var(--color-border);
  flex-wrap: wrap;
}

.category-pills {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
}

.cat-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.45rem 0.9rem;
  border-radius: 9999px;
  border: 1.5px solid var(--color-border);
  background: var(--color-card-bg);
  color: var(--color-text-secondary);
  font-size: 0.8125rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: var(--shadow-xs);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: inherit;
}

.cat-pill:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
  background: var(--color-accent-subtle);
}

.cat-pill-active {
  background: var(--color-accent);
  color: #fff;
  border-color: var(--color-accent);
  box-shadow: var(--shadow-accent);
}

.cat-pill-active:hover {
  background: var(--color-accent-hover);
  border-color: var(--color-accent-hover);
  color: #fff;
}

.cat-emoji {
  font-size: 0.85rem;
  line-height: 1;
}

.category-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.fetch-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}

.fetch-icon {
  width: 14px;
  height: 14px;
  stroke-width: 2.2;
}

.fetch-status {
  font-size: 0.75rem;
  font-weight: 700;
}

.status-error { color: var(--color-error); }
.status-success { color: var(--color-success); }

.spin-icon {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* ===== Section Header ===== */
.section-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 0.85rem;
  border-bottom: 1px solid var(--color-border);
}

.section-eyebrow {
  font-size: 0.6875rem;
  font-weight: 800;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--color-accent);
  margin-bottom: 0.35rem;
}

.section-title {
  font-weight: 800;
  font-size: clamp(1.15rem, 2.5vw, 1.65rem);
}

.view-toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.8125rem;
}

.view-toggle-icon {
  transition: transform 0.3s ease;
}

.view-toggle-icon.rotated {
  transform: rotate(180deg);
}

/* ===== Editorial Grid ===== */
.editorial-grid {
  display: grid;
  grid-template-columns: 1.75fr 1fr;
  gap: 1.75rem;
  align-items: start;
}

.editorial-main {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.secondary-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.more-stories {
  margin-top: 0.75rem;
  padding-top: 1.25rem;
  border-top: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

/* ===== Hero Card ===== */
.hero-card {
  cursor: pointer;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  border-radius: var(--radius-xl);
  border: 1px solid var(--color-border);
  background: var(--color-card-bg);
  box-shadow: var(--shadow-md);
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  text-decoration: none;
  color: inherit;
}

.hero-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
  border-color: var(--color-accent-light);
}

.hero-card-media {
  position: relative;
  height: 400px;
  overflow: hidden;
  background: var(--color-bg-alt);
}

.hero-card-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.hero-card:hover .hero-card-media img {
  transform: scale(1.04);
}

.hero-card-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 55%);
  pointer-events: none;
}

.hero-card-badge {
  position: absolute;
  top: 1rem;
  left: 1rem;
  display: inline-block;
  padding: 0.35rem 0.8rem;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(8px);
  color: var(--color-text);
  font-size: 0.6875rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.hero-card-body {
  padding: 1.5rem 1.75rem 1.75rem;
}

.hero-card-title {
  font-size: 1.5rem;
  font-family: 'Playfair Display', Georgia, serif;
  font-weight: 800;
  line-height: 1.2;
  color: var(--color-text);
  margin-bottom: 0.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* ===== Secondary Card ===== */
.secondary-card {
  height: 100%;
  cursor: pointer;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  background: var(--color-card-bg);
  box-shadow: var(--shadow-base);
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  text-decoration: none;
  color: inherit;
}

.secondary-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
  border-color: var(--color-accent-light);
}

.secondary-card-media {
  height: 160px;
  overflow: hidden;
  background: var(--color-bg-alt);
}

.secondary-card-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.secondary-card:hover .secondary-card-media img {
  transform: scale(1.04);
}

.secondary-card-body {
  padding: 1rem 1rem 1.25rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.secondary-card-title {
  font-size: 1rem;
  font-weight: 800;
  line-height: 1.35;
  color: var(--color-text);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* ===== List Card ===== */
.list-card {
  cursor: pointer;
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 1.25rem;
  overflow: hidden;
  align-items: center;
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  background: var(--color-card-bg);
  box-shadow: var(--shadow-base);
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  text-decoration: none;
  color: inherit;
}

.list-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
  border-color: var(--color-accent-light);
}

.list-card-media {
  height: 130px;
  overflow: hidden;
  background: var(--color-bg-alt);
}

.list-card-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.list-card:hover .list-card-media img {
  transform: scale(1.03);
}

.list-card-body {
  padding: 0.75rem 1.25rem 0.75rem 0;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.list-card-title {
  font-size: 1.0625rem;
  font-weight: 800;
  line-height: 1.35;
  color: var(--color-text);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* ===== Card Typography ===== */
.card-kicker {
  font-size: 0.6875rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-accent);
  margin-bottom: 0.25rem;
}

.card-excerpt {
  font-size: 0.875rem;
  line-height: 1.6;
  color: var(--color-text-secondary);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-text-muted);
  margin-top: auto;
  padding-top: 0.5rem;
}

.card-author {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-time {
  white-space: nowrap;
}

.meta-sep {
  color: var(--color-border);
}

/* ===== Trending Sidebar ===== */
.sidebar-card {
  position: sticky;
  top: 88px;
  border-radius: var(--radius-xl);
  border: 1px solid var(--color-border);
  background: var(--color-card-bg);
  padding: 1.5rem;
  box-shadow: var(--shadow-md);
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 1.1rem;
}

.sidebar-label {
  font-size: 0.6875rem;
  font-weight: 800;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--color-text);
}

.trending-list {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.trending-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.65rem 0.65rem;
  border-radius: var(--radius-base);
  cursor: pointer;
  border: 1px solid transparent;
  transition: all 0.2s ease;
  text-decoration: none;
  color: inherit;
}

.trending-card:hover {
  background: var(--color-bg-alt);
  border-color: var(--color-border);
  transform: translateX(3px);
}

.trending-rank {
  width: 1.75rem;
  height: 1.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  font-size: 0.6875rem;
  font-weight: 800;
  color: var(--color-text-muted);
  flex-shrink: 0;
  border: 1px solid var(--color-border);
  background: var(--color-bg-alt);
}

.trending-rank-1 {
  background: var(--color-accent);
  color: #fff;
  border-color: var(--color-accent);
}

.trending-media {
  width: 3.5rem;
  height: 2.75rem;
  border-radius: 0.5rem;
  overflow: hidden;
  background: var(--color-bg-alt);
  flex-shrink: 0;
}

.trending-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.trending-body {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  min-width: 0;
  flex: 1;
}

.trending-title {
  font-size: 0.85rem;
  font-weight: 800;
  line-height: 1.35;
  color: var(--color-text);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* ===== Sidebar supplementary widgets ===== */
.sidebar-newsletter {
  background: linear-gradient(150deg, var(--color-accent-subtle) 0%, var(--color-card-bg) 70%);
  border-color: var(--color-accent-light);
}

.sidebar-newsletter-label {
  color: var(--color-accent);
}

.sidebar-newsletter-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--color-text);
  margin: 0.35rem 0 0.4rem;
  line-height: 1.2;
}

.sidebar-newsletter-desc {
  font-size: 0.825rem;
  line-height: 1.55;
  color: var(--color-text-secondary);
  margin-bottom: 1rem;
}

.sidebar-newsletter :deep(.newsletter-box) {
  border: none;
  background: transparent;
  padding: 0;
  box-shadow: none;
}

.sidebar-newsletter :deep(.newsletter-header) {
  display: none;
}

.sidebar-newsletter :deep(.newsletter-form) {
  margin: 0;
}

.topic-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.topic-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.45rem 0.85rem;
  border-radius: 9999px;
  border: 1.5px solid var(--color-border);
  background: var(--color-card-bg);
  color: var(--color-text-secondary);
  font-size: 0.8rem;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  box-shadow: var(--shadow-xs);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.topic-chip:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
  background: var(--color-accent-subtle);
}

.topic-chip-active {
  background: var(--color-secondary);
  color: var(--color-secondary-contrast);
  border-color: var(--color-secondary);
  box-shadow: var(--shadow-sm);
}

.topic-chip-active:hover {
  background: var(--color-secondary-hover);
  border-color: var(--color-secondary-hover);
  color: var(--color-secondary-contrast);
}

.topic-emoji {
  font-size: 0.85rem;
  line-height: 1;
}

.picks-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.pick-card {
  display: grid;
  grid-template-columns: 4.5rem 1fr;
  gap: 0.85rem;
  align-items: center;
  padding: 0.5rem;
  border-radius: var(--radius-base);
  border: 1px solid transparent;
  cursor: pointer;
  text-decoration: none;
  color: inherit;
  transition: all 0.2s ease;
}

.pick-card:hover {
  background: var(--color-bg-alt);
  border-color: var(--color-border);
  transform: translateX(3px);
}

.pick-media {
  width: 4.5rem;
  height: 4.5rem;
  border-radius: 0.6rem;
  overflow: hidden;
  background: var(--color-bg-alt);
  flex-shrink: 0;
}

.pick-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.pick-body {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
}

.pick-title {
  font-size: 0.875rem;
  font-weight: 800;
  line-height: 1.35;
  color: var(--color-text);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.pick-time {
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--color-text-muted);
}

/* ===== Empty State ===== */
.empty-state {
  text-align: center;
  padding: 6rem 1rem;
}

.empty-icon {
  color: var(--color-text-muted);
  margin-bottom: 1.25rem;
  opacity: 0.5;
}

.empty-title {
  font-size: 1.125rem;
  font-weight: 800;
  color: var(--color-text);
  margin-bottom: 0.5rem;
}

.empty-desc {
  font-size: 0.9375rem;
  color: var(--color-text-secondary);
  max-width: 400px;
  margin: 0 auto;
  line-height: 1.6;
}

/* ===== Loading States ===== */
.loading-states {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.skeleton-grid {
  display: grid;
  grid-template-columns: 1.75fr 1fr;
  gap: 1.5rem;
}

.skeleton-main-col {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.skeleton-card-hero {
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 1px solid var(--color-border);
  background: var(--color-bg-alt);
}

.skeleton-card-body {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.skeleton-secondary-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.skeleton-card-sm {
  border-radius: var(--radius-lg);
  padding: 1rem;
  background: var(--color-bg-alt);
  border: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.skeleton-sidebar-col {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.skeleton-card-trend {
  border-radius: var(--radius-lg);
  padding: 1rem;
  background: var(--color-bg-alt);
  border: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.skeleton-media-hero {
  width: 100%;
  height: 280px;
}

.skeleton-media-sm {
  width: 100%;
  height: 100px;
}

.skeleton-media-xs {
  width: 3.5rem;
  height: 2.75rem;
  flex-shrink: 0;
}

.skeleton-rank {
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 9999px;
  flex-shrink: 0;
}

.skeleton-badge {
  height: 1rem;
  border-radius: 9999px;
}

.skeleton-title-lg {
  height: 1.5rem;
  border-radius: 0.5rem;
}

.skeleton-text-sm {
  height: 0.75rem;
  border-radius: 0.375rem;
}

/* ===== Responsive ===== */
@media (max-width: 1024px) {
  .editorial-grid {
    grid-template-columns: 1fr;
  }

  .sidebar-card {
    position: static;
  }

  .secondary-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .skeleton-grid {
    grid-template-columns: 1fr;
  }

  .skeleton-secondary-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .hero-section {
    flex-direction: column;
    align-items: flex-start;
    padding: 1.75rem 1.5rem;
    gap: 1.25rem;
  }

  .hero-stats {
    width: 100%;
    justify-content: flex-start;
  }

  .hero-title {
    font-size: 1.625rem;
  }

  .hero-card-media {
    height: 280px;
  }

  .hero-card-body {
    padding: 1.15rem 1.25rem 1.35rem;
  }

  .hero-card-title {
    font-size: 1.25rem;
  }

  .secondary-grid {
    grid-template-columns: 1fr;
  }

  .list-card {
    grid-template-columns: 140px 1fr;
    gap: 0.85rem;
  }

  .list-card-media {
    height: 110px;
  }

  .list-card-body {
    padding-right: 0.85rem;
  }
}

@media (max-width: 480px) {
  .home-page {
    padding: 1rem 0 0;
  }

  .hero-section {
    padding: 1.25rem;
    border-radius: var(--radius-xl);
  }

  .hero-title {
    font-size: 1.375rem;
  }

  .list-card {
    grid-template-columns: 1fr;
  }

  .list-card-media {
    height: 180px;
  }

  .list-card-body {
    padding: 0 0.75rem 0.75rem;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.6rem;
  }
}
</style>