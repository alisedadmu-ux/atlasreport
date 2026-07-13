<template>
  <div class="post-comments">
    <div v-if="comments.length" class="comments-list">
      <div v-for="comment in comments" :key="comment.id" class="comment-list-item">
        <div class="comment-list-avatar">
          <div :style="{ background: comment.authorColor }">{{ getInitials(comment.author_name || 'A') }}</div>
        </div>
        <div class="comment-list-body">
          <div class="comment-list-header">
             <span class="comment-list-author">{{ comment.author_name || 'Anonymous' }}</span>
             <time class="comment-list-time">{{ formatTime(comment.created_at) }}</time>
           </div>
          <p class="comment-list-text">{{ comment.content }}</p>
        </div>
        <button v-if="comment.user_id === currentUserId" @click="deleteComment(comment.id)" class="comment-list-delete" aria-label="Delete comment">
          <X class="delete-icon" />
        </button>
      </div>
    </div>

    <p v-else class="empty-comments">No comments yet. Be the first to reply.</p>

    <template v-if="currentUser">
      <form @submit.prevent="submitComment" class="comment-form">
        <input
          v-model="newComment"
          type="text"
          class="comment-input form-input"
          :placeholder="`Reply to ${postAuthor}...`"
          required
        />
        <button type="submit" :disabled="commentLoading || !newComment.trim()" class="btn btn-primary btn-sm">
          {{ commentLoading ? '...' : 'Reply' }}
        </button>
      </form>
      <p v-if="commentError" class="error-text">{{ commentError }}</p>
    </template>

    <p v-else class="signin-prompt">
      <NuxtLink to="/auth" class="link-accent">Sign in</NuxtLink> to reply.
    </p>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { getInitials, formatRelativeTime, getAccentColor } from '~/utils/format'
import { X } from '@lucide/vue'

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

const formatTime = (timestamp) => formatRelativeTime(timestamp)

const fetchComments = async () => {
  const { data, error } = await supabase
    .from('post_comments')
    .select('id, post_id, user_id, author_name, content, created_at')
    .eq('post_id', props.postId)
    .order('created_at', { ascending: true })
  if (!error && data) {
    comments.value = data.map(c => ({ ...c, authorColor: getAccentColor(c.author_name || c.user_id || c.id) }))
  }
}

  const submitComment = async () => {
  if (!newComment.value.trim() || !props.currentUser) return
  commentLoading.value = true
  commentError.value = ''
  const authorName = props.currentUser.user_metadata?.display_name || props.currentUser.user_metadata?.full_name || ''
  const { error } = await supabase.from('post_comments').insert({
    post_id: props.postId,
    user_id: props.currentUser.id,
    content: newComment.value.trim(),
    author_name: authorName,
    author_avatar: '',
    user_email: authorName
  })
  commentLoading.value = false
  if (error) { commentError.value = error.message; return }
  newComment.value = ''
  await fetchComments()
}

const deleteComment = async (commentId) => {
  const { error } = await supabase.from('post_comments').delete().eq('id', commentId)
  if (!error) comments.value = comments.value.filter(c => c.id !== commentId)
}

let subscription = null

onMounted(async () => {
  await fetchComments()
  subscription = supabase
    .channel(`post_comments:${props.postId}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'post_comments', filter: `post_id=eq.${props.postId}` }, async () => await fetchComments())
    .subscribe()
})

onBeforeUnmount(() => { if (subscription) supabase.removeChannel(subscription) })
</script>

<style scoped>
.post-comments {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 14rem;
  overflow-y: auto;
  padding-right: 0.25rem;
  scrollbar-width: thin;
  scrollbar-color: var(--color-border) transparent;
}

.comments-list::-webkit-scrollbar {
  width: 5px;
}

.comments-list::-webkit-scrollbar-track {
  background: transparent;
}

.comments-list::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: 9999px;
}

.comment-list-item {
  display: flex;
  gap: 0.65rem;
  padding: 0.75rem;
  border-radius: var(--radius-sm);
  background: var(--color-bg-alt);
  border: 1px solid var(--color-border-light);
  transition: background-color 0.15s ease;
}

.comment-list-item:hover {
  background: var(--color-bg-muted);
}

.comment-list-avatar div {
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.5rem;
  font-weight: 800;
  flex-shrink: 0;
}

.comment-list-body {
  flex: 1;
  min-width: 0;
}

.comment-list-header {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-bottom: 0.15rem;
}

.comment-list-author {
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--color-text);
}

.comment-list-time {
  font-size: 0.6875rem;
  color: var(--color-text-muted);
}

.comment-list-text {
  font-size: 0.8125rem;
  line-height: 1.55;
  color: var(--color-text-secondary);
}

.comment-list-delete {
  flex-shrink: 0;
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
  padding: 0;
  transition: all 0.2s ease;
  align-self: center;
}

.delete-icon {
  width: 14px;
  height: 14px;
  stroke-width: 2.5;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.comment-list-delete:hover {
  color: var(--color-error);
  background: rgba(220, 38, 38, 0.06);
}

.comment-form {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.comment-input {
  flex: 1;
  font-family: inherit;
  font-size: 0.875rem;
  color: var(--color-text);
  border-radius: var(--radius-sm);
  padding: 0.6rem 0.9rem;
}

.comment-input::placeholder { color: var(--color-text-muted); }

.comment-input:focus {
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px var(--color-accent-ring);
}

.error-text {
  font-size: 0.75rem;
  color: var(--color-error);
  font-weight: 700;
  margin-top: 0.4rem;
}

.signin-prompt {
  font-size: 0.8125rem;
  color: var(--color-text-muted);
  font-style: italic;
  text-align: center;
  padding: 0.75rem 0;
}

.link-accent {
  color: var(--color-accent);
  font-weight: 700;
  font-style: normal;
}

.empty-comments {
  font-size: 0.8125rem;
  color: var(--color-text-muted);
  text-align: center;
  padding: 0.85rem 0;
}
</style>
