<template>
  <div class="space-y-6">
    <h3 class="text-lg font-black text-slate-900 border-b border-slate-200 pb-2">
      Comments <span v-if="comments.length">({{ comments.length }})</span>
    </h3>

    <form v-if="currentUser" @submit.prevent="submitComment" class="space-y-3">
      <textarea
        v-model="newComment"
        rows="3"
        class="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900 resize-none"
        placeholder="Share your thoughts on this article..."
        required
      />
      <div class="flex items-center gap-3">
        <button
          type="submit"
          :disabled="commentLoading || !newComment.trim()"
          class="rounded-lg bg-slate-900 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-slate-800 disabled:opacity-50"
        >
          {{ commentLoading ? 'Posting...' : 'Post comment' }}
        </button>
        <p v-if="commentError" class="text-xs font-semibold text-rose-500">{{ commentError }}</p>
      </div>
    </form>

    <p v-else class="text-sm text-slate-500 italic">
      <NuxtLink to="/auth" class="text-red-700 font-semibold hover:underline">Sign in</NuxtLink> to leave a comment.
    </p>

    <div v-if="comments.length" class="space-y-4">
      <div
        v-for="comment in comments"
        :key="comment.id"
        class="rounded-lg border border-slate-100 bg-white p-4 shadow-sm"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <div class="flex items-center gap-2">
              <div
                class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                :style="{ background: comment.authorColor }"
              >
                {{ getInitials(comment.author_name || comment.user_email || 'Anonymous') }}
              </div>
              <span class="text-sm font-bold text-slate-900 truncate">
                {{ comment.author_name || comment.user_email?.split('@')[0] || 'Anonymous' }}
              </span>
              <span class="text-xs text-slate-400">{{ formatTime(comment.created_at) }}</span>
            </div>
            <p class="mt-2 text-sm text-slate-700 leading-relaxed">{{ comment.content }}</p>
          </div>
          <button
            v-if="comment.user_id === currentUserId"
            class="shrink-0 text-xs text-slate-400 hover:text-red-600 transition-colors"
            @click="deleteComment(comment.id)"
            title="Delete comment"
          >
            ✕
          </button>
        </div>
      </div>
    </div>

    <p v-else class="text-sm text-slate-400 text-center py-4">
      No comments yet. Be the first to share your thoughts.
    </p>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  articleId: {
    type: String,
    required: true
  }
})

const supabase = useSupabaseClient()

const comments = ref([])
const newComment = ref('')
const commentLoading = ref(false)
const commentError = ref('')
const currentUser = ref(null)
const currentUserId = ref(null)

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
  if (mins < 60) return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return date.toLocaleDateString()
}

const fetchComments = async () => {
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('article_id', props.articleId)
    .order('created_at', { ascending: false })

  if (!error && data) {
    comments.value = data.map(comment => ({
      ...comment,
      authorColor: accentColors[Math.floor(Math.random() * accentColors.length)]
    }))
  }
}

const submitComment = async () => {
  if (!newComment.value.trim() || !currentUser.value) return

  commentLoading.value = true
  commentError.value = ''

  const authorName = currentUser.value.user_metadata?.display_name || currentUser.value.user_metadata?.full_name || ''

  const { error } = await supabase
    .from('comments')
    .insert({
      article_id: props.articleId,
      user_id: currentUser.value.id,
      content: newComment.value.trim(),
      author_name: authorName,
      user_email: currentUser.value.email
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
    .from('comments')
    .delete()
    .eq('id', commentId)

  if (!error) {
    comments.value = comments.value.filter(c => c.id !== commentId)
  }
}

let subscription = null

onMounted(async () => {
  // Get the current user session directly from Supabase
  const { data: { session } } = await supabase.auth.getSession()
  if (session?.user) {
    currentUser.value = session.user
    currentUserId.value = session.user.id
  }

  await fetchComments()

  subscription = supabase
    .channel(`comments:${props.articleId}`)
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'comments',
      filter: `article_id=eq.${props.articleId}`
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
