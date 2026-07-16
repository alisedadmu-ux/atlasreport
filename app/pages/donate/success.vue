<template>
  <div class="donate-success-page">
    <div class="site-container">
      <div class="donate-success-card fade-in-up">
        <span class="donate-success-badge" aria-hidden="true">
          <Heart class="donate-success-icon" />
        </span>

        <p v-if="loading" class="donate-success-status">Confirming your donation…</p>
        <template v-else>
          <h1 class="donate-success-title">Thank you for your support!</h1>
          <p class="donate-success-lead">
            Your donation of <strong>{{ amountLabel }}</strong> helps keep independent, verified
            journalism free for everyone. We're grateful.
          </p>
        </template>

        <div class="donate-success-actions">
          <NuxtLink to="/" class="btn btn-primary">Back to the feed</NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Heart } from '@lucide/vue'

const route = useRoute()
const data = ref(null)
const loading = ref(true)

const amountLabel = computed(() => {
  if (!data.value?.amount) return ''
  const value = (data.value.amount / 100).toFixed(2)
  const currency = (data.value.currency || 'usd').toUpperCase()
  return `${currency === 'USD' ? '$' : ''}${value} ${currency}`
})

onMounted(async () => {
  const sessionId = route.query.session_id
  if (!sessionId) {
    loading.value = false
    return
  }
  try {
    const res = await fetch(`/api/newsletter-checkout-session?session_id=${encodeURIComponent(sessionId)}`)
    if (res.ok) {
      data.value = await res.json()
    }
  } catch (e) {
    // Fallback message already shown.
  } finally {
    loading.value = false
  }
})

useHead({ title: 'Thank you — Atlas Report' })
</script>

<style scoped>
.donate-success-page {
  padding: 3rem 0;
  min-height: calc(100vh - 88px);
  display: flex;
  align-items: center;
}

.donate-success-card {
  max-width: 480px;
  margin: 0 auto;
  text-align: center;
  border: 1px solid var(--color-border);
  border-top: 3px solid var(--color-success);
  border-radius: var(--radius-xl);
  background: var(--color-card-bg);
  box-shadow: var(--shadow-xs);
  padding: 2.5rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.1rem;
}

.donate-success-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 3.25rem;
  height: 3.25rem;
  border-radius: 50%;
  background: var(--color-success-subtle);
  border: 1px solid var(--color-success-border);
  color: var(--color-success);
}

.donate-success-icon { width: 30px; height: 30px; }

.donate-success-status { font-size: 1rem; color: var(--color-text-secondary); margin: 0; }

.donate-success-title {
  font-family: var(--font-serif);
  font-size: clamp(1.5rem, 3vw, 1.9rem);
  margin: 0;
  color: var(--color-text);
}

.donate-success-lead {
  font-size: 1rem;
  line-height: 1.65;
  color: var(--color-text-secondary);
  margin: 0;
}

.donate-success-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 0.25rem;
}
</style>
