<template>
  <div class="min-h-screen bg-slate-50 text-slate-950">
    <main class="mx-auto grid max-w-6xl gap-8 px-5 py-10 sm:px-6 lg:grid-cols-[0.35fr_0.65fr] lg:px-8">
      <aside class="space-y-5">
        <div class="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div class="flex items-center gap-4">
            <div
              class="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg text-2xl font-black text-white"
              :style="{ background: selectedAccent.hex }"
            >
              {{ initials }}
            </div>
            <div class="min-w-0">
              <p class="truncate text-lg font-black">{{ form.displayName || 'Atlas Reader' }}</p>
              <p class="truncate text-sm text-slate-500">{{ user?.email }}</p>
            </div>
          </div>
          <p class="mt-5 text-sm leading-6 text-slate-600">{{ form.bio || 'Add a short bio so your dashboard feels more personal.' }}</p>
        </div>

        <NuxtLink to="/" class="inline-flex w-full justify-center rounded bg-slate-950 px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-800">
          Back to home
        </NuxtLink>
      </aside>

      <section class="space-y-6">
        <div>
          <p class="text-xs font-bold uppercase tracking-[0.3em] text-red-700">Profile settings</p>
          <h1 class="mt-3 font-serif text-4xl font-black">Customize your account</h1>
          <p class="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
            Change how your profile looks, update your reader details, and set a new password when needed.
          </p>
        </div>

        <form class="rounded-lg border border-slate-200 bg-white p-6 shadow-sm" @submit.prevent="saveProfile">
          <div class="grid gap-5 md:grid-cols-2">
            <label class="space-y-2">
              <span class="text-sm font-bold text-slate-700">Display name</span>
              <input v-model="form.displayName" class="profile-input" type="text" placeholder="Your newsroom name">
            </label>

            <label class="space-y-2">
              <span class="text-sm font-bold text-slate-700">Headline</span>
              <input v-model="form.headline" class="profile-input" type="text" placeholder="Science editor, reader, analyst...">
            </label>
          </div>

          <label class="mt-5 block space-y-2">
            <span class="text-sm font-bold text-slate-700">Bio</span>
            <textarea v-model="form.bio" class="profile-input min-h-28 resize-y" placeholder="Write a short profile bio" />
          </label>

          <div class="mt-6">
            <p class="text-sm font-bold text-slate-700">Profile accent</p>
            <div class="mt-3 flex flex-wrap gap-3">
              <button
                v-for="accent in accents"
                :key="accent.name"
                type="button"
                class="flex items-center gap-2 rounded border px-3 py-2 text-sm font-bold transition"
                :class="form.accent === accent.name ? 'border-slate-950 bg-slate-100' : 'border-slate-200 bg-white hover:border-slate-400'"
                @click="form.accent = accent.name"
              >
                <span class="h-5 w-5 rounded" :style="{ background: accent.hex }" />
                {{ accent.label }}
              </button>
            </div>
          </div>

          <div class="mt-6">
            <p class="text-sm font-bold text-slate-700">Dashboard density</p>
            <div class="mt-3 grid gap-3 sm:grid-cols-3">
              <button
                v-for="density in densities"
                :key="density"
                type="button"
                class="rounded border px-4 py-3 text-sm font-bold capitalize transition"
                :class="form.density === density ? 'border-slate-950 bg-slate-950 text-white' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-400'"
                @click="form.density = density"
              >
                {{ density }}
              </button>
            </div>
          </div>

          <div class="mt-6 flex flex-wrap items-center gap-3">
            <button type="submit" :disabled="profileLoading" class="rounded bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800 disabled:opacity-60">
              {{ profileLoading ? 'Saving...' : 'Save profile' }}
            </button>
            <p v-if="profileMessage" class="text-sm font-bold text-emerald-700">{{ profileMessage }}</p>
            <p v-if="profileError" class="text-sm font-bold text-rose-600">{{ profileError }}</p>
          </div>
        </form>

        <form class="rounded-lg border border-slate-200 bg-white p-6 shadow-sm" @submit.prevent="changePassword">
          <h2 class="font-serif text-2xl font-black">Change password</h2>
          <p class="mt-2 text-sm leading-6 text-slate-600">Choose a new password with at least six characters.</p>

          <div class="mt-5 grid gap-5 md:grid-cols-2">
            <label class="space-y-2">
              <span class="text-sm font-bold text-slate-700">New password</span>
              <input v-model="passwordForm.password" class="profile-input" type="password" autocomplete="new-password" placeholder="New password">
            </label>

            <label class="space-y-2">
              <span class="text-sm font-bold text-slate-700">Confirm password</span>
              <input v-model="passwordForm.confirm" class="profile-input" type="password" autocomplete="new-password" placeholder="Confirm password">
            </label>
          </div>

          <div class="mt-6 flex flex-wrap items-center gap-3">
            <button type="submit" :disabled="passwordLoading" class="rounded bg-red-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-800 disabled:opacity-60">
              {{ passwordLoading ? 'Updating...' : 'Update password' }}
            </button>
            <p v-if="passwordMessage" class="text-sm font-bold text-emerald-700">{{ passwordMessage }}</p>
            <p v-if="passwordError" class="text-sm font-bold text-rose-600">{{ passwordError }}</p>
          </div>
        </form>
      </section>
    </main>
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'

