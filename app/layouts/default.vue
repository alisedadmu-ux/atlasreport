<template>
  <div class="flex flex-col min-h-screen bg-slate-950">
    <Header />
    <main class="flex-1">
      <slot />
    </main>
    <Footer />
  </div>
</template>

<script setup></script>