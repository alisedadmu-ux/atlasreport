<template>
  <div class="home-page">
    <div class="site-container">
      <!-- Masthead strip -->
      <div class="home-masthead">
        <span class="live-indicator" aria-label="Live updates">
          <span class="live-dot" aria-hidden="true"></span>
          Live updates
        </span>
        <span class="home-date">{{ currentFormattedDate }}</span>
      </div>

      <!-- Section bar (top) -->
      <nav class="home-section-bar" aria-label="News sections">
        <div class="home-section-pills">
          <NuxtLink
            v-for="cat in categories"
            :key="cat.id"
            :to="`/?cat=${cat.id}`"
            :class="['home-pill', { 'home-pill-active': currentCategory === cat.id }]"
            :aria-current="currentCategory === cat.id ? 'true' : undefined"
          >
            <span class="home-pill-emoji" aria-hidden="true">{{ cat.emoji }}</span>
            {{ cat.name }}
          </NuxtLink>
        </div>
        <NuxtLink to="/" class="home-top-stories" :class="{ 'home-top-stories-active': currentCategory === 'general' }">
          <span class="home-top-stories-dot" aria-hidden="true"></span>
          Top Stories
        </NuxtLink>
      </nav>

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

      <!-- Empty State -->
      <div v-else-if="!viewArticles.length" class="empty-state">
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
        <NuxtLink to="/" class="btn btn-secondary btn-sm">Back to Top Stories</NuxtLink>
      </div>

      <!-- Front page -->
      <div v-else class="home-front">
        <!-- Lead + Featured -->
        <div class="home-lead-row">
          <NuxtLink
            v-if="leadArticle"
            :to="`/news/${leadArticle.id}`"
            class="hero-card card-interactive"
            :aria-label="'Read article: ' + leadArticle.title"
          >
            <div class="hero-card-media">
              <img :src="leadArticle.image" :alt="leadArticle.title" loading="eager" @error="onImageError($event, leadArticle)" />
              <div class="hero-card-overlay">
                <span class="hero-card-badge">Top story</span>
              </div>
            </div>
            <div class="hero-card-body">
              <div class="card-kicker">{{ leadArticle.category }}</div>
              <h2 class="hero-card-title">{{ leadArticle.title }}</h2>
              <p class="card-excerpt">{{ leadArticle.description }}</p>
              <div class="card-meta">
                <span class="card-author">By {{ leadArticle.author }}</span>
                <span class="meta-sep">·</span>
                <time class="card-time">{{ formatDate(leadArticle.published) }}</time>
              </div>
            </div>
          </NuxtLink>

          <div v-if="featuredArticles.length" class="home-featured">
            <NuxtLink
              v-for="article in featuredArticles"
              :key="article.id"
              :to="`/news/${article.id}`"
              class="secondary-card card-interactive"
              :aria-label="'Read article: ' + article.title"
            >
              <div class="secondary-card-media">
                <img :src="article.image" :alt="article.title" loading="lazy" @error="onImageError($event, article)" />
              </div>
              <div class="secondary-card-body">
                <div class="card-kicker">{{ article.category }}</div>
                <h3 class="secondary-card-title">{{ article.title }}</h3>
                <p class="card-excerpt">{{ truncateText(article.description, 110) }}</p>
                <div class="card-meta">
                  <span>{{ formatDate(article.published) }}</span>
                </div>
              </div>
            </NuxtLink>
          </div>
        </div>

        <div class="home-body-grid">
          <div class="home-main">
            <!-- Latest river -->
            <section class="home-zone">
              <div class="zone-header">
                <div>
                  <p class="kicker">Latest</p>
                  <h2 class="section-title">Latest news</h2>
                </div>
              </div>
              <div class="latest-river">
                <NuxtLink
                  v-for="article in latestArticlesPaged"
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
                    <h3 class="list-card-title">{{ article.title }}</h3>
                    <p class="card-excerpt">{{ truncateText(article.description, 160) }}</p>
                    <div class="card-meta">
                      <span class="card-author">By {{ article.author }}</span>
                      <span class="meta-sep">·</span>
                      <time>{{ formatDate(article.published) }}</time>
                    </div>
                  </div>
                </NuxtLink>

                <div v-if="hasMoreLatest" class="latest-more">
                  <button class="btn btn-secondary btn-load-more" @click="loadMoreLatest">
                    Load more stories
                  </button>
                </div>
              </div>
            </section>

            <!-- Category sections (Top Stories view only) -->
            <template v-if="currentCategory === 'general'">
              <section v-for="grp in sectionGroupsPaged" :key="grp.id" class="home-zone cat-section">
                <div class="zone-header">
                  <div>
                    <p class="kicker">{{ grp.label }}</p>
                    <h2 class="section-title">{{ grp.label }}</h2>
                  </div>
                  <NuxtLink :to="`/?cat=${grp.id}`" class="zone-more link-accent">More in {{ grp.label }}</NuxtLink>
                </div>
                <div class="cat-section-grid">
                  <NuxtLink
                    v-for="article in grp.items"
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
                      <h3 class="list-card-title">{{ article.title }}</h3>
                      <p class="card-excerpt">{{ truncateText(article.description, 140) }}</p>
                      <div class="card-meta">
                        <span class="card-author">By {{ article.author }}</span>
                        <span class="meta-sep">·</span>
                        <time>{{ formatDate(article.published) }}</time>
                      </div>
                    </div>
                  </NuxtLink>
                </div>
              </section>
            </template>

            <div v-if="currentCategory === 'general' && hasMoreSections" class="latest-more">
              <button class="btn btn-secondary btn-load-more" @click="loadMoreSections">
                Load more sections
              </button>
            </div>
          </div>

          <aside class="home-sidebar">
            <!-- Most read -->
            <div class="sidebar-card">
              <div class="sidebar-header">
                <p class="sidebar-label">Most read</p>
                <span class="badge badge-accent">Today</span>
              </div>
              <div class="trending-list">
                <NuxtLink
                  v-for="(article, index) in mostRead"
                  :key="'trend-' + article.id"
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
                    <h4 class="trending-title">{{ article.title }}</h4>
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
                <NuxtLink
                  v-for="cat in categories"
                  :key="'topic-' + cat.id"
                  :to="`/?cat=${cat.id}`"
                  :class="['topic-chip', { 'topic-chip-active': currentCategory === cat.id }]"
                >
                  <span class="topic-emoji" aria-hidden="true">{{ cat.emoji }}</span>
                  {{ cat.name }}
                </NuxtLink>
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

        <!-- Recommended -->
        <section v-if="recommendedArticles.length" class="home-zone home-recommended">
          <div class="zone-header">
            <div>
              <p class="kicker">For you</p>
              <h2 class="section-title">Recommended reading</h2>
            </div>
          </div>
          <div class="recommended-grid">
            <NuxtLink
              v-for="article in recommendedArticles"
              :key="article.id"
              :to="`/news/${article.id}`"
              class="secondary-card card-interactive"
              :aria-label="'Read article: ' + article.title"
            >
              <div class="secondary-card-media">
                <img :src="article.image" :alt="article.title" loading="lazy" @error="onImageError($event, article)" />
              </div>
              <div class="secondary-card-body">
                <div class="card-kicker">{{ article.category }}</div>
                <h3 class="secondary-card-title">{{ article.title }}</h3>
                <p class="card-excerpt">{{ truncateText(article.description, 110) }}</p>
                <div class="card-meta">
                  <span>{{ formatDate(article.published) }}</span>
                </div>
              </div>
            </NuxtLink>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRoute } from 'vue-router'
