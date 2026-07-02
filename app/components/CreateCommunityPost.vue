<template>
  <div class="rounded-xl border border-slate-200 bg-white shadow-sm p-4">
    <div class="flex gap-3">
      <!-- Avatar -->
      <div
        class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
        :style="{ background: userColor }"
      >
        {{ getInitials(userName) }}
      </div>

      <!-- Input area -->
      <div class="flex-1 min-w-0">
        <div
          class="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus-within:border-slate-900 cursor-text"
          @click="expanded = true"
          v-click-outside="collapseIfEmpty"
        >
          <input
            v-model="newPost.title"
            v-show="expanded"
            type="text"
            class="w-full outline-none text-sm font-semibold text-slate-900 placeholder:text-slate-400 mb-2"
            placeholder="Title (optional)"
          />
          <textarea
            v-model="newPost.content"
            :rows="expanded ? 3 : 1"
            class="w-full outline-none text-sm text-slate-700 placeholder:text-slate-400 resize-none"
            :placeholder="expanded ? 'What\'s happening?' : 'What\'s happening?'"
            @focus="expanded = true"
            required
          />
        </div>

        <!-- Image preview -->
        <div v-if="imagePreview" class="mt-3 relative">
          <img :src="imagePreview" alt="Preview" class="w-full max-h-48 object-cover rounded-lg border border-slate-200" />
          <button
            @click="removeImage"
            class="absolute top-2 right-2 bg-slate-900/70 text-white rounded-full p-1 hover:bg-slate-900 transition-colors"
            title="Remove image"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>

        <!-- Expandable footer -->
        <div v-if="expanded" class="mt-3 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <!-- Image upload button -->
            <button
              @click="triggerImageUpload"
              class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-600 hover:bg-blue-50 transition-colors"
              title="Add image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
              </svg>
              Media
            </button>
            <input
              ref="imageInput"
              type="file"
              accept="image/*"
              class="hidden"
              @change="handleImageSelect"
            />
          </div>

          <div class="flex items-center gap-3">
            <p v-if="postError" class="text-xs font-semibold text-rose-500">{{ postError }}</p>
            <p v-if="postSuccess" class="text-xs font-semibold text-emerald-600">{{ postSuccess }}</p>
            <div class="flex gap-2">
              <button
                @click="cancelPost"
                class="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700 transition-colors rounded-lg"
              >
                Cancel
              </button>
              <button
                @click="submitPost"
                :disabled="postLoading || !newPost.content.trim()"
                class="rounded-lg bg-slate-900 px-5 py-2 text-xs font-bold text-white transition hover:bg-slate-800 disabled:opacity-50"
              >
                {{ postLoading ? 'Posting...' : 'Post' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const emit = defineEmits(['post-created'])

const supabase = useSupabaseClient()

const props = defineProps({
  currentUser: { type: Object, default: null },
  currentUserId: { type: String, default: null }
})

const expanded = ref(false)
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

const userColor = computed(() => {
  const colors = ['#0f172a', '#b91c1c', '#047857', '#b45309', '#1d4ed8', '#7c3aed']
  return colors[Math.floor(Math.random() * colors.length)]
})

const getInitials = (name) => {
  return name
    .split(/[ @._-]/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('')
}

const collapseIfEmpty = () => {
  if (!newPost.value.title && !newPost.value.content && !imageFile.value) {
    expanded.value = false
  }
}

const triggerImageUpload = () => {
  imageInput.value?.click()
}

const handleImageSelect = (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  // Check file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    postError.value = 'Image must be less than 5MB'
    return
  }

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
  const fileName = `${props.currentUserId}/${Date.now()}.${fileExt}`
  const filePath = fileName

  // Try uploading directly first (bucket should already exist from SQL)
  const { error: uploadError } = await supabase.storage
    .from('post_images')
    .upload(filePath, imageFile.value, {
      cacheControl: '3600',
      upsert: false
    })

  if (uploadError) {
    console.error('Upload error details:', uploadError)
    // If bucket doesn't exist, try to create it
    if (uploadError.message?.includes('Bucket') || uploadError.message?.includes('bucket') || uploadError.message?.includes('not found')) {
      const { error: createError } = await supabase.storage.createBucket('post_images', {
        public: true,
        fileSizeLimit: 5242880
      })

      if (createError) {
        uploading.value = false
        throw new Error('Storage bucket "post_images" not found. Please run the SQL schema in your Supabase dashboard.')
      }

      // Retry upload after creating bucket
      const { error: retryError } = await supabase.storage
        .from('post_images')
        .upload(filePath, imageFile.value, {
          cacheControl: '3600',
          upsert: false
        })

      if (retryError) {
        uploading.value = false
        throw new Error(retryError.message)
      }
    } else {
      uploading.value = false
      throw new Error(uploadError.message)
    }
  }

  const { data: { publicUrl } } = supabase.storage
    .from('post_images')
    .getPublicUrl(filePath)

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
    try {
      imageUrl = await uploadImage()
    } catch (err) {
      // Post without the image if upload fails (bucket not created yet)
      console.warn('Image upload failed, posting without image:', err.message)
      postError.value = 'Image upload failed, posted without image. Run the SQL schema to fix this.'
      // Clear the image so the post goes through
      imageFile.value = null
      imagePreview.value = ''
      if (imageInput.value) imageInput.value.value = ''
    }
  }

  const authorName = props.currentUser.user_metadata?.display_name || props.currentUser.user_metadata?.full_name || ''

  const { error } = await supabase
    .from('community_posts')
    .insert({
      user_id: props.currentUser.id,
      title: newPost.value.title.trim() || '',
      content: newPost.value.content.trim(),
      author_name: authorName,
      author_email: props.currentUser.email,
      image_url: imageUrl
    })

  postLoading.value = false

  if (error) {
    postError.value = error.message
    return
  }

  postSuccess.value = 'Posted!'
  newPost.value = { title: '', content: '' }
  imageFile.value = null
  imagePreview.value = ''
  if (imageInput.value) imageInput.value.value = ''
  expanded.value = false

  emit('post-created')

  setTimeout(() => {
    postSuccess.value = ''
  }, 3000)
}

const cancelPost = () => {
  newPost.value = { title: '', content: '' }
  imageFile.value = null
  imagePreview.value = ''
  if (imageInput.value) imageInput.value.value = ''
  expanded.value = false
  postError.value = ''
}

// Click outside directive
const vClickOutside = {
  mounted(el, binding) {
    el.__clickOutside = (event) => {
      if (!el.contains(event.target)) {
        binding.value()
      }
    }
    document.addEventListener('click', el.__clickOutside)
  },
  unmounted(el) {
    document.removeEventListener('click', el.__clickOutside)
  }
}
</script>