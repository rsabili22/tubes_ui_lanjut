<script setup>
import DashboardNavbar from '../components/DashboardNavbar.vue'
import { ArrowLeft, Plus, Trash2, Save, Calendar, Clock, MapPin, Users, Upload, Image as ImageIcon } from 'lucide-vue-next'
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from '../composables/useToast'

const router = useRouter()
const route = useRoute()
const { addToast } = useToast()
const isEditMode = ref(false)
const eventId = ref(null)

const formData = ref({
  title: '',
  type: 'Seminar',
  date: '',
  timeStart: '',
  timeEnd: '',
  location: '',
  fullAddress: '',
  maxParticipants: 100,
  description: '',
  agenda: [{ time: '', activity: '' }],
  speakers: [{ name: '', title: '', institution: '' }],
  requirements: [''],
  image: null,
  imagePreview: null
})



onMounted(() => {
  // Check if we are in edit mode
  if (route.params.id) {
    isEditMode.value = true
    eventId.value = parseInt(route.params.id)
    loadEventData(eventId.value)
  }
})

const loadEventData = (id) => {
  const createdEvents = JSON.parse(localStorage.getItem('created_events') || '[]')
  const event = createdEvents.find(e => e.id === id)
  
  if (event) {
    // Populate form data
    formData.value = { ...event }
    // Ensure image preview is set
    if (event.image) {
      formData.value.imagePreview = event.image
    }
    // Parse time back to start/end if needed, but for simplicity we rely on stored separate fields if possible.
    // Wait! In saveEvent I didn't save separate timeStart/timeEnd, only combined 'time'.
    // Mistake in previous implementation step: I should have stored raw fields too.
    // Let's assume for now the user has to re-enter time or I fix saveEvent to store them.
    // FIX: I will update saveEvent to store all formData props so they can be restored.
  } else {
    alert('Event tidak ditemukan')
    router.push('/events/manage')
  }
}

const eventTypes = ['Seminar', 'Workshop', 'Konferensi', 'Webinar', 'Hackathon']

const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      formData.value.image = e.target.result // Base64 string
      formData.value.imagePreview = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const removeImage = () => {
  formData.value.image = null
  formData.value.imagePreview = null
}

const addAgenda = () => {
  formData.value.agenda.push({ time: '', activity: '' })
}

const removeAgenda = (index) => {
  if (formData.value.agenda.length > 1) {
    formData.value.agenda.splice(index, 1)
  }
}

const addSpeaker = () => {
  formData.value.speakers.push({ name: '', title: '', institution: '' })
}

const removeSpeaker = (index) => {
  if (formData.value.speakers.length > 1) {
    formData.value.speakers.splice(index, 1)
  }
}

const addRequirement = () => {
  formData.value.requirements.push('')
}

const removeRequirement = (index) => {
  if (formData.value.requirements.length > 1) {
    formData.value.requirements.splice(index, 1)
  }
}

const goBack = () => {
  router.back()
}

const saveEvent = () => {
  // Validate basic fields (simple validation)
  if (!formData.value.title || !formData.value.date) {
    addToast('Mohon lengkapi judul dan tanggal event.', 'error')
    return
  }

  // Create or Update event object
  const eventDataToSave = {
    ...formData.value,
    time: `${formData.value.timeStart} - ${formData.value.timeEnd} WIB`,
    // Ensure we keep existing ID if editing, or new ID if creating
    id: isEditMode.value ? eventId.value : Date.now(),
    participants: isEditMode.value ? formData.value.participants : 0, // Keep participants count
    isRegistered: isEditMode.value ? formData.value.isRegistered : false,
    image: formData.value.image || 'https://images.unsplash.com/photo-1544531586-fde5298cdd40?q=80&w=1000&auto=format&fit=crop'
  }

  // Get existing events
  let createdEvents = JSON.parse(localStorage.getItem('created_events') || '[]')
  
  if (isEditMode.value) {
    // Update existing
    const index = createdEvents.findIndex(e => e.id === eventId.value)
    if (index !== -1) {
      createdEvents[index] = eventDataToSave
      addToast('Perubahan berhasil disimpan!', 'success')
    }
  } else {
    // Create new
    createdEvents.push(eventDataToSave)
    
    // Auto-register the creator for their own event
    const registeredEvents = JSON.parse(localStorage.getItem('registered_events') || '[]')
    registeredEvents.push(eventDataToSave.id)
    localStorage.setItem('registered_events', JSON.stringify(registeredEvents))
    
    addToast('Event berhasil dibuat dan Anda terdaftar otomatis!', 'success')
  }

  // Save persistent notification
  const notificationText = isEditMode.value 
    ? `Anda telah memperbarui event "${eventDataToSave.title}".`
    : `Event "${eventDataToSave.title}" berhasil dibuat.`
    
  const newNotification = {
    id: Date.now() + 1, // Ensure unique from event ID
    text: notificationText,
    time: 'Baru saja',
    read: false,
    type: 'event'
  }

  const userNotifications = JSON.parse(localStorage.getItem('user_notifications') || '[]')
  userNotifications.unshift(newNotification) // Add to top
  localStorage.setItem('user_notifications', JSON.stringify(userNotifications.slice(0, 10))) // Keep last 10

  // Save back
  localStorage.setItem('created_events', JSON.stringify(createdEvents))
  
  // If editing, go back to manage, if new go to list
  if (isEditMode.value) {
    router.push('/events/manage')
  } else {
     router.push('/events')
  }
}
</script>

