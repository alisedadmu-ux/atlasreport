<template>
  <header class="w-full bg-slate-950/60 border-b border-slate-900 sticky top-0 z-50 backdrop-blur-md px-4 sm:px-6 py-4 select-none">
    <div class="max-w-7xl mx-auto flex items-center justify-between">
      
      <NuxtLink to="/" class="flex items-center gap-2.5 group">
        <div class="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center text-white font-mono text-sm font-black shadow-lg shadow-violet-500/20 group-hover:scale-105 transition-transform">
          Α
        </div>
        <div class="font-mono text-xs tracking-wider">
          <span class="text-white font-black group-hover:text-violet-400 transition-colors">ATLAS_</span>
          <span class="text-slate-500">SYS_v4.2</span>
        </div>
      </NuxtLink>

      <nav class="flex items-center gap-1 font-mono text-[11px] tracking-widest uppercase font-bold">
        <NuxtLink 
          to="/" 
          class="px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900/40 transition-all border border-transparent"
          active-class="!text-white bg-slate-900 border-slate-800/80 shadow-inner shadow-black/40"
        >
          // TERMINAL
        </NuxtLink>
        
        <NuxtLink 
          to="/about" 
          class="px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900/40 transition-all border border-transparent"
          active-class="!text-white bg-slate-900 border-slate-800/80 shadow-inner shadow-black/40"
        >
          // MANIFEST
        </NuxtLink>
        
        <NuxtLink 
          to="/contact" 
          class="px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900/40 transition-all border border-transparent"
          active-class="!text-white bg-slate-900 border-slate-800/80 shadow-inner shadow-black/40"
        >
          // UPLINK
        </NuxtLink>
      </nav>

      <div class="hidden md:flex items-center gap-2 bg-black/40 border border-slate-900 px-3 py-1.5 rounded-xl font-mono text-[10px]">
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
        <span class="text-slate-400 tracking-wider">SECURE_LINK: <span class="text-emerald-400 font-bold">ONLINE</span></span>
      </div>

    </div>
  </header>
</template>