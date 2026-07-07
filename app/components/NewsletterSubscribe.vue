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
  </div>
</template>

<script setup>
import { ref } from 'vue'

const supabase = useSupabaseClient()

const email = ref('')
const subscribing = ref(false)
const message = ref('')
const messageType = ref('')

const handleSubscribe = async () => {
  if (!email.value.trim()) return

  subscribing.value = true
  message.value = ''
  messageType.value = ''

  try {
    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert({ email: email.value.trim().toLowerCase() })

    if (error) {
      if (error.code === '23505') {
        message.value = 'You\'re already subscribed!'
        messageType.value = 'success'
      } else if (error.message?.includes('relation') || error.code === '42P01') {
        message.value = 'Newsletter is not configured yet. Check back soon!'
        messageType.value = 'error'
      } else {
        message.value = error.message
        messageType.value = 'error'
      }
    } else {
      message.value = 'Subscribed! Check your inbox for confirmation.'
      messageType.value = 'success'
      email.value = ''
    }
  } catch (e) {
    message.value = 'Something went wrong. Try again later.'
    messageType.value = 'error'
  }

  subscribing.value = false
}
</script>