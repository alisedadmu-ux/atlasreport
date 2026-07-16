<template>
  <div class="success-page">
    <div class="site-container">
      <div class="success-card fade-in-up">
        <span class="success-badge" aria-hidden="true">
          <Check class="success-check" />
        </span>

        <p v-if="loading" class="success-status">Confirming your subscription…</p>
        <template v-else-if="data">
          <h1 class="success-title">You're subscribed!</h1>
          <p class="success-lead">
            Thanks for becoming an Atlas Report Premium member. Your exclusive briefs will start
            arriving at <strong>{{ data.email }}</strong> shortly.
          </p>
          <div class="success-meta">
            <div class="success-meta-row">
              <span>Plan</span>
              <span>{{ planLabel }}</span>
            </div>
            <div class="success-meta-row">
              <span>Amount</span>
              <span>{{ amountLabel }}</span>
            </div>
            <div class="success-meta-row">
              <span>Status</span>
              <span class="success-pill">{{ statusLabel }}</span>
            </div>
          </div>
        </template>
        <p v-else class="success-lead">Your subscription is confirmed. Welcome aboard!</p>

        <div class="success-actions">
          <NuxtLink to="/" class="btn btn-primary">Back to the feed</NuxtLink>
          <NuxtLink to="/profile" class="btn btn-ghost">Manage account</NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Check } from '@lucide/vue'

const route = useRoute()
const data = ref(null)
const loading = ref(true)

const planLabel = computed(() => {
  if (!data.value) return ''
  return data.value.plan === 'yearly' ? 'Annual' : 'Monthly'
})

const amountLabel = computed(() => {
  if (!data.value?.amount) return '—'
  const value = (data.value.amount / 100).toFixed(2)
  const currency = (data.value.currency || 'usd').toUpperCase()
  return `${currency === 'USD' ? '$' : ''}${value} ${currency}`
})

const statusLabel = computed(() => {
  const s = data.value?.status
  if (s === 'complete' || s === 'paid') return 'Active'
  if (s === 'open') return 'Pending'
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : 'Confirmed'
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
    // Non-fatal; generic confirmation still shown.
  } finally {
    loading.value = false
  }
})

useHead({ title: 'Subscription confirmed — Atlas Report Premium' })
</script>

<style scoped>
.success-page {
  padding: 3rem 0;
  min-height: calc(100vh - 88px);
  display: flex;
  align-items: center;
}

.success-card {
  max-width: 520px;
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

.success-badge {
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

.success-check { width: 30px; height: 30px; }

.success-status { font-size: 1rem; color: var(--color-text-secondary); margin: 0; }

.success-title {
  font-family: var(--font-serif);
  font-size: clamp(1.5rem, 3vw, 1.9rem);
  margin: 0;
  color: var(--color-text);
}

.success-lead {
  font-size: 1rem;
  line-height: 1.65;
  color: var(--color-text-secondary);
  margin: 0;
}

.success-meta {
  width: 100%;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-bg-elevated);
  padding: 0.5rem 1rem;
  display: grid;
  gap: 0.1rem;
}

.success-meta-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.55rem 0;
  font-size: 0.9375rem;
  color: var(--color-text-secondary);
  border-bottom: 1px solid var(--color-border-light);
}
.success-meta-row:last-child { border-bottom: none; }
.success-meta-row span:last-child { color: var(--color-text); font-weight: 700; }

.success-pill {
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--color-success-contrast);
  background: var(--color-success);
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
}

.success-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 0.25rem;
}
</style>
