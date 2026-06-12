<template>
  <header class="w-full bg-slate-950/80 backdrop-blur-md border-b border-slate-900 sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
      
      <NuxtLink to="/" class="flex items-center gap-3 group">
        <div class="w-7 h-7 rounded-lg bg-gradient-to-tr from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
          <span class="text-white font-mono font-bold text-xs">A</span>
        </div>
        <div class="flex flex-col">
          <span class="text-sm font-sans font-black text-white tracking-wider uppercase bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
            ATLAS_REPORT
          </span>
          <span class="text-[9px] font-mono text-slate-500 uppercase tracking-widest -mt-0.5">Global Intelligence Feed</span>
        </div>
      </NuxtLink>

      <nav class="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider">
        <NuxtLink to="/" class="text-slate-400 hover:text-white transition-all px-3 py-1.5 rounded-lg" active-class="bg-slate-900 text-violet-400 border border-slate-800">News Platform</NuxtLink>
        <NuxtLink to="/about" class="text-slate-400 hover:text-white transition-all px-3 py-1.5 rounded-lg" active-class="bg-slate-900 text-violet-400 border border-slate-800">About</NuxtLink>
        <NuxtLink to="/contact" class="text-slate-400 hover:text-white transition-all px-3 py-1.5 rounded-lg" active-class="bg-slate-900 text-violet-400 border border-slate-800">Contact</NuxtLink>
      </nav>

    </div>
  </header>
</template>