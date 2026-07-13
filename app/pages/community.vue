<template>
  <div class="community-page">
    <!-- Hero Section -->
    <section class="community-hero fade-in-up">
      <div class="hero-copy">
        <div class="eyebrow">Community</div>
        <h1 class="community-title">Atlas Report Community</h1>
        <p class="community-subtitle">Join the discussion, share your perspective, and connect with fellow readers in a calm, thoughtful space.</p>
      </div>
      <div class="hero-stats">
        <div class="stat-pill">
          <span class="stat-value">{{ posts.length }}</span>
          <span class="stat-label">Posts</span>
        </div>
        <div class="stat-pill">
          <span class="stat-value">{{ totalLikes }}</span>
          <span class="stat-label">Likes</span>
        </div>
        <div class="stat-pill">
          <span class="stat-value">{{ totalComments }}</span>
          <span class="stat-label">Comments</span>
        </div>
      </div>
    </section>

    <div class="community-grid">
      <div class="feed-column">
        <CreateCommunityPost
          v-if="currentUser"
          :currentUser="currentUser"
          :currentUserId="currentUserId"
          @post-created="handlePostCreated"
        />

        <div v-else class="sign-in-card fade-in-up stagger-1">
          <div class="sign-in-card-icon">
            <MessageCircle class="sign-in-icon" />
          </div>
          <p>
            <NuxtLink to="/auth" class="link-accent">Sign in</NuxtLink> to create a post and join the conversation.
          </p>
        </div>

        <!-- Feed Tabs -->
        <div class="tabs-row">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            :class="['tab-btn', { 'tab-active': feedTab === tab.key }]"
            @click="setTab(tab.key)"
          >
            {{ tab.label }}
          </button>
        </div>

        <!-- Topic Filter -->
        <div v-if="topicFilter" class="topic-filter-bar">
          <span>Showing <strong>#{{ topicFilter }}</strong></span>
          <button class="topic-filter-clear" @click="clearTopic">Clear</button>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="feed-stack" aria-busy="true" aria-label="Loading community posts">
          <div v-for="i in 3" :key="i" class="skeleton-card">
            <div class="sk-avatar-row">
              <div class="sk-avatar"></div>
              <div>
                <div class="sk-bone sk-bone-text" style="width: 120px;"></div>
                <div class="sk-bone sk-bone-text" style="width: 80px; margin-top: 4px;"></div>
              </div>
            </div>
            <div class="sk-bone sk-bone-title" style="width: 60%;"></div>
            <div class="sk-bone sk-bone-text" style="width: 100%;"></div>
            <div class="sk-bone sk-bone-text" style="width: 70%;"></div>
          </div>
        </div>

        <!-- Feed Posts -->
        <div v-else-if="filteredPosts.length" class="feed-stack">
          <CommunityPostCard
            v-for="post in filteredPosts"
            :key="post.id"
            :post="post"
            :currentUser="currentUser"
            :currentUserId="currentUserId"
            @delete="deletePost"
            @open-comments="openCommentsModal"
            @follow-changed="handleFollowChanged"
          />
        </div>

        <!-- Empty State -->
        <div v-else class="empty-state">
          <div class="empty-icon">
            <MessageCircle class="empty-icon-svg" />
          </div>
          <p class="empty-title">No posts yet</p>
          <p class="empty-desc" v-if="feedTab === 'following'">
            Follow some users to see their posts here.
          </p>
          <p class="empty-desc" v-else>
            Be the first to start a discussion.
          </p>
        </div>
      </div>

      <!-- Sidebar -->
      <aside class="side-column">
        <div class="panel-card">
          <h3 class="panel-heading">Trending topics</h3>
          <div v-if="trendingTopics.length" class="topic-list">
            <button v-for="topic in trendingTopics" :key="topic" @click="searchTopic(topic)">
              <span class="topic-hash">#</span>
              {{ topic }}
            </button>
          </div>
          <p v-else class="muted">No trending topics yet.</p>
        </div>

        <div v-if="suggestedUsers.length" class="panel-card">
          <h3 class="panel-heading">Who to follow</h3>
          <div class="people-list">
            <div v-for="user in suggestedUsers" :key="user.user_id" class="person-row">
              <NuxtLink :to="`/community/profile/${user.user_id}`" class="person-avatar">
                <div :style="{ background: user.color }">{{ getInitials(user.display_name || user.email || 'U') }}</div>
              </NuxtLink>
              <div class="person-info">
                <NuxtLink :to="`/community/profile/${user.user_id}`" class="person-name">
                  {{ user.display_name || user.email?.split('@')[0] || 'User' }}
                </NuxtLink>
              </div>
              <button @click="quickFollow(user.user_id)" class="btn btn-secondary btn-sm">Follow</button>
            </div>
          </div>
        </div>

        <div v-if="currentUser" class="panel-card stats-card">
          <h3 class="panel-heading">Your activity</h3>
          <div class="stats-grid">
            <div class="stat-item">
              <span class="stat-value">{{ userStats.posts }}</span>
              <span class="stat-label">Posts</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ userStats.followers }}</span>
              <span class="stat-label">Followers</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ userStats.following }}</span>
              <span class="stat-label">Following</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ userStats.likes }}</span>
              <span class="stat-label">Likes</span>
            </div>
          </div>
        </div>
      </aside>
    </div>

    <!-- Comments Modal -->
    <Teleport to="body">
      <div
        v-if="commentsModalPost"
        class="modal-overlay"
        @click.self="closeCommentsModal"
        @keydown.esc="closeCommentsModal"
        tabindex="-1"
      >
        <div class="modal-backdrop" @click="closeCommentsModal"></div>
        <div class="modal-shell" role="dialog" aria-modal="true" aria-label="Comments">
          <div class="modal-header">
            <h3 class="modal-title">Comments</h3>
            <button @click="closeCommentsModal" class="modal-close" aria-label="Close comments">
              <X class="modal-icon" />
            </button>
          </div>

          <div class="modal-preview">
             <div class="preview-avatar">
               <div :style="{ background: commentsModalPost.authorColor }">{{ getInitials(commentsModalPost.author_name || 'A') }}</div>
             </div>
             <p class="preview-text">{{ commentsModalPost.content }}</p>
           </div>

           <div class="modal-content">
            <PostComments
              :postId="commentsModalPost.id"
              :postAuthor="commentsModalPost.author_name || 'Anonymous'"
              :currentUser="currentUser"
              :currentUserId="currentUserId"
            />
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { getInitials, getAccentColor } from '~/utils/format'
import { MessageCircle, X } from '@lucide/vue'

