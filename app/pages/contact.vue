<template>
  <div class="news-portal-container" :style="{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }">
    <main class="portal-layout">
      <div class="editorial-card" :style="{ background: 'var(--color-card-bg)', borderColor: 'var(--color-border)' }">
        <span class="section-badge">CORRESPONDENCE</span>
        <h1 class="page-title">Contact Support</h1>
    <p class="lead-text" :style="{ color: 'var(--color-text-secondary)' }">Have inquiries or operational feedback? Reach our direct desk below.</p>
        
        <form @submit.prevent="handleSubmit" class="contact-form">
          <div class="form-group">
            <label for="name">Your Name</label>
            <input type="text" id="name" v-model="form.name" placeholder="John Doe" required />
          </div>

          <div class="form-group">
            <label for="email">Email Address</label>
            <input type="email" id="email" v-model="form.email" placeholder="name@example.com" required />
          </div>

          <div class="form-group">
            <label for="message">Message</label>
            <textarea id="message" v-model="form.message" rows="5" placeholder="Type your message here..." required></textarea>
          </div>

          <button type="submit" class="submit-btn" :disabled="loading">
            {{ loading ? 'Sending…' : 'Submit Dispatch ➔' }}
          </button>
        </form>
        <p v-if="submitted" class="success-msg">✅ Dispatch received. Our team will review your message shortly.</p>
        <p v-if="error" class="error-msg">⚠️ {{ error }}</p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const form = ref({ name: '', email: '', message: '' })
const submitted = ref(false)
const loading = ref(false)
const error = ref('')
const supabase = useSupabaseClient()

const handleSubmit = async () => {
  submitted.value = false
  error.value = ''
  loading.value = true

  try {
    const { error: supabaseError } = await supabase
      .from('contacts')
      .insert({
        name: form.value.name,
        email: form.value.email,
        message: form.value.message
      })

    if (supabaseError) {
      // If the contacts table doesn't exist, show a friendly fallback
      if (supabaseError.message?.includes('relation') || supabaseError.code === '42P01') {
        error.value = 'The contact form is not yet configured. Please email us directly at team@atlasreport.com.'
      } else {
        error.value = supabaseError.message
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
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700;800&family=Playfair+Display:ital,wght@0,600;0,700&family=Plus+Jakarta+Sans:wght@400;600;700&display=swap');

.news-portal-container {
  background-color: var(--color-bg);
  font-family: 'Plus Jakarta Sans', sans-serif;
  min-height: 100vh;
  color: var(--color-text);
}
.portal-layout {
  padding: 3rem 2rem;
  display: flex;
  justify-content: center;
}
.editorial-card {
  width: 100%;
  max-width: 600px;
  background: #ffffff;
  border: 1px solid #e5e5e5;
  padding: 3rem;
}
.section-badge {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 1px;
  color: #a30000;
}
.page-title {
  font-family: 'Playfair Display', serif;
  font-size: 2.5rem;
  margin: 0.5rem 0 1rem;
  color: var(--color-text);
}
.lead-text {
  color: #555555;
  font-size: 1.05rem;
  margin-bottom: 2rem;
}
.contact-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}
.form-group label {
  font-size: 0.85rem;
  font-weight: 700;
  color: #111111;
}
.form-group input, .form-group textarea {
  font-family: inherit;
  padding: 0.75rem;
  border: 1px solid #cbd5e1;
  background: #fafafa;
  font-size: 0.95rem;
}
.form-group input:focus, .form-group textarea:focus {
  outline: none;
  border-color: #a30000;
  background: #ffffff;
}
.submit-btn {
  font-family: inherit;
  background-color: #111111;
  color: #ffffff;
  border: none;
  padding: 0.85rem;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  transition: background 0.2s;
  margin-top: 0.5rem;
}
.submit-btn:hover {
  background-color: #a30000;
}
.success-msg {
  margin-top: 1.5rem;
  color: #16a34a;
  font-weight: 600;
  text-align: center;
  font-size: 0.95rem;
}
</style>