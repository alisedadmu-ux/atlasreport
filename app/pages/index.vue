<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { categoriesData } from '../data/articles.js'

// Selection, Filter, & UI Animation States
const activeCategory = ref(categoriesData[0].id)
const selectedTopic = ref(null)
const searchQuery = ref('')
const isLoading = ref(false)
const liveClock = ref('SYNCING_WITH_ATOMIC_CLOCK...')
let clockInterval = null

// Computed property to watch current active category
const currentCategoryData = computed(() => {
  return categoriesData.find(c => c.id === activeCategory.value)
})

// Filtered topics based on search input query
const filteredTopics = computed(() => {
  if (!currentCategoryData.value) return []
  return currentCategoryData.value.topics.filter(topic => 
    topic.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

// LEVEL UP: Immersive Skeleton Loader Switch on Switch Category
const handleCategoryChange = (catId) => {
  isLoading.value = true
  activeCategory.value = catId
  selectedTopic.value = null
  searchQuery.value = ''
  
  // Shimmer placeholder effect lasts for 400ms to mimic real network speeds
  setTimeout(() => {
    isLoading.value = false
  }, 400)
}

// LEVEL UP: Advanced Intelligent Headline Image Encoder Engine
const getTopicImage = (categoryId, topicId, topicName) => {
  if (!topicName) return 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80'
  
  // Encodes the actual headline text so Unsplash searches for matching photographic contexts
  const dynamicKeyword = encodeURIComponent(topicName.toLowerCase().replace(/[^a-z0-9 ]/g, ''))
  return `https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80&sig=${topicId}&q=${dynamicKeyword}`
}

// LEVEL UP: Export Brief Utility
const copyDossierJSON = () => {
  if (!selectedTopic.value) return
  navigator.clipboard.writeText(JSON.stringify(selectedTopic.value, null, 2))
  alert('SUCCESS: Dossier compiled and copied to clipboard as structured JSON telemetry.')
}

const formatIndex = (idx) => {
  const num = idx + 1
  return num < 10 ? '0' + num : num
}

const handleKeyDown = (e) => {
  if (e.key === 'Escape') {
    selectedTopic.value = null
    searchQuery.value = ''
  }
}

// LEVEL UP: Atomic Operation Clock Runtime Setup
onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
  clockInterval = setInterval(() => {
    const now = new Date()
    liveClock.value = now.toUTCString().replace('GMT', 'UTC')
  }, 1000)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
  if (clockInterval) clearInterval(clockInterval)
})
</script>

<template>
  <main class="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased py-6 px-4 sm:px-6 select-none">
    <div class="max-w-7xl mx-auto space-y-6">
      
      <div class="w-full bg-black/60 border border-slate-900 h-9 rounded-xl overflow-hidden flex items-center px-4 backdrop-blur-sm text-[10px] font-mono tracking-wider">
        <span class="text-violet-400 font-bold shrink-0 flex items-center gap-1.5 mr-4 border-r border-slate-800 pr-4">
          <span class="w-1 h-1 rounded-full bg-violet-400 animate-ping"></span>
          ATLAS_STREAM
        </span>
        <div class="animate-marquee whitespace-nowrap text-slate-500 space-x-8">
          <span>[NODE_01]: QUANTUM CORE EFFICIENCY +14.2%</span>
          <span>[NODE_04]: ORBITAL INFRASTRUCTURE SYNCHRONIZED</span>
          <span>[NODE_07]: CYBER DEFENSE APPARATUS AT 100% THREAT MITIGATION</span>
          <span>[NODE_09]: ECO-TECH MYCELIAL NETWORKS EXPANDING</span>
        </div>
      </div>

      <div class="relative bg-gradient-to-r from-slate-900 via-purple-950/10 to-black border border-slate-800/80 rounded-2xl p-8 overflow-hidden shadow-2xl">
        <div class="absolute -top-24 -left-24 w-48 h-48 bg-violet-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute -bottom-24 -right-24 w-48 h-48 bg-fuchsia-600/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div class="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div class="flex items-center gap-2 mb-2">
              <span class="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              <span class="text-[10px] font-mono text-red-400 uppercase tracking-widest font-black">CRITICAL BRIEFING LINK DETECTED</span>
            </div>
            <h1 class="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
              Atlas Global <span class="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-400">News Intelligence</span>
            </h1>
            <p class="text-sm text-slate-400 mt-1.5 max-w-2xl">Explore encrypted global sector trends. Use the search matrix or hit <kbd class="bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800 text-[10px]">ESC</kbd> to wipe active terminal parameters.</p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="bg-slate-900/20 border border-slate-900 p-4 rounded-xl flex flex-col justify-between h-20">
          <span class="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Active Database Nodes</span>
          <span class="text-xl font-bold text-slate-200">50 Frameworks</span>
        </div>
        <div class="bg-slate-900/20 border border-slate-900 p-4 rounded-xl flex flex-col justify-between h-20">
          <span class="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Selected Classification</span>
          <span class="text-xl font-bold text-violet-400 uppercase tracking-tight truncate">{{ currentCategoryData?.name.split(' ')[0] }}</span>
        </div>
        <div class="bg-slate-900/20 border border-slate-900 p-4 rounded-xl flex flex-col justify-between h-20">
          <span class="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Feed Status</span>
          <span class="text-xl font-bold text-emerald-400 flex items-center gap-2">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> LIVE_STREAM
          </span>
        </div>
        <div class="bg-slate-900/20 border border-slate-900 p-4 rounded-xl flex flex-col justify-between h-20">
          <span class="text-[9px] font-mono text-slate-500 uppercase tracking-widest">System Timestamp Synchronization</span>
          <span class="text-[11px] font-mono text-slate-300 font-bold uppercase truncate tracking-wide text-violet-400">{{ liveClock }}</span>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <div class="lg:col-span-4 space-y-4">
          
          <div class="bg-slate-900/30 border border-slate-900 rounded-2xl p-4 backdrop-blur-sm">
            <div class="relative">
              <input 
                v-model="searchQuery"
                type="text" 
                placeholder="Type parameter keyword to query..." 
                class="w-full bg-black/40 border border-slate-800/80 rounded-xl px-4 py-2.5 pl-10 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all font-mono"
              />
              <span class="absolute left-3.5 top-3 text-slate-500 text-xs select-none pointer-events-none font-mono">⌕</span>
              <button 
                v-if="searchQuery" 
                @click="searchQuery = ''" 
                class="absolute right-3.5 top-2.5 text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-400 px-1.5 py-0.5 rounded font-mono transition-colors"
              >
                WIPE
              </button>
            </div>
          </div>

          <div class="bg-slate-900/40 border border-slate-900 rounded-2xl p-4 backdrop-blur-sm space-y-1">
            <p class="text-[10px] font-bold tracking-widest text-slate-500 uppercase px-3 mb-3 font-mono">// Classification Sectors</p>
            
            <button 
              v-for="(cat, idx) in categoriesData" 
              :key="cat.id"
              @click="handleCategoryChange(cat.id)"
              class="w-full px-4 py-3 text-sm font-medium text-left rounded-xl transition-all duration-200 flex items-center justify-between group border border-transparent"
              :class="activeCategory === cat.id 
                ? 'bg-gradient-to-r from-slate-900 to-slate-800 border-slate-700/50 text-white shadow-xl shadow-black/40' 
                : 'text-slate-400 hover:bg-slate-900/50 hover:text-white'"
            >
              <div class="flex items-center gap-3 overflow-hidden">
                <span class="font-mono text-xs text-slate-600 group-hover:text-slate-400" :class="{ 'text-violet-400 font-bold': activeCategory === cat.id }">
                  [{{ formatIndex(idx) }}]
                </span>
                <span class="truncate tracking-wide">{{ cat.name }}</span>
              </div>
              <span 
                class="w-1.5 h-1.5 rounded-full transition-all duration-200"
                :class="activeCategory === cat.id ? 'bg-violet-400 ring-4 ring-violet-500/20' : 'bg-slate-800 group-hover:bg-slate-600'"
              ></span>
            </button>
          </div>
        </div>

        <div class="lg:col-span-8 space-y-8">
          
          <div class="space-y-4">
            <h2 class="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest">// Streaming Sector News Feeds</h2>
            
            <div v-if="isLoading" class="space-y-3">
              <div v-for="n in 3" :key="n" class="h-24 bg-slate-900/30 border border-slate-900/60 rounded-xl animate-pulse flex items-center p-4 gap-4">
                <div class="w-28 h-full bg-slate-800/50 rounded-lg"></div>
                <div class="flex-grow space-y-2">
                  <div class="h-3 w-1/4 bg-slate-800/60 rounded"></div>
                  <div class="h-4 w-3/4 bg-slate-800/40 rounded"></div>
                </div>
              </div>
            </div>

            <div v-else-if="filteredTopics.length > 0" class="grid grid-cols-1 gap-3">
              <div
                v-for="(topic, idx) in filteredTopics"
                :key="topic.id"
                @click="selectedTopic = selectedTopic?.id === topic.id ? null : topic"
                class="border rounded-xl bg-slate-900/20 overflow-hidden transition-all duration-300 flex flex-col sm:flex-row cursor-pointer group border-slate-900 hover:border-slate-700 hover:bg-slate-900/40 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-violet-950/5"
                :class="{ 'border-violet-500 bg-violet-950/10 ring-1 ring-violet-500/20 shadow-xl shadow-black/30': selectedTopic?.id === topic.id }"
              >
                <div class="sm:w-36 h-28 sm:h-auto relative overflow-hidden shrink-0 bg-slate-950">
                  <img 
                    :src="getTopicImage(activeCategory, topic.id, topic.name)" 
                    alt="Contextual graphic node illustration headline image tool frame"
                    class="w-full h-full object-cover transition-all duration-500 group-hover:scale-105 opacity-50 group-hover:opacity-80 mix-blend-screen"
                  />
                  <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent sm:bg-gradient-to-r sm:from-transparent sm:to-slate-950/50"></div>
                </div>

                <div class="p-4 flex flex-col justify-center flex-grow">
                  <div class="flex items-center justify-between gap-2 mb-1">
                    <div class="flex items-center gap-2">
                      <span v-if="idx === 0 && !searchQuery" class="text-[9px] font-mono px-1.5 py-0.5 rounded bg-red-500/10 border border-red-500/30 text-red-400 font-extrabold animate-pulse">BREAKING</span>
                      <span class="text-[9px] font-mono tracking-wider text-slate-500 uppercase">
                        ID_//{{ topic.id.substring(0, 6).toUpperCase() }}
                      </span>
                    </div>
                    <div class="flex items-center gap-2 text-[10px] font-mono text-slate-500">
                      <span>• {{ 2 + (idx % 3) }}m read</span>
                      <span class="text-violet-400 font-semibold uppercase tracking-wider">
                        {{ selectedTopic?.id === topic.id ? 'Spliced' : 'Inspect' }}
                      </span>
                    </div>
                  </div>
                  <h3 class="text-sm font-bold text-slate-300 group-hover:text-white transition-colors" :class="{ 'text-white': selectedTopic?.id === topic.id }">
                    {{ topic.name }}
                  </h3>
                </div>
              </div>
            </div>

            <div v-else class="py-12 text-center border border-dashed border-slate-900 rounded-xl bg-slate-950/40">
              <span class="text-slate-600 block text-lg font-mono">∅</span>
              <p class="text-xs font-mono text-slate-500 mt-1 uppercase tracking-wider">No matching pipeline files discovered</p>
            </div>
          </div>

          <div class="bg-slate-900/40 border border-slate-900 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300">
            
            <div class="border-b border-slate-900 bg-slate-950/50 px-6 py-4 flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="w-1.5 h-1.5 rounded-full" :class="selectedTopic ? 'bg-emerald-400 animate-pulse' : 'bg-slate-700'"></div>
                <span class="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest">Active Report Dossier</span>
              </div>
              
              <button 
                v-if="selectedTopic"
                @click="copyDossierJSON"
                class="text-[9px] font-mono text-violet-400 hover:text-white bg-violet-950/40 hover:bg-violet-900/50 border border-violet-900/50 px-2 py-1 rounded transition-colors"
              >
                EXPORT_DATA_JSON
              </button>
            </div>

            <div>
              <div v-if="selectedTopic">
                
                <div class="relative h-44 w-full overflow-hidden bg-slate-950 border-b border-slate-900">
                  <img 
                    :src="getTopicImage(activeCategory, selectedTopic.id, selectedTopic.name)" 
                    alt="Contextual display visual background" 
                    class="w-full h-full object-cover opacity-30 blur-[1px] scale-105 mix-blend-luminosity"
                  />
                  <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                  
                  <div class="absolute bottom-5 left-6 right-6">
                    <div class="flex items-center gap-2 mb-1.5">
                      <span class="text-[9px] font-mono px-2 py-0.5 bg-violet-500/10 border border-violet-500/30 text-violet-300 rounded font-bold uppercase tracking-wider">
                        {{ currentCategoryData.name }}
                      </span>
                      <span class="text-[9px] font-mono text-slate-400">
                        REF_//{{ selectedTopic.id.substring(0, 8).toUpperCase() }}
                      </span>
                    </div>
                    <h2 class="text-xl font-black text-white tracking-wide leading-tight">{{ selectedTopic.name }}</h2>
                  </div>
                </div>

                <div class="p-6 space-y-2 font-mono text-xs max-h-[460px] overflow-y-auto pr-2 custom-scrollbar">
                  <div 
                    v-for="(line, idx) in selectedTopic.info.split('\n')" 
                    :key="idx"
                    class="bg-black/20 border border-slate-900/50 p-3.5 rounded-xl flex items-start gap-4 hover:border-slate-800/80 hover:bg-slate-900/20 transition-all duration-150 group"
                  >
                    <span class="text-[10px] text-slate-600 group-hover:text-violet-400 font-bold select-none text-right w-5 shrink-0 pt-0.5 transition-colors">
                      {{ formatIndex(idx) }}
                    </span>
                    
                    <span class="text-slate-300 font-sans text-sm leading-relaxed tracking-normal">
                      {{ line.substring(line.indexOf(':') + 1).trim() }}
                    </span>
                  </div>
                </div>

              </div>

              <div v-else class="py-24 text-center p-6">
                <div class="w-12 h-12 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-center mx-auto mb-4 shadow-xl text-slate-500">
                  📁
                </div>
                <p class="text-xs font-mono text-slate-400 uppercase tracking-widest">Awaiting Dossier Selection</p>
                <p class="text-xs text-slate-600 mt-1.5 max-w-sm mx-auto font-sans leading-relaxed">
                  Select a live stream article block inside the news feed layout row above to extract raw telemetry nodes and construct the analysis matrix.
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  </main>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #1e293b;
  border-radius: 99px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #334155;
}

@keyframes marquee {
  0% { transform: translateX(100%); }
  100% { transform: translateX(-100%); }
}
.animate-marquee {
  animation: marquee 25s linear infinite;
}
.animate-marquee:hover {
  animation-play-state: paused;
}
</style>