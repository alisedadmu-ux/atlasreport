<template>
  <div class="max-w-4xl mx-auto px-5 py-10 sm:px-6 lg:px-8">
    <!-- Loading -->
    <div v-if="loading" class="animate-pulse space-y-6">
      <div class="h-32 bg-slate-200 rounded-xl"></div>
      <div class="space-y-3">
        <div class="h-4 w-48 bg-slate-200 rounded"></div>
        <div class="h-3 w-64 bg-slate-200 rounded"></div>
      </div>
    </div>

    <template v-else-if="profile">
      <!-- Back button -->
      <button
        @click="goBack"
        class="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-slate-700 transition-colors mb-6"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
        </svg>
        Back to Community
      </button>

      <!-- Profile header -->
      <div class="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <!-- Banner -->
        <div class="h-24 sm:h-32 bg-gradient-to-r from-slate-800 to-slate-600"></div>

        <div class="px-6 pb-6">
          <!-- Avatar and actions -->
          <div class="flex items-end justify-between -mt-12 mb-4">
            <div
              class="flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full text-2xl font-bold text-white ring-4 ring-white shadow-lg"
              :style="{ background: profileColor }"
            >
              {{ getInitials(profile.display_name || profile.email || 'U') }}
            </div>

            <div class="flex gap-2">
              <button
                v-if="currentUser && profile.user_id !== currentUserId"
                @click="toggleFollow"
                class="text-sm font-bold px-5 py-2 rounded-full border transition-all duration-150"
                :class="isFollowing
                  ? 'border-slate-300 text-slate-500 hover:border-red-300 hover:text-red-500'
                  : 'border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white'"
              >
                {{ isFollowing ? 'Following' : 'Follow' }}
              </button>

              <!-- Edit profile for own profile -->
              <button
                v-if="currentUser && profile.user_id === currentUserId"
                @click="editing = true"
                class="text-sm font-bold px-5 py-2 rounded-full border border-slate-300 text-slate-700 hover:bg-slate-100 transition-all"
              >
                Edit Profile
              </button>
            </div>
          </div>

          <!-- Profile info -->
          <h1 class="text-xl font-black text-slate-900">{{ profile.display_name || profile.email?.split('@')[0] || 'Anonymous' }}</h1>
          <p v-if="profile.bio" class="mt-1 text-sm text-slate-600 leading-relaxed">{{ profile.bio }}</p>
          <p v-else class="mt-1 text-sm text-slate-400 italic">No bio yet.</p>

          <!-- Stats -->
          <div class="flex items-center gap-6 mt-4">
            <div class="text-center">
              <p class="text-lg font-black text-slate-900">{{ stats.posts }}</p>
              <p class="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Posts</p>
            </div>
            <div class="text-center">
              <p class="text-lg font-black text-slate-900">{{ stats.followers }}</p>
              <p class="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Followers</p>
            </div>
            <div class="text-center">
              <p class="text-lg font-black text-slate-900">{{ stats.following }}</p>
              <p class="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Following</p>
            </div>
            <div class="text-center">
              <p class="text-lg font-black text-slate-900">{{ stats.likes }}</p>
              <p class="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Likes</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Edit Profile Modal -->
      <Teleport to="body">
        <div v-if="editing" class="fixed inset-0 z-50 flex items-center justify-center">
          <div class="fixed inset-0 bg-black/40 backdrop-blur-sm" @click="editing = false"></div>
          <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 m-4">
            <h2 class="text-lg font-black text-slate-900 mb-4">Edit Profile</h2>
            <form @submit.prevent="saveProfile" class="space-y-4">
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Display Name</label>
                <input
                  v-model="editForm.display_name"
                  type="text"
                  class="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-slate-900"
                  placeholder="Your display name"
                />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Bio</label>
                <textarea
                  v-model="editForm.bio"
                  rows="3"
                  class="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-slate-900 resize-none"
                  placeholder="Tell us about yourself"
                ></textarea>
              </div>
              <div v-if="profileError" class="text-xs font-semibold text-rose-500">{{ profileError }}</div>
              <div class="flex gap-2 justify-end">
                <button
                  type="button"
                  @click="editing = false"
                  class="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  :disabled="saving"
                  class="rounded-lg bg-slate-900 px-5 py-2 text-xs font-bold text-white hover:bg-slate-800 disabled:opacity-50"
                >
                  {{ saving ? 'Saving...' : 'Save' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Teleport>

      <!-- User's posts -->
      <div class="mt-8">
        <h2 class="text-sm font-black text-slate-900 mb-4">Posts</h2>
        <div v-if="userPosts.length" class="space-y-4">
          <CommunityPostCard
            v-for="post in userPosts"
            :key="post.id"
            :post="post"
            :currentUser="currentUser"
            :currentUserId="currentUserId"
            @delete="deletePost"
            @open-comments="openCommentsModal"
            @follow-changed="handleFollowChanged"
          />
        </div>
        <p v-else class="text-center py-12 text-sm text-slate-400">
          This user hasn't posted anything yet.
        </p>
      </div>
    </template>

    <div v-else class="text-center py-16">
      <div class="text-4xl mb-3">🔍</div>
      <p class="text-slate-400 text-sm">User not found.</p>
      <NuxtLink to="/community" class="text-red-700 font-semibold hover:underline text-sm mt-2 inline-block">Back to Community</NuxtLink>
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
          <div class="flex items-center justify-between p-4 border-b border-slate-200 shrink-0">
            <h3 class="text-sm font-black text-slate-900">Comments</h3>
            <button @click="closeCommentsModal" class="text-slate-400 hover:text-slate-600 p-1">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
          <div class="p-4 border-b border-slate-100 bg-slate-50 shrink-0">
            <div class="flex items-center gap-2 mb-1">
              <div class="flex h-6 w-6 items-center justify-center rounded-full text-[8px] font-bold text-white" :style="{ background: commentsModalPost.authorColor }">
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
import { ref, onMounted } from 'vue'

const route = useRoute()
const router = useRouter()
const supabase = useSupabaseClient()

const userId = route.params.id

const loading = ref(true)
const profile = ref(null)
const userPosts = ref([])
const currentUser = ref(null)
const currentUserId = ref(null)
const isFollowing = ref(false)
const editing = ref(false)
const saving = ref(false)
const profileError = ref('')
const commentsModalPost = ref(null)

const editForm = ref({ display_name: '', bio: '' })
const stats = ref({ posts: 0, followers: 0, following: 0, likes: 0 })

const accentColors = ['#0f172a', '#b91c1c', '#047857', '#b45309', '#1d4ed8', '#7c3aed']

const profileColor = accentColors[Math.floor(Math.random() * accentColors.length)]

const getInitials = (name) => {
  return name
    .split(/[ @._-]/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('')
}

const goBack = () => {
  router.push('/community')
}

const fetchProfile = async () => {
  // Get user's posts to extract profile info
  const { data: posts, error: postsError } = await supabase
    .from('community_posts')
    .select(`
      *,
      post_likes:post_likes(count),
      post_comments:post_comments(count)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (postsError) {
    loading.value = false
    return
  }

  // Get user profile
  const { data: userProfile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', userId)
    .single()

  // Get user email from auth if we can't find posts
  const email = posts?.[0]?.author_email || ''

  profile.value = {
    user_id: userId,
    display_name: userProfile?.display_name || posts?.[0]?.author_name || '',
    bio: userProfile?.bio || '',
    email: email,
    avatar_url: userProfile?.avatar_url || ''
  }

  // Edit form initial values
  editForm.value = {
    display_name: profile.value.display_name,
    bio: profile.value.bio
  }

  // Enrich posts
  userPosts.value = (posts || []).map(post => ({
    ...post,
    like_count: post.post_likes?.[0]?.count || 0,
    comment_count: post.post_comments?.[0]?.count || 0,
    authorColor: profileColor,
    user_liked: false, // will be checked below
    is_following: false // will be checked below
  }))

  // Stats
  if (currentUserId.value) {
    // Check follow status
    const { data: follow } = await supabase
      .from('follows')
      .select('id')
      .eq('follower_id', currentUserId.value)
      .eq('following_id', userId)
      .single()

    isFollowing.value = !!follow

    // Check which posts user liked
    const postIds = userPosts.value.map(p => p.id)
    const { data: likes } = await supabase
      .from('post_likes')
      .select('post_id')
      .in('post_id', postIds)
      .eq('user_id', currentUserId.value)

    const likedIds = new Set(likes?.map(l => l.post_id) || [])
    userPosts.value = userPosts.value.map(p => ({
      ...p,
      user_liked: likedIds.has(p.id)
    }))
  }

  // Calculate stats
  const [followersRes, followingRes] = await Promise.all([
    supabase.from('follows').select('id', { count: 'exact', head: true }).eq('following_id', userId),
    supabase.from('follows').select('id', { count: 'exact', head: true }).eq('follower_id', userId)
  ])

  const totalLikes = userPosts.value.reduce((sum, p) => sum + (p.like_count || 0), 0)

  stats.value = {
    posts: userPosts.value.length,
    followers: followersRes.count || 0,
    following: followingRes.count || 0,
    likes: totalLikes
  }

  loading.value = false
}

const toggleFollow = async () => {
  if (!currentUser.value) return

  if (isFollowing.value) {
    const { error } = await supabase
      .from('follows')
      .delete()
      .eq('follower_id', currentUserId.value)
      .eq('following_id', userId)

    if (!error) {
      isFollowing.value = false
      stats.value.followers = Math.max(0, stats.value.followers - 1)
    }
  } else {
    const { error } = await supabase
      .from('follows')
      .insert({ follower_id: currentUserId.value, following_id: userId })

    if (!error) {
      isFollowing.value = true
      stats.value.followers += 1
    }
  }
}

const saveProfile = async () => {
  if (!currentUser.value) return

  saving.value = true
  profileError.value = ''

  // Upsert profile
  const { error } = await supabase
    .from('user_profiles')
    .upsert({
      user_id: currentUserId.value,
      display_name: editForm.value.display_name.trim(),
      bio: editForm.value.bio.trim(),
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id' })

  saving.value = false

  if (error) {
    profileError.value = error.message
    return
  }

  profile.value.display_name = editForm.value.display_name.trim()
  profile.value.bio = editForm.value.bio.trim()
  editing.value = false
}

const deletePost = async (postId) => {
  const { error } = await supabase
    .from('community_posts')
    .delete()
    .eq('id', postId)

  if (!error) {
    userPosts.value = userPosts.value.filter(p => p.id !== postId)
    stats.value.posts = userPosts.value.length
  }
}

const openCommentsModal = (post) => {
  commentsModalPost.value = post
}

const closeCommentsModal = () => {
  commentsModalPost.value = null
}

const handleFollowChanged = ({ userId: changedUserId, following }) => {
  userPosts.value = userPosts.value.map(p => {
    if (p.user_id === changedUserId) {
      return { ...p, is_following: following }
    }
    return p
  })
}

onMounted(async () => {
  const { data: { session } } = await supabase.auth.getSession()
  if (session?.user) {
    currentUser.value = session.user
    currentUserId.value = session.user.id
  }

  await fetchProfile()
})
</script>