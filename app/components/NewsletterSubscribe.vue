<template>
  <div class="newsletter-box">
    <div class="newsletter-header">
      <div class="newsletter-icon-wrap">
        <Mail class="newsletter-icon" />
      </div>
      <div>
        <h3 class="newsletter-title">Newsletter</h3>
        <p class="newsletter-subtitle">Subscribe to get the latest briefs in your inbox.</p>
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
        :class="{ 'form-input-error': emailTouched && !validEmail }"
        @blur="emailTouched = true"
      />
      <button type="submit" :disabled="!validEmail" class="btn btn-primary btn-sm">
        Subscribe
      </button>
    </form>
    <p v-if="emailTouched && !validEmail" class="newsletter-error">
      Please enter a valid email address.
    </p>
    <p class="newsletter-note">You'll be taken to secure checkout to complete your subscription.</p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Mail } from '@lucide/vue'

const email = ref('')
const emailTouched = ref(false)

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const validEmail = computed(() => emailRegex.test(email.value.trim()))

const handleSubscribe = () => {
  emailTouched.value = true
  if (!validEmail.value) return
  navigateTo(`/checkout?email=${encodeURIComponent(email.value.trim())}`)
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

.form-input-error {
  border-color: var(--color-error);
}

.newsletter-error {
  margin-top: 0.6rem;
  font-size: 0.8125rem;
  color: var(--color-error);
}

.newsletter-note {
  margin-top: 0.7rem;
  font-size: 0.75rem;
  color: var(--color-text-muted);
}
</style>
