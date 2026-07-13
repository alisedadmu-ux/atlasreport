<template>
  <article class="post-card">
    <div class="post-header">
      <button @click="navigateToProfile" class="post-avatar" :aria-label="post.author_name || 'View profile'">
        <div class="avatar-circle" :style="{ background: post.authorColor }">
          {{ getInitials(post.author_name || post.author_email || 'A') }}
        </div>
      </button>
      <div class="post-header-main">
        <div class="post-author-row">
          <button @click="navigateToProfile" class="post-author-name">
            {{ post.author_name || post.author_email?.split('@')[0] || 'Anonymous' }}
          </button>
          <span class="post-time">&middot; {{ formatTime(post.created_at) }}</span>
        </div>
        <p v-if="post.author_bio" class="post-bio">{{ truncateText(post.author_bio, 90) }}</p>
      </div>
      <div class="post-header-actions">
        <button
          v-if="currentUser && post.user_id !== currentUserId"
          @click.stop="toggleFollow(post.user_id)"
          :disabled="followLoading === post.user_id"
          class="follow-btn"
          :class="isFollowing ? 'following' : ''"
        >
          {{ followLoading === post.user_id ? '...' : isFollowing ? 'Following' : 'Follow' }}
        </button>
        <button
          v-if="post.user_id === currentUserId"
          @click.stop="$emit('delete', post.id)"
          class="delete-btn"
          title="Delete post"
          aria-label="Delete post"
        >
          <Trash2 class="delete-icon" />
        </button>
      </div>
    </div>

    <div class="post-body">
      <h3 v-if="post.title" class="post-title">{{ post.title }}</h3>
      <p class="post-content">{{ post.content }}</p>
    </div>

    <div v-if="post.image_url" class="post-media">
      <img :src="post.image_url" alt="Post image" loading="lazy" @click="expandImage" class="post-media-img" />
    </div>

      <div v-if="imageExpanded" class="image-expand-overlay" @click="closeImage" role="button" aria-label="Close image" tabindex="0" @keydown.esc="closeImage">
        <img :src="post.image_url" alt="Expanded image" class="image-expand-img" />
      </div>

    <div class="post-actions-bar">
      <button @click="toggleLike" class="action-btn" :class="liked ? 'liked' : ''" :aria-label="liked ? 'Unlike' : 'Like'">
        <Heart class="action-icon" :fill="liked ? 'currentColor' : 'none'" />
        <span class="action-count">{{ likeCount }}</span>
      </button>

      <button @click="$emit('open-comments', post)" class="action-btn" aria-label="Comment">
        <MessageCircle class="action-icon" />
        <span class="action-count">{{ commentCount }}</span>
      </button>

      <button @click="sharePost" class="action-btn" aria-label="Copy link">
        <Share2 class="action-icon" />
      </button>
    </div>
  </article>
</template>

<script setup>
import { ref, watch, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { getInitials, formatRelativeTime, truncateText } from '~/utils/format'
import { Trash2, Heart, MessageCircle, Share2 } from '@lucide/vue'

const props = defineProps({
  post: { type: Object, required: true },
  currentUser: { type: Object, default: null },
  currentUserId: { type: String, default: null }
})

const emit = defineEmits(['delete', 'open-comments', 'follow-changed'])

const router = useRouter()
const supabase = useSupabaseClient()

const liked = ref(false)
const likeCount = ref(0)
const commentCount = ref(0)
const isFollowing = ref(false)
const followLoading = ref(false)
const imageExpanded = ref(false)

const formatTime = (timestamp) => formatRelativeTime(timestamp)

const navigateToProfile = () => {
  router.push(`/community/profile/${props.post.user_id}`)
}

const toggleLike = async () => {
  if (!props.currentUser) return navigateTo('/auth')
  if (liked.value) {
    const { error } = await supabase.from('post_likes').delete().eq('post_id', props.post.id).eq('user_id', props.currentUserId)
    if (!error) { liked.value = false; likeCount.value = Math.max(0, likeCount.value - 1) }
  } else {
    const { error } = await supabase.from('post_likes').insert({ post_id: props.post.id, user_id: props.currentUserId })
    if (!error) { liked.value = true; likeCount.value += 1 }
  }
}

const toggleFollow = async (targetUserId) => {
  if (!props.currentUser) return navigateTo('/auth')
  followLoading.value = targetUserId
  if (isFollowing.value) {
    const { error } = await supabase.from('follows').delete().eq('follower_id', props.currentUserId).eq('following_id', targetUserId)
    if (!error) { isFollowing.value = false; emit('follow-changed', { userId: targetUserId, following: false }) }
  } else {
    const { error } = await supabase.from('follows').insert({ follower_id: props.currentUserId, following_id: targetUserId })
    if (!error) { isFollowing.value = true; emit('follow-changed', { userId: targetUserId, following: true }) }
  }
  followLoading.value = false
}

const sharePost = async () => {
  const url = `${window.location.origin}/community`
  try { await navigator.clipboard.writeText(url) } catch {
    const ta = document.createElement('textarea')
    ta.value = url
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    document.body.removeChild(ta)
  }
}

const expandImage = () => { imageExpanded.value = true }
const closeImage = () => { imageExpanded.value = false }
const onEsc = (e) => { if (e.key === 'Escape') closeImage() }

watch(imageExpanded, (open) => {
  if (open) document.addEventListener('keydown', onEsc)
  else document.removeEventListener('keydown', onEsc)
})

onBeforeUnmount(() => document.removeEventListener('keydown', onEsc))

const initState = () => {
  likeCount.value = props.post.like_count || 0
  commentCount.value = props.post.comment_count || 0
  liked.value = props.post.user_liked || false
  isFollowing.value = props.post.is_following || false
}

watch(() => props.post, initState, { immediate: true })
</script>

<style scoped>
.post-card {
  border: 1px solid var(--color-border);
  background: var(--color-card-bg);
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-xs);
  transition: box-shadow 0.25s ease, transform 0.25s ease;
}

