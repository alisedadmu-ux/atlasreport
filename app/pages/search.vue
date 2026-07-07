<template>
  <div class="min-h-screen" :style="{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }">
    <main class="max-w-4xl mx-auto px-6 py-12">
      <!-- Search Header -->
      <div class="mb-8">
        <h1 class="font-serif text-3xl font-black mb-2" :style="{ color: 'var(--color-text)' }">Search Articles</h1>
        <p class="text-sm" :style="{ color: 'var(--color-text-secondary)' }">Find articles across all categories and sources.</p>
      </div>

      <!-- Search Input -->
      <div class="relative mb-8">
        <input
          v-model="query"
          @input="onSearchInput"
          @keydown.enter="performSearch"
          type="text"
          placeholder="Search articles by title, description, author..."
          class="w-full rounded-xl border-2 px-5 py-4 pr-12 text-sm outline-none transition-all"
          :style="{
            backgroundColor: 'var(--color-input-bg)',
            borderColor: query ? 'var(--color-accent)' : 'var(--color-input-border)',
            color: 'var(--color-text)'
          }"
        />
        <button
          @click="performSearch"
          class="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-lg transition-colors"
          :style="{ color: 'var(--color-text-muted)' }"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>

      <!-- Category quick filters -->
      <div class="flex flex-wrap gap-2 mb-6">
        <button
          v-for="cat in categories"
          :key="cat.id"
          @click="toggleCategory(cat.id)"
          class="px-3 py-1.5 text-xs font-semibold rounded-full border transition-colors"
          :style="{
            borderColor: selectedCategories.includes(cat.id) ? 'var(--color-accent)' : 'var(--color-border)',
            backgroundColor: selectedCategories.includes(cat.id) ? 'var(--color-accent)' : 'var(--color-bg-alt)',
            color: selectedCategories.includes(cat.id) ? '#fff' : 'var(--color-text-secondary)'
          }"
        >
          {{ cat.emoji }} {{ cat.name }}
        </button>
      </div>

      <!-- Loading -->
      <div v-if="searching" class="flex justify-center py-12">
        <div class="animate-spin h-6 w-6 border-2 rounded-full" :style="{ borderColor: 'var(--color-accent)', borderTopColor: 'transparent' }"></div>
      </div>

      <!-- Results -->
      <template v-else-if="searched">
        <p class="text-xs mb-4" :style="{ color: 'var(--color-text-muted)' }">
          {{ results.length }} result{{ results.length !== 1 ? 's' : '' }} for "{{ lastQuery }}"
        </p>

        <div v-if="results.length" class="space-y-3">
          <div
            v-for="article in results"
            :key="article.id"
            @click="navigateTo(`/news/${article.id}`)"
            class="flex gap-4 p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md"
            :style="{
              borderColor: 'var(--color-border)',
              backgroundColor: 'var(--color-bg-muted)'
            }"
          >
            <div class="w-20 h-20 shrink-0 rounded overflow-hidden">
              <img
                :src="article.image"
                :alt="article.title"
                class="w-full h-full object-cover"
                @error="(e) => { e.target.style.display = 'none' }"
              />
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <span class="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded" :style="{ backgroundColor: 'var(--color-accent)', color: '#fff' }">
                  {{ article.category }}
                </span>
                <span class="text-[10px]" :style="{ color: 'var(--color-text-muted)' }">{{ formatDate(article.published) }}</span>
              </div>
              <h3 class="text-sm font-bold leading-snug mb-1" :style="{ color: 'var(--color-text)' }">
                <span v-for="(part, i) in highlightText(article.title)" :key="i" :class="part.highlight ? 'bg-yellow-200 dark:bg-yellow-700' : ''">{{ part.text }}</span>
              </h3>
              <p class="text-xs line-clamp-2" :style="{ color: 'var(--color-text-secondary)' }">
                <span v-for="(part, i) in highlightText(article.description)" :key="i" :class="part.highlight ? 'bg-yellow-200 dark:bg-yellow-700' : ''">{{ part.text }}</span>
              </p>
            </div>
          </div>
        </div>

        <p v-else class="text-sm text-center py-12" :style="{ color: 'var(--color-text-muted)' }">
          No articles found. Try different keywords or categories.
        </p>
      </template>

      <!-- Initial state -->
      <div v-else class="text-center py-16">
        <div class="text-5xl mb-4">🔍</div>
        <p class="text-sm" :style="{ color: 'var(--color-text-muted)' }">
          Type a keyword above to search through all articles.
        </p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const supabase = useSupabaseClient()

const query = ref('')
const lastQuery = ref('')
const results = ref([])
const searching = ref(false)
const searched = ref(false)
const selectedCategories = ref([])

const categories = [
  { id: 'general', name: 'World', emoji: '🌍' },
  { id: 'technology', name: 'Tech', emoji: '💻' },
  { id: 'sports', name: 'Sports', emoji: '⚽' },
  { id: 'science', name: 'Science', emoji: '🔬' },
  { id: 'business', name: 'Business', emoji: '📈' },
  { id: 'health', name: 'Health', emoji: '🏥' }
]

let debounceTimer = null

const onSearchInput = () => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    if (query.value.trim()) performSearch()
  }, 400)
}

const toggleCategory = (catId) => {
  const idx = selectedCategories.value.indexOf(catId)
  if (idx >= 0) {
    selectedCategories.value.splice(idx, 1)
  } else {
    selectedCategories.value.push(catId)
  }
  if (lastQuery.value) performSearch()
}

const performSearch = async () => {
  const q = query.value.trim()
  if (!q) return

  searching.value = true
  searched.value = true
  lastQuery.value = q

  try {
    let dbQuery = supabase
      .from('articles')
      .select('*')
      .or(`title.ilike.%${q}%,description.ilike.%${q}%,author.ilike.%${q}%`)
      .order('published', { ascending: false })

    if (selectedCategories.value.length) {
      dbQuery = dbQuery.in('category', selectedCategories.value)
    }

    const { data, error } = await dbQuery

    if (!error && data) {
      results.value = data
    } else {
      results.value = []
    }
  } catch (e) {
    results.value = []
  }

  searching.value = false
}

const highlightText = (text) => {
  if (!text || !lastQuery.value) return [{ text: text || '', highlight: false }]
  const regex = new RegExp(`(${lastQuery.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  const parts = text.split(regex)
  return parts.map(part => ({
    text: part,
    highlight: regex.test(part) || part.toLowerCase() === lastQuery.value.toLowerCase()
  }))
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script>