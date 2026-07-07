<template>
  <div class="min-h-screen" :style="{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }">
    <main class="max-w-lg mx-auto px-6 py-16">
      <div class="rounded-2xl border p-8" :style="{ backgroundColor: 'var(--color-card-bg)', borderColor: 'var(--color-border)' }">
        <div class="text-center mb-6">
          <div class="text-4xl mb-3">🔑</div>
          <h1 class="font-serif text-2xl font-black" :style="{ color: 'var(--color-text)' }">Reset your password</h1>
          <p class="text-sm mt-2" :style="{ color: 'var(--color-text-secondary)' }">
            Enter your email and we'll send you a recovery link.
          </p>
        </div>

        <form @submit.prevent="handleReset" class="space-y-4">
          <div class="space-y-2">
            <label class="text-sm font-semibold" :style="{ color: 'var(--color-text-secondary)' }">Email address</label>
            <input
              v-model="email"
              type="email"
              required
              placeholder="name@example.com"
              class="w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:border-slate-900"
              :style="{
                backgroundColor: 'var(--color-input-bg)',
                borderColor: 'var(--color-input-border)',
                color: 'var(--color-text)'
              }"
            />
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full rounded-xl py-3 text-sm font-bold text-white transition"
            :style="{
              backgroundColor: 'var(--color-accent)',
              opacity: loading ? 0.6 : 1
            }"
          >
            {{ loading ? 'Sending...' : 'Send recovery link' }}
          </button>

          <p v-if="error" class="text-sm font-semibold text-center" :style="{ color: 'var(--color-accent)' }">{{ error }}</p>
          <p v-if="success" class="text-sm font-semibold text-center text-emerald-600">{{ success }}</p>
        </form>

        <div class="mt-6 text-center">
          <NuxtLink to="/auth" class="text-xs font-bold hover:underline" :style="{ color: 'var(--color-accent)' }">
            ← Back to sign in
          </NuxtLink>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const supabase = useSupabaseClient()

const email = ref('')
const loading = ref(false)
const error = ref('')
const success = ref('')

const handleReset = async () => {
  if (!email.value.trim()) {
    error.value = 'Please enter your email address.'
    return
  }

  loading.value = true
  error.value = ''
  success.value = ''

  const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.value.trim(), {
    redirectTo: `${window.location.origin}/auth?type=recovery`
  })

  loading.value = false

  if (resetError) {
    error.value = resetError.message
  } else {
    success.value = 'Recovery link sent! Check your email inbox.'
    email.value = ''
  }
}
</script>