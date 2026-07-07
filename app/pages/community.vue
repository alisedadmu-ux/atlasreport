<template>
  <div class="max-w-6xl mx-auto px-5 py-10 sm:px-6 lg:px-8" :style="{ color: 'var(--color-text)' }">
    <!-- Header -->
    <div class="mb-8">
      <p class="text-xs font-bold uppercase tracking-[0.3em] text-red-700">Community</p>
      <h1 class="mt-3 font-serif text-4xl font-black" :style="{ color: 'var(--color-text)' }">Atlas Report Community</h1>
      <p class="mt-3 max-w-2xl text-sm leading-7" :style="{ color: 'var(--color-text-secondary)' }">
        Join the discussion. Share your thoughts, post photos, and connect with fellow readers.
      </p>
    </div>

    <div class="flex flex-col lg:flex-row gap-8">
      <!-- Main feed -->
      <div class="flex-1 min-w-0">
        <!-- Create post -->
        <div v-if="currentUser" class="mb-6">
          <CreateCommunityPost
            :currentUser="currentUser"
            :currentUserId="currentUserId"
            @post-created="handlePostCreated"
          />
        </div>

        <p v-else class="mb-6 text-sm text-slate-500 italic">
          <NuxtLink to="/auth" class="text-red-700 font-semibold hover:underline">Sign in</NuxtLink> to create a post and join the conversation.
        </p>

        <!-- Feed tabs -->
        <div class="flex items-center gap-1 mb-6 border-b border-slate-200">
          <button
            @click="feedTab = 'latest'"
            class="px-4 py-3 text-sm font-bold transition-colors relative"
            :class="feedTab === 'latest' ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'"
          >
            Latest
            <span v-if="feedTab === 'latest'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900 rounded-full"></span>
          </button>
          <button
            @click="feedTab = 'following'"
            class="px-4 py-3 text-sm font-bold transition-colors relative"
            :class="feedTab === 'following' ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'"
          >
            Following
            <span v-if="feedTab === 'following'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900 rounded-full"></span>
          </button>
          <button
            @click="feedTab = 'trending'"
            class="px-4 py-3 text-sm font-bold transition-colors relative"
            :class="feedTab === 'trending' ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'"
          >
            Trending
            <span v-if="feedTab === 'trending'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900 rounded-full"></span>
          </button>
        </div>

        <!-- Loading state -->
        <div v-if="loading" class="space-y-4">
          <div v-for="i in 3" :key="i" class="rounded-xl border border-slate-200 bg-white p-6 animate-pulse">
            <div class="flex items-center gap-3 mb-4">
              <div class="h-10 w-10 rounded-full bg-slate-200"></div>
              <div class="space-y-2">
                <div class="h-3 w-24 bg-slate-200 rounded"></div>
                <div class="h-2.5 w-16 bg-slate-200 rounded"></div>
              </div>
            </div>
            <div class="space-y-2">
              <div class="h-3 w-3/4 bg-slate-200 rounded"></div>
              <div class="h-3 w-1/2 bg-slate-200 rounded"></div>
            </div>
          </div>
        </div>

        <!-- Posts feed -->
        <div v-else-if="filteredPosts.length" class="space-y-4">
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

        <div v-else class="text-center py-16">
          <div class="text-4xl mb-3">📭</div>
          <p class="text-slate-400 text-sm">
            <template v-if="feedTab === 'following'">
              No posts from people you follow yet. Follow some users to see their posts here!
            </template>
            <template v-else>
              No community posts yet. Be the first to start a discussion.
            </template>
          </p>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="w-full lg:w-80 shrink-0">
        <div class="sticky top-8 space-y-6">
          <!-- Trending topics -->
        <div class="rounded-xl border p-5 shadow-sm" :style="{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-card-bg)' }">
          <h3 class="text-sm font-black mb-4" :style="{ color: 'var(--color-text)' }">Trending Topics</h3>
            <div v-if="trendingTopics.length" class="space-y-3">
              <button
                v-for="topic in trendingTopics"
                :key="topic"
                @click="searchTopic(topic)"
                class="block w-full text-left text-sm font-semibold text-slate-700 hover:text-red-700 transition-colors truncate"
              >
                #{{ topic }}
              </button>
            </div>
            <p v-else class="text-xs text-slate-400">No trending topics yet.</p>
          </div>

          <!-- Who to follow -->
        <div class="rounded-xl border p-5 shadow-sm" :style="{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-card-bg)' }">
          <h3 class="text-sm font-black mb-4" :style="{ color: 'var(--color-text)' }">Who to Follow</h3>
            <div v-if="suggestedUsers.length" class="space-y-3">
              <div
                v-for="user in suggestedUsers"
                :key="user.id"
                class="flex items-center gap-3"
              >
                <NuxtLink :to="`/community/profile/${user.user_id}`" class="shrink-0">
                  <div
                    class="flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-bold text-white"
                    :style="{ background: user.color }"
                  >
                    {{ getInitials(user.display_name || user.email || 'U') }}
                  </div>
                </NuxtLink>
                <div class="min-w-0 flex-1">
                  <NuxtLink :to="`/community/profile/${user.user_id}`" class="text-xs font-bold text-slate-900 hover:underline truncate block">
                    {{ user.display_name || user.email?.split('@')[0] || 'User' }}
                  </NuxtLink>
                  <p v-if="user.bio" class="text-[10px] text-slate-400 truncate">{{ user.bio }}</p>
                </div>
                <button
                  @click="quickFollow(user.user_id)"
                  class="text-[10px] font-bold px-2.5 py-1 rounded-full border border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white transition-all shrink-0"
                >
                  Follow
                </button>
              </div>
            </div>
            <p v-else class="text-xs text-slate-400">No suggestions yet.</p>
          </div>

          <!-- Stats -->
          <div v-if="currentUser" class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 class="text-sm font-black text-slate-900 mb-3">Your Stats</h3>
            <div class="grid grid-cols-2 gap-3">
              <div class="text-center p-2 rounded-lg bg-slate-50">
                <p class="text-lg font-black text-slate-900">{{ userStats.posts }}</p>
                <p class="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Posts</p>
              </div>
              <div class="text-center p-2 rounded-lg bg-slate-50">
                <p class="text-lg font-black text-slate-900">{{ userStats.followers }}</p>
                <p class="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Followers</p>
              </div>
              <div class="text-center p-2 rounded-lg bg-slate-50">
                <p class="text-lg font-black text-slate-900">{{ userStats.following }}</p>
                <p class="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Following</p>
              </div>
              <div class="text-center p-2 rounded-lg bg-slate-50">
                <p class="text-lg font-black text-slate-900">{{ userStats.likes }}</p>
                <p class="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Likes</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Comments Modal -->
    <Teleport to="body">
      <div
        v-if="commentsModalPost"
        class="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
        @click.self="closeCommentsModal"
      >
        <div class="fixed inset-0 bg-black/40 backdrop-blur-sm" @click="closeCommentsModal"></div>
        <div class="relative bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-lg max-h-[80vh] overflow-hidden flex flex-col">
          <!-- Modal header -->
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

          <!-- Original post preview -->
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

          <!-- Comments section -->
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