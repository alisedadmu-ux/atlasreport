<template>
  <div class="unsubscribe-page">
    <div class="site-container">
      <div class="unsubscribe-card">
        <p class="eyebrow">Newsletter</p>
        <h1 class="unsubscribe-title">Unsubscribe</h1>

        <div v-if="status === 'loading'" class="state-block">
          <div class="spinner"></div>
          <p>Processing your request...</p>
        </div>

        <div v-else-if="status === 'success'" class="state-block state-success">
          <div class="state-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <h2 class="state-heading">Unsubscribed</h2>
          <p>{{ message }}</p>
          <NuxtLink to="/" class="btn btn-primary btn-lg">Back to Home</NuxtLink>
        </div>

        <div v-else-if="status === 'error'" class="state-block state-error">
          <div class="state-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          </div>
          <h2 class="state-heading">Error</h2>
          <p>{{ message }}</p>
          <div class="state-actions">
            <NuxtLink to="/" class="btn btn-primary">Back to Home</NuxtLink>
            <NuxtLink to="/contact" class="btn btn-secondary">Contact Us</NuxtLink>
          </div>
        </div>

        <div v-else class="state-block">
          <p class="state-desc">Enter your email to unsubscribe from our newsletter.</p>
          <form @submit.prevent="handleManualUnsubscribe" class="unsubscribe-form">
            <input
              v-model="emailInput"
              type="email"
              required
              placeholder="your@email.com"
              aria-label="Email address"
              class="form-input"
            />
            <button type="submit" :disabled="submitting" class="btn btn-primary">
              {{ submitting ? '...' : 'Unsubscribe' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const status = ref('idle')
const message = ref('')
const emailInput = ref('')
const submitting = ref(false)

onMounted(async () => {
  const token = route.query.token
  const email = route.query.email
  if (token || email) {
    status.value = 'loading'
    try {
      const res = await fetch('/api/newsletter-unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: token || undefined, email: email || undefined })
      })
      const data = await res.json()
      if (data.success) { status.value = 'success'; message.value = data.message }
      else { status.value = 'error'; message.value = data.error || 'Failed to unsubscribe' }
    } catch (e) {
      status.value = 'error'
      message.value = 'Network error. Please try again.'
    }
  }
})

const handleManualUnsubscribe = async () => {
  if (!emailInput.value.trim()) return
  submitting.value = true
  status.value = 'loading'
  try {
    const res = await fetch('/api/newsletter-unsubscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: emailInput.value.trim() })
    })
    const data = await res.json()
    if (data.success) { status.value = 'success'; message.value = data.message }
    else { status.value = 'error'; message.value = data.error || 'Failed to unsubscribe' }
  } catch (e) {
    status.value = 'error'
    message.value = 'Network error. Please try again.'
  }
  submitting.value = false
}
</script>

<style scoped>
.unsubscribe-page {
  min-height: 100vh;
  padding: 3rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg);
}

.unsubscribe-card {
  max-width: 480px;
  width: 100%;
  margin: 0 auto;
  padding: 2.25rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.6rem;
  border: 1px solid var(--color-border);
  background: var(--color-card-bg);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-base);
}

.unsubscribe-title {
  font-family: var(--font-serif);
  font-size: clamp(1.5rem, 3vw, 2rem);
  margin: 0.25rem 0 0;
}

.state-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 1.5rem 0;
  width: 100%;
}

.state-icon {
  color: var(--color-text-muted);
  opacity: 0.7;
}

.state-success .state-icon {
  color: var(--color-success);
}

.state-error .state-icon {
  color: var(--color-error);
}

.state-heading {
  font-family: var(--font-serif);
  font-size: 1.5rem;
  color: var(--color-text);
  margin: 0;
}

.state-desc {
  color: var(--color-text-secondary);
  font-size: 0.9375rem;
}

.state-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 0.5rem;
  flex-wrap: wrap;
  justify-content: center;
}

.unsubscribe-form {
  display: flex;
  gap: 0.75rem;
  margin-top: 0.75rem;
  width: 100%;
  max-width: 400px;
}

.form-input {
  flex: 1;
  font-family: inherit;
  font-size: 0.9375rem;
  color: var(--color-text);
  background: var(--color-input-bg);
  border: 1px solid var(--color-input-border);
  border-radius: var(--radius-sm);
  padding: 0.7rem 1rem;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.form-input::placeholder { color: var(--color-text-muted); }

.form-input:focus {
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px var(--color-accent-ring);
}

.spinner {
  width: 2rem;
  height: 2rem;
  border: 2px solid var(--color-border);
  border-top-color: var(--color-accent);
  border-radius: 9999px;
  animation: spin 0.8s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

@media (max-width: 480px) {
  .unsubscribe-card {
    padding: 1.75rem 1.25rem;
  }

  .unsubscribe-form {
    flex-direction: column;
  }
}
</style>