<template>
  <div class="page-container">
    <DashboardNavbar />
    
    <main class="container page-content">
      <button class="back-link" @click="goBack">
        <ArrowLeft :size="20" /> Kembali
      </button>

      <div class="header-section">
        <h1>{{ isEditMode ? 'Edit Event' : 'Buat Event Baru' }}</h1>
        <p>{{ isEditMode ? 'Perbarui detail event akademik Anda' : 'Isi detail event akademik yang ingin Anda selenggarakan' }}</p>
      </div>

      <div class="form-card">
        <!-- Section 1: Basic Info -->
        <section class="form-section">
          <h2>Informasi Utama</h2>
          
          
          <div class="form-group">
            <label>Cover Image</label>
            <div class="image-upload-container">
              <div v-if="!formData.imagePreview" class="upload-placeholder" @click="$refs.fileInput.click()">
                <div class="upload-content">
                  <Upload :size="32" class="mb-2" />
                  <p>Klik untuk upload gambar cover</p>
                  <span class="text-sm text-muted">Format: JPG, PNG (Max 2MB)</span>
                </div>
              </div>
              
              <div v-else class="image-preview-wrapper">
                <img :src="formData.imagePreview" class="image-preview" />
                <button class="btn-remove-image" @click="removeImage">
                  <Trash2 :size="16" /> Hapus
                </button>
              </div>
              
              <input 
                type="file" 
                ref="fileInput" 
                class="hidden-input" 
                accept="image/*"
                @change="handleImageUpload"
              />
            </div>
          </div>

          <div class="form-group">
            <label>Judul Event</label>
            <input type="text" v-model="formData.title" placeholder="Contoh: Seminar Nasional AI 2024" />
          </div>

          <div class="grid-2">
            <div class="form-group">
              <label>Jenis Event</label>
              <select v-model="formData.type">
                <option v-for="type in eventTypes" :key="type" :value="type">{{ type }}</option>
              </select>
            </div>
            <div class="form-group">
              <label>Kuota Peserta</label>
              <div class="input-icon-wrapper">
                <Users :size="18" class="input-icon" />
                <input type="number" v-model="formData.maxParticipants" />
              </div>
            </div>
          </div>

          <div class="grid-3">
            <div class="form-group">
              <label>Tanggal</label>
              <div class="input-icon-wrapper">
                <Calendar :size="18" class="input-icon" />
                 <input type="date" v-model="formData.date" />
              </div>
            </div>
            <div class="form-group">
              <label>Waktu Mulai</label>
              <div class="input-icon-wrapper">
                <Clock :size="18" class="input-icon" />
                <input type="time" v-model="formData.timeStart" />
              </div>
            </div>
             <div class="form-group">
              <label>Waktu Selesai</label>
              <div class="input-icon-wrapper">
                <Clock :size="18" class="input-icon" />
                <input type="time" v-model="formData.timeEnd" />
              </div>
            </div>
          </div>

          <div class="form-group">
            <label>Lokasi (Singkat)</label>
             <div class="input-icon-wrapper">
                <MapPin :size="18" class="input-icon" />
                <input type="text" v-model="formData.location" placeholder="Contoh: Jakarta Convention Center / Online" />
            </div>
          </div>

          <div class="form-group">
            <label>Alamat Lengkap / Link</label>
            <textarea v-model="formData.fullAddress" rows="2" placeholder="Alamat lengkap gedung atau link meeting"></textarea>
          </div>
        </section>

        <hr class="divider" />

        <!-- Section 2: Description -->
        <section class="form-section">
          <h2>Deskripsi</h2>
          <div class="form-group">
            <label>Deskripsi Lengkap Event</label>
            <textarea v-model="formData.description" rows="5" placeholder="Jelaskan tujuan, topik, dan detail event..."></textarea>
          </div>
        </section>

        <hr class="divider" />

        <!-- Section 3: Agenda -->
        <section class="form-section">
          <div class="section-header-row">
            <h2>Agenda</h2>
            <button class="btn-add-sm" @click="addAgenda"><Plus :size="16" /> Tambah Agenda</button>
          </div>
          
          <div class="dynamic-list">
            <div v-for="(item, index) in formData.agenda" :key="index" class="dynamic-item-row">
              <div class="form-group col-time">
                <input type="text" v-model="item.time" placeholder="Waktu (09:00 - 10:00)" />
              </div>
              <div class="form-group col-activity">
                <input type="text" v-model="item.activity" placeholder="Nama Kegiatan" />
              </div>
              <button class="btn-remove" @click="removeAgenda(index)" v-if="formData.agenda.length > 1">
                <Trash2 :size="18" />
              </button>
            </div>
          </div>
        </section>

        <hr class="divider" />

        <!-- Section 4: Speakers -->
        <section class="form-section">
          <div class="section-header-row">
            <h2>Pembicara</h2>
            <button class="btn-add-sm" @click="addSpeaker"><Plus :size="16" /> Tambah Pembicara</button>
          </div>

          <div class="dynamic-cards">
            <div v-for="(speaker, index) in formData.speakers" :key="index" class="speaker-input-card">
              <div class="card-header-action">
                <h3>Pembicara {{ index + 1 }}</h3>
                <button class="btn-remove-text" @click="removeSpeaker(index)" v-if="formData.speakers.length > 1">Hapus</button>
              </div>
              <div class="form-group">
                <label>Nama Lengkap</label>
                <input type="text" v-model="speaker.name" placeholder="Nama beserta gelar" />
              </div>
              <div class="grid-2">
                 <div class="form-group">
                  <label>Jabatan / Keahlian</label>
                  <input type="text" v-model="speaker.title" placeholder="Contoh: AI Researcher" />
                </div>
                 <div class="form-group">
                  <label>Institusi</label>
                  <input type="text" v-model="speaker.institution" placeholder="Contoh: ITB / Google" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <hr class="divider" />

        <!-- Section 5: Requirements -->
        <section class="form-section">
          <div class="section-header-row">
            <h2>Persyaratan Peserta</h2>
            <button class="btn-add-sm" @click="addRequirement"><Plus :size="16" /> Tambah Syarat</button>
          </div>

          <div class="dynamic-list">
             <div v-for="(req, index) in formData.requirements" :key="index" class="dynamic-item-row">
                <div class="form-group col-full">
                  <input type="text" v-model="formData.requirements[index]" placeholder="Syarat (contoh: Membawa Laptop)" />
                </div>
                <button class="btn-remove" @click="removeRequirement(index)" v-if="formData.requirements.length > 1">
                  <Trash2 :size="18" />
                </button>
             </div>
          </div>
        </section>

        <!-- Action Buttons -->
        <div class="form-actions">
          <button class="btn-cancel" @click="goBack">Batal</button>
          <button class="btn-save" @click="saveEvent">
            <Save :size="20" /> {{ isEditMode ? 'Simpan Perubahan' : 'Simpan Event' }}
          </button>
        </div>

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
  max-width: 800px;
}

