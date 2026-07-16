<template>
  <div class="checkout-page">
    <div class="site-container">
      <!-- Step 1: choose plan + email -->
      <div v-if="step === 'details'" class="checkout-grid">
        <section class="checkout-main fade-in-up">
          <NuxtLink to="/" class="checkout-logo" aria-label="Atlas Report — Home">
            <img src="/images/atlasreport.png" alt="Atlas Report" class="checkout-logo-img" />
          </NuxtLink>

          <p v-if="canceled" class="checkout-canceled" role="alert">
            Your payment was canceled. No charge was made — try again whenever you're ready.
          </p>

          <p class="eyebrow">Atlas Report Premium</p>
          <h1 class="checkout-title">Subscribe to the newsletter</h1>
          <p class="checkout-lead">
            Get exclusive briefs, deeper analysis, and the full intelligence feed delivered to your inbox.
            Cancel anytime.
          </p>

          <fieldset class="plan-group">
            <legend class="sr-only">Choose a plan</legend>

            <label
              v-for="p in plans"
              :key="p.id"
              class="plan-card"
              :class="{ 'plan-card-selected': selectedPlan === p.id }"
            >
              <input
                v-model="selectedPlan"
                type="radio"
                name="plan"
                :value="p.id"
                class="plan-radio"
              />
              <span class="plan-radio-dot" aria-hidden="true"></span>
              <span class="plan-info">
                <span class="plan-name">{{ p.name }}</span>
                <span class="plan-desc">{{ p.desc }}</span>
              </span>
              <span class="plan-price">
                <span class="plan-amount">{{ p.price }}</span>
                <span class="plan-period">{{ p.period }}</span>
              </span>
            </label>
          </fieldset>

          <div class="field">
            <label for="email" class="field-label">Email address</label>
            <input
              id="email"
              v-model="email"
              type="email"
              required
              placeholder="your@email.com"
              autocomplete="email"
              class="form-input"
              :class="{ 'form-input-error': emailTouched && !validEmail }"
              @blur="emailTouched = true"
            />
            <p v-if="emailTouched && !validEmail" class="field-error">
              Please enter a valid email address.
            </p>
          </div>

          <button
            type="button"
            class="btn-pay"
            :disabled="!validEmail || loading"
            @click="startCheckout"
          >
            <span v-if="loading" class="spinner" aria-hidden="true"></span>
            {{ loading ? 'Preparing secure payment…' : `Continue to payment — ${selectedPlanPrice}` }}
          </button>

          <p v-if="error" class="checkout-error" role="alert">{{ error }}</p>

          <p class="checkout-secure">
            <Lock class="checkout-secure-icon" />
            Secured by Stripe. Your card details are entered on Stripe's PCI-compliant form.
          </p>
        </section>

        <aside class="checkout-summary fade-in-up stagger-1">
          <h2 class="summary-title">Order summary</h2>
          <div class="summary-row">
            <span>{{ selectedPlanName }}</span>
            <span>{{ selectedPlanPrice }}</span>
          </div>
          <div class="summary-row summary-row-muted">
            <span>Billed {{ selectedPlan === 'yearly' ? 'yearly' : 'monthly' }}</span>
            <span>—</span>
          </div>
          <div class="summary-divider"></div>
          <div class="summary-row summary-total">
            <span>Total due today</span>
            <span>{{ selectedPlanPrice }}</span>
          </div>
          <ul class="summary-perks">
            <li v-for="perk in perks" :key="perk">
              <Check class="perk-icon" /> {{ perk }}
            </li>
          </ul>
        </aside>
      </div>

      <!-- Step 2: on-site Stripe Embedded Checkout -->
      <div v-else class="checkout-pay fade-in-up">
        <NuxtLink to="/" class="checkout-logo checkout-logo-center" aria-label="Atlas Report — Home">
          <img src="/images/atlasreport.png" alt="Atlas Report" class="checkout-logo-img" />
        </NuxtLink>
        <div class="embedded-card">
          <div ref="embeddedEl" id="embedded-checkout"></div>
          <button type="button" class="embedded-back" @click="backToDetails">
            ← Change plan or email
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, onBeforeUnmount } from 'vue'
import { loadStripe } from '@stripe/stripe-js'
import { Lock, Check } from '@lucide/vue'

const config = useRuntimeConfig()
const publishableKey = config.public.stripePublishableKey
const stripePromise = publishableKey && import.meta.client ? loadStripe(publishableKey) : null

const plans = [
  { id: 'monthly', name: 'Monthly', desc: 'Flexible, cancel anytime', price: '$7', period: '/mo' },
  { id: 'yearly', name: 'Annual', desc: 'Best value — 2 months free', price: '$70', period: '/yr' }
]

