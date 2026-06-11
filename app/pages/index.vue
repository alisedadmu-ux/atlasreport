<template>
  <div class="bg-[#f7f6f3] min-h-screen text-[#1a1a1a] p-3 sm:p-6 md:p-8 antialiased selection:bg-amber-200">
    
    <div class="max-w-7xl mx-auto bg-white rounded-3xl shadow-[0_24px_70px_rgba(0,0,0,0.07)] border border-stone-200/80 overflow-hidden">
      
      <div class="bg-[#0b132b] text-[#e0b034] px-6 py-3.5 text-[10px] md:text-xs font-black tracking-[0.2em] uppercase flex justify-between items-center border-b border-stone-800">
        <div class="flex items-center gap-2.5">
          <span class="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
          <span class="text-white font-extrabold">LIVE NEWSROOM //</span> WORLD TRANSFERS UPDATE
        </div>
        <div class="hidden lg:flex items-center gap-6 text-stone-400 font-medium tracking-normal">
          <span>📈 MARKETS: ACTIVE</span>
          <span>⚽ FOOTBALL: WINDOW OPEN</span>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-stone-200">
        
        <div class="lg:col-span-5 p-6 md:p-8 flex flex-col justify-between group cursor-pointer">
          <div class="space-y-6">
            <div class="overflow-hidden rounded-2xl shadow-md aspect-[16/10] bg-stone-100 border border-stone-200">
              <img 
                src="/images/treaty.jfif" 
                alt="Geneva Summit" 
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
              />
            </div>
            <div class="space-y-3">
              <div class="flex items-center gap-2">
                <span class="px-2.5 py-0.5 bg-red-600 text-white font-black tracking-widest uppercase text-[9px] rounded-sm">EXCLUSIVE</span>
                <span class="text-xs font-bold text-stone-500 tracking-wider">Politics</span>
              </div>
              <NuxtLink to="/news/trade-treaty" class="block">
                <h1 class="text-3xl md:text-4xl font-serif font-black tracking-tight text-stone-950 leading-[1.1] group-hover:text-red-700 transition-colors">
                  Breakthrough international trade treaties signed in Geneva summit.
                </h1>
              </NuxtLink>
              <p class="text-stone-600 font-serif text-base md:text-lg font-light leading-relaxed">
                Diplomatic representatives have authorized historic trade frameworks designed to permanently alter logistics pipelines, balancing critical infrastructure equity across continents.
              </p>
            </div>
          </div>
          <div class="pt-6 mt-6 border-t border-stone-100">
            <NuxtLink to="/news/trade-treaty" class="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-stone-950 hover:text-red-600 transition-colors">
              Analyze Intelligence Dispatch →
            </NuxtLink>
          </div>
        </div>

        <div class="lg:col-span-4 p-6 md:p-8 bg-stone-50/50 space-y-8">
          <div class="flex items-center justify-between border-b border-stone-900 pb-2">
            <h2 class="text-xs font-black tracking-[0.15em] text-stone-950 uppercase flex items-center gap-2">
              <span>⚽</span> SPORTS BREAKING
            </h2>
            <span class="text-[10px] font-bold text-red-600 uppercase tracking-widest animate-pulse">Live Feed</span>
          </div>

          <div class="space-y-8">
            <article v-for="(article, id) in sportsArticles" :key="id" class="group space-y-4">
              <div class="overflow-hidden rounded-xl shadow-sm aspect-video border border-stone-200">
                <img :src="article.image" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" />
              </div>
              <div class="space-y-2">
                <span class="text-[9px] font-black text-red-600 uppercase tracking-widest block">Football Continental</span>
                <NuxtLink :to="`/news/${id}`" class="block">
                  <h3 class="text-xl font-serif font-black text-stone-950 group-hover:text-red-600 transition-colors leading-tight tracking-tight">
                    {{ article.title }}
                  </h3>
                </NuxtLink>
                <p class="text-stone-600 font-serif text-xs line-clamp-3 leading-relaxed">{{ article.lead }}</p>
              </div>
            </article>
          </div>
        </div>

        <div class="lg:col-span-3 p-6 md:p-8 space-y-6">
          <div class="border-b border-stone-900 pb-2">
            <h2 class="text-xs font-black tracking-[0.15em] text-stone-950 uppercase flex items-center gap-2">
              <span>🔥</span> POPULAR NOW
            </h2>
          </div>

          <div class="divide-y divide-stone-200">
            <div v-for="(article, id, index) in marketArticles" :key="id" class="group py-5 first:pt-0 last:pb-0">
              <div class="flex items-baseline gap-3">
                <span class="text-3xl font-sans font-black text-stone-200 group-hover:text-amber-500 transition-colors duration-300">
                  0{{ index + 1 }}
                </span>
                <div class="space-y-1">
                  <span class="text-[9px] font-black text-amber-700 uppercase tracking-widest block">Market Velocity</span>
                  <NuxtLink :to="`/news/${id}`" class="block font-serif font-bold text-base text-stone-900 group-hover:text-red-600 transition-colors leading-snug tracking-tight">
                    {{ article.title }}
                  </NuxtLink>
                  <p class="text-stone-500 font-serif text-[11px] line-clamp-2 leading-normal pt-1">{{ article.lead }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-gradient-to-br from-[#0b132b] to-[#1c2541] text-stone-100 p-5 rounded-2xl border border-stone-800 shadow-inner mt-4">
            <h4 class="text-[9px] font-black text-[#e0b034] tracking-[0.2em] uppercase mb-1">Atlas News Terminal</h4>
            <p class="text-xs text-stone-400 font-light leading-relaxed">Secure algorithmic streaming data frames are operational on all authenticated nodes.</p>
          </div>
        </div>

      </div>

    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { articlesDatabase } from '~/data/articles.js'

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