<template>
  <div class="search-page">
    <div class="site-container">
      <div class="search-header">
        <p class="eyebrow">Search</p>
        <h1 class="search-title">Find articles</h1>
        <p class="search-subtitle">Search across all categories and sources.</p>
      </div>

      <div class="search-bar">
        <div class="search-input-wrap">
          <Search class="search-icon" />
          <input
            v-model="query"
            @input="onSearchInput"
            @keydown.enter="performSearch"
            type="text"
            placeholder="Search articles by title, description, author..."
            class="search-input"
            aria-label="Search articles"
          />
        </div>
      </div>

      <div class="category-chips">
        <button
          v-for="cat in categories"
          :key="cat.id"
          :class="['chip', { 'chip-active': selectedCategories.includes(cat.id) }]"
          @click="toggleCategory(cat.id)"
        >
          <span aria-hidden="true">{{ cat.emoji }}</span>
          {{ cat.name }}
        </button>
      </div>

      <div v-if="loading" class="search-loading">
        <div v-for="i in 3" :key="i" class="skeleton skeleton-card" style="min-height: 90px;"></div>
      </div>

      <template v-else-if="searched">
        <p class="results-meta">
          {{ results.length }} result{{ results.length !== 1 ? 's' : '' }} for <strong>"{{ lastQuery }}"</strong>
        </p>

        <div v-if="results.length" class="results-list">
          <NuxtLink
            v-for="article in results"
            :key="article.id"
            :to="`/news/${article.id}`"
            class="result-card"
          >
            <div class="result-media">
              <img :src="article.image" :alt="article.title" loading="lazy" @error="handleImageError" />
            </div>
            <div class="result-body">
              <div class="result-meta">
                <span class="badge">{{ article.category }}</span>
                <time>{{ formatDate(article.published) }}</time>
              </div>
              <h3 class="result-title">{{ article.title }}</h3>
              <p class="result-excerpt">{{ truncateText(article.description, 160) }}</p>
            </div>
          </NuxtLink>
        </div>

        <div v-else class="empty-state">
          <div class="empty-icon">
            <SearchX class="empty-icon-svg" />
          </div>
          <p class="empty-title">No articles found</p>
          <p class="empty-desc">Try different keywords or categories.</p>
        </div>
      </template>

      <div v-else class="empty-state">
        <div class="empty-icon">
          <Search class="empty-icon-svg" />
        </div>
        <p class="empty-title">Start searching</p>
        <p class="empty-desc">Type a keyword above to search through all articles.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { truncateText, CATEGORIES, dedupeArticles } from '~/utils/format'
import { Search, SearchX } from '@lucide/vue'

const supabase = useSupabaseClient()

const query = ref('')
const lastQuery = ref('')
const results = ref([])
const loading = ref(false)
const searched = ref(false)
const selectedCategories = ref([])
let requestToken = 0

const categories = CATEGORIES

let debounceTimer = null

const onSearchInput = () => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    if (query.value.trim()) performSearch()
  }, 400)
}

const toggleCategory = (catId) => {
  const idx = selectedCategories.value.indexOf(catId)
  if (idx >= 0) selectedCategories.value.splice(idx, 1)
  else selectedCategories.value.push(catId)
  if (lastQuery.value) performSearch()
}

