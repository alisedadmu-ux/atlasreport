<template>
  <div class="newsletter-box">
    <div class="newsletter-header">
      <div class="newsletter-icon-wrap">
        <Mail class="newsletter-icon" />
      </div>
      <div>
        <h3 class="newsletter-title">Newsletter</h3>
        <p class="newsletter-subtitle">Get the latest briefs in your inbox.</p>
      </div>
    </div>
    <form @submit.prevent="handleSubscribe" class="newsletter-form">
      <input
        v-model="email"
        type="email"
        required
        placeholder="your@email.com"
        aria-label="Email address"
        class="form-input"
      />
      <button type="submit" :disabled="subscribing" class="btn btn-primary btn-sm">
        {{ subscribing ? '...' : 'Subscribe' }}
      </button>
    </form>
    <p v-if="message" class="newsletter-message" :class="messageType === 'error' ? 'form-error' : 'form-success'">
      {{ message }}
    </p>
    <p v-if="showUnsubscribeLink" class="newsletter-unsub">
      Already subscribed?
      <NuxtLink to="/unsubscribe" class="link-accent">Unsubscribe here</NuxtLink>
    </p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Mail } from '@lucide/vue'

const email = ref('')
const subscribing = ref(false)
const message = ref('')
const messageType = ref('')

const showUnsubscribeLink = computed(() => {
  return message.value.includes('already subscribed') || message.value.includes('Welcome back')
})

const handleSubscribe = async () => {
  if (!email.value.trim()) return
  subscribing.value = true
  message.value = ''
  messageType.value = ''
  try {
    const res = await fetch('/api/newsletter-subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value.trim() })
    })
    const data = await res.json()
    if (data.success) {
      message.value = data.message
      messageType.value = 'success'
      if (!data.message.includes('already') && !data.message.includes('Welcome back')) {
        email.value = ''
      }
    } else {
      message.value = data.error || 'Something went wrong. Try again later.'
      messageType.value = 'error'
    }
  } catch (e) {
    message.value = 'Something went wrong. Try again later.'
    messageType.value = 'error'
  }
  subscribing.value = false
}
</script>

<style scoped>
.newsletter-box {
  border: 1px solid var(--color-border);
  background: var(--color-card-bg);
  border-radius: var(--radius-lg);
  padding: 1.25rem;
  box-shadow: var(--shadow-xs);
}

.newsletter-header {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  margin-bottom: 1rem;
}

.newsletter-icon-wrap {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: var(--radius-sm);
  background: var(--color-bg-alt);
  color: var(--color-accent);
  border: 1px solid var(--color-border);
}

.newsletter-icon {
  width: 18px;
  height: 18px;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.newsletter-title {
  font-size: 0.9375rem;
  font-weight: 800;
  color: var(--color-text);
}

.newsletter-subtitle {
  font-size: 0.8125rem;
  color: var(--color-text-secondary);
  margin-top: 0.15rem;
}

.newsletter-form {
  display: flex;
  gap: 0.5rem;
}

.newsletter-message {
  margin-top: 0.85rem;
  font-size: 0.8125rem;
  font-weight: 700;
}

.newsletter-unsub {
  margin-top: 0.85rem;
  font-size: 0.75rem;
  color: var(--color-text-muted);
  text-align: center;
}

.link-accent {
  color: var(--color-accent);
  font-weight: 700;
}
</style>