const supabase = useSupabaseClient()

const posts = ref([])
const loading = ref(true)
const currentUser = ref(null)
const currentUserId = ref(null)
const feedTab = ref('latest')
const topicFilter = ref('')
const commentsModalPost = ref(null)
const suggestedUsers = ref([])
const userStats = ref({ posts: 0, followers: 0, following: 0, likes: 0 })

const tabs = computed(() => [
  { key: 'latest', label: 'Latest' },
  { key: 'following', label: 'Following' },
  { key: 'trending', label: 'Trending' }
])

const totalLikes = computed(() => posts.value.reduce((sum, p) => sum + (p.like_count || 0), 0))
const totalComments = computed(() => posts.value.reduce((sum, p) => sum + (p.comment_count || 0), 0))

const filteredPosts = computed(() => {
  let list = posts.value
  if (topicFilter.value) {
    const q = topicFilter.value.toLowerCase()
    list = list.filter(p => `${p.title} ${p.content}`.toLowerCase().includes(q))
  }
  if (feedTab.value === 'following') {
    return list.filter(p => p.is_following || p.user_id === currentUserId.value)
  } else if (feedTab.value === 'trending') {
    return [...list].sort((a, b) => (b.like_count || 0) - (a.like_count || 0))
  }
  return list
})

const trendingTopics = computed(() => {
  const wordCounts = {}
  posts.value.forEach(post => {
    const words = (post.title + ' ' + post.content).toLowerCase().split(/\s+/)
    words.forEach(word => {
      const clean = word.replace(/[^a-z0-9]/g, '')
      if (clean.length > 4 && !['this', 'that', 'with', 'from', 'have', 'been', 'were', 'what', 'when', 'where', 'which', 'their', 'there', 'about', 'would', 'could', 'should', 'just', 'more', 'some', 'into'].includes(clean)) {
        wordCounts[clean] = (wordCounts[clean] || 0) + 1
      }
    })
  })
  return Object.entries(wordCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word]) => word)
})

