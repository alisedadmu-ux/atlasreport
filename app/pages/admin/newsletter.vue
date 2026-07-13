<template>
  <div class="admin-page">
    <div class="site-container">
      <div class="admin-header">
        <div>
          <NuxtLink to="/profile" class="back-link">&larr; Back to Profile</NuxtLink>
          <p class="eyebrow">Admin</p>
          <h1 class="admin-title">Newsletter Management</h1>
          <p class="admin-subtitle">Manage subscribers, send campaigns, and track performance.</p>
        </div>
      </div>

      <div v-if="loading" class="admin-loading">
        <div class="skeleton skeleton-card" style="min-height: 80px;"></div>
        <div class="skeleton skeleton-card" style="min-height: 80px;"></div>
        <div class="skeleton skeleton-card" style="min-height: 80px;"></div>
      </div>

      <template v-else>
        <div class="stats-grid">
          <div class="stat-card stat-flat">
            <p class="stat-label">Total Subscribers</p>
            <p class="stat-value">{{ stats.total }}</p>
            <span class="stat-indicator"></span>
          </div>
          <div class="stat-card stat-flat">
            <p class="stat-label">Active</p>
            <p class="stat-value stat-success">{{ stats.active }}</p>
            <span class="stat-indicator stat-indicator-success"></span>
          </div>
          <div class="stat-card stat-flat">
            <p class="stat-label">Unsubscribed</p>
            <p class="stat-value stat-error">{{ stats.inactive }}</p>
            <span class="stat-indicator stat-indicator-error"></span>
          </div>
          <div class="stat-card stat-flat">
            <p class="stat-label">Campaigns Sent</p>
            <p class="stat-value">{{ campaigns.length }}</p>
            <span class="stat-indicator"></span>
          </div>
        </div>

        <div class="tabs-row">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            :class="['tab-btn', { 'tab-active': activeTab === tab.id }]"
            @click="activeTab = tab.id"
          >
            {{ tab.label }}
          </button>
        </div>

        <div v-if="activeTab === 'compose'" class="panel-card">
          <h2 class="panel-title">Compose Newsletter</h2>
          <form @submit.prevent class="compose-form">
            <div class="form-group">
              <label class="form-label" for="subject">Subject</label>
              <input id="subject" v-model="compose.subject" type="text" class="form-input" placeholder="Newsletter subject line" />
            </div>
            <div class="form-group">
              <label class="form-label" for="content">Content (HTML supported)</label>
              <textarea id="content" v-model="compose.content" rows="12" class="form-input form-textarea" placeholder="Write your newsletter content here... HTML is supported." />
              <span class="char-count">{{ compose.content.length }} characters</span>
            </div>
            <div class="test-row">
              <label class="form-label" for="testEmail">Send test to:</label>
              <div class="test-actions">
                <input id="testEmail" v-model="compose.testEmail" type="email" class="form-input" placeholder="your@email.com" />
                <button @click="sendTest" :disabled="sending" class="btn btn-secondary btn-sm">Send Test</button>
              </div>
            </div>
            <div class="send-row">
              <button @click="sendToAll" :disabled="sending" class="btn btn-primary">
                {{ sending ? 'Sending...' : `Send to ${stats.active} subscribers` }}
              </button>
              <p v-if="sendMessage" class="send-message" :class="sendMessageType === 'error' ? 'msg-error' : 'msg-success'">{{ sendMessage }}</p>
            </div>
          </form>
        </div>

        <div v-if="activeTab === 'subscribers'" class="panel-card">
          <div class="table-header">
            <input
              v-model="searchQuery"
              @input="searchSubscribers"
              type="text"
              placeholder="Search by email..."
              class="form-input"
              style="max-width: 280px;"
            />
            <span class="table-count">{{ subscribers.length }} of {{ stats.total }}</span>
          </div>
          <div class="table-wrap">
            <p v-if="deleteError" class="delete-status delete-status-error">{{ deleteError }}</p>
            <table class="data-table">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Subscribed</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="sub in subscribers" :key="sub.id" :class="{ 'row-muted': !sub.is_active }">
                  <td class="td-email">{{ sub.email }}</td>
                  <td>
                    <span :class="['badge', sub.is_active ? 'badge-success' : 'badge-error']">
                      {{ sub.is_active ? 'Active' : 'Unsubscribed' }}
                    </span>
                  </td>
                  <td class="td-muted">{{ new Date(sub.subscribed_at).toLocaleDateString() }}</td>
                  <td>
                    <button @click="deleteSubscriber(sub.id)" class="btn btn-ghost btn-sm" style="color: var(--color-error);">Delete</button>
                  </td>
                </tr>
                <tr v-if="subscribers.length === 0">
                  <td colspan="4" class="td-empty">No subscribers found.</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-if="totalPages > 1" class="pagination">
            <button @click="changePage(currentPage - 1)" :disabled="currentPage <= 1" :class="['page-btn', { 'page-btn-disabled': currentPage <= 1 }]">&larr; Previous</button>
            <span class="page-meta">Page {{ currentPage }} of {{ totalPages }}</span>
            <button @click="changePage(currentPage + 1)" :disabled="currentPage >= totalPages" :class="['page-btn', { 'page-btn-disabled': currentPage >= totalPages }]">Next &rarr;</button>
          </div>
        </div>

        <div v-if="activeTab === 'campaigns'" class="panel-card">
          <div class="table-wrap">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Status</th>
                  <th>Sent</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="campaign in campaigns" :key="campaign.id">
                  <td class="td-email">{{ campaign.subject }}</td>
                  <td>
                    <span :class="['badge', campaignBadgeClass(campaign.status)]">{{ campaign.status }}</span>
                  </td>
                  <td class="td-muted">{{ campaign.sent_count }}</td>
                  <td class="td-muted">{{ campaign.sent_at ? new Date(campaign.sent_at).toLocaleDateString() : 'Not sent' }}</td>
                </tr>
                <tr v-if="campaigns.length === 0">
                  <td colspan="4" class="td-empty">No campaigns sent yet.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const loading = ref(true)

