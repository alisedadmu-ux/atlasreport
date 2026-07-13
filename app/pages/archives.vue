<template>
  <div class="archives-page">
    <div class="site-container">
      <div class="archives-header">
        <p class="eyebrow">Archives</p>
        <h1 class="archives-title">Article Archives</h1>
        <p class="archives-subtitle">Browse all published articles by date and category.</p>
      </div>

      <div v-if="loading" class="search-loading">
        <div class="skeleton skeleton-card" style="min-height: 100px;"></div>
        <div class="skeleton skeleton-card" style="min-height: 100px;"></div>
        <div class="skeleton skeleton-card" style="min-height: 100px;"></div>
      </div>

      <div v-else-if="error" class="empty-state">
        <p class="empty-desc">{{ error }}</p>
      </div>

      <template v-else>
        <div class="filters">
          <div class="filter-row">
            <span class="filter-label">Year</span>
            <div class="filter-chips">
              <button
                v-for="year in availableYears"
                :key="year"
                :class="['chip', { 'chip-active': selectedYear === year }]"
                @click="selectedYear = year"
                :aria-pressed="selectedYear === year"
              >
                {{ year }}
              </button>
            </div>
          </div>
          <div class="filter-row">
            <span class="filter-label">Category</span>
            <div class="filter-chips">
              <button
                v-for="cat in categories"
                :key="cat.id"
                :class="['chip', { 'chip-active': selectedCategory === cat.id }]"
                @click="selectedCategory = cat.id"
                :aria-pressed="selectedCategory === cat.id"
              >
                <span aria-hidden="true">{{ cat.emoji }}</span>
                {{ cat.name }}
              </button>
              <button :class="['chip', { 'chip-active': !selectedCategory }]" @click="selectedCategory = ''" :aria-pressed="!selectedCategory">
                All
              </button>
            </div>
          </div>
        </div>

        <p class="results-meta">
          {{ filteredArticles.length }} article{{ filteredArticles.length !== 1 ? 's' : '' }} found
        </p>

        <div v-if="paginatedArticles.length" class="archive-list">
          <article
              v-for="article in paginatedArticles"
              :key="article.id"
              class="archive-card"
              role="button"
              tabindex="0"
              :style="{ borderLeft: `3px solid ${categoryAccentColors[article.category] || categoryAccentColors.general}` }"
              @click="navigateTo(`/news/${article.id}`)"
              @keydown.enter="navigateTo(`/news/${article.id}`)"
              @keydown.space.prevent="navigateTo(`/news/${article.id}`)"
            >
            <div class="archive-media" v-if="!imageFailed[article.id]">
              <img :src="article.image" :alt="article.title" loading="lazy" @error="imageFailed[article.id] = true" />
            </div>
            <div class="archive-media archive-media-fallback" v-else :style="imageFallbackStyle(article)">
              <span class="archive-media-emoji" aria-hidden="true">{{ imageFallbackEmoji(article) }}</span>
            </div>
            <div class="archive-body">
              <div class="result-meta">
                <span class="badge badge-accent">{{ article.category }}</span>
                <time>{{ formatDate(article.published) }}</time>
              </div>
              <h3 class="archive-title">{{ article.title }}</h3>
              <p class="archive-excerpt">{{ truncateText(article.description, 180) }}</p>
              <span class="archive-author">{{ article.author }}</span>
            </div>
          </article>
        </div>

        <div v-else class="empty-state">
          <p class="empty-desc">No articles found matching your filters.</p>
        </div>

        <div v-if="totalPages > 1" class="pagination">
          <button @click="currentPage = Math.max(1, currentPage - 1)" :disabled="currentPage === 1" class="page-btn" :class="{ 'page-btn-disabled': currentPage === 1 }">
            &larr; Prev
          </button>
          <template v-for="page in displayPages" :key="page">
            <button
              @click="currentPage = page"
              :class="['page-btn', { 'page-btn-active': currentPage === page }]"
            >
              {{ page }}
            </button>
          </template>
          <button @click="currentPage = Math.min(totalPages, currentPage + 1)" :disabled="currentPage === totalPages" class="page-btn" :class="{ 'page-btn-disabled': currentPage === totalPages }">
            Next &rarr;
          </button>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { truncateText, CATEGORY_GRADIENTS } from '~/utils/format'

const supabase = useSupabaseClient()

  const articles = ref([])
  const loading = ref(true)
  const error = ref('')
  const selectedYear = ref(new Date().getFullYear())
  const selectedCategory = ref('')
  const currentPage = ref(1)
  const articlesPerPage = 12
  const imageFailed = ref({})

const categories = [
  { id: 'general', name: 'World', emoji: '🌍' },
  { id: 'technology', name: 'Tech', emoji: '💻' },
  { id: 'sports', name: 'Sports', emoji: '⚽' },
  { id: 'science', name: 'Science', emoji: '🔬' },
  { id: 'business', name: 'Business', emoji: '📈' },
  { id: 'health', name: 'Health', emoji: '🏥' }
]

const categoryAccentColors = {
  general: '#667eea',
  technology: '#f5576c',
  sports: '#4facfe',
  science: '#43e97b',
  business: '#fa709a',
  health: '#38f9d7'
}

const categoryGradients = CATEGORY_GRADIENTS

const availableYears = computed(() => {
  const years = new Set(articles.value.map(a => new Date(a.published).getFullYear()))
  return [...years].sort((a, b) => b - a)
})

const filteredArticles = computed(() => {
  return articles.value.filter(a => {
    const year = new Date(a.published).getFullYear()
    if (selectedYear.value && year !== selectedYear.value) return false
    if (selectedCategory.value && a.category !== selectedCategory.value) return false
    return true
  })
})

