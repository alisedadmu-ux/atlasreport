<template>
  <div class="profile-page">
    <div class="site-container">
      <!-- Sidebar -->
      <aside class="profile-sidebar">
        <div class="profile-card profile-identity">
          <div class="identity-accent-bar" :style="{ background: selectedAccent.hex }"></div>
          <div class="identity-avatar" :style="{ background: selectedAccent.hex }">
            {{ initials }}
          </div>
          <div class="identity-body">
            <p class="identity-name">{{ form.displayName || 'Atlas Reader' }}</p>
            <p class="identity-email">{{ user?.email }}</p>
            <p v-if="form.headline" class="identity-headline">{{ form.headline }}</p>
          </div>
        </div>

        <NuxtLink to="/" class="btn btn-secondary w-full">Back to home</NuxtLink>

        <NuxtLink
          v-if="user?.email === 'alisedadmu@gmail.com'"
          to="/admin/newsletter"
          class="btn btn-secondary w-full"
        >
          Newsletter Management
        </NuxtLink>
      </aside>

      <!-- Main Content -->
      <section class="profile-main">
        <div class="profile-header">
          <p class="eyebrow">Profile settings</p>
          <h1 class="profile-title">Customize your account</h1>
          <p class="profile-subtitle">Change how your profile looks, update your reader details, and set a new password when needed.</p>
        </div>

        <div v-if="profileMessage" class="success-banner" role="status">
          {{ profileMessage }}
        </div>

        <div class="profile-forms">
          <!-- Public Profile -->
          <div class="profile-card">
            <h2 class="form-group-title">Public profile</h2>
            <p class="form-group-desc">This information will be visible to other community members.</p>
            <form @submit.prevent="saveProfile" class="profile-form">
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label" for="displayName">Display name</label>
                  <input id="displayName" v-model="form.displayName" class="form-input" type="text" placeholder="Your newsroom name" />
                </div>
                <div class="form-group">
                  <label class="form-label" for="headline">Headline</label>
                  <input id="headline" v-model="form.headline" class="form-input" type="text" placeholder="Science editor, reader, analyst..." />
                </div>
              </div>

              <div class="form-group">
                <label class="form-label" for="bio">Bio</label>
                <textarea id="bio" v-model="form.bio" class="form-input form-textarea" placeholder="Write a short profile bio" rows="4" />
              </div>

              <div class="form-group">
                <p class="form-label">Profile accent</p>
                <div class="accent-grid">
                  <button
                    v-for="accent in accents"
                    :key="accent.name"
                    type="button"
                    :class="['accent-btn', { 'accent-btn-active': form.accent === accent.name }]"
                    @click="form.accent = accent.name"
                  >
                    <span class="accent-swatch" :style="{ background: accent.hex }"></span>
                    <span>{{ accent.label }}</span>
                  </button>
                </div>
              </div>

              <div class="form-group">
                <p class="form-label">View density</p>
                <div class="density-grid">
                  <button
                    v-for="density in densities"
                    :key="density"
                    type="button"
                    :class="['density-btn', { 'density-btn-active': form.density === density }]"
                    @click="form.density = density"
                  >
                    {{ density }}
                  </button>
                </div>
              </div>

              <div class="form-footer">
                <button type="submit" :disabled="profileLoading" class="btn btn-primary">
                  {{ profileLoading ? 'Saving...' : 'Save profile' }}
                </button>
                <p v-if="profileError" class="form-error">{{ profileError }}</p>
              </div>
            </form>
          </div>

          <!-- Divider between major sections -->
          <div class="section-divider" aria-hidden="true"></div>

          <!-- Change Password -->
          <div class="profile-card">
            <h2 class="form-group-title">Change password</h2>
            <p class="form-group-desc">Choose a new password with at least six characters.</p>
            <form @submit.prevent="changePassword" class="profile-form">
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label" for="newPassword">New password</label>
                  <input id="newPassword" v-model="passwordForm.password" class="form-input" type="password" autocomplete="new-password" placeholder="New password" />
                </div>
                <div class="form-group">
                  <label class="form-label" for="confirmPassword">Confirm password</label>
                  <input id="confirmPassword" v-model="passwordForm.confirm" class="form-input" type="password" autocomplete="new-password" placeholder="Confirm password" />
                </div>
              </div>

              <div class="form-footer">
                <button type="submit" :disabled="passwordLoading" class="btn btn-primary">
                  {{ passwordLoading ? 'Updating...' : 'Update password' }}
                </button>
                <p v-if="passwordMessage" class="form-success">{{ passwordMessage }}</p>
                <p v-if="passwordError" class="form-error">{{ passwordError }}</p>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch, onMounted } from 'vue'
import { getInitials } from '~/utils/format'

const supabase = useSupabaseClient()
const user = useSupabaseUser()

onMounted(async () => {
  const { data: { user: currentUser } } = await supabase.auth.getUser()
  if (!currentUser) await navigateTo('/auth')
})

const accents = [
  { name: 'ink', label: 'Ink', hex: '#1E3A5F' },
  { name: 'crimson', label: 'Crimson', hex: '#B23A2E' },
  { name: 'green', label: 'Green', hex: '#2E7D5B' },
  { name: 'gold', label: 'Gold', hex: '#94651E' }
]
const densities = ['compact', 'balanced', 'spacious']

