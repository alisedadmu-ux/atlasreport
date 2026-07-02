<template>
  <div class="min-h-screen bg-slate-50 text-slate-900">
    <div class="mx-auto max-w-4xl px-6 py-16">
      <div class="grid gap-10 rounded-2xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/50 lg:grid-cols-[1.15fr_0.85fr] lg:p-10">
        <section class="space-y-6">
          <div class="space-y-3">
            <p class="text-sm uppercase tracking-[0.35em] text-slate-500">Atlas Report</p>
            <h1 class="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">Welcome back to your newsroom</h1>
            <p class="max-w-2xl text-slate-600">Sign in to open your home feed, follow the newest updates, and manage your profile settings.</p>
          </div>

          <div class="auth-tabs" role="tablist" aria-label="Authentication tabs">
            <button
              type="button"
              class="auth-tab-btn"
              :class="{ 'auth-tab-btn-active': mode === 'login' }"
              role="tab"
              :aria-selected="mode === 'login'"
              @click="mode = 'login'"
            >
              Sign in
            </button>
            <button
              type="button"
              class="auth-tab-btn"
              :class="{ 'auth-tab-btn-active': mode === 'signup' }"
              role="tab"
              :aria-selected="mode === 'signup'"
              @click="mode = 'signup'"
            >
              Create account
            </button>
          </div>

          <form class="space-y-5 rounded-2xl border border-slate-200 bg-slate-50 p-6" @submit.prevent="handleSubmit">
            <div class="space-y-2">
              <label for="email" class="text-sm font-semibold text-slate-700">Email address</label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                required
                class="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900"
                placeholder="team@atlasreport.com"
              >
            </div>

            <div class="space-y-2">
              <label for="password" class="text-sm font-semibold text-slate-700">Password</label>
              <input
                id="password"
                v-model="form.password"
                type="password"
                required
                class="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900"
                placeholder="Enter a secure password"
              >
            </div>

            <button
              type="submit"
              :disabled="loading"
              class="w-full rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {{ loading ? 'Working...' : mode === 'login' ? 'Sign in' : 'Create account' }}
            </button>
          </form>

          <div class="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p class="text-sm font-semibold text-slate-700">Auth status</p>
            <p class="text-sm text-slate-600">{{ statusMessage }}</p>
            <p v-if="error" class="text-sm font-semibold text-rose-500">{{ error }}</p>
            <p v-if="success" class="text-sm font-semibold text-emerald-600">{{ success }}</p>
          </div>
        </section>

        <aside class="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-slate-700 shadow-xl shadow-slate-200/40">
          <div class="space-y-4">
            <h2 class="text-2xl font-black text-slate-950">Current session</h2>
            <p class="text-sm leading-7 text-slate-600">Your Supabase session is synchronized automatically by Nuxt. Signed-in users can jump straight to the home feed.</p>

            <div class="space-y-4 rounded-2xl bg-slate-950 p-6">
              <div class="flex items-center justify-between gap-3">
                <span class="text-sm uppercase tracking-[0.18em] text-slate-400">User</span>
                <span class="text-xs text-slate-500">status</span>
              </div>

              <div class="space-y-2">
                <p class="text-base font-semibold text-white">{{ userLabel }}</p>
                <p class="text-sm text-slate-400">{{ userEmail }}</p>
              </div>

              <NuxtLink
                v-if="user"
                to="/"
                class="flex w-full items-center justify-center rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
              >
                Open home
              </NuxtLink>

              <button
                v-if="user"
                class="w-full rounded-xl border border-slate-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-900"
                @click="handleSignOut"
              >
                Sign out
              </button>
            </div>

            <div class="rounded-2xl border border-slate-200 bg-white p-5 text-sm leading-7 text-slate-600">
              <p>After a successful login, Atlas Report now sends you to the home page automatically.</p>
            </div>
          </div>
        </aside>
      </div>
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

const statusMessage = computed(() => {
  if (loading.value) return 'Processing your request...'
  if (user.value) return 'Signed in successfully. You can open your home feed.'
  return 'Not signed in yet. Use your email and password to authenticate.'
})

const userLabel = computed(() => (user.value ? 'Signed in' : 'Not signed in'))
const userEmail = computed(() => user.value?.email ?? 'No active email session')

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
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password
    })

    if (signInError) {
      error.value = signInError.message
      loading.value = false
      return
    }

    success.value = 'Successfully signed in. Opening your home feed...'
    form.password = ''
    loading.value = false
    await navigateTo('/')
    return
  }

  const { data, error: signUpError } = await supabase.auth.signUp({
    email: form.email,
    password: form.password
  })

  if (signUpError) {
    error.value = signUpError.message
  } else {
    success.value = data.user
      ? 'Account created successfully. Check your email for a confirmation link.'
      : 'Next step: check your email to activate your account.'
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

  if (signOutError) {
    error.value = signOutError.message
  } else {
    success.value = 'Signed out successfully.'
  }
}
</script>

<style scoped>
.auth-tabs {
  display: flex;
  gap: 0.75rem;
  padding: 0.5rem;
  background: #e2e8f0;
  border: 1px solid rgba(148, 163, 184, 0.3);
  border-radius: 0.75rem;
  margin-bottom: 1.75rem;
}

.auth-tab-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 9rem;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 0.6rem;
  font-family: inherit;
  font-weight: 800;
  font-size: 0.82rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #475569;
  cursor: pointer;
  padding: 0.85rem 1rem;
  transition: color 0.2s ease, background-color 0.2s ease, border-color 0.2s ease;
}

.auth-tab-btn:hover {
  color: #0f172a;
  background: rgba(255, 255, 255, 0.55);
}

.auth-tab-btn-active {
  color: #0f172a;
  background: #ffffff;
  border-color: rgba(148, 163, 184, 0.35);
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
}

@media (max-width: 520px) {
  .auth-tabs {
    flex-direction: column;
  }

  .auth-tab-btn {
    width: 100%;
    min-width: 0;
  }
}
</style>