import { fallbackArticles } from '~/data/fallback-articles'
import { truncateText, CATEGORY_GRADIENTS, CATEGORIES, dedupeArticles } from '~/utils/format'
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
const LATEST_PAGE_SIZE = 8
const latestVisibleCount = ref(LATEST_PAGE_SIZE)
const SECTION_PAGE_SIZE = 3
const sectionVisibleCount = ref(SECTION_PAGE_SIZE)

watch(() => route.query.cat, (newCat) => {
  currentCategory.value = newCat || 'general'
  latestVisibleCount.value = LATEST_PAGE_SIZE
  sectionVisibleCount.value = SECTION_PAGE_SIZE
})

const adminEmails = computed(() => {
  const raw = config.public.adminEmail || 'alisedadmu@gmail.com'
  return raw.split(',').map(e => e.trim()).filter(Boolean)
})
const isAdmin = computed(() => user.value?.email ? adminEmails.value.includes(user.value.email) : false)

const categories = CATEGORIES

const currentCategoryLabel = computed(() => {
  const cat = categories.find(c => c.id === currentCategory.value)
  return cat ? cat.name : 'General'
})

const filteredArticles = computed(() => {
  return articles.value.filter(art => art.category === currentCategory.value)
})

const viewArticles = computed(() => {
  return currentCategory.value === 'general' ? articles.value : filteredArticles.value
})