const metadata = computed(() => user.value?.user_metadata ?? {})
const form = reactive({ displayName: '', headline: '', bio: '', accent: 'ink', density: 'balanced' })
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
const initials = computed(() => getInitials(form.displayName || user.value?.email))

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
  if (error) { profileError.value = error.message } else { profileMessage.value = 'Profile updated successfully.' }
}

const changePassword = async () => {
  passwordMessage.value = ''
  passwordError.value = ''
  if (passwordForm.password.length < 6) { passwordError.value = 'Password must be at least six characters.'; return }
  if (passwordForm.password !== passwordForm.confirm) { passwordError.value = 'Password confirmation does not match.'; return }
  passwordLoading.value = true
  const { error } = await supabase.auth.updateUser({ password: passwordForm.password })
  passwordLoading.value = false
  if (error) { passwordError.value = error.message } else {
    passwordForm.password = ''
    passwordForm.confirm = ''
    passwordMessage.value = 'Password updated successfully.'
  }
}
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  padding: 2rem 0;
}

.profile-page .site-container {
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr);
  gap: 2.5rem;
  align-items: start;
}

.profile-sidebar {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  position: sticky;
  top: 88px;
}

.profile-card {
  border: 1px solid var(--color-border);
  background: var(--color-card-bg);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xs);
  overflow: hidden;
}

.profile-identity {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.85rem;
  padding: 1.5rem;
  padding-left: 1.75rem;
}

.identity-accent-bar {
  position: absolute;
  left: 0;
  top: 0.75rem;
  bottom: 0.75rem;
  width: 4px;
  border-radius: 0 4px 4px 0;
}

.identity-avatar {
  width: 4.5rem;
  height: 4.5rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;
  font-weight: 800;
  flex-shrink: 0;
  transition: transform 0.25s ease;
}

.profile-identity:hover .identity-avatar {
  transform: scale(1.05);
}

.identity-body {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.identity-name {
  font-size: 1.125rem;
  font-weight: 800;
  color: var(--color-text);
}

.identity-email {
  font-size: 0.8125rem;
  color: var(--color-text-muted);
}

.identity-headline {
  font-size: 0.8125rem;
  color: var(--color-text-secondary);
  max-width: 18ch;
  overflow: hidden;
  text-overflow: ellipsis;
}

.profile-main {
  min-width: 0;
}

.profile-header {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  margin-bottom: 1.75rem;
  padding-bottom: 1.15rem;
  border-bottom: 1px solid var(--color-border);
}

.profile-title {
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-family: var(--font-serif);
  font-weight: 800;
}

.profile-subtitle {
  font-size: 0.9375rem;
  color: var(--color-text-secondary);
  line-height: 1.65;
  max-width: 640px;
}

.success-banner {
  padding: 0.85rem 1.15rem;
  border-radius: var(--radius-base);
  background: rgba(16, 185, 129, 0.08);
  color: var(--color-success);
  border: 1px solid rgba(16, 185, 129, 0.18);
  font-size: 0.875rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
}

.profile-forms {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.profile-card {
  padding: 1.75rem;
}

.form-group-title {
  font-size: 1.0625rem;
  font-weight: 800;
  color: var(--color-text);
  margin-bottom: 0.35rem;
}

.form-group-desc {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  margin-bottom: 1.35rem;
}

.profile-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.section-divider {
  height: 1px;
  background: var(--color-border);
  margin: 0.5rem 0;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.form-label {
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--color-text);
  display: block;
}

.form-input {
  width: 100%;
  font-family: inherit;
  font-size: 0.9375rem;
  color: var(--color-text);
  background: var(--color-input-bg);
  border: 1px solid var(--color-input-border);
  border-radius: var(--radius-sm);
  padding: 0.7rem 1rem;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.form-input::placeholder { color: var(--color-text-muted); }

.form-input:focus {
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px var(--color-accent-ring);
}

.form-textarea {
  resize: vertical;
  min-height: 6rem;
}

.accent-grid,
.density-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.accent-btn,
.density-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.55rem 0.9rem;
  border-radius: var(--radius-sm);
  border: 1.5px solid var(--color-border);
  background: var(--color-card-bg);
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--color-text-secondary);
  cursor: pointer;
  box-shadow: var(--shadow-xs);
  transition: all 0.2s ease;
}

.accent-btn:hover,
.density-btn:hover {
  border-color: var(--color-border-strong);
  color: var(--color-text);
  box-shadow: var(--shadow-sm);
}

.accent-btn-active,
.density-btn-active {
  border-color: var(--color-accent);
  color: var(--color-accent);
  background: var(--color-accent-subtle);
  box-shadow: 0 0 0 1px var(--color-accent);
}

.accent-swatch {
  width: 0.875rem;
  height: 0.875rem;
  border-radius: 0.25rem;
  display: inline-block;
}

.form-footer {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  flex-wrap: wrap;
  padding-top: 0.5rem;
}

.form-error {
  font-size: 0.8125rem;
  color: var(--color-error);
  font-weight: 700;
}

.form-success {
  font-size: 0.8125rem;
  color: var(--color-success);
  font-weight: 700;
}

@media (max-width: 1024px) {
  .profile-page .site-container {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .profile-sidebar {
    position: static;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.85rem;
  }
}

@media (max-width: 640px) {
  .profile-page {
    padding: 1rem 0;
  }

  .profile-page .site-container {
    padding: 0 1rem;
  }

  .profile-sidebar {
    grid-template-columns: 1fr;
  }

  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
