<script setup>
import { useRoute } from 'vue-router'
import { articlesDatabase } from '../../data/articles.js'

const route = useRoute()
const article = articlesDatabase[route.params.id]
</script>

<template>
  <main class="max-w-7xl mx-auto px-4 py-8">
    <div v-if="!article" class="text-center py-20">
      <h2 class="text-xl font-bold text-white">SYSTEM ERR: Target Dispatch Absent</h2>
      <NuxtLink to="/" class="text-teal-400 hover:underline mt-4 inline-block text-xs">&larr; Return to main mainframe index</NuxtLink>
    </div>

    <div v-else class="space-y-6">
      <div class="flex items-center justify-between border-b border-slate-800 pb-3">
        <NuxtLink to="/" class="text-xs font-bold text-slate-500 hover:text-teal-400 transition-colors inline-flex items-center gap-1">
          &larr; BACK TO RAW DATA STREAM
        </NuxtLink>
        <span class="text-[10px] font-mono text-slate-600 bg-slate-950 border border-slate-900 px-2 py-0.5 rounded">
          REF_ID: {{ route.params.id.toUpperCase() }}
        </span>
      </div>

      <div class="space-y-3 max-w-4xl">
        <div class="flex items-center gap-2">
          <span class="text-[10px] font-extrabold text-slate-950 bg-teal-400 uppercase tracking-widest px-2 py-0.5 rounded">
            {{ article.category }}
          </span>
          <span class="text-xs font-mono text-slate-500">Filed at: {{ article.date }}</span>
        </div>
        <h1 class="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
          {{ article.title }}
        </h1>
      </div>

      <div class="grid lg:grid-cols-3 gap-8">
        
        <div class="lg:col-span-2 space-y-6">
          <div class="relative h-96 w-full rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
            <img :src="article.image" :alt="article.title" class="w-full h-full object-cover" />
          </div>

          <p class="text-base font-semibold text-slate-200 border-l-2 border-teal-400 pl-4 bg-slate-950/40 py-3 pr-3 rounded-r-lg leading-relaxed">
            {{ article.lead }}
          </p>

          <div class="space-y-4 text-slate-400 text-sm leading-relaxed">
            <p v-for="(paragraph, index) in article.paragraphs" :key="index" class="text-justify">
              {{ paragraph }}
            </p>
          </div>
        </div>

        <div class="space-y-4">
          
          <div class="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
            <h4 class="text-xs font-black uppercase text-slate-200 tracking-wider flex items-center gap-1.5 border-b border-slate-900 pb-2">
              <span class="w-1.5 h-1.5 bg-teal-400 rounded-full animate-pulse"></span>
              Event Context Parameters
            </h4>
            <div class="space-y-2.5 font-mono text-[11px]">
              <div class="flex justify-between border-b border-slate-900 pb-1.5">
                <span class="text-slate-600">Reporting Status:</span>
                <span class="text-green-400 font-bold">VERIFIED SECURE</span>
              </div>
              <div class="flex justify-between border-b border-slate-900 pb-1.5">
                <span class="text-slate-600">Primary Domain:</span>
                <span class="text-slate-300 uppercase font-semibold">{{ article.category }}</span>
              </div>
              <div class="flex justify-between border-b border-slate-900 pb-1.5">
                <span class="text-slate-600">Analysis Complexity:</span>
                <span class="text-slate-300">Level-4 Advanced Macro</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-600">Distribution Target:</span>
                <span class="text-slate-500">Public Global Access</span>
              </div>
            </div>
          </div>

          <div class="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
            <h4 class="text-xs font-black uppercase text-slate-200 tracking-wider border-b border-slate-900 pb-2">
              Executive Abstract
            </h4>
            <p class="text-xs text-slate-400 leading-relaxed font-sans pt-1">
              {{ article.summary }}
            </p>
          </div>

          <div class="bg-slate-900/40 border border-slate-800/60 rounded-xl p-4 text-[11px] text-slate-500 space-y-1">
            <p class="font-bold text-slate-400">Notice to Terminal Operators:</p>
            <p class="leading-relaxed">Further changes to these system logs are pushed out automatically across distributed network pipelines every six hours.</p>
          </div>

        </div>
      </div>
    </div>
  </main>
</template>