<template>
  <footer class="editorial-footer w-full bg-white border-t-2 border-gray-900 py-12 mt-20">
    <div class="max-w-7xl mx-auto px-6">
      <!-- Footer Top Section -->
      <div class="grid md:grid-cols-3 gap-12 pb-12 border-b border-gray-200">
        <!-- Masthead -->
        <div class="space-y-2">
          <h3 class="font-serif text-2xl font-bold text-gray-900">ATLAS REPORT</h3>
          <p class="text-xs tracking-widest text-gray-600 font-bold">GLOBAL INTELLIGENCE FEED</p>
          <p class="text-sm text-gray-700 mt-3 leading-relaxed">
            Premium editorial coverage delivering verified reporting across geopolitics, science, and markets.
          </p>
        </div>

        <!-- Navigation -->
        <div class="space-y-3">
          <h4 class="text-xs font-bold tracking-widest text-gray-900">SECTIONS</h4>
          <ul class="text-sm space-y-2 text-gray-700">
            <li><NuxtLink to="/" class="hover:text-red-700 transition-colors">Home</NuxtLink></li>
            <li><NuxtLink to="/about" class="hover:text-red-700 transition-colors">About</NuxtLink></li>
            <li><NuxtLink to="/contact" class="hover:text-red-700 transition-colors">Contact</NuxtLink></li>
            <li><NuxtLink to="/community" class="hover:text-red-700 transition-colors">Community</NuxtLink></li>
            <li><a href="#" class="hover:text-red-700 transition-colors">Archives</a></li>
          </ul>
        </div>

        <!-- Legal -->
        <div class="space-y-3">
          <h4 class="text-xs font-bold tracking-widest text-gray-900">LEGAL</h4>
          <ul class="text-sm space-y-2 text-gray-700">
            <li><a href="#" class="hover:text-red-700 transition-colors">Privacy Policy</a></li>
            <li><a href="#" class="hover:text-red-700 transition-colors">Terms of Service</a></li>
            <li><a href="#" class="hover:text-red-700 transition-colors">Advertising</a></li>
            <li><a href="#" class="hover:text-red-700 transition-colors">Corrections</a></li>
          </ul>
        </div>
      </div>

      <!-- Footer Bottom -->
      <div class="pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p class="text-xs text-gray-600">&copy; 2026 ATLAS REPORT. All rights reserved.</p>
        <div class="flex items-center gap-6 text-xs text-gray-600">
          <a href="#" class="hover:text-gray-900 transition-colors">Twitter</a>
          <a href="#" class="hover:text-gray-900 transition-colors">LinkedIn</a>
          <a href="#" class="hover:text-gray-900 transition-colors">RSS</a>
        </div>
      </div>
    </div>
  </footer>
</template>