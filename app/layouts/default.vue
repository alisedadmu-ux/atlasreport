<template>
  <div class="bg-[#f5f5f3] min-h-screen font-sans antialiased">
    
    <header class="bg-white/70 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-50">
      <div class="max-w-[1700px] mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
        
        <NuxtLink to="/" class="flex items-center gap-3 group">
          <div class="w-7 h-7 bg-slate-950 flex items-center justify-center font-black text-white text-[10px] tracking-widest transition-transform group-hover:rotate-6">
            A
          </div>
          <span class="font-serif font-black text-base tracking-tight text-slate-950 uppercase">
            Atlas<span class="text-red-600">.</span>Intelligence
          </span>
        </NuxtLink>

        <nav class="flex items-center gap-1">
          <NuxtLink 
            to="/" 
            class="px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-slate-950 transition-all duration-200"
            active-class="!text-slate-950 border-b-2 border-slate-950 font-black rounded-none"
          >
            Terminal
          </NuxtLink>
          <NuxtLink 
            to="/about" 
            class="px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-slate-950 transition-all duration-200"
            active-class="!text-slate-950 border-b-2 border-slate-950 font-black rounded-none"
          >
            About
          </NuxtLink>
          <NuxtLink 
            to="/contact" 
            class="px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-slate-950 transition-all duration-200"
            active-class="!text-slate-950 border-b-2 border-slate-950 font-black rounded-none"
          >
            Contact
          </NuxtLink>
        </nav>

      </div>
    </header>

    <slot />

  </div>
</template>