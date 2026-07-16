<template>
  <div class="donate-page">
    <div class="site-container">
      <!-- Step 1: choose amount -->
      <div v-if="step === 'details'" class="donate-grid">
        <section class="donate-main fade-in-up">
          <NuxtLink to="/" class="donate-logo" aria-label="Atlas Report — Home">
            <img src="/images/atlasreport.png" alt="Atlas Report" class="donate-logo-img" />
          </NuxtLink>

          <p class="eyebrow">Support independent journalism</p>
          <h1 class="donate-title">Make a donation</h1>
          <p class="donate-lead">
            Your contribution keeps verified, ad-free reporting free for everyone. Every amount helps.
          </p>

          <div class="donate-amounts">
            <button
              v-for="amt in presetAmounts"
              :key="amt"
              type="button"
              class="donate-chip"
              :class="{ 'donate-chip-active': selectedAmount === amt && !customMode }"
              @click="setPreset(amt)"
            >
              ${{ amt }}
            </button>
            <button
              type="button"
              class="donate-chip"
              :class="{ 'donate-chip-active': customMode }"
              @click="enableCustom"
            >
              Custom
            </button>
          </div>

          <input
            v-if="customMode"
            v-model="customAmount"
            type="number"
            min="1"
            step="1"
            inputmode="numeric"
            placeholder="Amount (USD)"
            class="form-input"
            :class="{ 'form-input-error': customTouched && !validAmount }"
            @blur="customTouched = true"
            aria-label="Custom donation amount"
          />

          <div class="field">
            <label for="donate-email" class="field-label">Email (optional, for receipt)</label>
            <input
              id="donate-email"
              v-model="donorEmail"
              type="email"
              placeholder="your@email.com"
              autocomplete="email"
              class="form-input"
              aria-label="Email for receipt"
            />
          </div>

          <p v-if="customTouched && !validAmount" class="field-error">
            Enter a valid amount (min $1, max $100,000).
          </p>

          <button
            type="button"
            class="btn-pay"
            :disabled="!validAmount || loading"
            @click="startDonate"
          >
            <span v-if="loading" class="spinner" aria-hidden="true"></span>
            {{ loading ? 'Preparing secure payment…' : `Donate ${displayAmount}` }}
          </button>

          <p v-if="error" class="donate-error" role="alert">{{ error }}</p>

          <p class="donate-secure">
            <Lock class="donate-secure-icon" />
            Secured by Stripe. Your card details are entered on Stripe's PCI-compliant form.
          </p>
        </section>

        <aside class="donate-summary fade-in-up stagger-1">
          <h2 class="summary-title">Your donation</h2>
          <div class="summary-row">
            <span>Amount</span>
            <span>{{ displayAmount }}</span>
          </div>
          <div class="summary-row summary-row-muted">
            <span>One-time</span>
            <span>—</span>
          </div>
          <div class="summary-divider"></div>
          <div class="summary-row summary-total">
            <span>Total due today</span>
            <span>{{ displayAmount }}</span>
          </div>
          <ul class="summary-perks">
            <li v-for="perk in perks" :key="perk">
              <Heart class="perk-icon" /> {{ perk }}
            </li>
          </ul>
        </aside>
      </div>

      <!-- Step 2: on-site Stripe Embedded Checkout -->
      <div v-else class="donate-pay fade-in-up">
        <NuxtLink to="/" class="donate-logo donate-logo-center" aria-label="Atlas Report — Home">
          <img src="/images/atlasreport.png" alt="Atlas Report" class="donate-logo-img" />
        </NuxtLink>
        <div class="embedded-card">
          <div ref="embeddedEl" id="embedded-checkout"></div>
          <button type="button" class="embedded-back" @click="backToDetails">
            ← Change amount or email
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, onBeforeUnmount } from 'vue'
import { loadStripe } from '@stripe/stripe-js'
import { Lock, Heart } from '@lucide/vue'

const config = useRuntimeConfig()
const publishableKey = config.public.stripePublishableKey
const stripePromise = publishableKey && import.meta.client ? loadStripe(publishableKey) : null

const presetAmounts = [5, 10, 25]
const perks = [
  'Funds independent, verified reporting',
  'Keeps our feed free for all readers',
  'No ads, no paywalls — just the news',
  'Tax-deductible where applicable'
]

