<template>
  <main class="article-page">
    <!-- Loading State -->
    <div v-if="loading" class="article-loading">
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
    <div v-else class="article-layout">
      <article class="article-main">
        <div class="article-progress" ref="progressBar">
          <div class="article-progress-bar" :style="{ width: progressPercent + '%' }"></div>
        </div>

        <NuxtLink to="/" class="back-link">
          <ArrowLeft class="back-icon" />
          Back to feed
        </NuxtLink>

        <header class="article-hero">
          <div class="article-hero-meta">
            <span class="badge badge-accent">{{ article.category }}</span>
            <span class="article-hero-date">{{ formatDate(article.published) }}</span>
            <span class="article-read-time">{{ readingTime }} min read</span>
          </div>
          <h1 class="article-hero-title">{{ article.title }}</h1>

          <div class="article-hero-author">
            <div class="author-avatar">
              <span>{{ getInitials(article.author || 'AR') }}</span>
            </div>
            <div class="author-meta">
              <span class="author-name">{{ article.author }}</span>
              <span class="author-role">Contributor, Atlas Report</span>
            </div>
          </div>
        </header>

        <div class="article-hero-media" v-if="article.image" :style="imageFailed ? heroImageFallbackStyle() : undefined">
          <img v-if="!imageFailed" :src="article.image" :alt="article.title" loading="eager" @error="imageFailed = true" />
          <div v-else class="img-placeholder article-img-placeholder" aria-hidden="true">{{ heroImageFallbackEmoji() }}</div>
        </div>

        <div class="article-body-container">
          <div class="article-summary-block" v-if="article.description">
            <p>{{ article.description }}</p>
          </div>

          <div class="article-content prose-content">
            <div class="article-content-inner">
              <div
                v-for="(paragraph, index) in contentParagraphs"
                :key="index"
                class="article-paragraph"
              >
                <p>{{ paragraph }}</p>
              </div>
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

        <div class="article-comments-section">
          <CommentsSection :article-id="article.id" />
        </div>

        <div v-if="relatedArticles.length" class="related-section">
          <h3 class="related-heading">
            <span>Related stories</span>
            <span class="related-heading-line" aria-hidden="true"></span>
          </h3>
          <div class="related-grid">
            <NuxtLink
              v-for="ra in relatedArticles"
              :key="ra.id"
              :to="`/news/${ra.id}`"
              class="related-card"
            >
              <div class="related-media">
                <img :src="ra.image" :alt="ra.title" loading="lazy" @error="onRelatedImageError" />
              </div>
              <div class="related-body">
                <span class="badge badge-accent">{{ ra.category }}</span>
                <h4 class="related-title">{{ ra.title }}</h4>
                <time class="related-date">{{ formatDate(ra.published) }}</time>
              </div>
            </NuxtLink>
          </div>
        </div>
      </article>

      <aside class="article-sidebar">
        <div class="sidebar-section">
          <h4 class="sidebar-title">On this page</h4>
          <div class="toc-card">
            <p class="toc-item toc-item-active">{{ article.title }}</p>
            <p v-for="(paragraph, index) in Math.min(contentParagraphs.length, 6)" :key="index" class="toc-item toc-item-sub">
              Section {{ index + 1 }}
            </p>
          </div>
        </div>

        <div class="sidebar-section">
          <h4 class="sidebar-title">Story details</h4>
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

        <div class="sidebar-section">
          <h4 class="sidebar-title">Why this matters</h4>
          <div class="detail-card detail-card-muted">
            <p>Atlas Report is designed to keep important reporting clear, accessible, and easy to read without compromising depth.</p>
          </div>
        </div>
      </aside>
    </div>
  </main>
</template>

<script setup>
import { computed, onMounted, ref, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { fallbackArticles } from '~/data/fallback-articles'
import { getInitials, CATEGORY_GRADIENTS } from '~/utils/format'
import { CircleAlert, ArrowLeft, Share2, Bookmark } from '@lucide/vue'

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

const relatedArticles = computed(() => {
  if (!article.value) return []
  return fallbackArticles
    .filter(a => a.id !== article.value.id && a.category === article.value.category)
    .slice(0, 3)
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
  padding: 2rem 0;
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
  background: linear-gradient(90deg, var(--color-accent), var(--color-accent-hover));
  transition: width 0.1s linear;
  border-radius: 0 2px 2px 0;
}

/* ===== Article Layout ===== */
.article-layout {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 2.5rem;
  align-items: start;
}

.article-main {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 780px;
  min-width: 0;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8125rem;
  font-weight: 700;
  letter-spacing: 0.08em;
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
  padding-bottom: 1.75rem;
  border-bottom: 1px solid var(--color-border);
}

.article-hero-meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.article-hero-date {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-text-muted);
  letter-spacing: 0.02em;
}

.article-read-time {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--color-text-muted);
  padding: 0.2rem 0.6rem;
  border-radius: 9999px;
  border: 1px solid var(--color-border);
  background: var(--color-bg-alt);
}