.back-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #64748b;
  background: none;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  margin-bottom: 1.5rem;
  padding: 0;
}

.header-section {
  margin-bottom: 2rem;
}

.header-section h1 {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 0.5rem;
}

.header-section p {
  color: var(--text-muted);
}

/* Form Styling */
.form-card {
  background: var(--card-bg);
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  border: 1px solid var(--border-color); /* Added border for separation in light mode */
}

.form-section {
  margin-bottom: 1.5rem;
}

.form-section h2 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 1.25rem;
}

.divider {
  border: none;
  border-top: 1px solid #e2e8f0;
  margin: 2rem 0;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-muted);
  margin-bottom: 0.5rem;
}

input[type="text"],
input[type="number"],
input[type="date"],
input[type="time"],
textarea,
select {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  font-size: 0.95rem;
  background-color: var(--bg-main);
  color: var(--text-main);
  transition: border-color 0.2s;
  font-family: inherit;
}

input:focus, textarea:focus, select:focus {
  outline: none;
  border-color: #10b981;
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.1);
}

.input-icon-wrapper {
  position: relative;
}

.input-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
}

.input-icon-wrapper input {
  padding-left: 3rem;
}

.grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.grid-3 {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1.5rem;
}

/* Dynamic Lists */
.section-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
}

