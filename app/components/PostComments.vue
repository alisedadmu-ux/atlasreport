<template>
  <div>
    <!-- Comments list -->
    <div v-if="comments.length" class="space-y-3 max-h-80 overflow-y-auto pr-1">
      <div
        v-for="comment in comments"
        :key="comment.id"
        class="flex gap-2.5 p-3 rounded-lg bg-slate-50 border border-slate-100"
      >
        <div
          class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
          :style="{ background: comment.authorColor }"
        >
          {{ getInitials(comment.author_name || comment.user_email || 'A') }}
        </div>
        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-2">
            <span class="text-xs font-bold text-slate-900 truncate">
              {{ comment.author_name || comment.user_email?.split('@')[0] || 'Anonymous' }}
            </span>
            <span class="text-[10px] text-slate-400">{{ formatTime(comment.created_at) }}</span>
          </div>
          <p class="mt-0.5 text-xs text-slate-700 leading-relaxed">{{ comment.content }}</p>
        </div>
        <button
          v-if="comment.user_id === currentUserId"
          @click="deleteComment(comment.id)"
          class="shrink-0 text-[10px] text-slate-400 hover:text-red-500 transition-colors self-start mt-0.5"
          title="Delete comment"
        >
          ✕
        </button>
      </div>
    </div>

    <p v-else class="text-xs text-slate-400 text-center py-6">
      No comments yet. Be the first to reply.
    </p>

    <!-- Comment input -->
    <form v-if="currentUser" @submit.prevent="submitComment" class="mt-3 flex gap-2">
      <input
        v-model="newComment"
        type="text"
        class="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 outline-none transition focus:border-slate-900"
        :placeholder="`Reply to ${postAuthor}...`"
        required
      />
      <button
        type="submit"
        :disabled="commentLoading || !newComment.trim()"
        class="rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-bold text-white transition hover:bg-slate-800 disabled:opacity-50 shrink-0"
      >
        {{ commentLoading ? '...' : 'Reply' }}
      </button>
    </form>

    <p v-else class="mt-3 text-xs text-slate-400 italic text-center">
      <NuxtLink to="/auth" class="text-red-700 font-semibold hover:underline">Sign in</NuxtLink> to reply.
    </p>

    <p v-if="commentError" class="mt-2 text-xs font-semibold text-rose-500">{{ commentError }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  postId: { type: String, required: true },
  postAuthor: { type: String, default: '' },
  currentUser: { type: Object, default: null },
  currentUserId: { type: String, default: null }
})

const supabase = useSupabaseClient()

const comments = ref([])
const newComment = ref('')
const commentLoading = ref(false)
const commentError = ref('')

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

const fetchComments = async () => {
  const { data, error } = await supabase
    .from('post_comments')
    .select('*')
    .eq('post_id', props.postId)
    .order('created_at', { ascending: true })

  if (!error && data) {
    comments.value = data.map(comment => ({
      ...comment,
      authorColor: accentColors[Math.floor(Math.random() * accentColors.length)]
    }))
  }
}

const submitComment = async () => {
  if (!newComment.value.trim() || !props.currentUser) return

  commentLoading.value = true
  commentError.value = ''

  const authorName = props.currentUser.user_metadata?.display_name || props.currentUser.user_metadata?.full_name || ''

  const { error } = await supabase
    .from('post_comments')
    .insert({
      post_id: props.postId,
      user_id: props.currentUser.id,
      content: newComment.value.trim(),
      author_name: authorName,
      author_avatar: ''
    })

  commentLoading.value = false

  if (error) {
    commentError.value = error.message
    return
  }

  newComment.value = ''
  await fetchComments()
}

const deleteComment = async (commentId) => {
  const { error } = await supabase
    .from('post_comments')
    .delete()
    .eq('id', commentId)

  if (!error) {
    comments.value = comments.value.filter(c => c.id !== commentId)
  }
}

let subscription = null

onMounted(async () => {
  await fetchComments()

  subscription = supabase
    .channel(`post_comments:${props.postId}`)
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'post_comments',
      filter: `post_id=eq.${props.postId}`
    }, async () => {
      await fetchComments()
    })
    .subscribe()
})

onBeforeUnmount(() => {
  if (subscription) {
    supabase.removeChannel(subscription)
  }
})
</script>