const fetchSuggestedUsers = async () => {
  if (!currentUserId.value) return
  const { data: postAuthors } = await supabase
    .from('community_posts')
    .select('user_id, author_name, author_email')
    .neq('user_id', currentUserId.value)
    .order('created_at', { ascending: false })

  if (!postAuthors) return

  const uniqueAuthors = []
  const seen = new Set()
  postAuthors.forEach(a => {
    if (!seen.has(a.user_id)) {
      seen.add(a.user_id)
      uniqueAuthors.push(a)
    }
  })

  const authorIds = uniqueAuthors.map(a => a.user_id)
  const { data: follows } = await supabase.from('follows').select('following_id').in('following_id', authorIds).eq('follower_id', currentUserId.value)
  const followedIds = new Set(follows?.map(f => f.following_id) || [])

  suggestedUsers.value = uniqueAuthors.filter(a => !followedIds.has(a.user_id)).slice(0, 3).map(u => ({
    user_id: u.user_id,
    display_name: u.author_name,
    email: u.author_email,
    bio: '',
    color: getAccentColor(u.user_id)
  }))
}

const fetchUserStats = async () => {
  if (!currentUserId.value) return
  const [postsRes, followersRes, followingRes, likesRes] = await Promise.all([
    supabase.from('community_posts').select('id', { count: 'exact', head: true }).eq('user_id', currentUserId.value),
    supabase.from('follows').select('id', { count: 'exact', head: true }).eq('following_id', currentUserId.value),
    supabase.from('follows').select('id', { count: 'exact', head: true }).eq('follower_id', currentUserId.value),
    supabase.from('post_likes').select('id', { count: 'exact', head: true }).eq('user_id', currentUserId.value)
  ])
  userStats.value = {
    posts: postsRes.count || 0,
    followers: followersRes.count || 0,
    following: followingRes.count || 0,
    likes: likesRes.count || 0
  }
}

const handlePostCreated = async () => {
  await fetchPosts()
  await fetchUserStats()
  await fetchSuggestedUsers()
}

const deletePost = async (postId) => {
  const { error } = await supabase.from('community_posts').delete().eq('id', postId)
  if (!error) {
    posts.value = posts.value.filter(p => p.id !== postId)
    await fetchUserStats()
  }
}

const openCommentsModal = (post) => {
  commentsModalPost.value = post
}

const closeCommentsModal = () => {
  commentsModalPost.value = null
}

const handleFollowChanged = async ({ userId, following }) => {
  posts.value = posts.value.map(p => (p.user_id === userId ? { ...p, is_following: following } : p))
  await fetchSuggestedUsers()
  await fetchUserStats()
}

const quickFollow = async (userId) => {
  if (!currentUser.value) return
  const { error } = await supabase.from('follows').insert({ follower_id: currentUserId.value, following_id: userId })
  if (!error) {
    suggestedUsers.value = suggestedUsers.value.filter(u => u.user_id !== userId)
    posts.value = posts.value.map(p => (p.user_id === userId ? { ...p, is_following: true } : p))
    await fetchUserStats()
  }
}

const searchTopic = (topic) => {
  topicFilter.value = topic
  feedTab.value = 'latest'
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const setTab = (key) => {
  feedTab.value = key
  topicFilter.value = ''
}

const clearTopic = () => { topicFilter.value = '' }

let subscription = null
let feedDebounceTimer = null
let feedRequestId = 0

function scheduleFeedRefresh() {
  if (feedDebounceTimer) clearTimeout(feedDebounceTimer)
  feedDebounceTimer = setTimeout(() => fetchPosts(false), 400)
}

const fetchPosts = async (showLoading = true) => {
  const requestId = ++feedRequestId
  if (showLoading) loading.value = true
  const { data, error } = await supabase
    .from('community_posts')
    .select(`
      *,
      post_likes:post_likes(count),
      post_comments:post_comments(count)
    `)
    .order('created_at', { ascending: false })

  if (!error && data) {
    let enrichedPosts = data.map(post => ({
      ...post,
      like_count: post.post_likes?.[0]?.count || 0,
      comment_count: post.post_comments?.[0]?.count || 0,
      authorColor: getAccentColor(post.author_name || post.author_email || post.id)
    }))

    if (currentUserId.value) {
      const postIds = enrichedPosts.map(p => p.id)
      const authorIds = [...new Set(enrichedPosts.map(p => p.user_id).filter(id => id !== currentUserId.value))]

      const { data: likes } = await supabase.from('post_likes').select('post_id').in('post_id', postIds).eq('user_id', currentUserId.value)
      const likedPostIds = new Set(likes?.map(l => l.post_id) || [])

      const { data: follows } = await supabase.from('follows').select('following_id').in('following_id', authorIds).eq('follower_id', currentUserId.value)
      const followedUserIds = new Set(follows?.map(f => f.following_id) || [])

      enrichedPosts = enrichedPosts.map(post => ({
        ...post,
        user_liked: likedPostIds.has(post.id),
        is_following: followedUserIds.has(post.user_id)
      }))
    }

    if (requestId === feedRequestId) {
      posts.value = enrichedPosts
    }
  }
  loading.value = false
}

onMounted(async () => {
  const { data: { session } } = await supabase.auth.getSession()
  if (session?.user) {
    currentUser.value = session.user
    currentUserId.value = session.user.id
  }

  await fetchPosts()
  if (currentUserId.value) {
    await fetchSuggestedUsers()
    await fetchUserStats()
  }

  subscription = supabase
    .channel('community_feed')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'community_posts' }, scheduleFeedRefresh)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'post_likes' }, scheduleFeedRefresh)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'post_comments' }, scheduleFeedRefresh)
    .subscribe()
})

