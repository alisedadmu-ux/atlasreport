<template>
  <main class="article-shell">
    <div v-if="loading" class="loading-state">
      <div class="loading-card"></div>
      <div class="loading-card short"></div>
    </div>

    <div v-else-if="!article" class="empty-state">
      <h2>Article not found</h2>
      <NuxtLink to="/" class="back-link">&larr; Return to home</NuxtLink>
    </div>

    <div v-else class="article-layout">
      <NuxtLink to="/" class="back-link">&larr; Back to feed</NuxtLink>

      <section class="article-hero">
        <div class="article-hero-copy">
          <div class="hero-meta-row">
            <span class="category-pill">{{ article.category }}</span>
            <span class="meta-text">{{ formatDate(article.published) }}</span>
            <span class="meta-text">By {{ article.author }}</span>
          </div>
          <h1>{{ article.title }}</h1>
          <p>{{ article.description }}</p>
        </div>
        <div class="hero-visual">
          <img :src="article.image" :alt="article.title" @error="onImageError" />
        </div>
      </section>

      <div class="content-grid">
        <article class="article-content">
          <div class="article-summary">
            <p>{{ article.description }}</p>
          </div>
          <div v-for="(paragraph, index) in contentParagraphs" :key="index" class="article-paragraph">
            <p>{{ paragraph }}</p>
          </div>
        </article>

        <aside class="article-sidebar">
          <div class="detail-card">
            <h3>Story details</h3>
            <div class="detail-row"><span>Category</span><strong>{{ article.category }}</strong></div>
            <div class="detail-row"><span>Published</span><strong>{{ formatDate(article.published) }}</strong></div>
            <div class="detail-row"><span>Author</span><strong>{{ article.author }}</strong></div>
          </div>

          <div class="detail-card muted">
            <h3>Why this matters</h3>
            <p>Atlas Report is designed to keep important reporting clear, accessible, and easy to read without compromising depth.</p>
          </div>
        </aside>
      </div>

      <div class="comments-section">
        <CommentsSection :article-id="article.id" />
      </div>
    </div>
  </main>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { fallbackArticles } from '~/data/fallback-articles'

const route = useRoute()
const supabase = useSupabaseClient()

const article = ref(null)
const loading = ref(true)

const contentParagraphs = computed(() => {
  if (!article.value?.content) return []
  if (Array.isArray(article.value.content)) return article.value.content
  return [article.value.content]
})

const categoryPlaceholders = {
  general: { bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', emoji: '🌍' },
  technology: { bg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', emoji: '💻' },
  sports: { bg: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', emoji: '⚽' },
  science: { bg: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', emoji: '🔬' },
  business: { bg: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', emoji: '📈' },
  health: { bg: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', emoji: '🏥' }
}

const onImageError = (event) => {
  const img = event.target
  const wrapper = img.closest('.hero-visual')
  if (wrapper) {
    const category = article.value?.category || 'general'
    const ph = categoryPlaceholders[category] || categoryPlaceholders.general
    wrapper.innerHTML = `<div class="category-placeholder" style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:${ph.bg};font-size:3.5rem;">${ph.emoji}</div>`
  }
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

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
})
</script>

<style scoped>
.article-shell {
  padding: 1.2rem 0 0;
}

.article-layout {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  width: fit-content;
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: var(--color-accent);
}

.article-hero {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 1.25rem;
  padding: 1.4rem;
  border: 1px solid var(--color-border);
  border-radius: 28px;
  background: linear-gradient(135deg, #ffffff 0%, #f7efe2 100%);
  box-shadow: 0 20px 60px rgba(17, 17, 17, 0.05);
}

.article-hero-copy h1 {
  margin: 0.8rem 0 0.7rem;
  font-size: clamp(1.7rem, 3vw, 2.6rem);
  line-height: 1.08;
  font-family: 'Playfair Display', serif;
  font-weight: 800;
  color: #111111;
}

.article-hero-copy p {
  margin: 0;
  color: var(--color-text-secondary);
  line-height: 1.75;
}

.hero-meta-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.7rem;
  align-items: center;
}

.category-pill {
  display: inline-flex;
  padding: 0.4rem 0.7rem;
  border-radius: 999px;
  color: white;
  background: #111111;
  font-size: 0.72rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.18em;
}

.meta-text {
  color: var(--color-text-muted);
  font-size: 0.8rem;
  font-weight: 600;
}

.hero-visual {
  min-height: 280px;
  border-radius: 24px;
  overflow: hidden;
  background: #efe6d7;
}

.hero-visual img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.content-grid {
  display: grid;
  grid-template-columns: 1.45fr 0.7fr;
  gap: 1rem;
}

.article-content,
.detail-card {
  border: 1px solid var(--color-border);
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.82);
  box-shadow: 0 10px 30px rgba(17, 17, 17, 0.04);
}

.article-content {
  padding: 1.2rem;
}

.article-summary {
  margin-bottom: 1rem;
  padding: 0.95rem 1rem;
  border-left: 3px solid var(--color-accent);
  border-radius: 0 14px 14px 0;
  background: #f8f3e8;
}

.article-summary p {
  margin: 0;
  font-weight: 600;
  color: #222222;
  line-height: 1.7;
}

.article-paragraph p {
  margin: 0 0 1rem;
  color: var(--color-text-secondary);
  line-height: 1.8;
}

.article-sidebar {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

.detail-card {
  padding: 1rem 1.05rem;
}

.detail-card.muted {
  background: linear-gradient(135deg, #fcfaf7 0%, #f7efe2 100%);
}

.detail-card h3 {
  margin: 0 0 0.9rem;
  font-size: 0.95rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: #111111;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.45rem 0;
  border-bottom: 1px solid rgba(232, 224, 212, 0.8);
  font-size: 0.9rem;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-row span {
  color: var(--color-text-muted);
}

.detail-row strong {
  color: #111111;
  font-weight: 700;
  text-align: right;
}

.detail-card p {
  margin: 0;
  color: var(--color-text-secondary);
  line-height: 1.7;
}

.comments-section {
  margin-top: 0.8rem;
  padding-top: 0.8rem;
  border-top: 1px solid var(--color-border);
}

.loading-state {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.loading-card {
  min-height: 220px;
  border-radius: 24px;
  background: linear-gradient(90deg, #f0e8da 0%, #f8f4ea 50%, #f0e8da 100%);
  background-size: 200% 100%;
  animation: shimmer 1.3s infinite;
}

.loading-card.short {
  min-height: 90px;
  max-width: 340px;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

@media (max-width: 920px) {
  .article-hero,
  .content-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .article-hero {
    padding: 1rem;
    border-radius: 22px;
  }

  .article-content {
    padding: 1rem;
  }
}
</style>