.post-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

.post-header {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem 1.25rem 0;
}

.post-avatar {
  flex-shrink: 0;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  border-radius: 9999px;
  transition: opacity 0.2s ease;
}

.post-avatar:hover { opacity: 0.8; }

.avatar-circle {
  width: 2rem;
  height: 2rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.625rem;
  font-weight: 800;
  transition: opacity 0.2s ease;
}

.post-header-main {
  flex: 1;
  min-width: 0;
}

.post-author-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.post-author-name {
  font-size: 0.875rem;
  font-weight: 800;
  color: var(--color-text);
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  text-align: left;
  transition: color 0.2s ease;
}

.post-author-name:hover {
  color: var(--color-accent);
}

.post-time {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  flex-shrink: 0;
}

.post-bio {
  margin: 0.2rem 0 0;
  font-size: 0.75rem;
  color: var(--color-text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.post-header-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
}

.follow-btn {
  font-size: 0.75rem;
  font-weight: 800;
  padding: 0.35rem 0.85rem;
  border-radius: 9999px;
  border: 1px solid var(--color-border);
  background: transparent;
  color: var(--color-text);
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.follow-btn:hover {
  border-color: var(--color-text-muted);
  color: var(--color-text);
}

.follow-btn.following {
  border-color: var(--color-border);
  color: var(--color-text-muted);
}

.follow-btn.following:hover {
  border-color: var(--color-error);
  color: var(--color-error);
  background: rgba(220, 38, 38, 0.06);
}

.delete-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 9999px;
  border: none;
  background: transparent;
  color: var(--color-text-muted);
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 0;
}

.delete-icon {
  width: 14px;
  height: 14px;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.delete-btn:hover {
  color: var(--color-error);
  background: rgba(220, 38, 38, 0.06);
}

.post-body {
  padding: 0.85rem 1.25rem 0.6rem;
}

.post-title {
  font-size: 1.0625rem;
  font-weight: 800;
  line-height: 1.35;
  color: var(--color-text);
  margin-bottom: 0.4rem;
}

.post-content {
  font-size: 0.9375rem;
  line-height: 1.65;
  color: var(--color-text-secondary);
  white-space: pre-line;
}

.post-media {
  margin: 0.3rem 1rem 0.85rem;
  border-radius: var(--radius-base);
  overflow: hidden;
  background: var(--color-bg-alt);
}

.post-media-img {
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  cursor: pointer;
  transition: transform 0.35s ease;
}

.post-media:hover .post-media-img {
  transform: scale(1.01);
}

.image-expand-overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.88);
  cursor: pointer;
  padding: 1rem;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.image-expand-img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: var(--radius-base);
  animation: scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.92); }
  to { opacity: 1; transform: scale(1); }
}

.post-actions-bar {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 0.75rem 0.85rem;
  border-top: 1px solid var(--color-border-light);
}

.action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  width: 36px;
  height: 36px;
  border-radius: var(--radius-sm);
  border: none;
  background: transparent;
  color: var(--color-text-secondary);
  font-size: 0.8125rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-count {
  font-size: 0.8125rem;
  font-weight: 700;
  min-width: 1rem;
  text-align: center;
}

.action-icon {
  width: 18px;
  height: 18px;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.action-btn:hover {
  background: var(--color-bg-alt);
  color: var(--color-text);
}

.action-btn.liked {
  color: var(--color-error);
}

.action-btn.liked:hover {
  background: rgba(220, 38, 38, 0.06);
}
</style>