const leadArticle = computed(() => viewArticles.value[0] || null)

const featuredArticles = computed(() => viewArticles.value.slice(1, 4))

const latestArticles = computed(() => {
  return [...viewArticles.value].sort((a, b) => new Date(b.published).getTime() - new Date(a.published).getTime())
})

const latestArticlesPaged = computed(() => {
  return latestArticles.value.slice(0, latestVisibleCount.value)
})

const hasMoreLatest = computed(() => {
  return latestVisibleCount.value < latestArticles.value.length
})

const loadMoreLatest = () => {
  if (hasMoreLatest.value) latestVisibleCount.value += LATEST_PAGE_SIZE
}

const mostRead = computed(() => viewArticles.value.slice(0, 6))

const recommendedArticles = computed(() => {
  const exclude = new Set([
    leadArticle.value?.id,
    ...featuredArticles.value.map(a => a.id)
  ].filter(Boolean))
  return viewArticles.value.filter(a => !exclude.has(a.id)).slice(0, 3)
})

const sectionGroups = computed(() => {
  const order = ['general', 'technology', 'sports', 'science', 'business', 'health']
  return order.map(cat => {
    const meta = categories.find(c => c.id === cat)
    const items = articles.value.filter(a => a.category === cat).slice(0, 4)
    return { id: cat, label: meta?.name || cat, items }
  }).filter(g => g.items.length)
})

const sectionGroupsPaged = computed(() => {
  return sectionGroups.value.slice(0, sectionVisibleCount.value)
})

const hasMoreSections = computed(() => {
  return sectionVisibleCount.value < sectionGroups.value.length
})

const loadMoreSections = () => {
  if (hasMoreSections.value) sectionVisibleCount.value += SECTION_PAGE_SIZE
}

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
      articles.value = dedupeArticles(data)
    } else {
      articles.value = dedupeArticles(fallbackArticles)
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
  padding: 1.5rem 0 0;
}

/* ===== Masthead strip ===== */
.home-masthead {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0 0 1rem;
  flex-wrap: wrap;
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

.home-date {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-text-muted);
  letter-spacing: 0.02em;
}

/* ===== Section bar (top) ===== */
.home-section-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0 0 1rem;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid var(--color-border);
  flex-wrap: wrap;
}

.home-section-pills {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
}

.home-pill {
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
  transition: all 0.2s ease;
  font-family: inherit;
  text-decoration: none;
}

.home-pill:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
  background: var(--color-accent-subtle);
}

.home-pill-active {
  background: var(--color-accent);
  color: var(--color-accent-contrast);
  border-color: var(--color-accent);
  box-shadow: var(--shadow-accent);
}

.home-pill-emoji {
  font-size: 0.85rem;
  line-height: 1;
}

.home-top-stories {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.45rem 0.95rem;
  border-radius: 9999px;
  border: 1.5px solid var(--color-secondary);
  background: var(--color-secondary);
  color: var(--color-secondary-contrast);
  font-size: 0.8125rem;
  font-weight: 700;
  text-decoration: none;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.home-top-stories:hover {
  background: var(--color-secondary-hover);
  border-color: var(--color-secondary-hover);
}

.home-top-stories-active {
  box-shadow: var(--shadow-sm);
}

.home-top-stories-dot {
  width: 7px;
  height: 7px;
  border-radius: 9999px;
  background: var(--color-highlight);
}

/* ===== Front page layout ===== */
.home-lead-row {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
  align-items: start;
}

.home-featured {
  display: grid;
  grid-template-rows: repeat(3, 1fr);
  gap: 1rem;
}

.home-body-grid {
  display: grid;
  grid-template-columns: 1.7fr 1fr;
  gap: 1.75rem;
  align-items: start;
}

.home-main {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  min-width: 0;
}

.home-sidebar {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  position: sticky;
  top: 140px;
}

.home-zone {
  scroll-margin-top: 100px;
}

.zone-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.25rem;
  padding-bottom: 0.85rem;
  border-bottom: 1px solid var(--color-border);
}

