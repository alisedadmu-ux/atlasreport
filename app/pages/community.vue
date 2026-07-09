<template>
  <div class="community-page">
    <section class="community-hero">
      <div class="hero-copy">
        <p class="eyebrow">Community</p>
        <h1>Atlas Report Community</h1>
        <p>Join the discussion, share your perspective, and connect with fellow readers in a calm, thoughtful space.</p>
      </div>
      <div class="hero-side">
        <div class="insight-pill">Live conversations</div>
        <div class="insight-card">
          <span>Reader-led dialogue</span>
          <strong>Fresh reactions from the Atlas audience</strong>
        </div>
      </div>
    </section>

    <div class="community-grid">
      <div class="feed-column">
        <div v-if="currentUser" class="composer-card">
          <CreateCommunityPost
            :currentUser="currentUser"
            :currentUserId="currentUserId"
            @post-created="handlePostCreated"
          />
        </div>

        <div v-else class="sign-in-card">
          <p>
            <NuxtLink to="/auth">Sign in</NuxtLink> to create a post and join the conversation.
          </p>
        </div>

        <div class="tabs-row">
          <button
            @click="feedTab = 'latest'"
            :class="feedTab === 'latest' ? 'active' : ''"
          >
            Latest
          </button>
          <button
            @click="feedTab = 'following'"
            :class="feedTab === 'following' ? 'active' : ''"
          >
            Following
          </button>
          <button
            @click="feedTab = 'trending'"
            :class="feedTab === 'trending' ? 'active' : ''"
          >
            Trending
          </button>
        </div>

        <div v-if="loading" class="feed-stack">
          <div v-for="i in 3" :key="i" class="skeleton-card"></div>
        </div>

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

        <div v-else class="empty-state">
          <div class="empty-emoji">📭</div>
          <p>
            <template v-if="feedTab === 'following'">
              No posts from people you follow yet. Follow some users to see their posts here.
            </template>
            <template v-else>
              No community posts yet. Be the first to start a discussion.
            </template>
          </p>
        </div>
      </div>

      <aside class="side-column">
        <div class="panel-card">
          <h3>Trending topics</h3>
          <div v-if="trendingTopics.length" class="topic-list">
            <button
              v-for="topic in trendingTopics"
              :key="topic"
              @click="searchTopic(topic)"
            >
              #{{ topic }}
            </button>
          </div>
          <p v-else class="muted">No trending topics yet.</p>
        </div>

        <div class="panel-card">
          <h3>Who to follow</h3>
          <div v-if="suggestedUsers.length" class="people-list">
            <div v-for="user in suggestedUsers" :key="user.id" class="person-row">
              <NuxtLink :to="`/community/profile/${user.user_id}`" class="person-avatar">
                <div :style="{ background: user.color }">
                  {{ getInitials(user.display_name || user.email || 'U') }}
                </div>
              </NuxtLink>
              <div class="person-info">
                <NuxtLink :to="`/community/profile/${user.user_id}`">
                  {{ user.display_name || user.email?.split('@')[0] || 'User' }}
                </NuxtLink>
                <p v-if="user.bio">{{ user.bio }}</p>
              </div>
              <button @click="quickFollow(user.user_id)">Follow</button>
            </div>
          </div>
          <p v-else class="muted">No suggestions yet.</p>
        </div>

        <div v-if="currentUser" class="panel-card stats-card">
          <h3>Your stats</h3>
          <div class="stats-grid">
            <div>
              <strong>{{ userStats.posts }}</strong>
              <span>Posts</span>
            </div>
            <div>
              <strong>{{ userStats.followers }}</strong>
              <span>Followers</span>
            </div>
            <div>
              <strong>{{ userStats.following }}</strong>
              <span>Following</span>
            </div>
            <div>
              <strong>{{ userStats.likes }}</strong>
              <span>Likes</span>
            </div>
          </div>
        </div>
      </aside>
    </div>

    <Teleport to="body">
      <div
        v-if="commentsModalPost"
        class="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
        @click.self="closeCommentsModal"
      >
        <div class="fixed inset-0 bg-black/40 backdrop-blur-sm" @click="closeCommentsModal"></div>
        <div class="relative bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-lg max-h-[80vh] overflow-hidden flex flex-col">
          <div class="flex items-center justify-between p-4 border-b border-slate-200 shrink-0">
            <h3 class="text-sm font-black text-slate-900">Comments</h3>
            <button
              @click="closeCommentsModal"
              class="text-slate-400 hover:text-slate-600 transition-colors p-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>

          <div class="p-4 border-b border-slate-100 bg-slate-50 shrink-0">
            <div class="flex items-center gap-2 mb-1">
              <div
                class="flex h-6 w-6 items-center justify-center rounded-full text-[8px] font-bold text-white"
                :style="{ background: commentsModalPost.authorColor }"
              >
                {{ getInitials(commentsModalPost.author_name || commentsModalPost.author_email || 'A') }}
              </div>
              <span class="text-xs font-bold text-slate-900">{{ commentsModalPost.author_name || commentsModalPost.author_email?.split('@')[0] || 'Anonymous' }}</span>
            </div>
            <p class="text-xs text-slate-600 leading-relaxed">{{ commentsModalPost.content }}</p>
          </div>

          <div class="p-4 overflow-y-auto flex-1">
            <PostComments
              :postId="commentsModalPost.id"
              :postAuthor="commentsModalPost.author_name || commentsModalPost.author_email?.split('@')[0] || 'Anonymous'"
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
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'