const tabs = [
  { id: 'compose', label: 'Compose' },
  { id: 'subscribers', label: 'Subscribers' },
  { id: 'campaigns', label: 'Campaigns' }
]
const activeTab = ref('compose')
const stats = ref({ total: 0, active: 0, inactive: 0 })
const compose = ref({ subject: '', content: '', testEmail: '' })
const sending = ref(false)
const sendMessage = ref('')
const sendMessageType = ref('')
const subscribers = ref([])
const searchQuery = ref('')
const currentPage = ref(1)
const totalPages = ref(1)
const campaigns = ref([])
const deleteError = ref('')

let searchTimeout = null

onMounted(async () => {
  const { data: { user: currentUser } } = await supabase.auth.getUser()
  if (!currentUser || currentUser.email !== 'alisedadmu@gmail.com') {
    await navigateTo('/auth')
    return
  }
  await Promise.all([fetchStats(), fetchSubscribers(), fetchCampaigns()])
  loading.value = false
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
    const params = new URLSearchParams({ action: 'subscribers', page: currentPage.value.toString(), limit: '50' })
    if (searchQuery.value) params.set('search', searchQuery.value)
    const res = await fetch(`/api/newsletter-admin?${params.toString()}`)
    const data = await res.json()
    if (data.success) { subscribers.value = data.subscribers; totalPages.value = data.totalPages }
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
  searchTimeout = setTimeout(() => { currentPage.value = 1; fetchSubscribers() }, 300)
}

const changePage = (page) => { if (page < 1 || page > totalPages.value) return; currentPage.value = page; fetchSubscribers() }

const deleteSubscriber = async (id) => {
  if (!confirm('Delete this subscriber?')) return
  deleteError.value = ''
  try {
    const res = await fetch('/api/newsletter-admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete-subscriber', id })
    })
    const data = await res.json()
    if (res.status === 403) {
      deleteError.value = 'Unauthorized: admin access required'
    } else if (data.success) {
      await Promise.all([fetchSubscribers(), fetchStats()])
      deleteError.value = ''
    } else {
      deleteError.value = data.error || 'Failed to delete subscriber'
    }
  } catch (e) {
    deleteError.value = 'Network error. Please try again.'
  }
}

const sendTest = async () => {
  if (!compose.value.testEmail || !compose.value.subject || !compose.value.content) {
    sendMessage.value = 'Please fill in subject, content, and test email'
    sendMessageType.value = 'error'
    return
  }
  sending.value = true; sendMessage.value = ''; sendMessageType.value = ''
  try {
    const res = await fetch('/api/newsletter-send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject: compose.value.subject, content: compose.value.content, testEmail: compose.value.testEmail })
    })
    const data = await res.json()
    if (data.success) { sendMessage.value = data.message; sendMessageType.value = 'success' }
    else { sendMessage.value = data.error; sendMessageType.value = 'error' }
  } catch (e) { sendMessage.value = 'Network error'; sendMessageType.value = 'error' }
  sending.value = false
}

const sendToAll = async () => {
  if (!compose.value.subject || !compose.value.content) {
    sendMessage.value = 'Please fill in subject and content'
    sendMessageType.value = 'error'
    return
  }
  if (!confirm(`Send newsletter to ${stats.value.active} active subscribers?`)) return
  sending.value = true; sendMessage.value = ''; sendMessageType.value = ''
  try {
    const res = await fetch('/api/newsletter-send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject: compose.value.subject, content: compose.value.content })
    })
    const data = await res.json()
    if (data.success) { sendMessage.value = data.message; sendMessageType.value = 'success'; await Promise.all([fetchCampaigns(), fetchStats()]) }
    else { sendMessage.value = data.error; sendMessageType.value = 'error' }
  } catch (e) { sendMessage.value = 'Network error'; sendMessageType.value = 'error' }
  sending.value = false
}

