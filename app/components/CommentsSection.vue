<template>
  <div class="comments-section">
    <h3 class="comments-heading">
      Comments
      <span v-if="comments.length" class="comments-count">{{ comments.length }}</span>
    </h3>

    <form v-if="currentUser" @submit.prevent="submitComment" class="comment-form">
      <div class="comment-form-row">
        <div class="comment-avatar-sm">
          <div :style="{ background: currentUserColor }">{{ getInitials(currentUserDisplayName || currentUserEmail || 'U') }}</div>
        </div>
        <div class="comment-form-fields">
          <textarea
            v-model="newComment"
            rows="3"
            class="comment-textarea form-input"
            placeholder="Share your thoughts on this article..."
            aria-label="Comment"
            required
          />
          <button type="submit" :disabled="commentLoading || !newComment.trim()" class="btn btn-primary btn-sm">
            {{ commentLoading ? 'Posting...' : 'Post comment' }}
          </button>
        </div>
      </div>
      <p v-if="commentError" class="form-error">{{ commentError }}</p>
    </form>

    <p v-else class="signin-prompt">
      <NuxtLink to="/auth" class="link-accent">Sign in</NuxtLink> to leave a comment.
    </p>

    <div v-if="comments.length" class="comments-list">
      <p v-if="commentDeleteError" class="delete-error" role="alert">{{ commentDeleteError }}</p>
      <div v-for="comment in comments" :key="comment.id" class="comment-item">
        <div class="comment-meta">
          <div class="comment-avatar">
            <div :style="{ background: comment.authorColor }">{{ getInitials(comment.author_name || comment.user_email || 'A') }}</div>
          </div>
          <div class="comment-meta-main">
            <span class="comment-author">{{ comment.author_name || comment.user_email?.split('@')[0] || 'Anonymous' }}</span>
            <time class="comment-time">{{ formatTime(comment.created_at) }}</time>
          </div>
          <button
            v-if="comment.user_id === currentUserId"
            @click="deleteComment(comment.id)"
            class="comment-delete"
            aria-label="Delete comment"
          >
            <X class="delete-icon" />
          </button>
        </div>
        <p class="comment-text">{{ comment.content }}</p>
      </div>
    </div>

    <p v-else class="empty-comments">
      No comments yet. Be the first to share your thoughts.
    </p>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { getInitials, formatRelativeTime, getAccentColor } from '~/utils/format'
import { X } from '@lucide/vue'

const props = defineProps({ articleId: { type: String, required: true } })
const supabase = useSupabaseClient()

const comments = ref([])
const newComment = ref('')
const commentLoading = ref(false)
const commentError = ref('')
const currentUser = ref(null)
const currentUserId = ref(null)
const currentUserDisplayName = ref('')
const currentUserEmail = ref('')
const currentUserColor = ref('var(--color-accent)')
const commentDeleteError = ref('')

const formatTime = (timestamp) => formatRelativeTime(timestamp)

const fetchComments = async () => {
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('article_id', props.articleId)
    .order('created_at', { ascending: false })
  if (!error && data) {
    comments.value = data.map(c => ({ ...c, authorColor: getAccentColor(c.author_name || c.user_email || c.id) }))
  }
}

const submitComment = async () => {
  if (!newComment.value.trim() || !currentUser.value) return
  commentLoading.value = true
  commentError.value = ''
  const authorName = currentUser.value.user_metadata?.display_name || currentUser.value.user_metadata?.full_name || ''
  const { error } = await supabase.from('comments').insert({
    article_id: props.articleId,
    user_id: currentUser.value.id,
    content: newComment.value.trim(),
    author_name: authorName,
    user_email: currentUser.value.email
  })
  commentLoading.value = false
  if (error) { commentError.value = error.message; return }
  newComment.value = ''
  await fetchComments()
}

