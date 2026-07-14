<template>
  <main class="article-page">
    <!-- Reading progress -->
    <div class="article-progress" ref="progressBar">
      <div class="article-progress-bar" :style="{ width: progressPercent + '%' }"></div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="article-loading site-container">
      <div class="skeleton skeleton-hero"></div>
      <div class="skeleton skeleton-text" style="max-width: 720px;"></div>
      <div class="skeleton skeleton-text" style="max-width: 560px;"></div>
    </div>

    <!-- Not Found -->
    <div v-else-if="!article" class="empty-state">
      <div class="empty-icon">
        <CircleAlert class="empty-icon-svg" />
      </div>
      <p class="empty-title">Article not found</p>
      <p class="empty-desc">The story you're looking for doesn't exist or has been removed.</p>
      <NuxtLink to="/" class="btn btn-primary"><ArrowLeft class="back-icon" style="width: 14px; height: 14px;" />Return to home</NuxtLink>
    </div>

    <!-- Article Content -->
    <div v-else class="site-container">
      <div class="article-layout">
        <article class="article-main">
          <NuxtLink to="/" class="back-link">
            <ArrowLeft class="back-icon" />
            Back to feed
          </NuxtLink>

          <header class="article-hero">
            <span class="kicker article-kicker">{{ article.category }}</span>
            <h1 class="article-hero-title">{{ article.title }}</h1>
            <p v-if="article.description" class="standfirst">{{ article.description }}</p>

            <div class="article-byline">
              <div class="author-avatar">
                <span>{{ getInitials(article.author || 'AR') }}</span>
              </div>
              <div class="byline-meta">
                <span class="author-name">{{ article.author }}</span>
                <span class="byline-sub">
                  <time>{{ formatDate(article.published) }}</time>
                  <span class="byline-dot">·</span>
                  <span>{{ readingTime }} min read</span>
                </span>
              </div>
            </div>
          </header>

          <figure class="article-hero-media" v-if="article.image" :style="imageFailed ? heroImageFallbackStyle() : undefined">
            <img v-if="!imageFailed" :src="article.image" :alt="article.title" loading="eager" @error="imageFailed = true" />
            <div v-else class="img-placeholder article-img-placeholder" aria-hidden="true">{{ heroImageFallbackEmoji() }}</div>
          </figure>

          <div class="article-body-container">
            <div class="article-content prose-content">
              <div
                v-for="(paragraph, index) in contentParagraphs"
                :key="index"
                class="article-paragraph"
                :class="{ 'article-paragraph-lead': index === 0 }"
              >
                <p>{{ paragraph }}</p>
              </div>
            </div>

            <div class="article-actions-bar">
              <div class="article-actions">
                <button class="action-btn" :class="{ 'action-active': copied }" @click="shareArticle" aria-label="Share article">
                  <Share2 class="action-icon" />
                  <span class="action-label">{{ copied ? 'Copied!' : 'Share' }}</span>
                </button>
                <button class="action-btn" :class="{ 'action-active': bookmarked }" @click="toggleBookmark" :aria-pressed="bookmarked" aria-label="Bookmark article">
                  <Bookmark class="action-icon" :fill="bookmarked ? 'currentColor' : 'none'" />
                  <span class="action-label">{{ bookmarked ? 'Saved' : 'Save' }}</span>
                </button>
              </div>
              <div class="article-actions-extra">
                <span class="article-action-hint">Enjoyed this? Share it with someone who needs to know.</span>
              </div>
            </div>
          </div>

          <!-- Related stories -->
          <div v-if="relatedArticles.length" class="related-section">
            <h2 class="related-heading">
              <span>Related stories</span>
              <span class="related-heading-line" aria-hidden="true"></span>
            </h2>
            <div class="related-grid">
              <NuxtLink
                v-for="ra in relatedArticles"
                :key="ra.id"
                :to="`/news/${ra.id}`"
                class="related-card card-interactive"
              >
                <div class="related-media">
                  <img :src="ra.image" :alt="ra.title" loading="lazy" @error="onRelatedImageError" />
                </div>
                <div class="related-body">
                  <span class="kicker">{{ ra.category }}</span>
                  <h3 class="related-title">{{ ra.title }}</h3>
                  <time class="related-date">{{ formatDate(ra.published) }}</time>
                </div>
              </NuxtLink>
            </div>
          </div>

          <!-- Prev / Next -->
          <nav v-if="prevArticle || nextArticle" class="article-prevnext" aria-label="More stories">
            <NuxtLink v-if="prevArticle" :to="`/news/${prevArticle.id}`" class="prevnext-card prevnext-prev card-interactive">
              <span class="prevnext-label">
                <ArrowLeft class="prevnext-arrow" />
                Previous
              </span>
              <span class="prevnext-title">{{ prevArticle.title }}</span>
            </NuxtLink>
            <span v-else class="prevnext-spacer"></span>
            <NuxtLink v-if="nextArticle" :to="`/news/${nextArticle.id}`" class="prevnext-card prevnext-next card-interactive">
              <span class="prevnext-label">
                Next
                <ArrowRight class="prevnext-arrow" />
              </span>
              <span class="prevnext-title">{{ nextArticle.title }}</span>
            </NuxtLink>
            <span v-else class="prevnext-spacer"></span>
          </nav>

          <div class="article-comments-section">
            <CommentsSection :article-id="article.id" />
          </div>
        </article>

        <aside class="article-sidebar">
          <div class="sidebar-rail">
            <button class="rail-btn" :class="{ 'action-active': copied }" @click="shareArticle" aria-label="Share article">
              <Share2 class="rail-icon" />
              <span class="rail-label">{{ copied ? 'Copied!' : 'Share' }}</span>
            </button>
            <button class="rail-btn" :class="{ 'action-active': bookmarked }" @click="toggleBookmark" :aria-pressed="bookmarked" aria-label="Bookmark article">
              <Bookmark class="rail-icon" :fill="bookmarked ? 'currentColor' : 'none'" />
              <span class="rail-label">{{ bookmarked ? 'Saved' : 'Save' }}</span>
            </button>
          </div>

          <div class="sidebar-section">
            <h2 class="sidebar-title">Story details</h2>
            <div class="detail-card">
              <div class="detail-row">
                <span>Category</span>
                <strong>{{ article.category }}</strong>
              </div>
              <div class="detail-row">
                <span>Published</span>
                <time>{{ formatDate(article.published) }}</time>
              </div>
              <div class="detail-row">
                <span>Author</span>
                <strong>{{ article.author }}</strong>
              </div>
              <div class="detail-row" v-if="article.source">
                <span>Source</span>
                <strong>{{ article.source }}</strong>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </main>