const supabase = useSupabaseClient()

const posts = ref([])
const loading = ref(true)
const currentUser = ref(null)
const currentUserId = ref(null)
const feedTab = ref('latest')
const commentsModalPost = ref(null)

const accentColors = ['#0f172a', '#b91c1c', '#047857', '#b45309', '#1d4ed8', '#7c3aed']

const getInitials = (name) => {
  return name
    .split(/[ @._-]/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('')
}

// Filter posts based on active tab
const filteredPosts = computed(() => {
  if (feedTab.value === 'latest') {
    return posts.value
  } else if (feedTab.value === 'following') {
    return posts.value.filter(p => p.is_following || p.user_id === currentUserId.value)
  } else {
    // Trending: sort by like count
    return [...posts.value].sort((a, b) => (b.like_count || 0) - (a.like_count || 0))
  }
})

// Trending topics extracted from post content
const trendingTopics = computed(() => {
  const wordCounts = {}
  posts.value.forEach(post => {
    const words = (post.title + ' ' + post.content).toLowerCase().split(/\s+/)
    words.forEach(word => {
      const clean = word.replace(/[^a-z0-9]/g, '')
      if (clean.length > 4 && !['this', 'that', 'with', 'from', 'have', 'been', 'were', 'what', 'when', 'where', 'which', 'their', 'there', 'about', 'would', 'could', 'should'].includes(clean)) {
        wordCounts[clean] = (wordCounts[clean] || 0) + 1
      }
    })
  })
  return Object.entries(wordCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word]) => word)
})

// Suggested users (people with most posts who current user doesn't follow)
const suggestedUsers = ref([])

// User stats
const userStats = ref({ posts: 0, followers: 0, following: 0, likes: 0 })

const fetchPosts = async () => {
  loading.value = true

  // Get posts with like counts and comment counts
  const { data, error } = await supabase
    .from('community_posts')
    .select(`
      *,
      post_likes:post_likes(count),
      post_comments:post_comments(count)
    `)
    .order('created_at', { ascending: false })

  if (!error && data) {
    // Check if user liked each post and follows each author
    let enrichedPosts = data.map(post => ({
      ...post,
      like_count: post.post_likes?.[0]?.count || 0,
      comment_count: post.post_comments?.[0]?.count || 0,
      authorColor: accentColors[Math.floor(Math.random() * accentColors.length)]
    }))

    // If logged in, check likes and follows
    if (currentUserId.value) {
      const postIds = enrichedPosts.map(p => p.id)
      const authorIds = [...new Set(enrichedPosts.map(p => p.user_id).filter(id => id !== currentUserId.value))]

      // Check likes
      const { data: likes } = await supabase
        .from('post_likes')
        .select('post_id')
        .in('post_id', postIds)
        .eq('user_id', currentUserId.value)

      const likedPostIds = new Set(likes?.map(l => l.post_id) || [])

      // Check follows
      const { data: follows } = await supabase
        .from('follows')
        .select('following_id')
        .in('following_id', authorIds)
        .eq('follower_id', currentUserId.value)

      const followedUserIds = new Set(follows?.map(f => f.following_id) || [])

      enrichedPosts = enrichedPosts.map(post => ({
        ...post,
        user_liked: likedPostIds.has(post.id),
        is_following: followedUserIds.has(post.user_id)
      }))
    }

    posts.value = enrichedPosts
  }

  loading.value = false
}

