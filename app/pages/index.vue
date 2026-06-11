<template>
  <div class="bg-[#fcfaf7] min-h-screen text-slate-950 font-sans p-2 sm:p-4 md:p-6 lg:p-8 transition-all duration-300">
    <div class="max-w-[1750px] mx-auto bg-white border border-slate-200 sm:border-2 sm:border-slate-950 shadow-xl sm:shadow-[0_30px_90px_rgba(154,23,23,0.08)] rounded-2xl sm:rounded-3xl overflow-hidden">
      
      <div class="bg-slate-950 text-white px-4 sm:px-8 py-3.5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4 border-b border-slate-900">
        <div class="flex items-center gap-3 w-full sm:w-auto">
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          <p class="text-[10px] sm:text-xs font-black tracking-[0.25em] uppercase text-slate-100 truncate">
            ATLAS MONITOR // <span class="text-red-500">LIVE WIRE READY</span>
          </p>
        </div>
        
        <div class="w-full sm:w-auto overflow-x-auto no-scrollbar py-0.5 sm:py-0 border-t border-slate-800 sm:border-0 pt-1.5 sm:pt-0">
          <div class="text-[9px] font-mono tracking-widest text-slate-400 uppercase whitespace-nowrap flex gap-4">
            <span>[NODES INDEXED: {{ Object.keys(articlesDatabase).length }}]</span>
            <span class="sm:hidden text-red-500">• SWIPE FOR ACTIVE STREAMS •</span>
            <span class="hidden sm:inline">SYS_STATUS: ACTIVE</span>
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-br from-red-800 via-red-600 to-amber-600 p-5 sm:p-8 md:p-12 border-b sm:border-b-2 border-slate-950 text-white space-y-4 sm:space-y-6">
        <div class="max-w-4xl space-y-2">
          <span class="inline-block text-[9px] font-black tracking-[0.25em] uppercase bg-black/25 px-2.5 py-1 rounded">
            INTEL DECRYPTION GRID
          </span>
          <h2 class="text-2xl sm:text-3xl md:text-5xl font-serif font-black tracking-tight leading-[1.1]">
            Query the Active 2026 Core Stream.
          </h2>
        </div>
        
        <div class="max-w-3xl relative group">
          <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 text-sm sm:text-base">
            ⚡
          </div>
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Filter titles, topics, sports, networks..." 
            class="w-full bg-white text-slate-950 font-medium pl-9 sm:pl-11 pr-12 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl border border-slate-300 sm:border-2 sm:border-slate-950 shadow-sm sm:shadow-[4px_4px_0px_#000] focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/20 text-sm sm:text-base font-serif transition-all"
          />
          <button 
            v-if="searchQuery" 
            @click="searchQuery = ''"
            class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[10px] font-black text-slate-400 hover:text-red-600 uppercase tracking-widest"
          >
            Clear
          </button>
        </div>
      </div>

      <div v-if="filteredArticlesList.length === 0" class="p-12 sm:p-20 text-center space-y-4 bg-slate-50/50">
        <span class="text-3xl sm:text-4xl block">📭</span>
        <h3 class="text-lg sm:text-xl font-serif font-black text-slate-950">No Active Feeds Match</h3>
        <p class="text-xs text-slate-500 font-mono max-w-sm mx-auto leading-relaxed">
          The query matrix parameter [ "{{ searchQuery }}" ] did not correspond to any encrypted partitions in our active registry database.
        </p>
        <button @click="searchQuery = ''" class="mt-2 px-4 py-2.5 bg-slate-950 text-white font-black text-[10px] uppercase tracking-widest rounded-lg shadow-sm">
          Reset Telemetry Feed
        </button>
      </div>

      <div v-else class="p-4 sm:p-6 md:p-8 lg:p-10 bg-[#fafaf9]">
        <div class="flex items-center gap-2 mb-6 sm:mb-8 border-b border-slate-200 pb-3 sm:pb-4">
          <span class="text-[9px] font-black tracking-widest uppercase bg-slate-950 text-white px-2 py-1 rounded-sm">
            INDEXED MANIFEST
          </span>
          <span class="text-xs font-mono text-slate-400">{{ filteredArticlesList.length }} Entries Loaded</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <article 
            v-for="article in filteredArticlesList" 
            :key="article.id" 
            class="bg-white border border-slate-200 sm:border-2 sm:border-slate-950 rounded-xl sm:rounded-2xl overflow-hidden shadow-sm sm:shadow-[4px_4px_0px_rgba(15,23,42,1)] hover:shadow-[6px_6px_0px_rgba(185,28,28,1)] sm:hover:shadow-[8px_8px_0px_rgba(185,28,28,1)] transition-all duration-300 transform sm:hover:-translate-y-1 flex flex-col justify-between group"
          >
            <div class="space-y-3 sm:space-y-4">
              <div class="aspect-[16/10] overflow-hidden border-b border-slate-200 sm:border-b-2 sm:border-slate-950 bg-slate-900 relative">
                <img :src="article.image" :alt="article.title" class="w-full h-full object-cover grayscale-[15%] group-hover:grayscale-0 group-hover:scale-102 transition-all duration-700 ease-out" loading="lazy" />
                <span class="absolute top-3 left-3 bg-slate-950/90 backdrop-blur-sm text-white font-black text-[8px] sm:text-[9px] tracking-widest uppercase px-2 py-0.5 rounded-sm border border-slate-800">
                  {{ article.category }}
                </span>
              </div>

              <div class="p-4 sm:p-6 space-y-2 sm:space-y-3">
                <p class="text-[9px] sm:text-[10px] font-mono text-slate-400 uppercase tracking-wider">{{ article.date }}</p>
                
                <NuxtLink :to="`/news/${article.id}`" class="block group-hover:text-red-700 transition-colors">
                  <h3 class="text-base sm:text-lg md:text-xl font-serif font-black text-slate-950 group-hover:text-red-700 leading-tight tracking-tight">
                    {{ article.title }}
                  </h3>
                </NuxtLink>
                
                <p class="text-xs font-serif font-bold text-slate-800 leading-relaxed line-clamp-2 sm:line-clamp-3">
                  {{ article.lead }}
                </p>
                <p class="text-xs font-serif text-slate-500 font-light leading-relaxed line-clamp-3 sm:line-clamp-4 italic pt-1 border-t border-slate-50">
                  {{ article.summary }}
                </p>
              </div>
            </div>

            <div class="p-4 sm:p-6 pt-0 border-t border-slate-100 mt-2 flex justify-between items-center">
              <NuxtLink :to="`/news/${article.id}`" class="text-[10px] font-black uppercase tracking-widest text-slate-950 group-hover:text-red-600 transition-colors py-1.5 flex items-center gap-1.5">
                <span>Examine Full Report</span>
                <span class="inline-block transform group-hover:translate-x-0.5 transition-transform">→</span>
              </NuxtLink>
              <span class="text-[9px] font-mono text-slate-300 hidden sm:inline">REG:{{ article.id.substring(0,4).toUpperCase() }}</span>
            </div>
          </article>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { articlesDatabase } from '~/data/articles.js'

const searchQuery = ref('')

const filteredArticlesList = computed(() => {
  const query = searchQuery.value.toLowerCase().trim()
  const items = Object.entries(articlesDatabase).map(([key, value]) => ({
    id: key,
    ...value
  }))

  if (!query) return items

  return items.filter(art => {
    return (
      art.title.toLowerCase().includes(query) ||
      art.category.toLowerCase().includes(query) ||
      art.lead.toLowerCase().includes(query) ||
      art.summary.toLowerCase().includes(query)
    )
  })
})
</script>