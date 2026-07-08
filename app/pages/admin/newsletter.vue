<template>
  <div class="min-h-screen" style="background-color: var(--color-bg);">
    <div class="max-w-6xl mx-auto px-6 py-8">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold font-serif" :style="{ color: 'var(--color-text)' }">📬 Newsletter Management</h1>
          <p class="text-sm mt-1" :style="{ color: 'var(--color-text-muted)' }">Manage subscribers, send campaigns, and track performance.</p>
        </div>
        <NuxtLink
          to="/profile"
          class="text-sm font-bold px-4 py-2 rounded-lg border transition-all"
          :style="{
            borderColor: 'var(--color-border)',
            color: 'var(--color-text)'
          }"
        >
          ← Back to Profile
        </NuxtLink>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div class="rounded-xl border p-5" :style="{ backgroundColor: 'var(--color-card-bg)', borderColor: 'var(--color-border)' }">
          <p class="text-xs font-bold uppercase tracking-wider" :style="{ color: 'var(--color-text-muted)' }">Total Subscribers</p>
          <p class="text-3xl font-bold mt-1" :style="{ color: 'var(--color-text)' }">{{ stats.total }}</p>
        </div>
        <div class="rounded-xl border p-5" :style="{ backgroundColor: 'var(--color-card-bg)', borderColor: 'var(--color-border)' }">
          <p class="text-xs font-bold uppercase tracking-wider" :style="{ color: 'var(--color-text-muted)' }">Active</p>
          <p class="text-3xl font-bold mt-1 text-emerald-600">{{ stats.active }}</p>
        </div>
        <div class="rounded-xl border p-5" :style="{ backgroundColor: 'var(--color-card-bg)', borderColor: 'var(--color-border)' }">
          <p class="text-xs font-bold uppercase tracking-wider" :style="{ color: 'var(--color-text-muted)' }">Unsubscribed</p>
          <p class="text-3xl font-bold mt-1 text-red-500">{{ stats.inactive }}</p>
        </div>
        <div class="rounded-xl border p-5" :style="{ backgroundColor: 'var(--color-card-bg)', borderColor: 'var(--color-border)' }">
          <p class="text-xs font-bold uppercase tracking-wider" :style="{ color: 'var(--color-text-muted)' }">Campaigns Sent</p>
          <p class="text-3xl font-bold mt-1" :style="{ color: 'var(--color-text)' }">{{ campaigns.length }}</p>
        </div>
      </div>

      <!-- Tabs -->
      <div class="flex gap-1 mb-6 border-b" :style="{ borderColor: 'var(--color-border)' }">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          class="px-5 py-3 text-sm font-bold transition-all rounded-t-lg"
          :style="{
            color: activeTab === tab.id ? 'var(--color-accent)' : 'var(--color-text-muted)',
            borderBottom: activeTab === tab.id ? '2px solid var(--color-accent)' : '2px solid transparent'
          }"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Tab: Compose -->
      <div v-if="activeTab === 'compose'" class="rounded-xl border p-6" :style="{ backgroundColor: 'var(--color-card-bg)', borderColor: 'var(--color-border)' }">
        <h2 class="text-xl font-bold mb-4" :style="{ color: 'var(--color-text)' }">Compose Newsletter</h2>

        <div class="space-y-4">
          <div>
            <label class="block text-xs font-bold mb-1" :style="{ color: 'var(--color-text-muted)' }">Subject</label>
            <input
              v-model="compose.subject"
              type="text"
              placeholder="Newsletter subject line"
              class="w-full rounded-lg border px-4 py-3 text-sm outline-none transition"
              :style="{
                backgroundColor: 'var(--color-input-bg)',
                borderColor: 'var(--color-input-border)',
                color: 'var(--color-text)'
              }"
            />
          </div>

          <div>
            <label class="block text-xs font-bold mb-1" :style="{ color: 'var(--color-text-muted)' }">Content (HTML supported)</label>
            <textarea
              v-model="compose.content"
              rows="12"
              placeholder="Write your newsletter content here... HTML is supported."
              class="w-full rounded-lg border px-4 py-3 text-sm outline-none transition font-mono"
              :style="{
                backgroundColor: 'var(--color-input-bg)',
                borderColor: 'var(--color-input-border)',
                color: 'var(--color-text)'
              }"
            ></textarea>
          </div>

          <div class="flex items-center gap-3">
            <label class="text-xs font-bold" :style="{ color: 'var(--color-text-muted)' }">Send test to:</label>
            <input
              v-model="compose.testEmail"
              type="email"
              placeholder="your@email.com"
              class="flex-1 max-w-xs rounded-lg border px-3 py-2 text-sm outline-none transition"
              :style="{
                backgroundColor: 'var(--color-input-bg)',
                borderColor: 'var(--color-input-border)',
                color: 'var(--color-text)'
              }"
            />
            <button
              @click="sendTest"
              :disabled="sending"
              class="px-4 py-2 rounded-lg text-xs font-bold text-white transition"
              style="background-color: #6b7280;"
            >
              {{ sending ? '...' : 'Send Test' }}
            </button>
          </div>

          <div class="flex items-center gap-3 pt-2 border-t" :style="{ borderColor: 'var(--color-border)' }">
            <button
              @click="sendToAll"
              :disabled="sending"
              class="px-6 py-3 rounded-lg text-sm font-bold text-white transition"
              style="background-color: var(--color-accent)"
            >
              {{ sending ? 'Sending...' : `Send to ${stats.active} subscribers` }}
            </button>
            <p v-if="sendMessage" class="text-sm font-semibold" :class="sendMessageType === 'error' ? 'text-red-500' : 'text-emerald-600'">
              {{ sendMessage }}
            </p>
          </div>
        </div>
      </div>

      <!-- Tab: Subscribers -->
      <div v-if="activeTab === 'subscribers'" class="rounded-xl border" :style="{ backgroundColor: 'var(--color-card-bg)', borderColor: 'var(--color-border)' }">
        <div class="p-4 border-b flex items-center gap-4" :style="{ borderColor: 'var(--color-border)' }">
          <input
            v-model="searchQuery"
            @input="searchSubscribers"
            type="text"
            placeholder="Search by email..."
            class="flex-1 rounded-lg border px-4 py-2 text-sm outline-none transition"
            :style="{
              backgroundColor: 'var(--color-input-bg)',
              borderColor: 'var(--color-input-border)',
              color: 'var(--color-text)'
            }"
          />
          <span class="text-xs font-semibold" :style="{ color: 'var(--color-text-muted)' }">
            {{ subscribers.length }} of {{ stats.total }}
          </span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b" :style="{ borderColor: 'var(--color-border)' }">
                <th class="text-left px-4 py-3 font-bold text-xs" :style="{ color: 'var(--color-text-muted)' }">Email</th>
                <th class="text-left px-4 py-3 font-bold text-xs" :style="{ color: 'var(--color-text-muted)' }">Status</th>
                <th class="text-left px-4 py-3 font-bold text-xs" :style="{ color: 'var(--color-text-muted)' }">Subscribed</th>
                <th class="text-left px-4 py-3 font-bold text-xs" :style="{ color: 'var(--color-text-muted)' }">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="sub in subscribers" :key="sub.id" class="border-b" :style="{ borderColor: 'var(--color-border)' }">
                <td class="px-4 py-3" :style="{ color: 'var(--color-text)' }">{{ sub.email }}</td>
                <td class="px-4 py-3">
                  <span
                    class="text-xs font-bold px-2 py-1 rounded-full"
                    :class="sub.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'"
                  >
                    {{ sub.is_active ? 'Active' : 'Unsubscribed' }}
                  </span>
                </td>
                <td class="px-4 py-3 text-xs" :style="{ color: 'var(--color-text-muted)' }">
                  {{ new Date(sub.subscribed_at).toLocaleDateString() }}
                </td>
                <td class="px-4 py-3">
                  <button
                    @click="deleteSubscriber(sub.id)"
                    class="text-xs font-bold text-red-500 hover:text-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </td>
              </tr>
              <tr v-if="subscribers.length === 0">
                <td colspan="4" class="px-4 py-8 text-center text-sm" :style="{ color: 'var(--color-text-muted)' }">
                  No subscribers found.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="p-4 border-t flex items-center justify-between" :style="{ borderColor: 'var(--color-border)' }">
          <button
            @click="changePage(currentPage - 1)"
            :disabled="currentPage <= 1"
            class="text-xs font-bold px-3 py-1.5 rounded border transition-all disabled:opacity-30"
            :style="{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }"
          >
            ← Previous
          </button>
          <span class="text-xs" :style="{ color: 'var(--color-text-muted)' }">Page {{ currentPage }} of {{ totalPages }}</span>
          <button
            @click="changePage(currentPage + 1)"
            :disabled="currentPage >= totalPages"
            class="text-xs font-bold px-3 py-1.5 rounded border transition-all disabled:opacity-30"
            :style="{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }"
          >
            Next →
          </button>
        </div>
      </div>

      <!-- Tab: Campaigns -->
      <div v-if="activeTab === 'campaigns'" class="rounded-xl border" :style="{ backgroundColor: 'var(--color-card-bg)', borderColor: 'var(--color-border)' }">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b" :style="{ borderColor: 'var(--color-border)' }">
                <th class="text-left px-4 py-3 font-bold text-xs" :style="{ color: 'var(--color-text-muted)' }">Subject</th>
                <th class="text-left px-4 py-3 font-bold text-xs" :style="{ color: 'var(--color-text-muted)' }">Status</th>
                <th class="text-left px-4 py-3 font-bold text-xs" :style="{ color: 'var(--color-text-muted)' }">Sent</th>
                <th class="text-left px-4 py-3 font-bold text-xs" :style="{ color: 'var(--color-text-muted)' }">Date</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="campaign in campaigns" :key="campaign.id" class="border-b" :style="{ borderColor: 'var(--color-border)' }">
                <td class="px-4 py-3 font-medium" :style="{ color: 'var(--color-text)' }">{{ campaign.subject }}</td>
                <td class="px-4 py-3">
                  <span
                    class="text-xs font-bold px-2 py-1 rounded-full"
                    :class="{
                      'bg-blue-100 text-blue-700': campaign.status === 'draft',
                      'bg-emerald-100 text-emerald-700': campaign.status === 'sent',
                      'bg-yellow-100 text-yellow-700': campaign.status === 'sending',
                      'bg-red-100 text-red-700': campaign.status === 'failed'
                    }"
                  >
                    {{ campaign.status }}
                  </span>
                </td>
                <td class="px-4 py-3 text-xs" :style="{ color: 'var(--color-text-muted)' }">{{ campaign.sent_count }}</td>
                <td class="px-4 py-3 text-xs" :style="{ color: 'var(--color-text-muted)' }">
                  {{ campaign.sent_at ? new Date(campaign.sent_at).toLocaleDateString() : 'Not sent' }}
                </td>
              </tr>
              <tr v-if="campaigns.length === 0">
                <td colspan="4" class="px-4 py-8 text-center text-sm" :style="{ color: 'var(--color-text-muted)' }">
                  No campaigns sent yet.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const supabase = useSupabaseClient()
