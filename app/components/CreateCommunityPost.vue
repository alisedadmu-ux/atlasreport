<template>
  <div class="composer" :class="{ 'composer-expanded': expanded }">
    <div class="composer-header">
      <div class="composer-avatar" :style="{ background: userColor }">
        {{ getInitials(userName) }}
      </div>
      <div class="composer-fields" ref="composerRef">
        <input
          v-model="newPost.title"
          v-show="expanded"
          type="text"
          class="composer-input composer-title form-input"
          placeholder="Title (optional)"
        />
        <textarea
          v-model="newPost.content"
          :rows="expanded ? 3 : 1"
          class="composer-input composer-body form-input"
          placeholder="What's happening?"
          @focus="expanded = true"
          required
        />
      </div>
    </div>

    <div v-if="imagePreview" class="composer-preview">
      <img :src="imagePreview" alt="Preview" />
      <button @click="removeImage" class="remove-preview" aria-label="Remove image">
        <X class="remove-icon" />
      </button>
    </div>

    <div v-if="expanded" class="composer-toolbar">
      <div class="toolbar-left">
        <button @click="triggerImageUpload" class="toolbar-btn" title="Add image">
          <Image class="toolbar-icon" />
          <span>Media</span>
        </button>
        <input ref="imageInput" type="file" accept="image/*" class="sr-only" @change="handleImageSelect" />
      </div>
      <div class="toolbar-right">
        <p v-if="postError" class="toolbar-error">{{ postError }}</p>
        <p v-if="postSuccess" class="toolbar-success">{{ postSuccess }}</p>
        <div class="toolbar-actions">
          <button v-if="hasContent" @click="cancelPost" class="toolbar-ghost">Cancel</button>
          <button @click="submitPost" :disabled="postLoading || !newPost.content.trim()" class="btn btn-primary btn-sm">
            {{ postLoading ? 'Posting...' : 'Post' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { getInitials, getAccentColor } from '~/utils/format'
import { X, Image } from '@lucide/vue'

const emit = defineEmits(['post-created'])
const supabase = useSupabaseClient()

const props = defineProps({
  currentUser: { type: Object, default: null },
  currentUserId: { type: String, default: null }
})

const expanded = ref(false)
const composerRef = ref(null)
const newPost = ref({ title: '', content: '' })
const postLoading = ref(false)
const postError = ref('')
const postSuccess = ref('')
const imageFile = ref(null)
const imagePreview = ref('')
const imageInput = ref(null)
const uploading = ref(false)

const userName = computed(() => {
  return props.currentUser?.user_metadata?.display_name || props.currentUser?.user_metadata?.full_name || props.currentUser?.email || 'User'
})

const userColor = computed(() => getAccentColor(userName.value))

const hasContent = computed(() => !!newPost.value.title || !!newPost.value.content || !!imageFile.value)

const handleClickOutside = (event) => {
  if (composerRef.value && !composerRef.value.contains(event.target)) {
    collapseIfEmpty()
  }
}

const collapseIfEmpty = () => {
  if (!newPost.value.title && !newPost.value.content && !imageFile.value) {
    expanded.value = false
  }
}

const triggerImageUpload = () => { imageInput.value?.click() }

const handleImageSelect = (event) => {
  const file = event.target.files?.[0]
  if (!file) return
  if (file.size > 5 * 1024 * 1024) { postError.value = 'Image must be less than 5MB'; return }
  imageFile.value = file
  imagePreview.value = URL.createObjectURL(file)
  postError.value = ''
}

const removeImage = () => {
  imageFile.value = null
  imagePreview.value = ''
  if (imageInput.value) imageInput.value.value = ''
}

const uploadImage = async () => {
  if (!imageFile.value) return ''
  uploading.value = true
  const fileExt = imageFile.value.name.split('.').pop()
  const filePath = `${props.currentUserId}/${Date.now()}.${fileExt}`
  const { error: uploadError } = await supabase.storage.from('post_images').upload(filePath, imageFile.value, { cacheControl: '3600', upsert: false })
  if (uploadError) {
    if (uploadError.message?.includes('Bucket') || uploadError.message?.includes('bucket') || uploadError.message?.includes('not found')) {
      const { error: createError } = await supabase.storage.createBucket('post_images', { public: true, fileSizeLimit: 5242880 })
      if (createError) { uploading.value = false; throw new Error('Storage bucket "post_images" not found. Please run the SQL schema in your Supabase dashboard.') }
      const { error: retryError } = await supabase.storage.from('post_images').upload(filePath, imageFile.value, { cacheControl: '3600', upsert: false })
      if (retryError) { uploading.value = false; throw new Error(retryError.message) }
    } else {
      uploading.value = false
      throw new Error(uploadError.message)
    }
  }
  const { data: { publicUrl } } = supabase.storage.from('post_images').getPublicUrl(filePath)
  uploading.value = false
  return publicUrl
}

const submitPost = async () => {
  if (!newPost.value.content.trim() || !props.currentUser) return
  postLoading.value = true
  postError.value = ''
  postSuccess.value = ''
  let imageUrl = ''
  if (imageFile.value) {
    try { imageUrl = await uploadImage() } catch (err) {
      console.warn('Image upload failed, posting without image:', err.message)
      postError.value = 'Image upload failed, posted without image.'
      imageFile.value = null
      imagePreview.value = ''
      if (imageInput.value) imageInput.value.value = ''
    }
  }
  const authorName = props.currentUser.user_metadata?.display_name || props.currentUser.user_metadata?.full_name || ''
  try {
    const { error } = await supabase.from('community_posts').insert({
      user_id: props.currentUser.id,
      title: newPost.value.title.trim() || '',
      content: newPost.value.content.trim(),
      author_name: authorName,
      author_email: props.currentUser.email,
      image_url: imageUrl
    })
    if (error) {
      if (error.message?.includes('JWT') || error.message?.includes('expired') || error.message?.includes('session')) {
        postError.value = 'Your session expired. Please sign in again and try posting once more.'
      } else {
        postError.value = error.message
      }
      return
    }
    postSuccess.value = 'Posted!'
    newPost.value = { title: '', content: '' }
    imageFile.value = null
    imagePreview.value = ''
    if (imageInput.value) imageInput.value.value = ''
    expanded.value = false
    emit('post-created')
    setTimeout(() => { postSuccess.value = '' }, 3000)
  } catch (err) {
    postError.value = err?.message || 'Unable to post right now. Please try again in a moment.'
  } finally {
    postLoading.value = false
  }
}

const cancelPost = () => {
  newPost.value = { title: '', content: '' }
  imageFile.value = null
  imagePreview.value = ''
  if (imageInput.value) imageInput.value.value = ''
  expanded.value = false
  postError.value = ''
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.composer {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-card-bg);
  box-shadow: var(--shadow-xs);
  overflow: hidden;
  transition: box-shadow 0.2s ease;
}

.composer-expanded {
  box-shadow: var(--shadow-base);
}

.composer-header {
  display: flex;
  gap: 0.85rem;
  padding: 0.75rem 1rem;
}

.composer-avatar {
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

.composer-fields {
  flex: 1;
  min-width: 0;
  border-bottom: 1px solid transparent;
  padding-bottom: 0.5rem;
  transition: border-color 0.2s ease;
}

.composer-expanded .composer-fields {
  border-bottom-color: var(--color-border-light);
}

.composer-input {
  width: 100%;
  font-family: inherit;
  font-size: 0.9375rem;
  color: var(--color-text);
  background: transparent;
  border: none;
  outline: none;
  padding: 0;
  line-height: 1.5;
  border-radius: 0;
}

.composer-input::placeholder { color: var(--color-text-muted); }

.composer-input:focus {
  box-shadow: none;
  border-color: transparent;
}

.composer-title {
  font-weight: 700;
  margin-bottom: 0.35rem;
}

.composer-body {
  resize: none;
  min-height: 1.5rem;
}

.composer-preview {
  position: relative;
  margin: 0 1rem 0.85rem;
  border-radius: var(--radius-base);
  overflow: hidden;
}

.composer-preview img {
  width: 100%;
  max-height: 240px;
  object-fit: cover;
  display: block;
}

.remove-preview {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 9999px;
  background: rgba(0,0,0,0.6);
  color: #fff;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: background-color 0.2s ease;
}

.remove-icon {
  width: 14px;
  height: 14px;
  stroke-width: 2.5;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.remove-preview:hover {
  background: rgba(0,0,0,0.8);
}

.composer-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.85rem;
  padding: 0.5rem 1rem 0.75rem;
  border-top: 1px solid var(--color-border-light);
}

.toolbar-left {
  display: flex;
  gap: 0.5rem;
}

.toolbar-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.45rem 0.65rem;
  border-radius: 0.5rem;
  border: none;
  background: transparent;
  color: var(--color-text-secondary);
  font-size: 0.8125rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 36px;
}

.toolbar-icon {
  width: 18px;
  height: 18px;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.toolbar-btn:hover {
  background: var(--color-bg-alt);
  color: var(--color-text);
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.toolbar-error {
  font-size: 0.8125rem;
  color: var(--color-error);
  font-weight: 700;
}

.toolbar-success {
  font-size: 0.8125rem;
  color: var(--color-success);
  font-weight: 700;
}

.toolbar-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.toolbar-ghost {
  padding: 0.5rem 0.8rem;
  border-radius: 0.5rem;
  border: none;
  background: transparent;
  color: var(--color-text-muted);
  font-size: 0.8125rem;
  font-weight: 700;
  cursor: pointer;
  transition: color 0.2s ease;
  min-height: 36px;
}

.toolbar-ghost:hover {
  color: var(--color-text);
}
</style>