const route = useRoute()
const selectedAmount = ref(Number(route.query.amount) || 10)
const customMode = ref(false)
const customAmount = ref('')
const customTouched = ref(false)
const donorEmail = ref(route.query.email ? String(route.query.email) : '')
const loading = ref(false)
const error = ref('')
const step = ref('details')
const embeddedEl = ref(null)
let embeddedCheckout = null

const validAmount = computed(() => {
  if (customMode.value) {
    const n = Number(customAmount.value)
    return Number.isFinite(n) && n >= 1 && n <= 100000
  }
  return selectedAmount.value >= 1
})

const displayAmount = computed(() => {
  const n = customMode.value ? Number(customAmount.value) : selectedAmount.value
  return Number.isFinite(n) && n > 0 ? `$${n}` : ''
})

const setPreset = (amt) => {
  selectedAmount.value = amt
  customMode.value = false
  error.value = ''
}

const enableCustom = () => {
  customMode.value = true
  error.value = ''
}

const mountEmbedded = async (clientSecret) => {
  if (embeddedCheckout) {
    embeddedCheckout.destroy()
    embeddedCheckout = null
  }
  const stripe = await stripePromise
  embeddedCheckout = await stripe.initEmbeddedCheckout({
    clientSecret,
    onComplete: () => { window.location.href = '/?donated=success' }
  })
  embeddedCheckout.mount(embeddedEl.value)
}

const startDonate = async () => {
  error.value = ''
  if (customMode.value) customTouched.value = true
  if (!validAmount.value) return
  if (!stripePromise) {
    error.value = 'Stripe is not configured. Please contact support.'
    return
  }
  if (loading.value) return
  const amount = customMode.value ? Number(customAmount.value) : selectedAmount.value
  loading.value = true
  try {
    const res = await fetch('/api/newsletter-donate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, email: donorEmail.value.trim() || undefined })
    })
    const data = await res.json()
    if (!res.ok || !data.clientSecret) {
      throw new Error(data?.statusMessage || data?.error || 'Could not start donation.')
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

useHead({ title: 'Donate — Atlas Report' })

useSeoMeta({
  description: 'Support independent, verified journalism with a donation to Atlas Report.'
})
</script>

<style scoped>
.donate-page {
  padding: 2.5rem 0;
  min-height: calc(100vh - 88px);
}

.donate-grid {
  max-width: 940px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 2rem;
  align-items: start;
}

.donate-main {
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

.donate-logo { display: inline-flex; width: fit-content; }
.donate-logo-img { width: 116px; height: auto; object-fit: contain; }

.eyebrow {
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-accent);
  margin: 0;
}

.donate-title {
  font-family: var(--font-serif);
  font-size: clamp(1.6rem, 3vw, 2rem);
  line-height: 1.15;
  margin: 0.15rem 0 0;
  color: var(--color-text);
}

.donate-lead {
  font-size: 1rem;
  line-height: 1.65;
  color: var(--color-text-secondary);
  margin: 0;
}

.donate-amounts {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}

.donate-chip {
  flex: 1 1 auto;
  min-width: 64px;
  padding: 0.7rem 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-card-bg);
  color: var(--color-text-secondary);
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s, color 0.15s;
}

.donate-chip:hover { border-color: var(--color-accent); color: var(--color-accent); }

.donate-chip-active {
  border-color: var(--color-accent);
  background: var(--color-accent-subtle);
  color: var(--color-accent);
}

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

.donate-error {
  font-size: 0.875rem;
  color: var(--color-error-contrast);
  background: var(--color-error);
  border-radius: var(--radius-md);
  padding: 0.6rem 0.85rem;
  margin: 0;
}

.donate-secure {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.8125rem;
  color: var(--color-text-muted);
  margin: 0;
}
.donate-secure-icon { width: 15px; height: 15px; flex: none; }

.donate-summary {
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
.donate-pay {
  max-width: 720px;
  margin: 0 auto;
}

.donate-logo-center { margin: 0 auto 1.5rem; }

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

@media (max-width: 760px) {
  .donate-grid { grid-template-columns: 1fr; }
  .donate-summary { position: static; order: -1; }
  .donate-main { padding: 1.5rem; }
}
</style>
