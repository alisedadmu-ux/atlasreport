<template>
  <div class="bg-[#fcfbfc] min-h-screen py-16">
    <div class="max-w-3xl mx-auto px-6">
      
      <NuxtLink to="/" class="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-red-600 hover:text-red-700 transition-colors mb-8 group">
        <span class="transform group-hover:-translate-x-1 transition-transform">←</span> Return to Newsroom
      </NuxtLink>

      <article v-if="article">
        <header class="mb-8 border-b border-gray-200 pb-8">
          <div class="flex items-center gap-2 mb-3">
            <span class="text-xs font-extrabold text-red-600 uppercase tracking-widest">{{ article.category || 'Exclusive' }}</span>
            <span class="text-gray-300">|</span>
            <span class="text-xs text-gray-500 font-medium">Published: June 11, 2026</span>
          </div>
          <h1 class="text-3xl md:text-5xl font-serif font-black text-[#0f2c59] leading-tight mb-4 tracking-tight">
            {{ article.title }}
          </h1>
          <div class="flex items-center gap-3 mt-6">
            <div class="w-8 h-8 rounded-full bg-[#0f2c59] text-white flex items-center justify-center text-xs font-bold">AN</div>
            <p class="text-xs text-gray-600 font-semibold">By <span class="text-gray-900">Atlas Newsroom Editorial Desk</span></p>
          </div>
        </header>

        <div v-if="article.image" class="mb-10 overflow-hidden rounded-xl shadow-sm border border-gray-100 max-h-[460px]">
          <img :src="article.image" alt="Editorial asset" class="w-full h-full object-cover" />
        </div>
        
        <div class="prose prose-lg max-w-none text-gray-800 font-serif leading-relaxed space-y-6">
          <p class="text-xl font-sans font-normal text-gray-900 border-l-4 border-[#0f2c59] pl-5 italic leading-normal bg-gray-50/50 py-4 pr-4 rounded-r">
            {{ article.lead }}
          </p>

          <p v-for="(paragraph, index) in article.paragraphs" :key="index" class="text-lg font-light tracking-wide text-gray-800">
            {{ paragraph }}
          </p>
        </div>
      </article>
      
      <div v-else class="text-center py-20 bg-white rounded-xl border border-gray-100 shadow-sm">
        <h2 class="text-2xl font-bold text-[#0f2c59] mb-2">Briefing Unavailable</h2>
        <p class="text-gray-500 text-sm mb-6">The requested document file could not be found.</p>
        <NuxtLink to="/" class="inline-block bg-[#0f2c59] text-white text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-lg hover:bg-opacity-90 transition-opacity">
          Go Back Home
        </NuxtLink>
      </div>

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