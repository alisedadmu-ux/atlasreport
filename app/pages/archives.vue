<template>
  <div class="news-portal-container" :style="{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }">
    <main class="portal-layout">
      <div class="editorial-card" :style="{ background: 'var(--color-card-bg)', borderColor: 'var(--color-border)' }">
        <span class="section-badge" :style="{ color: 'var(--color-accent)' }">ARCHIVES</span>
        <h1 class="page-title" :style="{ color: 'var(--color-text)' }">Article Archives</h1>
        <p class="lead-text" :style="{ color: 'var(--color-text-secondary)' }">Browse all published articles by date and category.</p>

        <!-- Loading -->
        <div v-if="loading" class="flex justify-center py-12">
          <p :style="{ color: 'var(--color-text-muted)' }">Loading archives...</p>
        </div>

        <!-- Error -->
        <p v-else-if="error" class="text-red-500 text-sm py-4">{{ error }}</p>

        <!-- Content -->
        <template v-else>
          <!-- Date Filter -->
          <div class="flex flex-wrap gap-3 mb-6 border-b pb-4" :style="{ borderColor: 'var(--color-border)' }">
            <button
              v-for="year in availableYears"
              :key="year"
              @click="selectedYear = year"
              class="px-3 py-1.5 text-xs font-bold rounded transition-colors"
              :class="selectedYear === year ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-900'"
              :style="selectedYear === year ? {} : { color: 'var(--color-text-muted)' }"
            >
              {{ year }}
            </button>
          </div>

          <!-- Category Filter -->
          <div class="flex flex-wrap gap-2 mb-6">
            <button
              v-for="cat in categories"
              :key="cat.id"
              @click="selectedCategory = cat.id"
              class="px-3 py-1 text-xs font-semibold rounded-full border transition-colors"
              :style="{
                borderColor: selectedCategory === cat.id ? 'var(--color-accent)' : 'var(--color-border)',
                backgroundColor: selectedCategory === cat.id ? 'var(--color-accent)' : 'var(--color-bg-alt)',
                color: selectedCategory === cat.id ? '#fff' : 'var(--color-text-secondary)'
              }"
            >
              {{ cat.emoji }} {{ cat.name }}
            </button>
            <button
              @click="selectedCategory = ''"
              class="px-3 py-1 text-xs font-semibold rounded-full border transition-colors"
              :style="{
                borderColor: !selectedCategory ? 'var(--color-accent)' : 'var(--color-border)',
                backgroundColor: !selectedCategory ? 'var(--color-accent)' : 'var(--color-bg-alt)',
                color: !selectedCategory ? '#fff' : 'var(--color-text-secondary)'
              }"
            >
              All
            </button>
          </div>

          <!-- Article Count -->
          <p class="text-xs mb-4" :style="{ color: 'var(--color-text-muted)' }">
            {{ filteredArticles.length }} article{{ filteredArticles.length !== 1 ? 's' : '' }} found
          </p>

          <!-- Article List -->
          <div v-if="paginatedArticles.length" class="space-y-4">
            <div
              v-for="article in paginatedArticles"
              :key="article.id"
              @click="navigateTo(`/news/${article.id}`)"
              class="flex gap-4 p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md"
              :style="{
                borderColor: 'var(--color-border)',
                backgroundColor: 'var(--color-bg-muted)'
              }"
            >
              <div class="w-24 h-24 shrink-0 rounded overflow-hidden">
                <img
                  :src="article.image"
                  :alt="article.title"
                  class="w-full h-full object-cover"
                  @error="(e) => handleImageError(e, article)"
                />
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-1">
                  <span class="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded" :style="{ backgroundColor: 'var(--color-accent)', color: '#fff' }">
                    {{ article.category }}
                  </span>
                  <span class="text-[10px]" :style="{ color: 'var(--color-text-muted)' }">{{ formatDate(article.published) }}</span>
                </div>
                <h3 class="text-sm font-bold leading-snug mb-1 line-clamp-2" :style="{ color: 'var(--color-text)' }">
                  {{ article.title }}
                </h3>
                <p class="text-xs line-clamp-2" :style="{ color: 'var(--color-text-secondary)' }">{{ article.description }}</p>
                <p class="text-[10px] mt-1 font-semibold" :style="{ color: 'var(--color-text-muted)' }">{{ article.author }}</p>
              </div>
            </div>
          </div>

          <p v-else class="text-sm text-center py-8" :style="{ color: 'var(--color-text-muted)' }">
            No articles found matching your filters.
          </p>

          <!-- Pagination -->
          <div v-if="totalPages > 1" class="flex items-center justify-center gap-2 mt-8 pt-6 border-t" :style="{ borderColor: 'var(--color-border)' }">
            <button
              @click="currentPage = Math.max(1, currentPage - 1)"
              :disabled="currentPage === 1"
              class="px-3 py-1.5 text-xs font-bold rounded border transition-colors disabled:opacity-40"
              :style="{
                borderColor: 'var(--color-border)',
                color: currentPage === 1 ? 'var(--color-text-muted)' : 'var(--color-text)'
              }"
            >
              ← Prev
            </button>
            <span
              v-for="page in displayPages"
              :key="page"
              @click="currentPage = page"
              class="px-3 py-1.5 text-xs font-bold rounded cursor-pointer transition-colors"
              :style="{
                backgroundColor: currentPage === page ? 'var(--color-accent)' : 'transparent',
                color: currentPage === page ? '#fff' : 'var(--color-text)',
                border: currentPage === page ? 'none' : '1px solid ' + 'var(--color-border)'
              }"
            >
              {{ page }}
            </span>
            <button
              @click="currentPage = Math.min(totalPages, currentPage + 1)"
              :disabled="currentPage === totalPages"
              class="px-3 py-1.5 text-xs font-bold rounded border transition-colors disabled:opacity-40"
              :style="{
                borderColor: 'var(--color-border)',
                color: currentPage === totalPages ? 'var(--color-text-muted)' : 'var(--color-text)'
              }"
            >
              Next →
            </button>
          </div>
        </template>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const supabase = useSupabaseClient()

