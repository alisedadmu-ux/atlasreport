<template>
  <div class="min-h-screen flex items-center justify-center" :style="{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }">
    <div class="text-center max-w-md px-6">
      <div class="text-7xl mb-4">{{ error?.statusCode === 404 ? '🔍' : '⚠️' }}</div>
      <h1 class="font-serif text-4xl font-black mb-3" :style="{ color: 'var(--color-text)' }">
        {{ error?.statusCode === 404 ? 'Page Not Found' : 'Something Went Wrong' }}
      </h1>
      <p class="text-sm mb-6" :style="{ color: 'var(--color-text-secondary)' }">
        {{ error?.statusCode === 404
          ? 'The page you\'re looking for doesn\'t exist or has been moved.'
          : 'An unexpected error occurred. Please try again later.' }}
      </p>
      <div class="flex items-center justify-center gap-3">
        <NuxtLink
          to="/"
          class="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white transition"
          :style="{ backgroundColor: 'var(--color-accent)' }"
        >
          ← Back to Home
        </NuxtLink>
        <button
          @click="handleClearError"
          class="inline-flex items-center gap-2 rounded-xl border px-6 py-3 text-sm font-bold transition"
          :style="{
            borderColor: 'var(--color-border)',
            color: 'var(--color-text)'
          }"
        >
          Try Again
        </button>
      </div>
      <p v-if="error?.statusCode" class="mt-8 text-xs" :style="{ color: 'var(--color-text-muted)' }">
        Error {{ error.statusCode }}
      </p>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  error: Object
})

const handleClearError = () => clearError({ redirect: '/' })
</script>