const performSearch = async () => {
  const q = query.value.trim()
  if (!q) return
  const token = ++requestToken || 1
  loading.value = true
  searched.value = true
  lastQuery.value = q
  try {
    const safe = q.replace(/[,()%\\]/g, ' ').trim()
    if (!safe) {
      if (token === requestToken) {
        results.value = []
        loading.value = false
      }
      return
    }
    let dbQuery = supabase
      .from('articles')
      .select('*')
      .or(`title.ilike.%${safe}%,description.ilike.%${safe}%,author.ilike.%${safe}%`)
      .order('published', { ascending: false })
    if (selectedCategories.value.length) dbQuery = dbQuery.in('category', selectedCategories.value)
    const { data, error } = await dbQuery
    if (token === requestToken) {
      if (!error && data) results.value = dedupeArticles(data)
      else results.value = []
      loading.value = false
    }
  } catch (e) {
    if (token === requestToken) {
      results.value = []
      loading.value = false
    }
  }
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

const handleImageError = (event) => {
  const img = event.target
  const wrapper = img.closest('.result-media')
  if (wrapper) {
    wrapper.innerHTML = '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:var(--color-bg-alt);font-size:1.25rem;">📰</div>'
  }
}
</script>

<style scoped>
.search-page {
  padding: 2.5rem 0;
}

.search-header {
  margin-bottom: 2.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--color-border);
}

.search-title {
  font-family: var(--font-serif);
  font-size: clamp(1.75rem, 3.5vw, 2.5rem);
  margin: 0.4rem 0 0.75rem;
}

.search-subtitle {
  color: var(--color-text-secondary);
  font-size: 1rem;
  line-height: 1.6;
}

.search-bar {
  margin-bottom: 1.5rem;
}

.search-input-wrap {
  position: relative;
  max-width: 720px;
}

.search-icon {
  position: absolute;
  left: 1.15rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-muted);
  pointer-events: none;
  width: 20px;
  height: 20px;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  transition: color 0.2s ease;
}

.search-input {
  width: 100%;
  font-family: inherit;
  font-size: 1rem;
  color: var(--color-text);
  background: var(--color-input-bg);
  border: 1px solid var(--color-input-border);
  border-radius: var(--radius-base);
  padding: 0.95rem 1rem 0.95rem 2.75rem;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.search-input::placeholder { color: var(--color-text-muted); }

.search-input:focus {
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px var(--color-accent-ring);
}

.search-input:focus ~ .search-icon {
  color: var(--color-accent);
}

.category-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

.chip {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  border: 1px solid var(--color-border);
  background: var(--color-card-bg);
  color: var(--color-text-secondary);
  font-size: 0.8125rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: var(--shadow-xs);
  transition: all 0.2s ease;
  font-family: inherit;
}

.chip:hover {
  border-color: var(--color-text-muted);
  color: var(--color-text);
}

.chip-active {
  background: var(--color-secondary);
  color: var(--color-secondary-contrast);
  border-color: var(--color-secondary);
  box-shadow: var(--shadow-sm);
}

.search-loading {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.results-meta {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text-secondary);
  margin-bottom: 1.25rem;
}

.results-meta strong {
  color: var(--color-text);
}

.results-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.result-card {
  display: flex;
  gap: 1.25rem;
  padding: 1.1rem;
  border-radius: var(--radius-lg);
  background: var(--color-card-bg);
  border: 1px solid var(--color-border);
  border-left: 3px solid transparent;
  transition: all 0.25s ease;
  text-decoration: none;
  color: inherit;
}

.result-card:hover {
  border-left-color: var(--color-accent);
  box-shadow: var(--shadow-md);
  border-color: var(--color-text-muted);
}

.result-media {
  width: 5rem;
  height: 5rem;
  border-radius: var(--radius-sm);
  overflow: hidden;
  background: var(--color-bg-alt);
  flex-shrink: 0;
  border: 1px solid var(--color-border);
}

.result-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.result-card:hover .result-media img {
  transform: scale(1.04);
}

.result-body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
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

.result-title {
  font-size: 1.125rem;
  font-weight: 800;
  line-height: 1.35;
  color: var(--color-text);
}

.result-excerpt {
  font-size: 0.875rem;
  line-height: 1.65;
  color: var(--color-text-secondary);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.empty-state {
  text-align: center;
  padding: 6rem 1rem;
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

@media (max-width: 640px) {
  .search-page {
    padding: 1.5rem 0;
  }

  .result-card {
    flex-direction: column;
    gap: 1rem;
  }

  .result-media {
    width: 100%;
    height: 180px;
  }
}
</style>