</template>

<script setup>
import { computed, onMounted, ref, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { fallbackArticles } from '~/data/fallback-articles'
import { getInitials, CATEGORY_GRADIENTS } from '~/utils/format'
import { CircleAlert, ArrowLeft, ArrowRight, Share2, Bookmark } from '@lucide/vue'

const route = useRoute()
const supabase = useSupabaseClient()

const article = ref(null)
const loading = ref(true)
const imageFailed = ref(false)
const copied = ref(false)
const bookmarked = ref(false)
const progressPercent = ref(0)
const progressBar = ref(null)

const contentParagraphs = computed(() => {
  if (!article.value?.content) return []
  if (Array.isArray(article.value.content)) return article.value.content
  return article.value.content.split('\n').filter(Boolean)
})

const readingTime = computed(() => {
  const text = article.value?.content || ''
  const wordCount = typeof text === 'string' ? text.split(/\s+/).length : text.length
  return Math.max(1, Math.ceil(wordCount / 200))
})

const categoryPlaceholders = CATEGORY_GRADIENTS

const heroImageFallbackStyle = () => {
  const category = article.value?.category || 'general'
  const ph = categoryPlaceholders[category] || categoryPlaceholders.general
  return { background: ph.bg }
}

const heroImageFallbackEmoji = () => {
  const category = article.value?.category || 'general'
  const ph = categoryPlaceholders[category] || categoryPlaceholders.general
  return ph.emoji
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
}

const sameCategory = computed(() => {
  if (!article.value) return []
  return fallbackArticles.filter(a => a.category === article.value.category && a.id !== article.value.id)
})

const relatedArticles = computed(() => {
  if (!article.value) return []
  return fallbackArticles
    .filter(a => a.id !== article.value.id && a.category === article.value.category)
    .slice(0, 3)
})

const currentIndex = computed(() => {
  if (!article.value) return -1
  return sameCategory.value.findIndex(a => a.id === article.value.id)
})

const prevArticle = computed(() => {
  if (currentIndex.value > 0) return sameCategory.value[currentIndex.value - 1]
  return null
})

const nextArticle = computed(() => {
  if (currentIndex.value >= 0 && currentIndex.value < sameCategory.value.length - 1) {
    return sameCategory.value[currentIndex.value + 1]
  }
  return null
})

const shareArticle = async () => {
  const shareData = { title: article.value?.title, url: window.location.href }
  try {
    if (navigator.share) {
      await navigator.share(shareData)
      copied.value = true
    } else {
      await navigator.clipboard.writeText(window.location.href)
      copied.value = true
    }
  } catch {
    try {
      await navigator.clipboard.writeText(window.location.href)
      copied.value = true
    } catch {
      copied.value = false
    }
  }
  setTimeout(() => { copied.value = false }, 2500)
}

const toggleBookmark = () => {
  bookmarked.value = !bookmarked.value
}

const onRelatedImageError = (event) => {
  const img = event.target
  const wrapper = img.closest('.related-media')
  if (wrapper) {
    wrapper.innerHTML = '<div class="img-placeholder" style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:var(--color-bg-alt);font-size:1.5rem;">📰</div>'
  }
}

let scrollHandler = null

onMounted(async () => {
  loading.value = true
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('id', route.params.id)
      .single()
    if (!error && data) {
      article.value = data
    } else {
      article.value = fallbackArticles.find((entry) => entry.id === route.params.id) || null
    }
  } catch (err) {
    console.warn('Article lookup failed, using fallback content.', err)
    article.value = fallbackArticles.find((entry) => entry.id === route.params.id) || null
  } finally {
    loading.value = false
  }

  // Reading progress tracking
  scrollHandler = () => {
    const scrollTop = window.scrollY
    const docHeight = document.documentElement.scrollHeight - window.innerHeight
    if (docHeight > 0) {
      progressPercent.value = Math.min(100, Math.round((scrollTop / docHeight) * 100))
    }
  }
  window.addEventListener('scroll', scrollHandler, { passive: true })
})