const campaignBadgeClass = (status) => {
  const map = { draft: 'badge-muted', sent: 'badge-success', sending: 'badge-warning', failed: 'badge-error' }
  return map[status] || 'badge-muted'
}
</script>

<style scoped>
.admin-page { padding: 2rem 0; }

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.8125rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-accent);
  margin-bottom: 0.5rem;
  background: none;
  border: none;
  padding: 0.25rem 0;
  cursor: pointer;
  font-family: inherit;
  text-decoration: none;
}

.admin-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1.25rem;
  margin-bottom: 2rem;
  padding-bottom: 1.15rem;
  border-bottom: 1px solid var(--color-border);
  flex-wrap: wrap;
}

.admin-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(1.5rem, 3vw, 2.25rem);
  margin: 0.3rem 0 0.5rem;
}

.admin-subtitle {
  color: var(--color-text-secondary);
  font-size: 0.9375rem;
}

.admin-loading {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1rem;
  margin-bottom: 1.75rem;
}

.stat-card {
  border: 1px solid var(--color-border);
  background: var(--color-card-bg);
  border-radius: var(--radius-base);
  padding: 1.35rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  position: relative;
  overflow: hidden;
}

.stat-flat {
  box-shadow: none;
  transition: none;
}

.stat-flat:hover {
  transform: none;
  box-shadow: none;
}

.stat-indicator {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--color-border);
}

.stat-indicator-success {
  background: var(--color-success);
}

.stat-indicator-error {
  background: var(--color-error);
}

.stat-label {
  font-size: 0.6875rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-text-muted);
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--color-text);
  line-height: 1;
}

.stat-success { color: var(--color-success); }
.stat-error { color: var(--color-error); }

.tabs-row {
  display: flex;
  gap: 0.5rem;
  padding: 0.4rem;
  background: var(--color-bg-alt);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-base);
  width: fit-content;
  margin-bottom: 1.5rem;
}

.tab-btn {
  padding: 0.65rem 1.4rem;
  border-radius: var(--radius-sm);
  border: 1px solid transparent;
  background: transparent;
  color: var(--color-text-secondary);
  font-size: 0.875rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 44px;
}

.tab-btn:hover { color: var(--color-text); }

.tab-active {
  background: var(--color-card-bg);
  color: var(--color-text);
  border-color: var(--color-border);
  box-shadow: var(--shadow-sm);
}

.panel-card {
  border: 1px solid var(--color-border);
  background: var(--color-card-bg);
  border-radius: var(--radius-lg);
  padding: 1.75rem;
  box-shadow: var(--shadow-xs);
}

.panel-title {
  font-size: 1.0625rem;
  font-weight: 800;
  color: var(--color-text);
  margin-bottom: 1.35rem;
}

.compose-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.char-count {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  font-weight: 600;
  margin-top: 0.35rem;
  text-align: right;
}

.test-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.test-actions {
  display: flex;
  gap: 0.5rem;
  flex: 1;
}

.send-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  padding-top: 1rem;
  border-top: 1px solid var(--color-border);
}

.send-message { font-size: 0.875rem; font-weight: 700; }
.msg-error { color: var(--color-error); }
.msg-success { color: var(--color-success); }

.table-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.25rem;
  flex-wrap: wrap;
}

.table-count { font-size: 0.8125rem; color: var(--color-text-muted); font-weight: 700; }

.table-wrap {
  overflow-x: auto;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-base);
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.data-table th {
  text-align: left;
  padding: 0.85rem 1rem;
  font-size: 0.6875rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-text-muted);
  border-bottom: 1px solid var(--color-border);
  background: var(--color-bg-alt);
}

.data-table td {
  padding: 0.85rem 1rem;
  border-bottom: 1px solid var(--color-border-light);
  color: var(--color-text-secondary);
}

.data-table tbody tr {
  transition: background-color 0.15s ease;
}

.data-table tbody tr:hover {
  background: var(--color-bg-alt);
}

.data-table tbody tr.row-muted {
  opacity: 0.65;
}

.data-table tr:last-child td { border-bottom: none; }

.td-email { color: var(--color-text); font-weight: 600; }
.td-muted { color: var(--color-text-muted); font-size: 0.8125rem; }
.td-empty { text-align: center; color: var(--color-text-muted); padding: 2.5rem; }

.delete-status {
  font-size: 0.8125rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.delete-status-error {
  color: var(--color-error);
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.85rem 0;
  border-top: 1px solid var(--color-border);
  margin-top: 1.25rem;
}

.page-meta { font-size: 0.8125rem; color: var(--color-text-muted); }

@media (max-width: 1024px) {
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 640px) {
  .stats-grid { grid-template-columns: 1fr; }
  .admin-header { flex-direction: column; }
}
</style>
