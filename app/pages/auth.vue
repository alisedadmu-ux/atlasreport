<template>
  <div class="auth-page">
    <div class="auth-grid">
      <section class="auth-brand">
        <NuxtLink to="/" class="auth-logo" aria-label="Atlas Report — Home">
          <img src="/images/atlaslogo.png" alt="Atlas Report" class="auth-logo-img" />
        </NuxtLink>
        <div class="auth-brand-content">
          <h2 class="auth-brand-heading">Join the intelligence network</h2>
          <p class="auth-brand-text">
            Premium editorial coverage for modern readers. Sign in to access your custom feed and join the community.
          </p>
        </div>
        <div class="auth-brand-features">
          <div class="feature">
            <span class="feature-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
            </span>
            <span>Curated reading</span>
          </div>
          <div class="feature">
            <span class="feature-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </span>
            <span>Community</span>
          </div>
          <div class="feature">
            <span class="feature-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </span>
            <span>Secure account</span>
          </div>
        </div>
      </section>

      <section class="auth-main">
        <div class="auth-card">
          <div class="auth-tabs" role="tablist" aria-label="Authentication tabs">
            <button
              type="button"
              :class="['auth-tab', { 'auth-tab-active': mode === 'login' }]"
              role="tab"
              :aria-selected="mode === 'login'"
              @click="mode = 'login'"
            >
              Sign in
            </button>
            <button
              type="button"
              :class="['auth-tab', { 'auth-tab-active': mode === 'signup' }]"
              role="tab"
              :aria-selected="mode === 'signup'"
              @click="mode = 'signup'"
            >
              Create account
            </button>
          </div>

          <form class="auth-form" @submit.prevent="handleSubmit">
            <div class="form-group">
              <label for="email" class="form-label">Email address</label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                required
                class="form-input"
                placeholder="team@atlasreport.com"
                autocomplete="email"
              />
            </div>

            <div class="form-group">
              <label for="password" class="form-label">Password</label>
              <input
                id="password"
                v-model="form.password"
                type="password"
                required
                class="form-input"
                placeholder="Enter a secure password"
                :autocomplete="mode === 'login' ? 'current-password' : 'new-password'"
              />
            </div>

            <button type="submit" :disabled="loading" class="btn btn-primary btn-lg w-full">
              {{ loading ? 'Working...' : mode === 'login' ? 'Sign in' : 'Create account' }}
            </button>

            <div v-if="mode === 'login'" class="auth-forgot">
              <NuxtLink to="/forgot-password" class="link-accent">Forgot your password?</NuxtLink>
            </div>
          </form>

          <div v-if="error || success" class="auth-feedback">
            <p v-if="error" class="form-error">{{ error }}</p>
            <p v-if="success" class="form-success">{{ success }}</p>
          </div>
        </div>

        <div class="auth-session">
          <div class="session-card">
            <div class="session-header">
              <h3 class="session-title">Current session</h3>
              <div class="session-indicator">
                <span :class="['status-dot', user ? 'active' : 'inactive']"></span>
                <span class="status-label">{{ user ? 'Signed in' : 'Not signed in' }}</span>
              </div>
            </div>
            <p class="session-desc">Your Supabase session is synchronized automatically.</p>
            <div class="session-email-status">
              <p v-if="user" class="session-email">{{ user.email }}</p>
              <p v-else class="session-email">No active email session</p>
            </div>
            <div class="session-actions">
              <NuxtLink v-if="user" to="/" class="btn btn-primary w-full">Open home feed</NuxtLink>
              <button v-if="user" @click="handleSignOut" class="btn btn-ghost w-full">Sign out</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'

const supabase = useSupabaseClient()
const user = useSupabaseUser()

const mode = ref('login')
const form = reactive({ email: '', password: '' })
const loading = ref(false)
const error = ref('')
const success = ref('')