onBeforeUnmount(() => {
  if (scrollHandler) window.removeEventListener('scroll', scrollHandler)
})
</script>

<style scoped>
.article-page {
  padding: 1.5rem 0 3rem;
}

/* ===== Reading Progress ===== */
.article-progress {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--color-border-light);
  z-index: 60;
}

.article-progress-bar {
  height: 100%;
  background: var(--color-accent);
  transition: width 0.1s linear;
  border-radius: 0 2px 2px 0;
}

/* ===== Article Layout ===== */
.article-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 220px;
  gap: 3rem;
  align-items: start;
}

.article-main {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 720px;
  min-width: 0;
  margin: 0 auto;
  width: 100%;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8125rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--color-accent);
  padding: 0.4rem 0;
  transition: all 0.2s ease;
  text-decoration: none;
  width: fit-content;
}

.back-link:hover {
  color: var(--color-accent-hover);
  gap: 0.65rem;
}

.back-icon {
  width: 16px;
  height: 16px;
  stroke-width: 2.5;
  stroke-linecap: round;
  stroke-linejoin: round;
}

/* ===== Hero ===== */
.article-hero {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--color-border);
}

.article-kicker {
  margin-bottom: 0.25rem;
}

.article-hero-title {
  font-family: var(--font-serif);
  font-size: clamp(2rem, 4.5vw, 3rem);
  line-height: 1.12;
  letter-spacing: -0.015em;
  color: var(--color-text);
  font-weight: 700;
}

