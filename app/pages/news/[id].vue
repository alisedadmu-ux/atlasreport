<template>
  <main class="max-w-7xl mx-auto px-4 py-8">
    <div v-if="loading" class="text-center py-20">
      <p class="text-slate-400 text-sm">Loading article...</p>
    </div>

    <div v-else-if="!article" class="text-center py-20">
      <h2 class="text-xl font-bold text-slate-900">Article not found</h2>
      <NuxtLink to="/" class="text-red-700 hover:underline mt-4 inline-block text-sm">&larr; Return to home</NuxtLink>
    </div>

    <div v-else class="space-y-6">
      <NuxtLink to="/" class="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-red-700 transition-colors">
        &larr; Back to feed
      </NuxtLink>

      <div class="space-y-3 max-w-4xl">
        <div class="flex items-center gap-2">
          <span class="text-xs font-extrabold text-white bg-slate-900 uppercase tracking-widest px-2 py-0.5 rounded">
            {{ article.category }}
          </span>
          <span class="text-xs text-slate-500">{{ formatDate(article.published) }}</span>
          <span class="text-xs text-slate-400">by {{ article.author }}</span>
        </div>
        <h1 class="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight font-serif">
          {{ article.title }}
        </h1>
      </div>

      <div class="grid lg:grid-cols-3 gap-8">
        
        <div class="lg:col-span-2 space-y-6">
          <div class="relative h-96 w-full rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
            <img :src="article.image" :alt="article.title" class="w-full h-full object-cover" />
          </div>

          <p class="text-base font-semibold text-slate-700 border-l-2 border-red-700 pl-4 bg-slate-50 py-3 pr-3 rounded-r-lg leading-relaxed">
            {{ article.description }}
          </p>

          <div class="space-y-4 text-slate-600 text-sm leading-relaxed">
            <p v-for="(paragraph, index) in article.content" :key="index" class="text-justify">
              {{ paragraph }}
            </p>
          </div>
        </div>

        <div class="space-y-4">
          <div class="bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-sm">
            <h4 class="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center gap-1.5 border-b border-slate-200 pb-2">
              Article Details
            </h4>
            <div class="space-y-2.5 text-xs">
              <div class="flex justify-between border-b border-slate-100 pb-1.5">
                <span class="text-slate-500">Category:</span>
                <span class="text-slate-900 font-semibold uppercase">{{ article.category }}</span>
              </div>
              <div class="flex justify-between border-b border-slate-100 pb-1.5">
                <span class="text-slate-500">Published:</span>
                <span class="text-slate-900">{{ formatDate(article.published) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-500">Author:</span>
                <span class="text-slate-900">{{ article.author }}</span>
              </div>
            </div>
          </div>

          <div class="bg-white border border-slate-200 rounded-xl p-4 space-y-2 shadow-sm">
            <h4 class="text-xs font-black uppercase text-slate-700 tracking-wider border-b border-slate-200 pb-2">
              Summary
            </h4>
            <p class="text-xs text-slate-600 leading-relaxed pt-1">
              {{ article.description }}
            </p>
          </div>
        </div>
      </div>

      <!-- Comments Section -->
      <div class="mt-12 border-t border-slate-200 pt-8">
        <CommentsSection :article-id="article.id" />
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const supabase = useSupabaseClient()

const article = ref(null)
const loading = ref(true)

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
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('id', route.params.id)
    .single()

  if (!error && data) {
    article.value = data
  }
  loading.value = false
})
</script>
