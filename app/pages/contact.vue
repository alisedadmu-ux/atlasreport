<template>
  <div class="news-app-container">
    
    <aside class="category-sidebar">
      <div class="sidebar-header">
        <span class="pulse-icon">🔴</span> liveNews
      </div>
      <nav class="category-list">
        <NuxtLink to="/" class="nav-btn">📰 Home Dashboard</NuxtLink>
        <NuxtLink to="/about" class="nav-btn">ℹ️ About Platform</NuxtLink>
        <NuxtLink to="/contact" class="nav-btn active">📞 Contact Support</NuxtLink>
      </nav>
    </aside>

    <main class="main-content">
      <header class="dashboard-header">
        <h1>Contact Support</h1>
        <p class="subtitle">Have feedback or need help? Send us a direct message below.</p>
      </header>

      <div class="form-card">
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
            <textarea id="message" v-model="form.message" rows="6" placeholder="Type your feedback or question here..." required></textarea>
          </div>

          <button type="submit" class="submit-btn">Send Message ➔</button>
        </form>
        <p v-if="submitted" class="success-msg">✅ Thank you! Your message has been sent successfully.</p>
      </div>
    </main>

  </div>
</template>

<script setup>
import { ref } from 'vue'

const form = ref({
  name: '',
  email: '',
  message: ''
})
const submitted = ref(false)

const handleSubmit = () => {
  submitted.value = true
  form.value = { name: '', email: '', message: '' }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.news-app-container {
  display: flex;
  background-color: #f8fafc;
  font-family: 'Plus Jakarta Sans', sans-serif;
  min-height: 100vh;
  color: #0f172a;
}

.category-sidebar {
  width: 280px;
  background-color: #ffffff;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 0;
  height: 100vh;
}

.sidebar-header {
  font-size: 1.5rem;
  font-weight: 800;
  padding: 2rem 1.5rem;
  color: #1e40af;
  border-bottom: 1px solid #f1f5f9;
}
.pulse-icon { font-size: 1rem; }

.category-list {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.nav-btn {
  display: block;
  text-decoration: none;
  padding: 0.85rem 1rem;
  border-radius: 10px;
  font-weight: 600;
  color: #475569;
  font-size: 0.95rem;
  transition: all 0.2s ease;
}
.nav-btn:hover { background-color: #f1f5f9; }
.nav-btn.active { background-color: #e0f2fe; color: #0369a1; }

.main-content {
  flex: 1;
  padding: 3rem;
  overflow-y: auto;
}

/* 🛠️ FIXED LACK OF BRACES HERE */
.dashboard-header { 
  margin-bottom: 2.5rem; 
}

.dashboard-header h1 { font-size: 2.5rem; font-weight: 800; letter-spacing: -1px; }
.subtitle { color: #64748b; font-size: 1.1rem; margin-top: 0.25rem; }

.form-card {
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 2.5rem;
  max-width: 600px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.form-group {
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: 0.9rem;
  font-weight: 700;
  color: #334155;
}

.form-group input, .form-group textarea {
  font-family: inherit;
  padding: 0.75rem 1rem;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 1rem;
  color: #0f172a;
}
.form-group input:focus, .form-group textarea:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.submit-btn {
  font-family: inherit;
  background-color: #0f172a;
  color: #ffffff;
  border: none;
  padding: 0.85rem 1.5rem;
  border-radius: 10px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
  width: 100%;
}
.submit-btn:hover { background-color: #1e293b; }

.success-msg {
  margin-top: 1.5rem;
  color: #16a34a;
  font-weight: 600;
  text-align: center;
}
</style>