const user = useSupabaseUser()

// Auth check
onMounted(() => {
  if (!user.value || user.value?.email !== 'alisedadmu@gmail.com') {
    navigateTo('/auth')
  }
})

const tabs = [
  { id: 'compose', label: '✏️ Compose' },
  { id: 'subscribers', label: '👥 Subscribers' },
  { id: 'campaigns', label: '📊 Campaigns' }
]
const activeTab = ref('compose')

// Stats
const stats = ref({ total: 0, active: 0, inactive: 0 })

// Compose
const compose = ref({ subject: '', content: '', testEmail: '' })
const sending = ref(false)
const sendMessage = ref('')
const sendMessageType = ref('')

// Subscribers
const subscribers = ref([])
const searchQuery = ref('')
const currentPage = ref(1)
const totalPages = ref(1)

// Campaigns
const campaigns = ref([])

let searchTimeout = null

onMounted(async () => {
  await Promise.all([
    fetchStats(),
    fetchSubscribers(),
    fetchCampaigns()
  ])
})

const fetchStats = async () => {
  try {
    const res = await fetch('/api/newsletter-admin?action=subscriber-stats')
    const data = await res.json()
    if (data.success) stats.value = data.stats
  } catch (e) {}
}

const fetchSubscribers = async () => {
  try {
    const params = new URLSearchParams({
      action: 'subscribers',
      page: currentPage.value.toString(),
      limit: '50'
    })
    if (searchQuery.value) params.set('search', searchQuery.value)

    const res = await fetch(`/api/newsletter-admin?${params.toString()}`)
    const data = await res.json()
    if (data.success) {
      subscribers.value = data.subscribers
      totalPages.value = data.totalPages
    }
  } catch (e) {}
}

