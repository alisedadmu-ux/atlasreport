<template>
  <div class="auth-page">
    <div class="site-container">
      <div class="auth-card auth-card-centered">
        <NuxtLink to="/" class="auth-logo" aria-label="Atlas Report — Home">
          <img src="/images/atlasreport.png" alt="Atlas Report" class="auth-logo-img" />
        </NuxtLink>
        <p class="eyebrow">Account</p>
        <h1 class="auth-title">Reset your password</h1>
        <p class="auth-subtitle">Enter your email and we'll send you a recovery link.</p>

        <form @submit.prevent="handleReset" class="auth-form">
          <div class="form-group">
            <label for="email" class="form-label">Email address</label>
            <input id="email" v-model="email" type="email" class="form-input" placeholder="name@example.com" required />
          </div>

          <button type="submit" :disabled="loading" class="btn btn-primary btn-lg w-full">
            {{ loading ? 'Sending...' : 'Send recovery link' }}
          </button>
        </form>

        <p v-if="error" class="form-error">{{ error }}</p>
        <p v-if="success" class="form-success">{{ success }}</p>

        <NuxtLink to="/auth" class="back-link">Back to sign in</NuxtLink>
      </div>
    </div>
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
  success.value = ''
  error.value = ''
  if (!email.value.trim()) {
    error.value = 'Please enter your email address.'
    return
  }
  loading.value = true
  try {
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.value.trim(), {
      redirectTo: `${window.location.origin}/auth?type=recovery`
    })
    if (resetError) {
      error.value = resetError.message
    } else {
      success.value = 'Recovery link sent! Check your email inbox.'
      email.value = ''
    }
  } catch (e) {
    error.value = 'Something went wrong. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  padding: 3rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg);
}

.auth-card-centered {
  max-width: 440px;
  margin: 0 auto;
  padding: 2.25rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  border: 1px solid var(--color-border);
  background: var(--color-card-bg);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-base);
}

.auth-logo {
  display: inline-flex;
  margin: 0 auto 0.5rem;
}

.auth-logo-img {
  width: 120px;
  height: auto;
  object-fit: contain;
}

.auth-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(1.5rem, 3vw, 2rem);
  margin: 0.25rem 0 0;
}

.auth-subtitle {
  color: var(--color-text-secondary);
  font-size: 0.9375rem;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-top: 1.25rem;
}

.form-group {
  text-align: left;
}

.back-link {
  margin-top: 0.5rem;
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--color-accent);
}

.w-full { width: 100%; }

@media (max-width: 480px) {
  .auth-card-centered {
    padding: 1.75rem 1.25rem;
  }
}
</style>
