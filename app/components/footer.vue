<template>
  <footer class="w-full bg-slate-950 border-t border-slate-800 text-slate-400 py-12 mt-20 block">
    <div class="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8">
      
      <div class="space-y-3">
        <div class="text-lg font-bold text-slate-100">
          Global <span class="text-teal-400">NewsHub</span>
        </div>
        <p class="text-xs leading-relaxed text-slate-500">
          Delivering reliable breaking news, deep-dive feature stories, and global event tracking straight to your screen.
        </p>
      </div>

      <div class="space-y-3">
        <h4 class="text-sm font-semibold text-slate-200">Categories</h4>
        <ul class="text-xs space-y-2">
          <li><a href="#" class="hover:text-teal-400 transition-colors">World News</a></li>
          <li><a href="#" class="hover:text-teal-400 transition-colors">Technology</a></li>
          <li><a href="#" class="hover:text-teal-400 transition-colors">Business</a></li>
        </ul>
      </div>

      <div class="space-y-3">
        <h4 class="text-sm font-semibold text-slate-200">Stay Updated</h4>
        <div class="flex gap-2">
          <input 
            type="email" 
            placeholder="Enter your email" 
            class="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-teal-400 w-full"
          />
          <button class="bg-teal-400 hover:bg-teal-500 text-slate-900 font-medium text-xs px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap">
            Join
          </button>
        </div>
      </div>

    </div>

    <div class="max-w-6xl mx-auto px-6 pt-8 mt-8 border-t border-slate-900 text-center text-xs text-slate-600 flex flex-col sm:flex-row items-center justify-between gap-4">
      <p>&copy; 2026 NewsHub Media Group. All rights reserved.</p>
      <p class="text-[10px] text-slate-700">Powered by Nuxt & Vercel Analytics</p>
    </div>
  </footer>
</template>