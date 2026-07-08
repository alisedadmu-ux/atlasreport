<template>
  <div
    class="rounded-xl border p-6"
    :style="{
      backgroundColor: 'var(--color-card-bg)',
      borderColor: 'var(--color-border)'
    }"
  >
    <div class="flex items-center gap-3 mb-3">
      <span class="text-2xl">📬</span>
      <div>
        <h3 class="text-sm font-black" :style="{ color: 'var(--color-text)' }">Newsletter</h3>
        <p class="text-xs" :style="{ color: 'var(--color-text-muted)' }">Get the latest briefs in your inbox.</p>
      </div>
    </div>

    <form @submit.prevent="handleSubscribe" class="flex gap-2">
      <input
        v-model="email"
        type="email"
        required
        placeholder="your@email.com"
        class="flex-1 rounded-lg border px-3 py-2 text-xs outline-none transition"
        :style="{
          backgroundColor: 'var(--color-input-bg)',
          borderColor: 'var(--color-input-border)',
          color: 'var(--color-text)'
        }"
      />
      <button
        type="submit"
        :disabled="subscribing"
        class="rounded-lg px-4 py-2 text-xs font-bold text-white transition"
        :style="{
          backgroundColor: 'var(--color-accent)',
          opacity: subscribing ? 0.6 : 1
        }"
      >
        {{ subscribing ? '...' : 'Subscribe' }}
      </button>
    </form>

    <p v-if="message" class="mt-2 text-xs font-semibold" :class="messageType === 'error' ? 'text-red-500' : 'text-emerald-600'">
      {{ message }}
    </p>

    <p v-if="showUnsubscribeLink" class="mt-3 text-[10px] text-center" :style="{ color: 'var(--color-text-muted)' }">
      Already subscribed?
      <NuxtLink to="/unsubscribe" class="font-bold underline hover:text-red-700 transition-colors">
        Unsubscribe here
      </NuxtLink>
    </p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

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
      messageType.value = data.message.includes('already') || data.message.includes('Welcome back') ? 'success' : 'success'
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