const articles = ref([])
const loading = ref(true)
const error = ref('')
const selectedYear = ref(new Date().getFullYear())
const selectedCategory = ref('')
const currentPage = ref(1)
const articlesPerPage = 12

const categories = [
  { id: 'general', name: 'World', emoji: '🌍' },
  { id: 'technology', name: 'Tech', emoji: '💻' },
  { id: 'sports', name: 'Sports', emoji: '⚽' },
  { id: 'science', name: 'Science', emoji: '🔬' },
  { id: 'business', name: 'Business', emoji: '📈' },
  { id: 'health', name: 'Health', emoji: '🏥' }
]

const categoryGradients = {
  general: { bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', emoji: '🌍' },
  technology: { bg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', emoji: '💻' },
  sports: { bg: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', emoji: '⚽' },
  science: { bg: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', emoji: '🔬' },
  business: { bg: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', emoji: '📈' },
  health: { bg: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', emoji: '🏥' }
}

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

const handleImageError = (event, article) => {
  const img = event.target
  const wrapper = img.closest('div')
  if (wrapper) {
    const cat = article?.category || 'general'
    const grad = categoryGradients[cat] || categoryGradients.general
    wrapper.innerHTML = '<div class="w-full h-full flex items-center justify-center text-2xl" style="background:' + grad.bg + '">' + grad.emoji + '</div>'
  }
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

onMounted(async () => {
  loading.value = true
  const { data, error: err } = await supabase
    .from('articles')
    .select('*')
    .order('published', { ascending: false })

  if (err) {
    error.value = 'Failed to load archives.'
  } else if (data) {
    articles.value = data
  }
  loading.value = false
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700;800&family=Playfair+Display:ital,wght@0,600;0,700&family=Plus+Jakarta+Sans:wght@400;600;700&display=swap');

.news-portal-container {
  font-family: 'Plus Jakarta Sans', sans-serif;
  min-height: 100vh;
  color: var(--color-text);
}
.portal-layout {
  padding: 3rem 2rem;
  display: flex;
  justify-content: center;
}
.editorial-card {
  width: 100%;
  max-width: 800px;
  border: 1px solid;
  padding: 3rem;
}
.section-badge {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 1px;
}
.page-title {
  font-family: 'Playfair Display', serif;
  font-size: 2.5rem;
  margin: 0.5rem 0 1rem;
  color: var(--color-text);
}
.lead-text {
  font-size: 1.05rem;
  margin-bottom: 2rem;
}
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>