.standfirst {
  font-family: var(--font-serif);
  font-size: 1.1875rem;
  line-height: 1.55;
  color: var(--color-text-secondary);
  font-weight: 400;
  margin: 0;
}

.article-byline {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.85rem 1rem;
  border-radius: var(--radius-base);
  background: var(--color-bg-alt);
  border: 1px solid var(--color-border);
}

.author-avatar {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 9999px;
  background: var(--color-accent);
  color: var(--color-accent-contrast);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.6875rem;
  font-weight: 800;
  flex-shrink: 0;
  box-shadow: 0 0 0 2px var(--color-bg), 0 0 0 4px var(--color-accent-light);
}

.byline-meta {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  min-width: 0;
}

.author-name {
  display: block;
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--color-text);
}

.byline-sub {
  font-size: 0.8125rem;
  color: var(--color-text-muted);
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}

.byline-dot {
  color: var(--color-border-strong);
}

/* ===== Hero media ===== */
.article-hero-media {
  margin: 0;
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: var(--color-bg-alt);
  aspect-ratio: 16 / 8;
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-xs);
}

.article-hero-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.img-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  border-radius: inherit;
}

.article-img-placeholder {
  aspect-ratio: 16 / 8;
}

/* ===== Body ===== */
.article-body-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.article-content {
  display: flex;
  flex-direction: column;
}

.article-content-inner {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.article-paragraph {
  font-size: 1.125rem;
  line-height: 1.8;
  color: var(--color-text);
  letter-spacing: 0.01em;
}

.article-paragraph p {
  margin: 0;
}

.article-paragraph-lead::first-letter {
  font-family: var(--font-serif);
  font-weight: 700;
  float: left;
  font-size: 3.4rem;
  line-height: 0.82;
  padding: 0.25rem 0.6rem 0 0;
  color: var(--color-accent);
}

/* ===== Actions Bar ===== */
.article-actions-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.5rem 0;
  border-top: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
  flex-wrap: wrap;
}

.article-actions {
  display: flex;
  gap: 0.6rem;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.7rem 1.25rem;
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
  background: var(--color-bg);
  color: var(--color-text-secondary);
  font-size: 0.8125rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
}

.action-icon {
  width: 18px;
  height: 18px;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.action-btn:hover {
  background: var(--color-bg-alt);
  border-color: var(--color-text-muted);
  color: var(--color-text);
  transform: translateY(-1px);
  box-shadow: var(--shadow-xs);
}

.action-btn.action-active {
  color: var(--color-accent);
  border-color: var(--color-accent);
  background: var(--color-accent-subtle);
}

.article-action-hint {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  font-style: italic;
}

/* ===== Comments ===== */
.article-comments-section {
  margin-top: 0.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--color-border);
}

/* ===== Related Articles ===== */
.related-section {
  margin-top: 0.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--color-border);
}

.related-heading {
  font-size: 0.9375rem;
  font-weight: 800;
  color: var(--color-text);
  margin-bottom: 1rem;
  letter-spacing: 0.01em;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.related-heading-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, var(--color-border), transparent);
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.related-card {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  padding: 1rem;
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  background: var(--color-card-bg);
  box-shadow: var(--shadow-xs);
  transition: all 0.25s ease;
  text-decoration: none;
  color: inherit;
}

.related-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  border-color: var(--color-border-strong);
}

.related-media {
  width: 100%;
  height: 5rem;
  border-radius: var(--radius-sm);
  overflow: hidden;
  background: var(--color-bg-alt);
  border: 1px solid var(--color-border);
}

.related-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.related-card:hover .related-media img {
  transform: scale(1.04);
}