onBeforeUnmount(() => {
  if (feedDebounceTimer) clearTimeout(feedDebounceTimer)
  if (subscription) supabase.removeChannel(subscription)
})
</script>

<style scoped>
.community-page {
  padding: 2rem 0;
}

/* ===== Hero ===== */
.community-hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.75rem;
  padding: 1.75rem 2.25rem;
  margin-bottom: 2rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-2xl);
  background: linear-gradient(135deg, var(--color-bg-alt) 0%, var(--color-bg) 100%);
  flex-wrap: wrap;
}

.hero-copy {
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  max-width: 640px;
}

.community-title {
  font-size: clamp(1.75rem, 3.5vw, 2.5rem);
  line-height: 1.15;
  margin: 0.25rem 0 0.6rem;
  font-family: 'Playfair Display', Georgia, serif;
  font-weight: 800;
}

.community-subtitle {
  font-size: 1.0625rem;
  line-height: 1.7;
  color: var(--color-text-secondary);
}

.hero-stats {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.stat-pill {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
  padding: 0.85rem 1.35rem;
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  background: var(--color-card-bg);
  box-shadow: var(--shadow-xs);
}

.stat-value {
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--color-text);
  line-height: 1;
}

.stat-label {
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-text-muted);
}

/* ===== Grid ===== */
.community-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.75fr) 320px;
  gap: 1.5rem;
  align-items: start;
}

.feed-column,
.side-column {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* ===== Composer ===== */
.sign-in-card {
  border: 1px dashed var(--color-border);
  background: var(--color-bg-alt);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  text-align: center;
  color: var(--color-text-secondary);
  font-size: 0.9375rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.sign-in-card-icon {
  color: var(--color-text-muted);
  opacity: 0.6;
}

.sign-in-icon {
  width: 32px;
  height: 32px;
  stroke-width: 1.5;
}

.sign-in-card a {
  color: var(--color-accent);
  font-weight: 700;
}

/* ===== Tabs ===== */
.tabs-row {
  display: flex;
  gap: 0.25rem;
  border-bottom: 1px solid var(--color-border);
  width: 100%;
  margin-bottom: 1.25rem;
  padding: 0;
}

.tab-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.6rem 0.85rem;
  border-radius: 0;
  border: none;
  border-bottom: 2px solid transparent;
  background: transparent;
  color: var(--color-text-secondary);
  font-size: 0.875rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 44px;
  font-family: inherit;
  margin-bottom: -1px;
}

.tab-btn:hover {
  color: var(--color-text);
  border-bottom-color: var(--color-text-muted);
}

.tab-active {
  color: var(--color-accent);
  border-bottom-color: var(--color-accent);
}

.tab-active:hover {
  color: var(--color-accent-hover);
  border-bottom-color: var(--color-accent-hover);
}

/* ===== Topic Filter ===== */
.topic-filter-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.6rem 0.9rem;
  border: 1px solid var(--color-border);
  background: var(--color-bg-alt);
  border-radius: var(--radius-sm);
  font-size: 0.8125rem;
  color: var(--color-text-secondary);
  margin-bottom: 1rem;
}

.topic-filter-bar strong {
  color: var(--color-text);
}

.topic-filter-clear {
  border: none;
  background: transparent;
  color: var(--color-accent);
  font-weight: 700;
  font-size: 0.8125rem;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 0.5rem;
  transition: background-color 0.2s ease;
  font-family: inherit;
}

.topic-filter-clear:hover {
  background: var(--color-accent-subtle);
}

/* ===== Feed ===== */
.feed-stack {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.skeleton-card {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  background: var(--color-bg-alt);
}

.sk-avatar-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.25rem;
}

