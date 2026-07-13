<template>
  <div class="profile-detail-page">
    <div class="site-container">
      <template v-if="loading">
        <div class="skeleton skeleton-banner"></div>
        <div class="skeleton skeleton-avatar"></div>
        <div class="skeleton skeleton-text" style="max-width: 240px;"></div>
      </template>

      <template v-else-if="profile">
        <button @click="goBack" class="back-link">
          <ArrowLeft class="back-icon" />
          Back to Community
        </button>

        <div class="profile-card">
          <div class="profile-banner" :style="{ background: profileBanner }"></div>
          <div class="profile-main">
            <div class="profile-avatar-box">
              <div class="profile-avatar" :style="{ background: profileColor }">
                {{ getInitials(profile.display_name || profile.email || 'U') }}
              </div>
            </div>

            <div class="profile-actions">
              <button
                v-if="currentUser && profile.user_id !== currentUserId"
                @click="toggleFollow"
                :class="['btn', isFollowing ? 'btn-secondary' : 'btn-primary']"
              >
                {{ isFollowing ? 'Following' : 'Follow' }}
              </button>
              <button
                v-if="currentUser && profile.user_id === currentUserId"
                @click="editing = true"
                class="btn btn-secondary"
              >
                Edit Profile
              </button>
            </div>

            <div class="profile-info">
              <h1>{{ profile.display_name || profile.email?.split('@')[0] || 'Anonymous' }}</h1>
              <p v-if="profile.bio" class="profile-bio">{{ profile.bio }}</p>
              <p v-else class="profile-bio-empty">No bio yet.</p>
            </div>

            <div class="profile-stats">
              <div class="stat-item">
                <span class="stat-value">{{ stats.posts }}</span>
                <span class="stat-label">Posts</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">{{ stats.followers }}</span>
                <span class="stat-label">Followers</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">{{ stats.following }}</span>
                <span class="stat-label">Following</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">{{ stats.likes }}</span>
                <span class="stat-label">Likes</span>
              </div>
            </div>
          </div>
        </div>

        <Teleport to="body">
          <div v-if="editing" class="modal-overlay" @click.self="editing = false" @keydown.esc="editing = false">
            <div class="modal-backdrop" @click="editing = false"></div>
            <div class="modal-shell" role="dialog" aria-modal="true" aria-label="Edit profile">
              <div class="modal-header">
                <h3 class="modal-title">Edit Profile</h3>
                <button @click="editing = false" class="modal-close" aria-label="Close">
                  <X class="modal-icon" />
                </button>
              </div>
              <div class="modal-body">
                <form @submit.prevent="saveProfile" class="profile-form">
                  <div class="form-group">
                    <label class="form-label" for="editName">Display name</label>
                    <input id="editName" v-model="editForm.display_name" type="text" class="form-input" placeholder="Your display name" />
                  </div>
                  <div class="form-group">
                    <label class="form-label" for="editBio">Bio</label>
                    <textarea id="editBio" v-model="editForm.bio" rows="3" class="form-input form-textarea" placeholder="Tell us about yourself" />
                  </div>
                  <div v-if="profileError" class="form-error">{{ profileError }}</div>
                  <div class="form-footer">
                    <button type="button" @click="editing = false" class="btn btn-secondary">Cancel</button>
                    <button type="submit" :disabled="saving" class="btn btn-primary">
                      {{ saving ? 'Saving...' : 'Save' }}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </Teleport>

        <div class="user-posts">
          <h2 class="section-title">Posts</h2>
          <div v-if="userPosts.length" class="feed-stack">
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
          <div v-else class="empty-state">
            <p class="empty-desc">This user hasn't posted anything yet.</p>
          </div>
        </div>
      </template>

      <div v-else class="empty-state">
        <div class="empty-icon">
          <Search class="empty-icon-svg" />
        </div>
        <p class="empty-title">User not found</p>
        <NuxtLink to="/community" class="btn btn-primary">Back to Community</NuxtLink>
      </div>
    </div>

    <Teleport to="body">
      <div v-if="commentsModalPost" class="modal-overlay" @click.self="closeCommentsModal" @keydown.esc="closeCommentsModal">
        <div class="modal-backdrop" @click="closeCommentsModal"></div>
        <div class="modal-shell" role="dialog" aria-modal="true" aria-label="Comments">
          <div class="modal-header">
            <h3 class="modal-title">Comments</h3>
            <button @click="closeCommentsModal" class="modal-close" aria-label="Close comments">
              <X class="modal-icon" />
            </button>
          </div>
          <div class="modal-preview">
            <div class="preview-avatar"><div :style="{ background: commentsModalPost.authorColor }">{{ getInitials(commentsModalPost.author_name || commentsModalPost.author_email || 'A') }}</div></div>
            <p class="preview-text">{{ commentsModalPost.content }}</p>
          </div>
          <div class="modal-body">
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
import { useRoute, useRouter } from 'vue-router'
import { getInitials, getAccentColor } from '~/utils/format'
import { ArrowLeft, Search, X } from '@lucide/vue'
import CommunityPostCard from '~/components/CommunityPostCard.vue'
import PostComments from '~/components/PostComments.vue'

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