const handleSubmit = async () => {
  loading.value = true
  error.value = ''
  success.value = ''

  if (!form.email || !form.password) {
    error.value = 'Please enter both email and password.'
    loading.value = false
    return
  }

  if (mode.value === 'login') {
    const { error: signInError } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password })
    if (signInError) { error.value = signInError.message; loading.value = false; return }
    success.value = 'Successfully signed in.'
    form.password = ''
    loading.value = false
    await navigateTo('/profile')
    return
  }

  const { data, error: signUpError } = await supabase.auth.signUp({ email: form.email, password: form.password })
  if (signUpError) {
    error.value = signUpError.message
  } else {
    success.value = data.user ? 'Account created. Check your email for a confirmation link.' : 'Check your email to activate your account.'
    form.password = ''
  }
  loading.value = false
}

const handleSignOut = async () => {
  loading.value = true
  error.value = ''
  success.value = ''
  const { error: signOutError } = await supabase.auth.signOut()
  loading.value = false
  if (signOutError) { error.value = signOutError.message } else { success.value = 'Signed out successfully.' }
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

.auth-grid {
  width: 100%;
  max-width: 960px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  padding: 0 1.5rem;
  align-items: center;
}

.auth-brand {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.auth-logo {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  width: fit-content;
  text-decoration: none;
}

.auth-logo-img {
  display: block;
  width: 120px;
  height: auto;
  flex-shrink: 0;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.auth-logo:hover .auth-logo-img {
  transform: scale(1.04) rotate(-1deg);
}

.auth-brand-content {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.auth-brand-heading {
  font-size: 1.5rem;
  font-weight: 800;
  font-family: var(--font-serif);
  color: var(--color-text);
}

.auth-brand-text {
  font-size: 0.9375rem;
  line-height: 1.7;
  color: var(--color-text-secondary);
  max-width: 340px;
}

.auth-brand-features {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.feature {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text);
}

.feature-icon {
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

.auth-main {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.auth-card {
  border: 1px solid var(--color-border);
  background: var(--color-card-bg);
  border-radius: var(--radius-lg);
  padding: 1.75rem;
  box-shadow: var(--shadow-base);
}

.auth-tabs {
  display: flex;
  gap: 0.5rem;
  padding: 0.4rem;
  background: var(--color-bg-alt);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-base);
  margin-bottom: 1.75rem;
}

.auth-tab {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1rem;
  border-radius: var(--radius-sm);
  border: 1px solid transparent;
  background: transparent;
  font-family: inherit;
  font-size: 0.8125rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 44px;
}

.auth-tab:hover {
  color: var(--color-text);
}

.auth-tab-active {
  background: var(--color-card-bg);
  color: var(--color-text);
  border-color: var(--color-border);
  box-shadow: var(--shadow-sm);
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.35rem;
}

.auth-forgot {
  text-align: center;
  font-size: 0.8125rem;
}

.auth-feedback {
  margin-top: 1.5rem;
  padding-top: 1.15rem;
  border-top: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.auth-session .session-card {
  border: 1px solid var(--color-border);
  background: var(--color-bg-alt);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
}

.session-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}

.session-title {
  font-size: 0.9375rem;
  font-weight: 800;
  color: var(--color-text);
}

.session-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 9999px;
}

.status-dot.active { background: var(--color-success); }
.status-dot.inactive { background: var(--color-text-muted); }

.status-label {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--color-text);
}

.session-desc {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  line-height: 1.65;
  margin-bottom: 1.1rem;
}

.session-email-status {
  padding: 0.85rem 1rem;
  border-radius: var(--radius-sm);
  background: var(--color-card-bg);
  border: 1px solid var(--color-border);
  margin-bottom: 1.1rem;
}

.session-email {
  font-size: 0.8125rem;
  color: var(--color-text-muted);
}

.session-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.w-full {
  width: 100%;
}

@media (max-width: 768px) {
  .auth-grid {
    grid-template-columns: 1fr;
    max-width: 480px;
  }

  .auth-brand {
    text-align: center;
    align-items: center;
  }

  .auth-brand-text {
    max-width: 100%;
  }

  .auth-session {
    display: none;
  }

  .auth-page {
    padding: 2rem 0;
    align-items: flex-start;
  }
}
</style>