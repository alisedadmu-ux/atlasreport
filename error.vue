<template>
  <div class="error-page">
    <div class="site-container">
      <div class="error-card">
        <div class="error-icon">
          <svg v-if="error?.statusCode === 404" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <svg v-else width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>
        <h1 class="error-title">{{ error?.statusCode === 404 ? 'Page Not Found' : 'Something Went Wrong' }}</h1>
        <p class="error-desc">
          {{ error?.statusCode === 404
            ? 'The page you\'re looking for doesn\'t exist or has been moved.'
            : 'An unexpected error occurred. Please try again later.' }}
        </p>
        <div class="error-actions">
          <NuxtLink to="/" class="btn btn-primary btn-lg">
            ← Back to Home
          </NuxtLink>
          <button @click="handleClearError" class="btn btn-secondary btn-lg">
            Try Again
          </button>
        </div>
        <p v-if="error?.statusCode" class="error-code">Error {{ error.statusCode }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({ error: Object })
const handleClearError = () => clearError({ redirect: '/' })
</script>

<style scoped>
.error-page {
  min-height: 100vh;
  padding: 4rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg);
}

.error-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.85rem;
  max-width: 420px;
}

.error-icon {
  font-size: 3.5rem;
  line-height: 1;
  margin-bottom: 0.5rem;
  color: var(--color-text-muted);
  opacity: 0.7;
}

.error-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  color: var(--color-text);
}

.error-desc {
  font-size: 0.9375rem;
  color: var(--color-text-secondary);
  line-height: 1.65;
}

.error-actions {
  display: flex;
  gap: 0.85rem;
  margin-top: 1.25rem;
  flex-wrap: wrap;
  justify-content: center;
}

.error-code {
  font-size: 0.8125rem;
  color: var(--color-text-muted);
  margin-top: 1.5rem;
}
</style>
