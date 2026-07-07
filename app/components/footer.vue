<template>
  <footer class="w-full py-12 mt-20" :style="{ backgroundColor: 'var(--color-footer-bg)', borderTop: '2px solid', borderTopColor: 'var(--color-border)' }">
    <div class="max-w-7xl mx-auto px-6">
      <!-- Newsletter -->
      <div class="max-w-md mx-auto mb-10">
        <NewsletterSubscribe />
      </div>

      <!-- Footer Top Section -->
      <div class="grid md:grid-cols-3 gap-12 pb-12 border-b" :style="{ borderColor: 'var(--color-border)' }">
        <!-- Masthead -->
        <div class="space-y-2">
          <h3 class="font-serif text-2xl font-bold" :style="{ color: 'var(--color-text)' }">ATLAS REPORT</h3>
          <p class="text-xs tracking-widest font-bold" :style="{ color: 'var(--color-text-muted)' }">GLOBAL INTELLIGENCE FEED</p>
          <p class="text-sm mt-3 leading-relaxed" :style="{ color: 'var(--color-text-secondary)' }">
            Premium editorial coverage delivering verified reporting across geopolitics, science, and markets.
          </p>
        </div>

        <!-- Navigation -->
        <div class="space-y-3">
          <h4 class="text-xs font-bold tracking-widest" :style="{ color: 'var(--color-text)' }">SECTIONS</h4>
          <ul class="text-sm space-y-2" :style="{ color: 'var(--color-text-secondary)' }">
            <li><NuxtLink to="/" class="hover:text-red-700 transition-colors">Home</NuxtLink></li>
            <li><NuxtLink to="/search" class="hover:text-red-700 transition-colors">Search</NuxtLink></li>
            <li><NuxtLink to="/archives" class="hover:text-red-700 transition-colors">Archives</NuxtLink></li>
            <li><NuxtLink to="/about" class="hover:text-red-700 transition-colors">About</NuxtLink></li>
            <li><NuxtLink to="/contact" class="hover:text-red-700 transition-colors">Contact</NuxtLink></li>
            <li><NuxtLink to="/community" class="hover:text-red-700 transition-colors">Community</NuxtLink></li>
          </ul>
        </div>

        <!-- Legal -->
        <div class="space-y-3">
          <h4 class="text-xs font-bold tracking-widest" :style="{ color: 'var(--color-text)' }">LEGAL</h4>
          <ul class="text-sm space-y-2" :style="{ color: 'var(--color-text-secondary)' }">
            <li><NuxtLink to="/privacy" class="hover:text-red-700 transition-colors">Privacy Policy</NuxtLink></li>
            <li><NuxtLink to="/terms" class="hover:text-red-700 transition-colors">Terms of Service</NuxtLink></li>
            <li><NuxtLink to="/forgot-password" class="hover:text-red-700 transition-colors">Reset Password</NuxtLink></li>
          </ul>
        </div>
      </div>

      <!-- Footer Bottom -->
      <div class="pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p class="text-xs" :style="{ color: 'var(--color-text-muted)' }">&copy; 2026 ATLAS REPORT. All rights reserved.</p>
        <div class="flex items-center gap-6 text-xs" :style="{ color: 'var(--color-text-muted)' }">
          <a href="#" class="flex items-center gap-1.5 hover:text-gray-900 transition-colors group">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            <span>Twitter</span>
          </a>
          <a href="#" class="flex items-center gap-1.5 hover:text-gray-900 transition-colors group">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            <span>LinkedIn</span>
          </a>
          <NuxtLink to="/search" class="flex items-center gap-1.5 hover:text-gray-900 transition-colors group">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.199 24C19.199 13.467 10.533 4.8 0 4.8V0c13.165 0 24 10.835 24 24h-4.801zM3.291 17.415c1.814 0 3.293 1.479 3.293 3.295 0 1.813-1.479 3.293-3.293 3.293C1.479 24 0 22.521 0 20.71c0-1.816 1.479-3.295 3.291-3.295zM15.909 24h-4.665c0-6.169-5.075-11.245-11.244-11.245V8.09c8.727 0 15.909 7.184 15.909 15.91z"/>
            </svg>
            <span>RSS</span>
          </NuxtLink>
        </div>
      </div>
    </div>
  </footer>
</template>