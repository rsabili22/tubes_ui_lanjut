<script setup>
import DashboardNavbar from '../components/DashboardNavbar.vue'
import { Upload, X } from 'lucide-vue-next'
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const form = ref({
  title: '',
  category: '',
  author: '',
  abstract: '',
  keywords: '',
  fullContent: ''
})

const file = ref(null)
const fileName = ref('')
const dragActive = ref(false)
const isEditMode = ref(false)
const existingWorkId = ref(null)

const pageTitle = computed(() => isEditMode.value ? 'Edit Karya Ilmiah' : 'Unggah Karya Ilmiah')
const submitButtonText = computed(() => isEditMode.value ? 'Simpan Perubahan' : 'Unggah Karya')

onMounted(() => {
  if (route.params.id) {
    isEditMode.value = true
    existingWorkId.value = route.params.id
    loadExistingWork(route.params.id)
  }
})

// Helper to get key
const getWorksKey = () => {
    const userStr = localStorage.getItem('user')
    if (userStr) {
        try {
            const user = JSON.parse(userStr)
            if (user.email) {
                return 'data_' + user.email.replace(/[^a-zA-Z0-9]/g, '_') + '_works'
            }
        } catch(e) {}
    }
    return 'user_works'
}

const loadExistingWork = (id) => {
  const storedWorks = localStorage.getItem(getWorksKey())
  if (storedWorks) {
    try {
      const works = JSON.parse(storedWorks)
      const work = works.find(w => w.id == id)
      if (work) {
        form.value.title = work.title
        form.value.category = work.category
        form.value.author = work.author
        form.value.abstract = work.abstract
        form.value.keywords = work.keywords
        form.value.fullContent = work.fullContent || ''
        
        if (work.pdfName) {
           fileName.value = work.pdfName
        }
      } else {
        alert('Karya tidak ditemukan')
        router.push('/my-works')
      }
    } catch (e) {
      console.error('Error loading work', e)
    }
  }
}

// ... handlers ...

const handleSubmit = () => {
  // modify validation
  if (!form.value.title || !form.value.category || !form.value.author || !form.value.abstract || !form.value.fullContent) {
    alert('Mohon lengkapi semua field termasu Isi Lengkap')
    return
  }
  
  if (!isEditMode.value && !file.value) {
     alert('Mohon upload file PDF')
     return
  }

  const saveWork = (pdfData, pdfName) => {
    const worksKey = getWorksKey()
    const storedWorks = localStorage.getItem(worksKey)
    let works = []
    if (storedWorks) {
      try {
        works = JSON.parse(storedWorks)
      } catch (e) {
        console.error('Error parsing works', e)
        works = []
      }
    }

    if (isEditMode.value) {
      const index = works.findIndex(w => w.id == existingWorkId.value)
      if (index !== -1) {
        // Update existing
        works[index] = {
          ...works[index],
          title: form.value.title,
          category: form.value.category,
          author: form.value.author,
          abstract: form.value.abstract,
          keywords: form.value.keywords,
          fullContent: form.value.fullContent,
        }
        
        if (pdfData) {
          works[index].pdfUrl = pdfData
          works[index].pdfName = pdfName
        }
      }
    } else {
      // Create new
      const newWork = {
        id: Date.now(),
        title: form.value.title,
        category: form.value.category,
        author: form.value.author,
        abstract: form.value.abstract,
        keywords: form.value.keywords,
        fullContent: form.value.fullContent,
        date: new Date().toISOString().split('T')[0],
        views: 0,
        status: 'Published',
        pdfUrl: pdfData,
        pdfName: pdfName
      }
      works.unshift(newWork)
    }
    
    // ... save ...

    try {
      localStorage.setItem(worksKey, JSON.stringify(works))
      router.push('/my-works')
    } catch (e) {
      alert('Gagal menyimpan file: Ukuran file terlalu besar untuk LocalStorage quota.')
    }
  }

  if (file.value) {
    // Read file as Base64 
    const reader = new FileReader()
    reader.onload = (e) => {
      saveWork(e.target.result, fileName.value)
    }
    reader.readAsDataURL(file.value)
  } else {
    // Edit mode with no new file
    saveWork(null, null)
  }
}

const handleCancel = () => {
  router.push('/my-works')
}
</script>