const totalPages = computed(() => Math.ceil(filteredArticles.value.length / articlesPerPage))

const paginatedArticles = computed(() => {
  const start = (currentPage.value - 1) * articlesPerPage
  return filteredArticles.value.slice(start, start + articlesPerPage)
})

const displayPages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, currentPage.value + 2)
  for (let i = start; i <= end; i++) pages.push(i)
  return pages
})

watch([selectedCategory, selectedYear], () => { currentPage.value = 1 })

const handleImageError = (event, article) => {
  const img = event.target
  const wrapper = img.closest('.archive-media')
  if (wrapper) {
    const cat = article?.category || 'general'
    const grad = categoryGradients[cat] || categoryGradients.general
    wrapper.innerHTML = `<div class="img-placeholder" style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:${grad.bg};font-size:2rem;">${grad.emoji}</div>`
  }
}

const imageFallbackStyle = (article) => {
  const cat = article?.category || 'general'
  const grad = categoryGradients[cat] || categoryGradients.general
  return { background: grad.bg }
}

const imageFallbackEmoji = (article) => {
  const cat = article?.category || 'general'
  const grad = categoryGradients[cat] || categoryGradients.general
  return grad.emoji
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

onMounted(async () => {
  loading.value = true
  const { data, error: err } = await supabase.from('articles').select('*').order('published', { ascending: false })
  if (err) error.value = 'Failed to load archives.'
  else if (data) articles.value = data
  loading.value = false
})
</script>

<style scoped>
.archives-page {
  padding: 2.5rem 0;
  min-height: calc(100vh - 88px);
}

.archives-header {
  margin-bottom: 2.5rem;
  padding: 2rem 2.25rem;
  border-radius: var(--radius-lg);
  background: var(--color-bg-alt);
  border: 1px solid var(--color-border);
}

.archives-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(1.75rem, 3.5vw, 2.5rem);
  margin: 0.4rem 0 0.75rem;
}

.archives-subtitle {
  color: var(--color-text-secondary);
  font-size: 1rem;
  line-height: 1.6;
}

.filters {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1.25rem;
  border: 1px solid var(--color-border);
  background: var(--color-bg-alt);
  border-radius: var(--radius-base);
}

.filter-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.filter-label {
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-text-accent, var(--color-accent));
  padding-top: 0.5rem;
  min-width: 3.5rem;
}

.filter-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.chip {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  border: 1px solid var(--color-border);
  background: var(--color-card-bg);
  color: var(--color-text);
  font-size: 0.8125rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: var(--shadow-xs);
  transition: all 0.2s ease;
}

.chip:hover {
  border-color: var(--color-text-muted);
  color: var(--color-text);
  background: var(--color-bg-alt);
}

.chip-active {
  background: var(--color-secondary);
  color: var(--color-secondary-contrast);
  border-color: var(--color-secondary);
  box-shadow: var(--shadow-sm);
}

.results-meta {
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--color-text-secondary);
  margin-bottom: 1.5rem;
  padding-left: 0.25rem;
  border-left: 3px solid var(--color-accent);
}

.archive-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.archive-card {
  display: flex;
  gap: 1.5rem;
  padding: 1.25rem 1.1rem;
  cursor: pointer;
  overflow: hidden;
  border-radius: var(--radius-lg);
  background: var(--color-card-bg);
  border: 1px solid var(--color-border);
  border-left-width: 3px;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: var(--shadow-xs);
}

.archive-card:hover {
  box-shadow: var(--shadow-md);
  border-color: var(--color-text-muted);
}

.archive-media {
  width: 7rem;
  height: 5rem;
  border-radius: var(--radius-sm);
  overflow: hidden;
  background: var(--color-bg-alt);
  flex-shrink: 0;
  border: 1px solid var(--color-border);
}

.archive-media-fallback {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
}

.archive-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.archive-card:hover .archive-media img {
  transform: scale(1.04);
}

.archive-body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.result-meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.result-meta time {
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

.archive-title {
  font-size: 1.0625rem;
  font-weight: 800;
  line-height: 1.35;
  color: var(--color-text);
}

.archive-excerpt {
  font-size: 0.875rem;
  line-height: 1.65;
  color: var(--color-text-secondary);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.archive-author {
  font-size: 0.8125rem;
  color: var(--color-text-muted);
  font-weight: 600;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--color-border);
}

.page-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 2.5rem;
  height: 2.5rem;
  padding: 0 0.75rem;
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
  background: var(--color-card-bg);
  color: var(--color-text);
  font-size: 0.8125rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

.page-btn:hover:not(.page-btn-disabled) {
  background: var(--color-accent-light);
  border-color: var(--color-accent);
  color: var(--color-accent);
}

.page-btn-active {
  background: var(--color-accent);
  color: #fff;
  border-color: var(--color-accent);
}

.page-btn-disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.empty-state {
  text-align: center;
  padding: 6rem 1rem;
  gap: 1rem;
}

.empty-desc {
  font-size: 0.9375rem;
  color: var(--color-text-secondary);
  max-width: 420px;
  margin: 0 auto;
  line-height: 1.6;
}

.badge-accent {
  border: 1px solid;
}

@media (max-width: 640px) {
  .archives-page {
    padding: 1.5rem 0;
  }

  .archives-header {
    padding: 1.5rem;
    border-radius: var(--radius-base);
  }

  .archive-card {
    flex-direction: column;
    gap: 1rem;
  }

  .archive-media {
    width: 100%;
    height: 180px;
  }

  .filters {
    padding: 1rem;
    gap: 0.75rem;
  }
}
</style>
