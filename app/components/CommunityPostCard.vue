<template>
  <div class="rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
    <!-- Post header: avatar, name, timestamp, follow button -->
    <div class="flex items-start gap-3 p-4 pb-2">
      <button @click="navigateToProfile" class="shrink-0">
        <div
          class="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white ring-2 ring-white shadow-sm hover:opacity-80 transition-opacity"
          :style="{ background: post.authorColor }"
        >
          {{ getInitials(post.author_name || post.author_email || 'A') }}
        </div>
      </button>
      <div class="min-w-0 flex-1">
        <div class="flex items-center gap-2">
          <button @click="navigateToProfile" class="text-sm font-bold text-slate-900 hover:underline truncate">
            {{ post.author_name || post.author_email?.split('@')[0] || 'Anonymous' }}
          </button>
          <span class="text-xs text-slate-400 shrink-0">· {{ formatTime(post.created_at) }}</span>
        </div>
        <p v-if="post.author_bio" class="text-xs text-slate-400 truncate mt-0.5">{{ post.author_bio }}</p>
      </div>
      <div class="flex items-center gap-2 shrink-0">
        <!-- Follow button -->
        <button
          v-if="currentUser && post.user_id !== currentUserId"
          @click.stop="toggleFollow(post.user_id)"
          :disabled="followLoading === post.user_id"
          class="text-xs font-bold px-3 py-1.5 rounded-full border transition-all duration-150"
          :class="isFollowing 
            ? 'border-slate-300 text-slate-500 hover:border-red-300 hover:text-red-500 hover:bg-red-50' 
            : 'border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white'"
        >
          {{ followLoading === post.user_id ? '...' : isFollowing ? 'Following' : 'Follow' }}
        </button>
        <!-- Delete button (own post only) -->
        <button
          v-if="post.user_id === currentUserId"
          @click.stop="$emit('delete', post.id)"
          class="text-xs text-slate-400 hover:text-red-500 transition-colors p-1"
          title="Delete post"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Post content -->
    <div class="px-4 pb-2">
      <h3 v-if="post.title" class="text-base font-bold text-slate-900 mb-1">{{ post.title }}</h3>
      <p class="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{{ post.content }}</p>
    </div>

    <!-- Post image -->
    <div v-if="post.image_url" class="px-4 pb-3">
      <img
        :src="post.image_url"
        alt="Post image"
        class="w-full max-h-96 object-cover rounded-lg border border-slate-100"
        @click="expandImage"
      />
    </div>

    <!-- Image expanded modal -->
    <div
      v-if="imageExpanded"
      class="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 cursor-pointer"
      @click="imageExpanded = false"
    >
      <img :src="post.image_url" alt="Expanded image" class="max-w-full max-h-full object-contain rounded-lg" />
    </div>

    <!-- Action bar: Like, Comment -->
    <div class="flex items-center gap-1 px-4 pb-1 border-b border-slate-100">
      <!-- Like button -->
      <button
        @click="toggleLike"
        class="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-150"
        :class="liked 
          ? 'text-red-500 bg-red-50 hover:bg-red-100' 
          : 'text-slate-500 hover:text-red-500 hover:bg-red-50'"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" :class="liked ? 'fill-red-500' : ''" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" />
        </svg>
        <span>{{ likeCount }}</span>
      </button>

      <!-- Comment button -->
      <button
        @click="$emit('open-comments', post)"
        class="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-500 hover:text-blue-500 hover:bg-blue-50 transition-all duration-150"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zm-4 0H9v2h2V9z" clip-rule="evenodd" />
        </svg>
        <span>{{ commentCount }}</span>
      </button>

      <!-- Share (copy link) -->
      <button
        @click="sharePost"
        class="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-500 hover:text-green-500 hover:bg-green-50 transition-all duration-150 ml-auto"
        title="Copy link"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
        </svg>
      </button>
    </div>

    <!-- Share toast -->
    <div
      v-if="showShareToast"
      class="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-lg z-50 animate-bounce"
    >
      Link copied to clipboard!
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  post: { type: Object, required: true },
  currentUser: { type: Object, default: null },
  currentUserId: { type: String, default: null }
})

const emit = defineEmits(['delete', 'open-comments', 'follow-changed'])

const supabase = useSupabaseClient()
const router = useRouter()

const liked = ref(false)
const likeCount = ref(0)
const commentCount = ref(0)
const isFollowing = ref(false)
const followLoading = ref(false)
const imageExpanded = ref(false)
const showShareToast = ref(false)

const accentColors = ['#0f172a', '#b91c1c', '#047857', '#b45309', '#1d4ed8', '#7c3aed']

const getInitials = (name) => {
  return name
    .split(/[ @._-]/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('')
}

const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now - date
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m`
  if (hours < 24) return `${hours}h`
  if (days < 7) return `${days}d`
  return date.toLocaleDateString()
}

const navigateToProfile = () => {
  router.push(`/community/profile/${post.user_id}`)
}

const toggleLike = async () => {
  if (!props.currentUser) return

  if (liked.value) {
    // Unlike
    const { error } = await supabase
      .from('post_likes')
      .delete()
      .eq('post_id', props.post.id)
      .eq('user_id', props.currentUserId)

    if (!error) {
      liked.value = false
      likeCount.value = Math.max(0, likeCount.value - 1)
    }
  } else {
    // Like
    const { error } = await supabase
      .from('post_likes')
      .insert({ post_id: props.post.id, user_id: props.currentUserId })

    if (!error) {
      liked.value = true
      likeCount.value += 1
    }
  }
}

const toggleFollow = async (targetUserId) => {
  if (!props.currentUser) return

  followLoading.value = targetUserId

  if (isFollowing.value) {
    const { error } = await supabase
      .from('follows')
      .delete()
      .eq('follower_id', props.currentUserId)
      .eq('following_id', targetUserId)

    if (!error) {
      isFollowing.value = false
      emit('follow-changed', { userId: targetUserId, following: false })
    }
  } else {
    const { error } = await supabase
      .from('follows')
      .insert({ follower_id: props.currentUserId, following_id: targetUserId })

    if (!error) {
      isFollowing.value = true
      emit('follow-changed', { userId: targetUserId, following: true })
    }
  }

  followLoading.value = false
}

const sharePost = async () => {
  const url = `${window.location.origin}/community/post/${props.post.id}`
  try {
    await navigator.clipboard.writeText(url)
  } catch {
    // Fallback
    const textarea = document.createElement('textarea')
    textarea.value = url
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
  }

  showShareToast.value = true
  setTimeout(() => { showShareToast.value = false }, 2000)
}

const expandImage = () => {
  imageExpanded.value = true
}

// Initialize like/comment/follow state from post data
const initState = () => {
  likeCount.value = props.post.like_count || 0
  commentCount.value = props.post.comment_count || 0
  liked.value = props.post.user_liked || false
  isFollowing.value = props.post.is_following || false
}

watch(() => props.post, initState, { immediate: true })
</script>