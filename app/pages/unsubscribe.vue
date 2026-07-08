<template>
  <div class="min-h-screen flex items-center justify-center px-4" style="background-color: var(--color-bg);">
    <div class="max-w-md w-full text-center">
      <div v-if="status === 'loading'" class="py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700 mx-auto mb-4"></div>
        <p class="text-lg font-semibold" :style="{ color: 'var(--color-text)' }">Processing your request...</p>
      </div>

      <div v-else-if="status === 'success'" class="py-12">
        <div class="text-6xl mb-6">✅</div>
        <h1 class="text-3xl font-bold mb-4 font-serif" :style="{ color: 'var(--color-text)' }">Unsubscribed</h1>
        <p class="text-lg mb-8" :style="{ color: 'var(--color-text-secondary)' }">
          {{ message }}
        </p>
        <NuxtLink
          to="/"
          class="inline-block px-6 py-3 rounded-lg text-white font-bold text-sm transition-all hover:opacity-90"
          style="background-color: var(--color-accent)"
        >
          Back to Home
        </NuxtLink>
      </div>

      <div v-else-if="status === 'error'" class="py-12">
        <div class="text-6xl mb-6">❌</div>
        <h1 class="text-3xl font-bold mb-4 font-serif" :style="{ color: 'var(--color-text)' }">Error</h1>
        <p class="text-lg mb-4 text-red-500">{{ message }}</p>
        <p class="text-sm mb-8" :style="{ color: 'var(--color-text-muted)' }">
          If you're still receiving emails, please contact us.
        </p>
        <div class="flex gap-4 justify-center">
          <NuxtLink
            to="/"
            class="inline-block px-6 py-3 rounded-lg text-white font-bold text-sm transition-all hover:opacity-90"
            style="background-color: var(--color-accent)"
          >
            Back to Home
          </NuxtLink>
          <NuxtLink
            to="/contact"
            class="inline-block px-6 py-3 rounded-lg font-bold text-sm transition-all"
            :style="{
              border: '1px solid var(--color-border)',
              color: 'var(--color-text)'
            }"
          >
            Contact Us
          </NuxtLink>
        </div>
      </div>

      <div v-else class="py-12">
        <div class="text-6xl mb-6">📬</div>
        <h1 class="text-3xl font-bold mb-4 font-serif" :style="{ color: 'var(--color-text)' }">Unsubscribe</h1>
        <p class="text-lg mb-8" :style="{ color: 'var(--color-text-secondary)' }">
          Enter your email to unsubscribe from our newsletter.
        </p>

        <form @submit.prevent="handleManualUnsubscribe" class="flex gap-2 max-w-sm mx-auto">
          <input
            v-model="emailInput"
            type="email"
            required
            placeholder="your@email.com"
            class="flex-1 rounded-lg border px-4 py-3 text-sm outline-none transition"
            :style="{
              backgroundColor: 'var(--color-input-bg)',
              borderColor: 'var(--color-input-border)',
              color: 'var(--color-text)'
            }"
          />
          <button
            type="submit"
            :disabled="submitting"
            class="rounded-lg px-5 py-3 text-sm font-bold text-white transition"
            style="background-color: var(--color-accent)"
          >
            {{ submitting ? '...' : 'Unsubscribe' }}
          </button>
        </form>
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
      const params = new URLSearchParams()
      if (token) params.set('token', token)
      if (email) params.set('email', email)

      const res = await fetch(`/api/newsletter-unsubscribe?${params.toString()}`)
      const data = await res.json()

      if (data.success) {
        status.value = 'success'
        message.value = data.message
      } else {
        status.value = 'error'
        message.value = data.error || 'Failed to unsubscribe'
      }
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
    const res = await fetch(`/api/newsletter-unsubscribe?email=${encodeURIComponent(emailInput.value.trim())}`)
    const data = await res.json()

    if (data.success) {
      status.value = 'success'
      message.value = data.message
    } else {
      status.value = 'error'
      message.value = data.error || 'Failed to unsubscribe'
    }
  } catch (e) {
    status.value = 'error'
    message.value = 'Network error. Please try again.'
  }

  submitting.value = false
}
</script>