const perks = [
  'Exclusive premium briefs & analysis',
  'Full intelligence feed in your inbox',
  'Cancel anytime, no questions asked',
  'Ad-free reading experience'
]

const route = useRoute()
const selectedPlan = ref('monthly')
const email = ref(route.query.email ? String(route.query.email) : '')
const emailTouched = ref(false)
const loading = ref(false)
const error = ref('')
const canceled = ref(route.query.canceled === 'true')
const step = ref('details')
const embeddedEl = ref(null)
let embeddedCheckout = null

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const validEmail = computed(() => emailRegex.test(email.value.trim()))

const selectedPlanMeta = computed(() => plans.find(p => p.id === selectedPlan.value) || plans[0])
const selectedPlanName = computed(() => `Atlas Report Premium — ${selectedPlanMeta.value.name}`)
const selectedPlanPrice = computed(() => selectedPlanMeta.value.price + selectedPlanMeta.value.period)

const mountEmbedded = async (clientSecret) => {
  if (embeddedCheckout) {
    embeddedCheckout.destroy()
    embeddedCheckout = null
  }
  const stripe = await stripePromise
  embeddedCheckout = await stripe.initEmbeddedCheckout({
    clientSecret,
    onComplete: () => { window.location.href = '/?subscribed=success' }
  })
  embeddedCheckout.mount(embeddedEl.value)
}

const startCheckout = async () => {
  error.value = ''
  if (!validEmail.value) {
    emailTouched.value = true
    return
  }
  if (!stripePromise) {
    error.value = 'Stripe is not configured. Please contact support.'
    return
  }
  if (loading.value) return
  loading.value = true
  try {
    const res = await fetch('/api/newsletter-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value.trim(), plan: selectedPlan.value })
    })
    const data = await res.json()
    if (!res.ok || !data.clientSecret) {
      throw new Error(data?.statusMessage || data?.error || 'Could not start checkout.')
    }
    step.value = 'pay'
    await nextTick()
    await mountEmbedded(data.clientSecret)
  } catch (e) {
    error.value = e?.message || 'Something went wrong. Please try again.'
    step.value = 'details'
  } finally {
    loading.value = false
  }
}

const backToDetails = () => {
  if (embeddedCheckout) {
    embeddedCheckout.destroy()
    embeddedCheckout = null
  }
  step.value = 'details'
}

onBeforeUnmount(() => {
  if (embeddedCheckout) {
    embeddedCheckout.destroy()
    embeddedCheckout = null
  }
})

useHead({
  title: 'Subscribe — Atlas Report Premium Newsletter'
})

useSeoMeta({
  description: 'Subscribe to the Atlas Report premium newsletter for exclusive briefs and analysis.'
})
</script>

<style scoped>
.checkout-page {
  padding: 2.5rem 0;
  min-height: calc(100vh - 88px);
}

.checkout-grid {
  max-width: 940px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 2rem;
  align-items: start;
}

.checkout-main {
  border: 1px solid var(--color-border);
  border-top: 3px solid var(--color-accent);
  border-radius: var(--radius-xl);
  background: var(--color-card-bg);
  box-shadow: var(--shadow-xs);
  padding: 2.25rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.checkout-logo { display: inline-flex; width: fit-content; }
.checkout-logo-img { width: 116px; height: auto; object-fit: contain; }

.eyebrow {
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-accent);
  margin: 0;
}

.checkout-title {
  font-family: var(--font-serif);
  font-size: clamp(1.6rem, 3vw, 2rem);
  line-height: 1.15;
  margin: 0.15rem 0 0;
  color: var(--color-text);
}

.checkout-lead {
  font-size: 1rem;
  line-height: 1.65;
  color: var(--color-text-secondary);
  margin: 0;
}

.plan-group {
  border: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 0.75rem;
}

.plan-card {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 1rem 1.1rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-card-bg);
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s, box-shadow 0.15s;
}

.plan-card:hover { background: var(--color-card-hover); }

.plan-card-selected {
  border-color: var(--color-accent);
  background: var(--color-accent-subtle);
  box-shadow: 0 0 0 1px var(--color-accent);
}

.plan-radio { position: absolute; opacity: 0; pointer-events: none; }

.plan-radio-dot {
  width: 1.15rem;
  height: 1.15rem;
  border-radius: 50%;
  border: 2px solid var(--color-border-strong);
  flex: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.15s;
}