.related-body {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.related-title {
  font-size: 0.9375rem;
  font-weight: 700;
  line-height: 1.35;
  font-family: var(--font-serif);
  color: var(--color-text);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.related-date {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  font-weight: 600;
}

/* ===== Prev / Next ===== */
.article-prevnext {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-top: 0.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--color-border);
}

.prevnext-card {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  padding: 1rem 1.25rem;
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  background: var(--color-card-bg);
  box-shadow: var(--shadow-xs);
  text-decoration: none;
  color: inherit;
  transition: all 0.25s ease;
}

.prevnext-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  border-color: var(--color-border-strong);
}

.prevnext-next {
  text-align: right;
  align-items: flex-end;
}

.prevnext-label {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.6875rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-accent);
}

.prevnext-arrow {
  width: 14px;
  height: 14px;
  stroke-width: 2.5;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.prevnext-title {
  font-size: 0.9375rem;
  font-weight: 700;
  line-height: 1.35;
  color: var(--color-text);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.prevnext-spacer {
  display: block;
}

/* ===== Sidebar ===== */
.article-sidebar {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  position: sticky;
  top: 140px;
}

.sidebar-rail {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  padding: 1rem;
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  background: var(--color-card-bg);
  box-shadow: var(--shadow-xs);
}

.rail-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.6rem 0.75rem;
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
  background: var(--color-bg);
  color: var(--color-text-secondary);
  font-size: 0.8125rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
  justify-content: center;
}

.rail-icon {
  width: 18px;
  height: 18px;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.rail-btn:hover {
  background: var(--color-bg-alt);
  border-color: var(--color-text-muted);
  color: var(--color-text);
}

.rail-btn.action-active {
  color: var(--color-accent);
  border-color: var(--color-accent);
  background: var(--color-accent-subtle);
}

.sidebar-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.sidebar-title {
  font-size: 0.6875rem;
  font-weight: 800;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--color-text);
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--color-border);
}

.detail-card {
  padding: 1.25rem;
  background: var(--color-card-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
  padding: 0.7rem 0;
  border-bottom: 1px solid var(--color-border-light);
  font-size: 0.875rem;
}

.detail-row:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.detail-row span {
  color: var(--color-text-muted);
  font-weight: 600;
  font-size: 0.8125rem;
  letter-spacing: 0.02em;
}

.detail-row strong,
.detail-row time {
  color: var(--color-text);
  font-weight: 700;
  text-align: right;
  font-size: 0.8125rem;
}

/* ===== Loading ===== */
.article-loading {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding: 2rem 0;
}

.skeleton-hero {
  height: 420px;
  border-radius: var(--radius-lg);
}

/* ===== Empty State ===== */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 6rem 1rem;
  gap: 1rem;
}

.empty-icon {
  color: var(--color-text-muted);
  margin-bottom: 0.5rem;
  opacity: 0.6;
}

.empty-icon-svg {
  width: 48px;
  height: 48px;
  stroke-width: 1.5;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.empty-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-text);
}

.empty-desc {
  font-size: 0.9375rem;
  color: var(--color-text-secondary);
  max-width: 420px;
  margin: 0 auto;
  line-height: 1.6;
}

/* ===== Responsive ===== */
@media (max-width: 1024px) {
  .article-layout {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .article-sidebar {
    position: static;
    display: flex;
    flex-direction: column;
  }

  .sidebar-rail {
    flex-direction: row;
    justify-content: center;
  }

  .rail-btn {
    flex: 1;
  }

  .related-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .article-page {
    padding: 1.25rem 0 2.5rem;
  }

  .article-hero-media {
    aspect-ratio: 16 / 9;
  }

  .article-hero-title {
    font-size: clamp(1.75rem, 5vw, 2.25rem);
  }

  .article-paragraph {
    font-size: 1.0625rem;
    line-height: 1.75;
  }

  .related-grid {
    grid-template-columns: 1fr;
  }

  .article-actions-bar {
    flex-direction: column;
    align-items: flex-start;
  }

  .article-prevnext {
    grid-template-columns: 1fr;
  }

  .prevnext-next {
    text-align: left;
    align-items: flex-start;
  }
}
</style>