const profileColor = getAccentColor(userId)
const profileBanner = `linear-gradient(135deg, ${profileColor}2E 0%, ${profileColor}14 45%, var(--color-bg-alt) 100%)`

const goBack = () => router.push('/community')

const fetchProfile = async () => {
  const { data: posts, error: postsError } = await supabase
    .from('community_posts')
    .select('*, post_likes:post_likes(count), post_comments:post_comments(count)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (postsError) { loading.value = false; return }

  const { data: userProfile } = await supabase.from('user_profiles').select('*').eq('user_id', userId).single()
  const email = posts?.[0]?.author_email || ''

  profile.value = {
    user_id: userId,
    display_name: userProfile?.display_name || posts?.[0]?.author_name || '',
    bio: userProfile?.bio || '',
    email,
    avatar_url: userProfile?.avatar_url || ''
  }
  editForm.value = { display_name: profile.value.display_name, bio: profile.value.bio }

  userPosts.value = (posts || []).map(post => ({
    ...post,
    like_count: post.post_likes?.[0]?.count || 0,
    comment_count: post.post_comments?.[0]?.count || 0,
    authorColor: profileColor,
    user_liked: false,
    is_following: false
  }))

  if (currentUserId.value) {
    const { data: follow } = await supabase.from('follows').select('id').eq('follower_id', currentUserId.value).eq('following_id', userId).single()
    isFollowing.value = !!follow

    const postIds = userPosts.value.map(p => p.id)
    const { data: likes } = await supabase.from('post_likes').select('post_id').in('post_id', postIds).eq('user_id', currentUserId.value)
    const likedIds = new Set(likes?.map(l => l.post_id) || [])
    userPosts.value = userPosts.value.map(p => ({ ...p, user_liked: likedIds.has(p.id), is_following: isFollowing.value }))
  }

  const [followersRes, followingRes] = await Promise.all([
    supabase.from('follows').select('id', { count: 'exact', head: true }).eq('following_id', userId),
    supabase.from('follows').select('id', { count: 'exact', head: true }).eq('follower_id', userId)
  ])
  const totalLikes = userPosts.value.reduce((sum, p) => sum + (p.like_count || 0), 0)
  stats.value = { posts: userPosts.value.length, followers: followersRes.count || 0, following: followingRes.count || 0, likes: totalLikes }

  loading.value = false
}

const toggleFollow = async () => {
  if (!currentUser.value) return
  if (isFollowing.value) {
    const { error } = await supabase.from('follows').delete().eq('follower_id', currentUserId.value).eq('following_id', userId)
    if (!error) { isFollowing.value = false; stats.value.followers = Math.max(0, stats.value.followers - 1) }
  } else {
    const { error } = await supabase.from('follows').insert({ follower_id: currentUserId.value, following_id: userId })
    if (!error) { isFollowing.value = true; stats.value.followers += 1 }
  }
}

const saveProfile = async () => {
  if (!currentUser.value) return
  saving.value = true
  profileError.value = ''
  const { error } = await supabase.from('user_profiles').upsert({
    user_id: currentUserId.value,
    display_name: editForm.value.display_name.trim(),
    bio: editForm.value.bio.trim(),
    updated_at: new Date().toISOString()
  }, { onConflict: 'user_id' })
  saving.value = false
  if (error) { profileError.value = error.message; return }
  profile.value.display_name = editForm.value.display_name.trim()
  profile.value.bio = editForm.value.bio.trim()
  editing.value = false
}

const deletePost = async (postId) => {
  const { error } = await supabase.from('community_posts').delete().eq('id', postId)
  if (!error) { userPosts.value = userPosts.value.filter(p => p.id !== postId); stats.value.posts = userPosts.value.length }
}

const openCommentsModal = (post) => { commentsModalPost.value = post }
const closeCommentsModal = () => { commentsModalPost.value = null }
const handleFollowChanged = ({ userId: changedUserId, following }) => {
  userPosts.value = userPosts.value.map(p => (p.user_id === changedUserId ? { ...p, is_following: following } : p))
}

onMounted(async () => {
  const { data: { session } } = await supabase.auth.getSession()
  if (session?.user) { currentUser.value = session.user; currentUserId.value = session.user.id }
  await fetchProfile()
})
</script>

<style scoped>
.profile-detail-page {
  padding: 2rem 0;
}

.profile-card {
  border: 1px solid var(--color-border);
  background: var(--color-card-bg);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-xs);
  margin-top: 0.75rem;
  margin-bottom: 1.5rem;
}

