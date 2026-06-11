<template>
  <div class="bg-stone-100 min-h-screen font-sans antialiased">
    
    <header class="bg-white border-b border-stone-200 sticky top-0 z-50 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        <NuxtLink to="/" class="flex items-center gap-3 group">
          <div class="w-10 h-10 bg-[#0f172a] rounded-xl flex items-center justify-center font-black text-white text-lg group-hover:bg-red-700 transition-colors">
            A
          </div>
          <span class="font-serif font-black text-xl tracking-tight text-stone-900 uppercase">
            Atlas<span class="text-red-600">.</span>Report
          </span>
        </NuxtLink>

        <nav class="flex items-center gap-1 sm:gap-2">
          <NuxtLink 
            to="/" 
            class="px-4 py-2 text-xs font-black uppercase tracking-wider text-stone-900 rounded-lg hover:bg-stone-100 transition-colors"
            active-class="bg-stone-900 !text-white hover:bg-stone-900"
          >
            Home
          </NuxtLink>
          <NuxtLink 
            to="/about" 
            class="px-4 py-2 text-xs font-black uppercase tracking-wider text-stone-600 rounded-lg hover:bg-stone-100 hover:text-stone-900 transition-colors"
            active-class="bg-stone-900 !text-white hover:bg-stone-900"
          >
            About
          </NuxtLink>
          <NuxtLink 
            to="/contact" 
            class="px-4 py-2 text-xs font-black uppercase tracking-wider text-stone-600 rounded-lg hover:bg-stone-100 hover:text-stone-900 transition-colors"
            active-class="bg-stone-900 !text-white hover:bg-stone-900"
          >
            Contact
          </NuxtLink>
        </nav>

      </div>
    </header>

    <slot />

  </div>
</template>