.btn-add-sm {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background: none;
  border: none;
  color: #10b981;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
}

.btn-add-sm:hover {
  background-color: #f0fdf4;
}

.dynamic-item-row {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.col-time {
  width: 150px;
  flex-shrink: 0;
}

.col-activity, .col-full {
  flex: 1;
}

.card-header-action {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.card-header-action h3 {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-muted);
}

.speaker-input-card {
  background-color: #f8fafc;
  padding: 1.25rem;
  border-radius: 0.75rem;
  border: 1px solid #e2e8f0;
  margin-bottom: 1rem;
}

.btn-remove {
  background: none;
  border: none;
  color: #ef4444;
  cursor: pointer;
  padding: 0.75rem;
  border-radius: 0.5rem;
  display: flex; /* Fix alignment */
  align-items: center; /* Fix alignment */
  justify-content: center; /* Fix alignment */
  margin-top: 1px; /* Align with input better */
}

.btn-remove:hover {
  background-color: #fef2f2;
}

.btn-remove-text {
  font-size: 0.85rem;
  color: #ef4444;
  background: none;
  border: none;
  cursor: pointer;
}

.btn-remove-text:hover {
  text-decoration: underline;
}

/* Actions */
.form-actions {
  margin-top: 2.5rem;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.btn-cancel {
  padding: 0.75rem 1.5rem;
  background-color: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  color: #64748b;
  font-weight: 600;
  cursor: pointer;
}

.btn-cancel:hover {
  background-color: #f8fafc;
  color: #1e293b;
}

.btn-save {
  padding: 0.75rem 1.5rem;
  background-color: #10b981;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-save:hover {
  background-color: #059669;
}

@media (max-width: 640px) {
  .grid-2, .grid-3 {
    grid-template-columns: 1fr;
  }
  
  .dynamic-item-row {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .col-time {
    width: 100%;
  }

  .btn-remove {
     align-self: flex-end;
  }
}


/* Image Upload Styles */
.image-upload-container {
  margin-bottom: 1.5rem;
}

.upload-placeholder {
  border: 2px dashed #cbd5e1;
  border-radius: 0.75rem;
  padding: 2.5rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  background-color: #f8fafc;
}

.upload-placeholder:hover {
  border-color: #10b981;
  background-color: #f0fdf4;
}

.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: var(--text-muted);
}

.text-sm {
  font-size: 0.8rem;
}

.hidden-input {
  display: none;
}

.image-preview-wrapper {
  position: relative;
  border-radius: 0.75rem;
  overflow: hidden;
  border: 1px solid #e2e8f0;
}

.image-preview {
  width: 100%;
  height: 250px;
  object-fit: cover;
  display: block;
}

.btn-remove-image {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background-color: rgba(255, 255, 255, 0.9);
  color: #ef4444;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.btn-remove-image:hover {
  background-color: white;
  color: #dc2626;
}

/* Dark Mode */
:global(body.dark-mode) .page-container {
  background-color: #0f172a !important;
}

:global(body.dark-mode) .header-section h1 {
  color: var(--text-main) !important;
}

:global(body.dark-mode) .header-section p {
  color: var(--text-muted) !important;
}

:global(body.dark-mode) .form-card {
  background-color: var(--card-bg);
  box-shadow: var(--shadow-md);
  border-color: var(--border-color);
}

:global(body.dark-mode) .form-section h2 {
  color: var(--text-main) !important;
}

:global(body.dark-mode) .divider {
  border-top-color: var(--border-color);
}

:global(body.dark-mode) .form-group label {
  color: var(--text-muted) !important;
}

:global(body.dark-mode) input[type="text"],
:global(body.dark-mode) input[type="number"],
:global(body.dark-mode) input[type="date"],
:global(body.dark-mode) input[type="time"],
:global(body.dark-mode) textarea,
:global(body.dark-mode) select {
  background-color: var(--bg-main) !important;
  border-color: var(--border-color) !important;
  color: var(--text-main) !important;
}



:global(body.dark-mode) .upload-content {
  color: #94a3b8 !important;
}



:global(body.dark-mode) .card-header-action h3 {
  color: var(--text-muted) !important;
}

:global(body.dark-mode) .btn-cancel {
  background-color: var(--bg-main);
  border-color: var(--border-color);
  color: var(--text-muted);
}

:global(body.dark-mode) .btn-cancel:hover {
  background-color: #374151;
  color: var(--text-main);
}

:global(body.dark-mode) .btn-remove {
  color: #ef4444; /* red-500 */
}

:global(body.dark-mode) .btn-remove:hover {
  background-color: rgba(239, 68, 68, 0.1);
}
</style>