const fetchSuggestedUsers = async () => {
  if (!currentUserId.value) return

  // Get users who have posted, excluding current user
  const { data: postAuthors } = await supabase
    .from('community_posts')
    .select('user_id, author_name, author_email')
    .neq('user_id', currentUserId.value)
    .order('created_at', { ascending: false })

  if (!postAuthors) return

  // Get unique authors
  const uniqueAuthors = []
  const seen = new Set()
  postAuthors.forEach(a => {
    if (!seen.has(a.user_id)) {
      seen.add(a.user_id)
      uniqueAuthors.push(a)
    }
  })

  // Check which ones current user already follows
  const authorIds = uniqueAuthors.map(a => a.user_id)
  const { data: follows } = await supabase
    .from('follows')
    .select('following_id')
    .in('following_id', authorIds)
    .eq('follower_id', currentUserId.value)

  const followedIds = new Set(follows?.map(f => f.following_id) || [])

  // Get profiles for suggested users
  const notFollowed = uniqueAuthors.filter(a => !followedIds.has(a.user_id)).slice(0, 3)

  suggestedUsers.value = notFollowed.map(u => ({
    user_id: u.user_id,
    display_name: u.author_name,
    email: u.author_email,
    bio: '',
    color: accentColors[Math.floor(Math.random() * accentColors.length)]
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

const handlePostCreated = () => {
  fetchPosts()
  fetchUserStats()
  fetchSuggestedUsers()
}

const deletePost = async (postId) => {
  const { error } = await supabase
    .from('community_posts')
    .delete()
    .eq('id', postId)

  if (!error) {
    posts.value = posts.value.filter(p => p.id !== postId)
    fetchUserStats()
  }
}

const openCommentsModal = (post) => {
  commentsModalPost.value = post
}

const closeCommentsModal = () => {
  commentsModalPost.value = null
}

const handleFollowChanged = ({ userId, following }) => {
  // Update is_following on posts
  posts.value = posts.value.map(p => {
    if (p.user_id === userId) {
      return { ...p, is_following: following }
    }
    return p
  })
  fetchSuggestedUsers()
  fetchUserStats()
}

const quickFollow = async (userId) => {
  if (!currentUser.value) return

  const { error } = await supabase
    .from('follows')
    .insert({ follower_id: currentUserId.value, following_id: userId })

  if (!error) {
    suggestedUsers.value = suggestedUsers.value.filter(u => u.user_id !== userId)
    // Update posts
    posts.value = posts.value.map(p => {
      if (p.user_id === userId) {
        return { ...p, is_following: true }
      }
      return p
    })
    fetchUserStats()
  }
}

const searchTopic = (topic) => {
  feedTab.value = 'latest'
  // Simple scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

let subscription = null

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

  // Real-time subscription
  subscription = supabase
    .channel('community_feed')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'community_posts'
    }, async () => {
      await fetchPosts()
    })
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'post_likes'
    }, async () => {
      await fetchPosts()
    })
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'post_comments'
    }, async () => {
      await fetchPosts()
    })
    .subscribe()
})

onBeforeUnmount(() => {
  if (subscription) {
    supabase.removeChannel(subscription)
  }
})
</script>

<style scoped>
.community-page {
  padding: 1rem 0 2rem;
}