.article-hero-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(2.125rem, 4.5vw, 3.25rem);
  line-height: 1.06;
  letter-spacing: -0.025em;
  color: var(--color-text);
  font-weight: 800;
}

.article-hero-author {
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
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.6875rem;
  font-weight: 800;
  flex-shrink: 0;
  box-shadow: 0 0 0 2px var(--color-bg), 0 0 0 4px var(--color-accent-light);
}

.author-name {
  display: block;
  font-size: 0.875rem;
  font-weight: 800;
  color: var(--color-text);
  letter-spacing: 0.01em;
}

.author-role {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  letter-spacing: 0.02em;
}

.article-hero-media {
  border-radius: var(--radius-xl);
  overflow: hidden;
  background: var(--color-bg-alt);
  aspect-ratio: 16 / 7;
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-xs);
}

.article-hero-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.7s cubic-bezier(0.4, 0, 0.2, 1);
}

.article-hero-media:hover img {
  transform: scale(1.02);
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
  aspect-ratio: 16 / 7;
}

/* ===== Body ===== */
.article-body-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 720px;
}

.article-summary-block {
  padding: 1.25rem 1.5rem;
  border-left: 4px solid var(--color-accent);
  border-radius: 0 var(--radius-lg) var(--radius-lg) 0;
  background: var(--color-accent-subtle);
  font-size: 1.0625rem;
  line-height: 1.75;
  color: var(--color-text);
  font-weight: 500;
}

.article-summary-block p {
  margin: 0;
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
  font-size: 1.0625rem;
  line-height: 1.85;
  color: var(--color-text);
  letter-spacing: 0.01em;
}

.article-paragraph p {
  margin: 0;
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
  transition: all 0.3s ease;
  text-decoration: none;
  color: inherit;
}

.related-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
  border-color: var(--color-accent-light);
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
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.related-card:hover .related-media img {
  transform: scale(1.05);
}

.related-body {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.related-title {
  font-size: 0.9375rem;
  font-weight: 800;
  line-height: 1.35;
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

/* ===== Sidebar ===== */
.article-sidebar {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  position: sticky;
  top: 88px;
}

.sidebar-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.sidebar-title {
  font-size: 0.6875rem;
  font-weight: 800;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--color-text);
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--color-border);
}

.toc-card {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.toc-item {
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--color-text);
  padding: 0.4rem 0.6rem;
  border-radius: var(--radius-sm);
  border-left: 2px solid transparent;
  transition: all 0.2s ease;
  cursor: default;
}

.toc-item:hover {
  background: var(--color-bg-alt);
}

.toc-item-active {
  border-left-color: var(--color-accent);
  background: var(--color-accent-subtle);
}

.toc-item-sub {
  font-weight: 600;
  color: var(--color-text-secondary);
  padding-left: 1.25rem;
  font-size: 0.8125rem;
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

.detail-card-muted {
  background: var(--color-bg-alt);
}

.detail-card-muted p {
  font-size: 0.875rem;
  line-height: 1.7;
  color: var(--color-text-secondary);
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
  border-radius: var(--radius-xl);
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
  font-weight: 800;
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
    gap: 2.5rem;
  }

  .article-sidebar {
    position: static;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.25rem;
  }

  .related-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .article-page {
    padding: 1.5rem 1rem;
  }

  .article-hero-media {
    aspect-ratio: 16 / 9;
  }

  .article-sidebar {
    grid-template-columns: 1fr;
  }

  .article-body-container {
    max-width: 100%;
  }

  .article-hero-title {
    font-size: clamp(1.75rem, 5vw, 2.25rem);
  }

  .related-grid {
    grid-template-columns: 1fr;
  }

  .article-actions-bar {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>