const supabase = useSupabaseClient()
const user = useSupabaseUser()

watch(user, async (currentUser) => {
  if (currentUser === null) {
    await navigateTo('/auth')
  }
}, { immediate: true })

const accents = [
  { name: 'ink', label: 'Ink', hex: '#0f172a' },
  { name: 'crimson', label: 'Crimson', hex: '#b91c1c' },
  { name: 'green', label: 'Green', hex: '#047857' },
  { name: 'gold', label: 'Gold', hex: '#b45309' }
]
const densities = ['compact', 'balanced', 'spacious']

const metadata = computed(() => user.value?.user_metadata ?? {})
const form = reactive({
  displayName: '',
  headline: '',
  bio: '',
  accent: 'ink',
  density: 'balanced'
})
const passwordForm = reactive({ password: '', confirm: '' })
const profileLoading = ref(false)
const passwordLoading = ref(false)
const profileMessage = ref('')
const profileError = ref('')
const passwordMessage = ref('')
const passwordError = ref('')

watch(metadata, (currentMetadata) => {
  form.displayName = currentMetadata.display_name ?? ''
  form.headline = currentMetadata.headline ?? ''
  form.bio = currentMetadata.bio ?? ''
  form.accent = currentMetadata.accent ?? 'ink'
  form.density = currentMetadata.density ?? 'balanced'
}, { immediate: true })

const selectedAccent = computed(() => accents.find((accent) => accent.name === form.accent) ?? accents[0])
const initials = computed(() => {
  const label = form.displayName || user.value?.email || 'AR'
  return label
    .split(/[ @._-]/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('')
})

const saveProfile = async () => {
  profileLoading.value = true
  profileMessage.value = ''
  profileError.value = ''

  const { error } = await supabase.auth.updateUser({
    data: {
      display_name: form.displayName.trim(),
      headline: form.headline.trim(),
      bio: form.bio.trim(),
      accent: form.accent,
      density: form.density
    }
  })

  profileLoading.value = false

  if (error) {
    profileError.value = error.message
  } else {
    profileMessage.value = 'Profile updated successfully.'
  }
}

const changePassword = async () => {
  passwordMessage.value = ''
  passwordError.value = ''

  if (passwordForm.password.length < 6) {
    passwordError.value = 'Password must be at least six characters.'
    return
  }

  if (passwordForm.password !== passwordForm.confirm) {
    passwordError.value = 'Password confirmation does not match.'
    return
  }

  passwordLoading.value = true
  const { error } = await supabase.auth.updateUser({
    password: passwordForm.password
  })
  passwordLoading.value = false

  if (error) {
    passwordError.value = error.message
  } else {
    passwordForm.password = ''
    passwordForm.confirm = ''
    passwordMessage.value = 'Password updated successfully.'
  }
}
</script>

<style scoped>
.profile-input {
  width: 100%;
  border-radius: 0.5rem;
  border: 1px solid #cbd5e1;
  background: #ffffff;
  padding: 0.85rem 1rem;
  color: #0f172a;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.profile-input:focus {
  border-color: #0f172a;
  box-shadow: 0 0 0 3px rgba(15, 23, 42, 0.08);
}
</style>