const fetchCampaigns = async () => {
  try {
    const res = await fetch('/api/newsletter-admin?action=campaigns')
    const data = await res.json()
    if (data.success) campaigns.value = data.campaigns
  } catch (e) {}
}

const searchSubscribers = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 1
    fetchSubscribers()
  }, 300)
}

const changePage = (page) => {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  fetchSubscribers()
}

const deleteSubscriber = async (id) => {
  if (!confirm('Delete this subscriber?')) return
  try {
    const res = await fetch(`/api/newsletter-admin?action=delete-subscriber&id=${id}`)
    const data = await res.json()
    if (data.success) {
      await Promise.all([fetchSubscribers(), fetchStats()])
    }
  } catch (e) {}
}

const sendTest = async () => {
  if (!compose.value.testEmail || !compose.value.subject || !compose.value.content) {
    sendMessage.value = 'Please fill in subject, content, and test email'
    sendMessageType.value = 'error'
    return
  }

  sending.value = true
  sendMessage.value = ''
  sendMessageType.value = ''

  try {
    const res = await fetch('/api/newsletter-send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subject: compose.value.subject,
        content: compose.value.content,
        testEmail: compose.value.testEmail
      })
    })
    const data = await res.json()

    if (data.success) {
      sendMessage.value = data.message
      sendMessageType.value = 'success'
    } else {
      sendMessage.value = data.error
      sendMessageType.value = 'error'
    }
  } catch (e) {
    sendMessage.value = 'Network error'
    sendMessageType.value = 'error'
  }

  sending.value = false
}

const sendToAll = async () => {
  if (!compose.value.subject || !compose.value.content) {
    sendMessage.value = 'Please fill in subject and content'
    sendMessageType.value = 'error'
    return
  }

  if (!confirm(`Send newsletter to ${stats.value.active} active subscribers?`)) return

  sending.value = true
  sendMessage.value = ''
  sendMessageType.value = ''

  try {
    const res = await fetch('/api/newsletter-send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subject: compose.value.subject,
        content: compose.value.content
      })
    })
    const data = await res.json()

    if (data.success) {
      sendMessage.value = data.message
      sendMessageType.value = 'success'
      await Promise.all([fetchCampaigns(), fetchStats()])
    } else {
      sendMessage.value = data.error
      sendMessageType.value = 'error'
    }
  } catch (e) {
    sendMessage.value = 'Network error'
    sendMessageType.value = 'error'
  }

  sending.value = false
}
</script>