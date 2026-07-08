<template>
  <div class="flex flex-col min-h-screen" style="background-color: var(--color-bg);">
    <Header />
    <main class="flex-1 w-full">
      <div class="news-portal-container">
        <slot />
      </div>
    </main>
    <Footer />
  </div>
</template>

<script setup></script>