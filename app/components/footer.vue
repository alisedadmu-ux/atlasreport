<template>
  <footer class="footer-shell mt-20 w-full border-t" :style="{ backgroundColor: 'var(--color-footer-bg)', borderTopColor: 'var(--color-border)' }">
    <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div class="mx-auto mb-10 max-w-2xl rounded-[28px] border border-slate-200/80 bg-white/70 p-6 shadow-[0_20px_60px_rgba(17,17,17,0.06)] backdrop-blur">
        <NewsletterSubscribe />
      </div>

      <div class="grid gap-10 border-b pb-10 md:grid-cols-[1.2fr_0.8fr_0.8fr]" :style="{ borderColor: 'var(--color-border)' }">
        <div class="space-y-3">
          <p class="text-[11px] font-black uppercase tracking-[0.32em] text-slate-500">Atlas Report</p>
          <h3 class="font-['Playfair_Display'] text-2xl font-bold text-slate-900">Premium editorial coverage for modern readers.</h3>
          <p class="max-w-md text-sm leading-7" :style="{ color: 'var(--color-text-secondary)' }">
            Trusted reporting, sharp analysis, and a thoughtful reading experience shaped for readers who value clarity and context.
          </p>
        </div>

        <div class="space-y-3">
          <h4 class="text-[11px] font-black uppercase tracking-[0.32em] text-slate-700">Sections</h4>
          <ul class="space-y-2 text-sm" :style="{ color: 'var(--color-text-secondary)' }">
            <li><NuxtLink to="/" class="transition-colors hover:text-red-700">Home</NuxtLink></li>
            <li><NuxtLink to="/search" class="transition-colors hover:text-red-700">Search</NuxtLink></li>
            <li><NuxtLink to="/archives" class="transition-colors hover:text-red-700">Archives</NuxtLink></li>
            <li><NuxtLink to="/community" class="transition-colors hover:text-red-700">Community</NuxtLink></li>
            <li><NuxtLink to="/about" class="transition-colors hover:text-red-700">About</NuxtLink></li>
          </ul>
        </div>

        <div class="space-y-3">
          <h4 class="text-[11px] font-black uppercase tracking-[0.32em] text-slate-700">Account</h4>
          <ul class="space-y-2 text-sm" :style="{ color: 'var(--color-text-secondary)' }">
            <li><NuxtLink to="/profile" class="transition-colors hover:text-red-700">Profile</NuxtLink></li>
            <li><NuxtLink to="/auth" class="transition-colors hover:text-red-700">Login / Account</NuxtLink></li>
            <li><NuxtLink to="/privacy" class="transition-colors hover:text-red-700">Privacy Policy</NuxtLink></li>
            <li><NuxtLink to="/terms" class="transition-colors hover:text-red-700">Terms of Service</NuxtLink></li>
          </ul>
        </div>
      </div>

      <div class="flex flex-col items-center justify-between gap-4 pt-8 text-center md:flex-row md:text-left">
        <p class="text-xs" :style="{ color: 'var(--color-text-muted)' }">&copy; 2026 Atlas Report. All rights reserved.</p>
        <div class="flex items-center gap-5 text-xs" :style="{ color: 'var(--color-text-muted)' }">
          <a href="#" class="transition-colors hover:text-slate-900">X</a>
          <a href="#" class="transition-colors hover:text-slate-900">LinkedIn</a>
          <NuxtLink to="/search" class="transition-colors hover:text-slate-900">RSS</NuxtLink>
        </div>
      </div>
    </div>
  </footer>
</template>