.profile-banner {
  height: 8rem;
  width: 100%;
  background-size: cover;
  background-position: center;
}

.profile-main {
  padding: 0 1.5rem 1.5rem;
  position: relative;
}

.profile-avatar-box {
  margin-top: -2.75rem;
}

.profile-avatar {
  width: 5rem;
  height: 5rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;
  font-weight: 800;
  border: 4px solid var(--color-card-bg);
  box-shadow: var(--shadow-base);
}

.profile-actions {
  display: flex;
  gap: 0.5rem;
  margin: 1rem 0 0 auto;
  justify-content: flex-end;
}

.profile-info {
  margin-top: 0.75rem;
}

.profile-info h1 {
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--color-text);
}

.profile-bio {
  font-size: 0.9375rem;
  line-height: 1.6;
  color: var(--color-text-secondary);
  margin-top: 0.35rem;
}

.profile-bio-empty {
  font-size: 0.9375rem;
  color: var(--color-text-muted);
  font-style: italic;
  margin-top: 0.35rem;
}

.profile-stats {
  display: flex;
  gap: 1.5rem;
  margin-top: 1.25rem;
  padding-top: 1.25rem;
  border-top: 1px solid var(--color-border);
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.stat-value {
  font-size: 1.0625rem;
  font-weight: 800;
  color: var(--color-text);
}

.stat-label {
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-text-muted);
}

.user-posts {
  margin-top: 1rem;
}

.section-title {
  font-size: 0.9375rem;
  font-weight: 800;
  color: var(--color-text);
  margin-bottom: 0.75rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--color-border);
}

.feed-stack {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.8125rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-accent);
  margin-bottom: 0.75rem;
  background: none;
  border: none;
  padding: 0.25rem 0;
  cursor: pointer;
  font-family: inherit;
}

.back-icon {
  width: 16px;
  height: 16px;
  stroke-width: 2.5;
  stroke-linecap: round;
  stroke-linejoin: round;
}

@media (max-width: 640px) {
  .profile-banner { height: 6rem; }
  .profile-stats { gap: 1rem; }
}

/* Modal (shared) */
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
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
}

.modal-shell {
  position: relative;
  width: 100%;
  max-width: 28rem;
  max-height: 80vh;
  background: var(--color-bg);
  border-radius: var(--radius-xl) var(--radius-xl) 0 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: var(--shadow-xl);
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
  transition: all 0.15s ease;
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

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 1rem 1.25rem 1.25rem;
}

.modal-preview {
  padding: 0.85rem 1.25rem;
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: flex-start;
  gap: 0.65rem;
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

.profile-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.form-label {
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--color-text);
  display: block;
}

.form-input {
  width: 100%;
  font-family: inherit;
  font-size: 0.9375rem;
  color: var(--color-text);
  background: var(--color-input-bg);
  border: 1px solid var(--color-input-border);
  border-radius: var(--radius-sm);
  padding: 0.7rem 1rem;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.form-input::placeholder { color: var(--color-text-muted); }

.form-input:focus {
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px var(--color-accent-ring);
}

.form-textarea {
  resize: vertical;
  min-height: 5rem;
}

.form-error {
  font-size: 0.8125rem;
  color: var(--color-error);
  font-weight: 700;
}

.form-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 5rem 1rem;
  gap: 0.85rem;
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
  font-size: 1.125rem;
  font-weight: 800;
  color: var(--color-text);
}

.empty-desc {
  font-size: 0.9375rem;
  color: var(--color-text-secondary);
  max-width: 420px;
  margin: 0 auto;
}

@media (min-width: 640px) {
  .modal-overlay { align-items: center; }
  .modal-shell { border-radius: var(--radius-lg); }
}
</style>
