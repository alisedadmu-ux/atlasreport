<script setup>
import HeaderComponent from './components/header.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col bg-slate-950 text-slate-100 antialiased selection:bg-violet-500/20 selection:text-violet-300">
    <HeaderComponent />
    <div class="flex-grow">
      <NuxtPage />
    </div>
  </div>
</template>