.zone-header .kicker {
  margin-bottom: 0.35rem;
}

.zone-more {
  font-size: 0.8125rem;
  font-weight: 700;
  text-decoration: none;
  white-space: nowrap;
}

.zone-more:hover {
  text-decoration: underline;
}

/* ===== Lead hero card ===== */
.hero-card {
  cursor: pointer;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  background: var(--color-card-bg);
  box-shadow: var(--shadow-md);
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
  text-decoration: none;
  color: inherit;
  height: 100%;
}

.hero-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
  border-color: var(--color-border-strong);
}

.hero-card-media {
  position: relative;
  height: 380px;
  overflow: hidden;
  background: var(--color-bg-alt);
}

.hero-card-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.hero-card:hover .hero-card-media img {
  transform: scale(1.03);
}

.hero-card-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 55%);
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
  color: var(--color-text);
  font-size: 0.6875rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.hero-card-body {
  padding: 1.5rem 1.75rem 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.hero-card-title {
  font-size: clamp(1.5rem, 2.6vw, 2.125rem);
  font-family: var(--font-serif);
  font-weight: 700;
  line-height: 1.18;
  color: var(--color-text);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* ===== Secondary card ===== */
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
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
  text-decoration: none;
  color: inherit;
}

.secondary-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
  border-color: var(--color-border-strong);
}

.secondary-card-media {
  height: 150px;
  overflow: hidden;
  background: var(--color-bg-alt);
}

.secondary-card-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.secondary-card:hover .secondary-card-media img {
  transform: scale(1.03);
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
  font-weight: 700;
  line-height: 1.35;
  font-family: var(--font-serif);
  color: var(--color-text);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* ===== List card ===== */
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
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
  text-decoration: none;
  color: inherit;
}

.list-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  border-color: var(--color-border-strong);
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
  transition: transform 0.5s ease;
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
  font-weight: 700;
  line-height: 1.35;
  font-family: var(--font-serif);
  color: var(--color-text);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.latest-river {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.latest-more {
  display: flex;
  justify-content: center;
  padding: 1.25rem 0 0.5rem;
}

.btn-load-more {
  min-width: 220px;
  font-weight: 700;
}

.cat-section-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.85rem;
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

/* ===== Sidebar ===== */
.sidebar-card {
  border-radius: var(--radius-lg);
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
  color: var(--color-accent-contrast);
  border-color: var(--color-accent);
}

.trending-media {
  width: 3.5rem;
  height: 2.75rem;
  border-radius: var(--radius-sm);
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
  font-weight: 700;
  line-height: 1.35;
  color: var(--color-text);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.sidebar-newsletter {
  background: var(--color-accent-subtle);
  border-color: var(--color-accent-light);
}

.sidebar-newsletter-label {
  color: var(--color-accent);
}

.sidebar-newsletter-title {
  font-family: var(--font-serif);
  font-size: 1.25rem;
  font-weight: 700;
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
  transition: all 0.2s ease;
  text-decoration: none;
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
  border-radius: var(--radius-base);
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
  font-weight: 700;
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

/* ===== Recommended ===== */
.recommended-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

/* ===== Empty State ===== */
.empty-state {
  text-align: center;
  padding: 5rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.empty-icon {
  color: var(--color-text-muted);
  margin-bottom: 0.25rem;
  opacity: 0.5;
}

.empty-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-text);
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
  .home-lead-row {
    grid-template-columns: 1fr;
  }

  .home-body-grid {
    grid-template-columns: 1fr;
  }

  .home-sidebar {
    position: static;
  }

  .skeleton-grid {
    grid-template-columns: 1fr;
  }

  .skeleton-secondary-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .hero-card-media {
    height: 260px;
  }

  .hero-card-title {
    font-size: 1.5rem;
  }

  .cat-section-grid {
    grid-template-columns: 1fr;
  }

  .recommended-grid {
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

  .home-section-bar {
    gap: 0.75rem;
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

  .zone-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.6rem;
  }
}
</style>
