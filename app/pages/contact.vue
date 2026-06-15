<template>
  <div class="news-portal-container">
    <nav class="portal-nav">
      <div class="primary-nav-links">
        <NuxtLink to="/" class="nav-brand-link">◀ ATLAS REPORT</NuxtLink>
      </div>
      <div class="utility-nav-links">
        <NuxtLink to="/" class="util-link">Home Dashboard</NuxtLink>
        <NuxtLink to="/about" class="util-link">About</NuxtLink>
        <NuxtLink to="/contact" class="util-link active">Contact</NuxtLink>
      </div>
    </nav>

    <main class="portal-layout">
      <div class="editorial-card">
        <span class="section-badge">CORRESPONDENCE</span>
        <h1 class="page-title">Contact Support</h1>
        <p class="lead-text">Have inquiries or operational feedback? Reach our direct desk below.</p>
        
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

          <button type="submit" class="submit-btn">Submit Dispatch ➔</button>
        </form>
        <p v-if="submitted" class="success-msg">✅ Dispatch received. Our team will review your message shortly.</p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'

definePageMeta({
  layout: false
})

const form = ref({ name: '', email: '', message: '' })
const submitted = ref(false)

const handleSubmit = () => {
  submitted.value = true
  form.value = { name: '', email: '', message: '' }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700;800&family=Playfair+Display:ital,wght@0,600;0,700&family=Plus+Jakarta+Sans:wght@400;600;700&display=swap');

.news-portal-container {
  background-color: #fcfbf7;
  font-family: 'Plus Jakarta Sans', sans-serif;
  min-height: 100vh;
  color: #111111;
}
.portal-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e5e5e5;
  margin: 0 2rem;
}
.nav-brand-link {
  font-family: 'Cinzel', serif;
  text-decoration: none;
  color: #a30000;
  font-weight: 800;
  font-size: 1.1rem;
}
.util-link {
  text-decoration: none;
  color: #666666;
  font-size: 0.9rem;
  margin-left: 1.5rem;
  font-weight: 600;
}
.util-link.active {
  color: #a30000;
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