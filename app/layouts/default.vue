<template>
  <div class="flex flex-col min-h-screen" style="background-color: var(--color-bg);">
    <Header />
    <main class="flex-1">
      <slot />
    </main>
    <Footer />
  </div>
</template>

<script setup></script>