const deleteComment = async (commentId) => {
  commentDeleteError.value = ''
  const { error } = await supabase.from('comments').delete().eq('id', commentId)
  if (error) {
    commentDeleteError.value = error.message || 'Failed to delete comment'
  } else {
    comments.value = comments.value.filter(c => c.id !== commentId)
  }
}

let subscription = null

onMounted(async () => {
  const { data: { session } } = await supabase.auth.getSession()
  if (session?.user) {
    currentUser.value = session.user
    currentUserId.value = session.user.id
    currentUserDisplayName.value = session.user.user_metadata?.display_name || session.user.user_metadata?.full_name || ''
    currentUserEmail.value = session.user.email || ''
    currentUserColor.value = getAccentColor(currentUserDisplayName.value || currentUserEmail.value)
  }
  await fetchComments()
  subscription = supabase
    .channel(`comments:${props.articleId}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'comments', filter: `article_id=eq.${props.articleId}` }, async () => await fetchComments())
    .subscribe()
})

onBeforeUnmount(() => { if (subscription) supabase.removeChannel(subscription) })
</script>

<style scoped>
.comments-section {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.comments-heading {
  font-size: 0.9375rem;
  font-weight: 800;
  color: var(--color-text);
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding-bottom: 0.85rem;
  border-bottom: 2px solid var(--color-accent);
}

.comments-count {
  font-size: 0.75rem;
  font-weight: 800;
  padding: 0.2rem 0.55rem;
  border-radius: 9999px;
  background: var(--color-bg-alt);
  color: var(--color-text-muted);
  border: 1px solid var(--color-border);
}

.comment-form {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.comment-form-row {
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
}

.comment-avatar-sm {
  flex-shrink: 0;
}

.comment-avatar-sm div {
  width: 2rem;
  height: 2rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.625rem;
  font-weight: 800;
  flex-shrink: 0;
}

.comment-form-fields {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.comment-textarea {
  width: 100%;
  font-family: inherit;
  font-size: 0.9375rem;
  line-height: 1.6;
  color: var(--color-text);
  resize: vertical;
  min-height: 5rem;
  border-radius: var(--radius-sm);
}

.comment-textarea::placeholder { color: var(--color-text-muted); }

.comment-textarea:focus {
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px var(--color-accent-ring);
}

.signin-prompt {
  font-size: 0.9375rem;
  color: var(--color-text-secondary);
  padding: 1rem 0;
}

.link-accent {
  color: var(--color-accent);
  font-weight: 700;
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.comment-item {
  padding: 1rem;
  border-radius: var(--radius-base);
  background: var(--color-bg-alt);
  border: 1px solid var(--color-border-light);
  transition: background-color 0.15s ease, border-color 0.15s ease;
}

.comment-item:hover {
  background: var(--color-bg-muted);
  border-color: var(--color-border);
}

.comment-meta {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  margin-bottom: 0.6rem;
}

.comment-avatar {
  flex-shrink: 0;
}

.comment-avatar div {
  width: 1.85rem;
  height: 1.85rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.5rem;
  font-weight: 800;
}

.comment-meta-main {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  flex-wrap: wrap;
  flex: 1;
  min-width: 0;
}

.comment-author {
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--color-text);
}

.comment-time {
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

.comment-delete {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 9999px;
  border: none;
  background: transparent;
  color: var(--color-text-muted);
  cursor: pointer;
  padding: 0;
  transition: all 0.2s ease;
}

.delete-icon {
  width: 14px;
  height: 14px;
  stroke-width: 2.5;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.comment-delete:hover {
  color: var(--color-error);
  background: rgba(220, 38, 38, 0.06);
}

.comment-text {
  font-size: 0.9375rem;
  line-height: 1.65;
  color: var(--color-text-secondary);
  margin-left: 2.55rem;
}

.empty-comments {
  font-size: 0.9375rem;
  color: var(--color-text-muted);
  text-align: center;
  padding: 1.25rem 0;
}

.delete-error {
  font-size: 0.8125rem;
  color: var(--color-error);
  font-weight: 700;
}
</style>
