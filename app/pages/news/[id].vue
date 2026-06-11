<template>
  <div class="max-w-4xl mx-auto px-6 py-12">
    <article v-if="article" class="bg-white rounded-lg shadow-sm p-8 border border-gray-100">
      <NuxtLink to="/" class="inline-block text-red-600 hover:text-red-700 font-semibold text-sm uppercase tracking-wider mb-6 transition-colors">
        ← Back to News Desk
      </NuxtLink>
      
      <div class="mb-8 pb-6 border-b border-gray-200">
        <span class="block text-xs font-bold text-red-600 uppercase tracking-widest mb-2">Exclusive Report</span>
        <h1 class="text-3xl md:text-4xl font-bold text-[#0f2c59] leading-tight mb-4">{{ article.title }}</h1>
        <p class="text-sm text-gray-500">Published: June 11, 2026 | By Atlas Newsroom</p>
      </div>

      <div v-if="article.image" class="mb-8 overflow-hidden rounded-lg max-h-[400px]">
        <img :src="article.image" alt="Article imagery" class="w-full h-full object-cover" />
      </div>
      
      <div class="space-y-6 text-gray-800 text-lg leading-relaxed">
        <p class="text-xl font-medium text-gray-900 leading-normal border-l-4 border-[#0f2c59] pl-4 italic">
          {{ article.lead }}
        </p>

        <p v-for="(paragraph, index) in article.paragraphs" :key="index">
          {{ paragraph }}
        </p>
      </div>
    </article>
    
    <div v-else class="text-center py-20 bg-gray-50 rounded-lg border border-gray-200">
      <h1 class="text-3xl font-bold text-[#0f2c59] mb-4">Article Not Found</h1>
      <p class="text-gray-600 mb-6">The requested brief may have been archived or moved.</p>
      <NuxtLink to="/" class="inline-block bg-[#0f2c59] text-white px-6 py-3 font-bold rounded hover:bg-opacity-90 transition-opacity">
        Return Home
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import { articlesDatabase } from '~/data/articles.js'

const route = useRoute()
const articleId = route.params.id

const article = computed(() => articlesDatabase[articleId])
</script>