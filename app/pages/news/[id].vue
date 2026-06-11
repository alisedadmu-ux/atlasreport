<template>
  <div v-if="article" class="bg-[#fafaf9] min-h-screen pb-20 selection:bg-red-100">
    <div class="fixed top-20 left-0 w-full h-1 bg-slate-200 z-50">
      <div class="bg-red-600 h-full w-1/3"></div>
    </div>

    <header class="pt-12 pb-12 border-b border-slate-200 bg-white">
      <div class="max-w-4xl mx-auto px-6">
        <div class="flex items-center gap-4 mb-8">
          <span class="px-3 py-1 bg-slate-950 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-sm">
            {{ article.category }}
          </span>
          <span class="text-slate-400 text-xs font-bold tracking-widest uppercase">{{ article.date }}</span>
        </div>
        
        <h1 class="text-4xl md:text-6xl font-serif font-black text-slate-950 leading-[1.05] tracking-tight mb-8">
          {{ article.title }}
        </h1>

        <p class="text-xl md:text-2xl font-serif font-bold text-slate-700 leading-relaxed italic border-l-8 border-red-600 pl-6">
          {{ article.lead }}
        </p>
      </div>
    </header>

    <div class="max-w-4xl mx-auto px-6 mt-12">
      <div class="rounded-3xl overflow-hidden shadow-2xl border border-slate-200 mb-16">
        <img :src="article.image" class="w-full object-cover max-h-[500px]" />
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <aside class="lg:col-span-3 space-y-8 border-t lg:border-t-0 pt-8 lg:pt-0">
          <div class="space-y-1">
            <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Reporting Desk</p>
            <p class="text-sm font-bold text-slate-900">Atlas Intelligence Unit</p>
          </div>
          <div class="space-y-1">
            <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Transmission</p>
            <p class="text-sm font-bold text-slate-900">Encrypted Satellite Node 04</p>
          </div>
          <div class="pt-6 border-t border-slate-200">
            <button class="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-900 text-[10px] font-black uppercase tracking-widest transition-colors rounded-lg">
              Download PDF Report
            </button>
          </div>
        </aside>

        <main class="lg:col-span-9">
          <div class="bg-slate-900 text-slate-100 p-8 rounded-2xl mb-12 shadow-xl">
            <h3 class="text-amber-400 text-[10px] font-black uppercase tracking-[0.3em] mb-4">Executive Briefing</h3>
            <p class="text-lg font-serif leading-relaxed opacity-90">{{ article.summary }}</p>
          </div>

          <div class="prose prose-slate max-w-none space-y-8">
            <p v-for="(paragraph, index) in article.paragraphs" :key="index" 
               class="text-slate-800 font-serif text-lg md:text-xl leading-[1.8] font-light">
              {{ paragraph }}
            </p>
          </div>

          <div class="mt-20 pt-10 border-t border-slate-200 flex justify-between items-center">
            <NuxtLink to="/" class="text-xs font-black uppercase tracking-widest text-red-600 hover:text-slate-950 transition-colors">
              ← Return to Dashboard
            </NuxtLink>
            <p class="text-[10px] font-bold text-slate-400 uppercase">Verification ID: {{ route.params.id }}-2026-X</p>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { articlesDatabase } from '~/data/articles.js'

const route = useRoute()
const article = articlesDatabase[route.params.id]
</script>