.sk-avatar {
  width: 40px;
  height: 40px;
  border-radius: 9999px;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  flex-shrink: 0;
}

.sk-bone {
  border-radius: var(--radius-sm);
  background: var(--color-bg);
  border: 1px solid var(--color-border);
}

.sk-bone-text {
  height: 12px;
  border-radius: 9999px;
}

.sk-bone-title {
  height: 14px;
  border-radius: var(--radius-sm);
}

/* ===== Empty State ===== */
.empty-state {
  padding: 3.5rem 1rem;
  text-align: center;
  border: 1px dashed var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-bg-alt);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;
}

.empty-icon {
  color: var(--color-text-muted);
  margin-bottom: 0.5rem;
  opacity: 0.7;
}

.empty-icon-svg {
  width: 48px;
  height: 48px;
  stroke-width: 1.5;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.empty-title {
  font-size: 1.0625rem;
  font-weight: 800;
  color: var(--color-text);
}

.empty-desc {
  font-size: 0.9375rem;
  color: var(--color-text-secondary);
  max-width: 380px;
}

/* ===== Panel Cards ===== */
.panel-card {
  border: 1px solid var(--color-border);
  background: var(--color-card-bg);
  border-radius: var(--radius-lg);
  padding: 1.25rem;
}

.panel-heading {
  font-size: 0.6875rem;
  font-weight: 800;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--color-text);
  margin-bottom: 0.85rem;
}

.topic-list {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.topic-list button {
  width: 100%;
  text-align: left;
  border: 1px solid transparent;
  background: transparent;
  color: var(--color-text-secondary);
  font-size: 0.9375rem;
  font-weight: 600;
  padding: 0.5rem 0.6rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
}

.topic-list button:hover {
  background: var(--color-accent-subtle);
  color: var(--color-accent);
  border-color: var(--color-accent-light);
}

.topic-hash {
  color: var(--color-accent);
  font-weight: 800;
  margin-right: 0.15rem;
}

.people-list {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.person-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.person-avatar {
  flex-shrink: 0;
  text-decoration: none;
}

.person-avatar div {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.625rem;
  font-weight: 800;
}

.person-info {
  flex: 1;
  min-width: 0;
}

.person-name {
  display: block;
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--color-text);
  text-decoration: none;
}

.person-name:hover {
  color: var(--color-accent);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.6rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  padding: 0.85rem;
  border-radius: var(--radius-base);
  background: var(--color-bg-alt);
  border: 1px solid var(--color-border);
}

.muted {
  color: var(--color-text-muted);
  font-size: 0.85rem;
}

/* ===== Modal ===== */
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: var(--color-overlay);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

.modal-shell {
  position: relative;
  width: 100%;
  max-width: 32rem;
  max-height: 80vh;
  background: var(--color-card-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl) var(--radius-xl) 0 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: var(--shadow-xl);
  animation: modalSlideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes modalSlideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--color-border);
  flex-shrink: 0;
}

.modal-title {
  font-size: 0.9375rem;
  font-weight: 800;
  color: var(--color-text);
}

.modal-close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 0.5rem;
  border: none;
  background: transparent;
  color: var(--color-text-muted);
  cursor: pointer;
  transition: all 0.2s ease;
}

.modal-close:hover {
  background: var(--color-bg-alt);
  color: var(--color-text);
}

.modal-icon {
  width: 20px;
  height: 20px;
  stroke-width: 2.5;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.modal-preview {
  padding: 0.9rem 1.25rem;
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: flex-start;
  gap: 0.7rem;
  background: var(--color-bg-alt);
  flex-shrink: 0;
}

.preview-avatar div {
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.5rem;
  font-weight: 800;
  flex-shrink: 0;
}

.preview-text {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  line-height: 1.5;
}

.modal-content {
  flex: 1;
  overflow-y: auto;
  padding: 0.75rem 1.25rem 1.25rem;
}

@media (min-width: 640px) {
  .modal-overlay {
    align-items: center;
  }

  .modal-shell {
    border-radius: var(--radius-lg);
  }
}

/* ===== Responsive ===== */
@media (max-width: 1024px) {
  .community-grid {
    grid-template-columns: 1fr;
  }

  .side-column {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 640px) {
  .community-page {
    padding: 1rem 1rem;
  }

  .community-hero {
    padding: 1.5rem;
    flex-direction: column;
    align-items: flex-start;
  }

  .side-column {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>