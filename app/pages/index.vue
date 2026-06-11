<template>
  <div class="bg-[#f8fafc] min-h-screen text-slate-900 font-sans antialiased p-4 md:p-8 selection:bg-red-100">
    <div class="max-w-7xl mx-auto bg-white rounded-3xl shadow-[0_30px_80px_rgba(15,23,42,0.04)] border border-slate-200 overflow-hidden">
      
      <div class="bg-[#0f172a] text-amber-400 px-6 py-4 text-xs font-black tracking-[0.25em] uppercase flex justify-between items-center border-b border-slate-800">
        <div class="flex items-center gap-3">
          <span class="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
          <span class="text-white font-extrabold">ATLAS TELEMETRY //</span> BROADCASTING LIVE NEWSROOM STREAM
        </div>
        <div class="hidden lg:flex items-center gap-6 text-slate-400 font-bold tracking-normal text-xs">
          <span>🛡️ EU INFRASTRUCTURE CYBER SECURITY MODE: ACTIVE</span>
          <span>⚽ NORTH AMERICAN WORLD CUP TERMINALS: ONLINE</span>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
        
        <div v-if="mainStory" class="lg:col-span-5 p-6 md:p-10 flex flex-col justify-between group cursor-pointer bg-white">
          <div class="space-y-6">
            <div class="relative overflow-hidden rounded-2xl shadow-md border border-slate-200 aspect-[16/10] bg-slate-900">
              <img 
                :src="mainStory.image" 
                :alt="mainStory.title" 
                class="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700 ease-out" 
              />
              <div class="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent"></div>
            </div>
            
            <div class="space-y-4">
              <div class="flex items-center gap-3">
                <span class="px-2.5 py-0.5 bg-red-600 text-white font-black tracking-widest uppercase text-[10px] rounded">CRITICAL DISPATCH</span>
                <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">{{ mainStory.category }}</span>
              </div>
              
              <NuxtLink :to="`/news/cyber-crisis`" class="block">
                <h1 class="text-2xl md:text-4xl font-serif font-black tracking-tight text-slate-950 leading-[1.15] group-hover:text-red-600 transition-colors">
                  {{ mainStory.title }}
                </h1>
              </NuxtLink>
              
              <p class="text-slate-900 font-serif text-base md:text-lg font-bold leading-relaxed pt-1">
                {{ mainStory.lead }}
              </p>
              
              <p class="text-slate-700 font-serif text-sm md:text-base leading-relaxed bg-slate-50 p-4 rounded-xl border-l-4 border-slate-900">
                {{ mainStory.summary }}
              </p>

              <div class="space-y-3 pt-2">
                <p v-for="(p, i) in mainStory.paragraphs" :key="i" class="text-slate-600 font-serif text-sm leading-relaxed">
                  {{ p }}
                </p>
              </div>
            </div>
          </div>
          
          <div class="pt-8 mt-8 border-t border-slate-100">
            <NuxtLink :to="`/news/cyber-crisis`" class="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-950 hover:text-red-600 transition-colors group/btn">
              <span>View Full Network Mapping Report</span>
              <span class="transform group-hover/btn:translate-x-1.5 transition-transform">→</span>
            </NuxtLink>
          </div>
        </div>

        <div class="lg:col-span-4 p-6 md:p-8 bg-slate-50/60 space-y-8">
          <div class="flex items-center justify-between border-b-2 border-slate-950 pb-3">
            <h2 class="text-xs font-black tracking-[0.2em] text-slate-900 uppercase flex items-center gap-2">
              <span>⚽</span> SPORTS & LIVE TELEMETRY
            </h2>
            <span class="text-[9px] font-black bg-red-600 text-white px-2 py-0.5 rounded uppercase tracking-wider animate-pulse">Live</span>
          </div>

          <div class="space-y-10">
            <article v-for="(article, id) in sportsArticles" :key="id" class="group space-y-4">
              <div class="overflow-hidden rounded-xl shadow-sm aspect-video border border-slate-200 bg-slate-200">
                <img :src="article.image" class="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500 ease-out" />
              </div>
              <div class="space-y-3">
                <span class="text-[9px] font-black text-red-600 uppercase tracking-widest block">World Feed Transmission</span>
                <NuxtLink :to="`/news/${id}`" class="block">
                  <h3 class="text-lg md:text-xl font-serif font-black text-slate-950 group-hover:text-red-600 transition-colors leading-snug tracking-tight">
                    {{ article.title }}
                  </h3>
                </NuxtLink>
                <p class="text-slate-900 font-serif text-xs font-bold leading-relaxed">{{ article.lead }}</p>
                <p class="text-slate-600 font-serif text-xs leading-relaxed line-clamp-4 bg-white p-3 rounded-lg border border-slate-200/60 shadow-inner">{{ article.summary }}</p>
                <p class="text-slate-500 font-serif text-[11px] leading-relaxed hidden md:block">{{ article.paragraphs[0] }}</p>
              </div>
            </article>
          </div>
        </div>

        <div class="lg:col-span-3 p-6 md:p-8 space-y-6 bg-white">
          <div class="border-b border-slate-900 pb-3">
            <h2 class="text-xs font-black tracking-[0.2em] text-slate-900 uppercase flex items-center gap-2">
              <span>🔥</span> HIGH-VELOCITY RECENT NEWS
            </h2>
          </div>

          <div class="divide-y divide-slate-200">
            <div v-for="(article, id, index) in marketArticles" :key="id" class="group py-6 first:pt-0 last:pb-0">
              <div class="flex items-baseline gap-4">
                <span class="text-3xl font-sans font-black text-slate-200 group-hover:text-amber-500 transition-colors duration-300">
                  0{{ index + 1 }}
                </span>
                <div class="space-y-2">
                  <span class="text-[9px] font-black text-amber-700 uppercase tracking-widest block">Intelligence Vector</span>
                  <NuxtLink :to="`/news/${id}`" class="block font-serif font-bold text-base text-slate-950 group-hover:text-red-600 transition-colors leading-snug tracking-tight">
                    {{ article.title }}
                  </NuxtLink>
                  <p class="text-slate-900 font-serif text-xs leading-snug font-medium line-clamp-2">{{ article.lead }}</p>
                  <p class="text-slate-500 font-serif text-[11px] leading-normal line-clamp-3 bg-slate-50 p-2.5 rounded-lg border border-slate-100">{{ article.summary }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-slate-100 p-5 rounded-2xl border border-slate-800 shadow-xl mt-6">
            <div class="flex items-center gap-2 mb-2">
              <span class="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
              <h4 class="text-[9px] font-black text-amber-400 tracking-[0.25em] uppercase">Algorithmic Node Log</h4>
            </div>
            <p class="text-[11px] text-slate-400 font-light leading-relaxed">
              Global intelligence pipelines successfully populated. Content data streaming vectors initialized cleanly with continuous live background sync rules.
            </p>
          </div>
        </div>

      </div>

    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { articlesDatabase } from '~/data/articles.js'

// Target specific real-world data mappings
const mainStory = computed(() => articlesDatabase['cyber-crisis'])

const sportsArticles = computed(() => {
  return Object.fromEntries(
    Object.entries(articlesDatabase).filter(([_, art]) => art.category === 'sports')
  )
})

const marketArticles = computed(() => {
  return Object.fromEntries(
    Object.entries(articlesDatabase).filter(([_, art]) => art.category === 'markets')
  )
})
</script>