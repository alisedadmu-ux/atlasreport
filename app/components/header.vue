<template>
  <header class="w-full bg-white border-b border-slate-200 sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-6">
      <div class="flex items-center justify-between py-3 text-[11px] uppercase tracking-[0.25em] text-slate-500">
        <span>{{ today }}</span>
        <div class="flex items-center gap-6">
          <NuxtLink to="/about" class="hover:text-slate-900 transition-colors">About</NuxtLink>
          <NuxtLink to="/contact" class="hover:text-slate-900 transition-colors">Contact</NuxtLink>
          <NuxtLink to="/" class="font-semibold text-slate-900 hover:text-black transition-colors">Home</NuxtLink>
        </div>
      </div>

      <div class="flex flex-col items-center py-6">
        <NuxtLink to="/" class="font-serif text-4xl md:text-5xl font-black tracking-[0.08em] text-slate-900">ATLAS REPORT</NuxtLink>
        <p class="mt-2 text-xs uppercase tracking-[0.35em] text-slate-500">Global Intelligence Feed</p>
      </div>

      <nav class="flex flex-wrap justify-center gap-4 border-t border-slate-200 pt-4 pb-5 text-xs uppercase tracking-[0.2em] text-slate-600">
        <a href="#" class="hover:text-slate-900 transition-colors">World</a>
        <a href="#" class="hover:text-slate-900 transition-colors">U.S.</a>
        <a href="#" class="hover:text-slate-900 transition-colors">Politics</a>
        <a href="#" class="hover:text-slate-900 transition-colors">Business</a>
        <a href="#" class="hover:text-slate-900 transition-colors">Opinion</a>
        <a href="#" class="hover:text-slate-900 transition-colors">Science</a>
      </nav>
    </div>
  </header>
</template>

<script setup>
const today = new Date().toLocaleDateString(undefined, {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
  year: 'numeric'
})
</script>