<template>
  <div class="page-container">
    <DashboardNavbar />
    
    <main class="container page-content">
      <div class="form-card">
        <div class="form-header">
          <h1>{{ pageTitle }}</h1>
          <p>Bagikan karya ilmiah Anda dengan komunitas akademis</p>
        </div>

        <form @submit.prevent="handleSubmit" class="work-form">
          <div class="form-group">
            <label>Judul Karya <span class="required">*</span></label>
            <input type="text" v-model="form.title" placeholder="Masukkan judul karya ilmiah" class="form-input" />
          </div>

          <div class="form-group">
            <label>Kategori <span class="required">*</span></label>
            <select v-model="form.category" class="form-select">
              <option value="" disabled>Pilih kategori</option>
              <option value="Teknologi Informasi">Teknologi Informasi</option>
              <option value="Data Science">Data Science</option>
              <option value="Internet of Things">Internet of Things</option>
              <option value="Artificial Intelligence">Artificial Intelligence</option>
              <option value="Cyber Security">Cyber Security</option>
            </select>
          </div>

          <div class="form-group">
            <label>Penulis <span class="required">*</span></label>
            <input type="text" v-model="form.author" placeholder="Nama penulis (pisahkan dengan koma)" class="form-input" />
          </div>

          <div class="form-group">
            <label>Abstrak <span class="required">*</span></label>
            <textarea v-model="form.abstract" rows="4" placeholder="Tuliskan abstrak karya ilmiah Anda" class="form-textarea"></textarea>
          </div>

          <div class="form-group">
            <label>Isi Lengkap <span class="required">*</span></label>
            <textarea v-model="form.fullContent" rows="8" placeholder="Tuliskan isi lengkap karya ilmiah Anda" class="form-textarea"></textarea>
          </div>

          <div class="form-group">
            <label>Kata Kunci <span class="required">*</span></label>
            <input type="text" v-model="form.keywords" placeholder="Kata kunci (pisahkan dengan koma)" class="form-input" />
          </div>

          <div class="form-group">
            <label>Upload File PDF <span class="required" v-if="!isEditMode">*</span></label>
            <div 
              class="upload-area"
              :class="{ 'file-selected': file || fileName, 'drag-active': dragActive }"
              @dragenter.prevent="dragActive = true"
              @dragleave.prevent="dragActive = false"
              @dragover.prevent
              @drop="handleDrop"
              @click="$refs.fileInput.click()"
            >
              <input 
                type="file" 
                ref="fileInput" 
                accept="application/pdf" 
                class="hidden-input"
                @change="handleFileUpload"
              />
              
              <div v-if="!file && !fileName" class="upload-placeholder">
                <div class="upload-icon-circle">
                   <Upload :size="24" color="#6366f1" />
                </div>
                <p class="upload-text">Klik untuk upload file</p>
                <p class="upload-hint">Format: PDF (Max 10MB)</p>
              </div>
              
              <div v-if="file || fileName" class="file-info">
                 <div class="file-details">
                   <span class="file-name">{{ fileName }}</span>
                   <span v-if="file" class="file-size">{{ (file.size / 1024 / 1024).toFixed(2) }} MB</span>
                   <span v-else class="file-size">File Sebelumnya</span>
                 </div>
                 <button type="button" class="remove-file" @click.stop="file = null; fileName = ''">
                   <X :size="18" />
                 </button>
              </div>
            </div>
          </div>

          <div class="form-actions">
            <button type="button" class="btn btn-outline" @click="handleCancel">Batal</button>
            <button type="submit" class="btn btn-primary btn-submit">{{ submitButtonText }}</button>
          </div>
        </form>
      </div>
    </main>
  </div>
</template>

<style scoped>
.page-container {
  min-height: 100vh;
  background-color: var(--bg-color);
}

.page-content {
  padding-top: 2rem;
  padding-bottom: 4rem;
  display: flex;
  justify-content: center;
}

.form-card {
  background: var(--card-bg);
  width: 100%;
  max-width: 800px;
  padding: 2.5rem;
  border-radius: 1rem;
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
}

.form-header h1 {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 0.5rem;
}

.form-header p {
  color: var(--text-muted);
}

.form-group label {
  display: block;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: var(--text-main);
}

.form-input, .form-select, .form-textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 0.375rem;
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.2s;
  background-color: var(--bg-color); /* Matches page bg */
  color: var(--text-main);
}

.form-input:focus, .form-select:focus, .form-textarea:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.1);
}

.upload-area {
  border: 2px dashed var(--border-color);
  border-radius: 0.5rem;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  background-color: var(--bg-color);
}

.upload-area:hover, .drag-active {
  background-color: var(--card-bg);
  border-color: var(--primary);
}

.file-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--card-bg);
  padding: 0.75rem;
  border-radius: 0.375rem;
  border: 1px solid #10b981;
}

.file-name {
  font-weight: 500;
  color: var(--text-main);
}

.btn-outline {
  flex: 1;
  padding: 0.75rem;
  font-weight: 600;
  border: 1px solid var(--border-color);
  background: var(--card-bg);
  color: var(--text-main);
  border-radius: 0.375rem;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-outline:hover {
  background-color: var(--bg-color);
}

/* Dark Mode Overrides */
:global(body.dark-mode) .page-container {
  background-color: #0f172a !important;
}

:global(body.dark-mode) .form-card {
  background-color: var(--card-bg);
  border-color: var(--border-color);
}

:global(body.dark-mode) .form-input, 
:global(body.dark-mode) .form-select, 
:global(body.dark-mode) .form-textarea {
  background-color: #0f172a; /* Darker than card */
  border-color: var(--border-color);
  color: var(--text-main);
}

:global(body.dark-mode) .upload-area {
  background-color: #0f172a;
  border-color: var(--border-color);
}

:global(body.dark-mode) .upload-area:hover {
  background-color: rgba(16, 185, 129, 0.1);
  border-color: #10b981;
}

:global(body.dark-mode) .btn-outline {
  background-color: transparent;
  border-color: var(--border-color);
  color: var(--text-main);
}
:global(body.dark-mode) .btn-outline:hover {
  background-color: rgba(255,255,255,0.05);
}
</style>