.plan-radio-dot::after {
  content: '';
  width: 0.55rem;
  height: 0.55rem;
  border-radius: 50%;
  background: var(--color-accent);
  transform: scale(0);
  transition: transform 0.15s;
}

.plan-card-selected .plan-radio-dot {
  border-color: var(--color-accent);
}
.plan-card-selected .plan-radio-dot::after { transform: scale(1); }

.plan-info { display: flex; flex-direction: column; gap: 0.1rem; flex: 1; }
.plan-name { font-weight: 700; color: var(--color-text); }
.plan-desc { font-size: 0.8125rem; color: var(--color-text-secondary); }

.plan-price { display: flex; align-items: baseline; gap: 0.15rem; }
.plan-amount { font-weight: 800; font-size: 1.05rem; color: var(--color-text); }
.plan-period { font-size: 0.8125rem; color: var(--color-text-muted); }

.field { display: flex; flex-direction: column; gap: 0.4rem; }
.field-label { font-size: 0.8125rem; font-weight: 700; color: var(--color-text); }
.field-error { font-size: 0.8125rem; color: var(--color-error); margin: 0; }

.form-input {
  width: 100%;
  padding: 0.7rem 0.85rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-bg-elevated);
  color: var(--color-text);
  font-size: 0.95rem;
  font-family: inherit;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.form-input:focus {
  outline: none;
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px var(--color-accent-ring);
}
.form-input-error { border-color: var(--color-error); }

.btn-pay {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  width: 100%;
  padding: 0.9rem 1.25rem;
  border: none;
  border-radius: var(--radius-md);
  background: var(--color-accent);
  color: var(--color-accent-contrast);
  font-weight: 800;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.15s, transform 0.05s;
}
.btn-pay:hover:not(:disabled) { background: var(--color-accent-hover); }
.btn-pay:active:not(:disabled) { transform: translateY(1px); }
.btn-pay:disabled { background: var(--color-accent-disabled); cursor: not-allowed; }

.spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.checkout-error {
  font-size: 0.875rem;
  color: var(--color-error-contrast);
  background: var(--color-error);
  border-radius: var(--radius-md);
  padding: 0.6rem 0.85rem;
  margin: 0;
}

.checkout-secure {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.8125rem;
  color: var(--color-text-muted);
  margin: 0;
}
.checkout-secure-icon { width: 15px; height: 15px; flex: none; }

.checkout-canceled {
  font-size: 0.875rem;
  color: var(--color-warning-contrast);
  background: var(--color-warning);
  border-radius: var(--radius-md);
  padding: 0.6rem 0.85rem;
  margin: 0;
}

.checkout-summary {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  background: var(--color-card-bg);
  box-shadow: var(--shadow-xs);
  padding: 1.5rem;
  position: sticky;
  top: 104px;
}

.summary-title {
  font-size: 1rem;
  font-weight: 800;
  color: var(--color-text);
  margin: 0 0 1rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 1rem;
  font-size: 0.9375rem;
  color: var(--color-text);
  margin-bottom: 0.6rem;
}
.summary-row-muted { color: var(--color-text-muted); font-size: 0.8125rem; }

.summary-divider {
  height: 1px;
  background: var(--color-border);
  margin: 0.85rem 0;
}

.summary-total {
  font-weight: 800;
  font-size: 1.05rem;
  color: var(--color-text);
  margin-bottom: 1.1rem;
}

.summary-perks {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 0.6rem;
}
.summary-perks li {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--color-text-secondary);
}
.perk-icon {
  width: 16px;
  height: 16px;
  flex: none;
  color: var(--color-success);
  margin-top: 1px;
}

/* Step 2: on-site embedded checkout */
.checkout-pay {
  max-width: 720px;
  margin: 0 auto;
}

.checkout-logo-center { margin: 0 auto 1.5rem; }

.embedded-card {
  border: 1px solid var(--color-border);
  border-top: 3px solid var(--color-accent);
  border-radius: var(--radius-xl);
  background: var(--color-card-bg);
  box-shadow: var(--shadow-xs);
  padding: 1.5rem;
}

.embedded-back {
  margin-top: 1rem;
  background: none;
  border: none;
  color: var(--color-accent);
  font-size: 0.8125rem;
  font-weight: 700;
  cursor: pointer;
  padding: 0.25rem 0;
}
.embedded-back:hover { text-decoration: underline; }

.sr-only {
  position: absolute;
  width: 1px; height: 1px;
  padding: 0; margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@media (max-width: 760px) {
  .checkout-grid { grid-template-columns: 1fr; }
  .checkout-summary { position: static; order: -1; }
  .checkout-main { padding: 1.5rem; }
}
</style>
