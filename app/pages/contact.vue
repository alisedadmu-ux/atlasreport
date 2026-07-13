<template>
  <div class="contact-page">
    <div class="site-container">
      <div class="contact-card">
        <p class="eyebrow">Contact</p>
        <h1 class="contact-title">Get in touch</h1>
        <p class="contact-lead">Have inquiries or feedback? Reach our direct desk below.</p>

        <div v-if="submitted" class="success-banner" role="status">
          Message received. Our team will review your dispatch shortly.
        </div>

        <form @submit.prevent="handleSubmit" class="contact-form">
          <div class="form-row">
            <div class="form-group">
              <label for="name" class="form-label">Your name</label>
              <input id="name" v-model="form.name" type="text" class="form-input" placeholder="John Doe" required />
            </div>
            <div class="form-group">
              <label for="email" class="form-label">Email address</label>
              <input id="email" v-model="form.email" type="email" class="form-input" placeholder="name@example.com" required />
            </div>
          </div>

          <div class="form-group">
            <label for="message" class="form-label">Message</label>
            <textarea id="message" v-model="form.message" rows="5" class="form-input form-textarea" placeholder="Type your message here..." required />
          </div>

          <button type="submit" :disabled="loading" class="btn btn-primary">
            {{ loading ? 'Sending…' : 'Submit message' }}
          </button>
        </form>

        <p v-if="error" class="form-error">{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const supabase = useSupabaseClient()

const form = ref({ name: '', email: '', message: '' })
const submitted = ref(false)
const loading = ref(false)
const error = ref('')

const handleSubmit = async () => {
  submitted.value = false
  error.value = ''
  loading.value = true
  try {
    const { error: supabaseError } = await supabase
      .from('contacts')
      .insert({ name: form.value.name, email: form.value.email, message: form.value.message })
    if (supabaseError) {
      if (supabaseError.message?.includes('relation') || supabaseError.code === '42P01') {
        error.value = 'The contact form is not yet configured. Please email us directly.'
      } else {
        error.value = 'A server error occurred. Please try again later.'
      }
      loading.value = false
      return
    }
    submitted.value = true
    form.value = { name: '', email: '', message: '' }
  } catch (e) {
    error.value = 'An unexpected error occurred. Please try again later.'
  }
  loading.value = false
}
</script>

<style scoped>
.contact-page {
  padding: 2rem 0;
}

.contact-card {
  max-width: 600px;
  margin: 0 auto;
  padding: 2.25rem;
  border: 1px solid var(--color-border);
  border-top: 3px solid var(--color-accent);
  background: var(--color-card-bg);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-base);
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.contact-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(1.5rem, 3vw, 2.25rem);
  margin: 0.3rem 0 0;
}

.contact-lead {
  font-size: 0.9375rem;
  color: var(--color-text-secondary);
  line-height: 1.65;
}

.success-banner {
  padding: 0.85rem 1.15rem;
  border-radius: var(--radius-base);
  background: rgba(16, 185, 129, 0.08);
  color: var(--color-success);
  border: 1px solid rgba(16, 185, 129, 0.18);
  font-size: 0.875rem;
  font-weight: 700;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-top: 1.25rem;
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

.form-error {
  font-size: 0.8125rem;
  color: var(--color-error);
  font-weight: 700;
}

@media (max-width: 640px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