.community-hero {
  display: grid;
  grid-template-columns: 1.6fr 0.9fr;
  gap: 1.25rem;
  padding: 2rem;
  margin-bottom: 1.3rem;
  border: 1px solid var(--color-border);
  border-radius: 32px;
  background: linear-gradient(135deg, #fffdf8 0%, #f5ebdc 100%);
  box-shadow: 0 18px 60px rgba(17, 17, 17, 0.05);
}

.hero-copy h1 {
  margin: 0.35rem 0 0.7rem;
  font-size: clamp(1.8rem, 3vw, 2.6rem);
  line-height: 1.05;
  font-weight: 800;
  color: #111111;
  font-family: 'Playfair Display', serif;
}

.hero-copy p {
  margin: 0;
  color: var(--color-text-secondary);
  line-height: 1.7;
  max-width: 640px;
}

.eyebrow {
  font-size: 0.76rem;
  font-weight: 800;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: var(--color-accent);
}

.hero-side {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  justify-content: flex-end;
}

.insight-pill {
  display: inline-flex;
  align-self: flex-start;
  padding: 0.5rem 0.8rem;
  border-radius: 999px;
  background: rgba(17, 17, 17, 0.06);
  color: #222222;
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.insight-card {
  border-radius: 20px;
  border: 1px solid rgba(232, 224, 212, 0.9);
  background: rgba(255, 255, 255, 0.78);
  padding: 1rem 1.1rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.insight-card span {
  color: var(--color-text-muted);
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.22em;
}

.insight-card strong {
  font-size: 0.95rem;
  font-weight: 700;
  color: #111111;
}

.community-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.7fr) 320px;
  gap: 1.2rem;
}

.feed-column,
.side-column {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.composer-card,
.sign-in-card,
.panel-card,
.empty-state,
.skeleton-card {
  border: 1px solid var(--color-border);
  background: rgba(255, 255, 255, 0.85);
  border-radius: 24px;
  box-shadow: 0 10px 30px rgba(17, 17, 17, 0.04);
}

.composer-card,
.sign-in-card,
.panel-card {
  padding: 1rem;
}

.sign-in-card p,
.muted {
  margin: 0;
  color: var(--color-text-secondary);
  font-size: 0.95rem;
}

.sign-in-card a {
  color: var(--color-accent);
  font-weight: 700;
}

.tabs-row {
  display: flex;
  gap: 0.6rem;
  flex-wrap: wrap;
  padding: 0.25rem 0;
}

.tabs-row button {
  border: 1px solid var(--color-border);
  background: rgba(255, 255, 255, 0.75);
  color: var(--color-text-secondary);
  padding: 0.6rem 0.95rem;
  border-radius: 999px;
  font-size: 0.88rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tabs-row button.active {
  background: #111111;
  color: white;
  border-color: #111111;
}

.feed-stack {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

.skeleton-card {
  min-height: 160px;
  padding: 1rem;
  background: linear-gradient(90deg, #f0e8da 0%, #f8f4ea 50%, #f0e8da 100%);
  background-size: 200% 100%;
  animation: shimmer 1.3s infinite;
}

.empty-state {
  padding: 2rem 1rem;
  text-align: center;
}

.empty-emoji {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.panel-card h3 {
  margin: 0 0 0.8rem;
  font-size: 0.95rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: #111111;
}

.topic-list,
.people-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.topic-list button {
  width: 100%;
  text-align: left;
  border: 0;
  background: transparent;
  color: var(--color-text-secondary);
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0.35rem 0;
}

.person-row {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.person-avatar {
  flex-shrink: 0;
}

.person-avatar div {
  width: 36px;
  height: 36px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.72rem;
  font-weight: 800;
}

.person-info {
  min-width: 0;
  flex: 1;
}

.person-info a {
  display: block;
  font-size: 0.84rem;
  font-weight: 700;
  color: #111111;
}

.person-info p {
  margin: 0.2rem 0 0;
  font-size: 0.72rem;
  color: var(--color-text-muted);
}

.person-row button {
  border: 1px solid var(--color-border);
  background: white;
  color: #111111;
  padding: 0.4rem 0.65rem;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 700;
  cursor: pointer;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.7rem;
}

.stats-grid div {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  padding: 0.75rem;
  border-radius: 16px;
  background: #f8f4ea;
}

.stats-grid strong {
  font-size: 1rem;
  color: #111111;
}

.stats-grid span {
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: var(--color-text-muted);
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

@media (max-width: 1024px) {
  .community-hero,
  .community-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .community-hero {
    padding: 1.2rem;
    border-radius: 22px;
  }

  .stats-grid {
    grid-template-columns: 1fr 1fr;
  }
}
</style>