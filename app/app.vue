<template>
  <NuxtLayout>
    <NuxtErrorBoundary>
      <NuxtPage />
      <template #error="{ error }">
        <div class="error-boundary">
          <div class="error-content">
            <div class="error-icon-symbol">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <h2 class="error-title">Something went wrong</h2>
            <p class="error-message">{{ error.message || 'An unexpected error occurred' }}</p>
            <button @click="handleError(error)" class="btn btn-primary btn-lg">
              Try again
            </button>
          </div>
        </div>
      </template>
    </NuxtErrorBoundary>
  </NuxtLayout>
</template>

<script setup>
const handleError = (error) => clearError({ redirect: '/' })
</script>

<style>
.error-boundary {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 70vh;
  padding: 2rem;
}

.error-content {
  text-align: center;
  max-width: 420px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.error-icon-symbol {
  color: var(--color-text-muted);
  opacity: 0.6;
  margin-bottom: 0.5rem;
}

.error-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--color-text);
}

.error-message {
  color: var(--color-text-secondary);
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 1rem;
}
</style>