```
<script setup>
import DashboardNavbar from '../components/DashboardNavbar.vue'
import { ArrowLeft, Calendar, Clock, MapPin, User, Share2, Check } from 'lucide-vue-next'
import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted, onUnmounted } from 'vue'
import { useToast } from '../composables/useToast'

const route = useRoute()
const router = useRouter()
const { addToast } = useToast()
const event = ref(null)
const shareText = ref('Bagikan')
const timeLeft = ref({ days: 0, hours: 0, minutes: 0, seconds: 0 })
const isEventEnded = ref(false)
const countdownInterval = ref(null)

const eventData = {
  1: {
    id: 1,
    title: 'Seminar Nasional Artificial Intelligence 2024',
    type: 'Seminar',
    date: '2026-12-20',
    time: '09:00 - 16:00 WIB',
    location: 'Jakarta Convention Center',
    participants: 347,
    maxParticipants: 500,
    description: 'Seminar Nasional Artificial Intelligence 2024 adalah acara tahunan yang mempertemukan para akademisi, peneliti, praktisi, dan mahasiswa untuk berbagi pengetahuan dan pengalaman mengenai perkembangan terkini di bidang kecerdasan buatan.',
    agenda: [
      { time: '08:00 - 09:00', activity: 'Registrasi Peserta' },
      { time: '09:00 - 09:30', activity: 'Pembukaan dan Sambutan' },
      { time: '09:30 - 11:00', activity: 'Keynote Speech: The Future of AI' },
      { time: '11:00 - 12:30', activity: 'Panel Discussion: AI in Industry' },
      { time: '12:30 - 13:30', activity: 'Istirahat & Makan Siang' },
      { time: '13:30 - 15:30', activity: 'Parallel Sessions' },
      { time: '15:30 - 16:00', activity: 'Penutupan' }
    ],
    speakers: [
      { name: 'Prof. Dr. Ahmad Zainuddin', title: 'Deep Learning', institution: 'MIT' },
      { name: 'Dr. Sarah Johnson', title: 'Neural Networks', institution: 'Stanford University' },
      { name: 'Ir. Budi Santoso, Ph.D', title: 'AI Applications', institution: 'UI' }
    ],
    requirements: [
      'Mahasiswa, akademisi, atau praktisi di bidang terkait',
      'Memiliki minat dalam bidang AI dan machine learning',
      'Membawa laptop untuk workshop session'
    ],
    fullAddress: 'Jakarta Convention Center, Jl. Gatot Subroto, Jakarta Pusat',
    isRegistered: false
  },
  2: {
    id: 2,
    title: 'Workshop Machine Learning for Beginners',
    type: 'Workshop',
    date: '2026-12-25',
    time: '10:00 - 15:00 WIB',
    location: 'Online via Zoom',
    participants: 156,
    maxParticipants: 200,
    description: 'Workshop interaktif ini dirancang khusus untuk pemula yang ingin memulai perjalanan karir di bidang Machine Learning. Peserta akan diajarkan konsep dasar hingga implementasi model sederhana menggunakan Python.',
    agenda: [
      { time: '09:45 - 10:00', activity: 'Join Meeting & Setup' },
      { time: '10:00 - 11:00', activity: 'Pengenalan Python untuk Data Science' },
      { time: '11:00 - 12:30', activity: 'Supervised Learning Basics' },
      { time: '12:30 - 13:00', activity: 'Istirahat' },
      { time: '13:00 - 14:30', activity: 'Hands-on: Membangun Model Prediksi' },
      { time: '14:30 - 15:00', activity: 'Tanya Jawab & Penutup' }
    ],
    speakers: [
      { name: 'Rizki Pratama', title: 'Senior Data Scientist', institution: 'GoTo' },
      { name: 'Dina Kusuma', title: 'ML Engineer', institution: 'Bukalapak' }
    ],
    requirements: [
      'Memahami dasar pemrograman (logika dasar)',
      'Terinstall Python dan Jupyter Notebook/Google Colab',
      'Koneksi internet stabil'
    ],
    fullAddress: 'Link Zoom akan dikirimkan melalui email setelah pendaftaran.',
    isRegistered: true
  },
  3: {
    id: 3,
    title: 'Konferensi Internasional Teknologi Informasi',
    type: 'Konferensi',
    date: '2026-01-15',
    time: '08:00 - 17:00 WIB',
    location: 'Bandung Institute of Technology',
    participants: 789,
    maxParticipants: 1000,
    description: 'Konferensi ini menghadirkan peneliti dan inovator dari seluruh dunia untuk membahas tren teknologi masa depan, mulai dari Quantum Computing hingga 6G Networks.',
    agenda: [
      { time: '08:00 - 09:00', activity: 'Registrasi & Networking' },
      { time: '09:00 - 10:30', activity: 'Plenary Session 1: Future Tech' },
      { time: '10:30 - 12:00', activity: 'Paper Presentation Track A & B' },
      { time: '12:00 - 13:00', activity: 'Lunch Break' },
      { time: '13:00 - 15:00', activity: 'Workshop Sessions' },
      { time: '15:00 - 16:30', activity: 'Plenary Session 2: Ethics in Tech' },
      { time: '16:30 - 17:00', activity: 'Awards & Closing' }
    ],
    speakers: [
      { name: 'Prof. Alan Turing (Descendant)', title: 'Computing History', institution: 'Cambridge' },
      { name: 'Dr. Li Wei', title: 'Quantum Research', institution: 'Tsinghua University' },
      { name: 'Emily White', title: 'Tech Policy', institution: 'Oxford' }
    ],
    requirements: [
      'Terbuka untuk umum, mahasiswa, dan peneliti',
      'Registrasi wajib dilakukan H-3',
      'Dresscode: Formal / Batik'
    ],
    fullAddress: 'Aula Barat ITB, Jl. Ganesha No.10, Bandung',
    isRegistered: false
  },
  4: {
    id: 4,
    title: 'Webinar Cybersecurity Best Practices',
    type: 'Webinar',
    date: '2026-12-18',
    time: '19:00 - 21:00 WIB',
    location: 'Online',
    participants: 245,
    maxParticipants: 300,
    description: 'Pelajari cara melindungi aset digital Anda dari ancaman siber yang semakin kompleks. Webinar ini akan membahas studi kasus serangan terbaru dan strategi mitigasinya.',
    agenda: [
      { time: '19:00 - 19:15', activity: 'Opening' },
      { time: '19:15 - 20:00', activity: 'Landscape Ancaman Siber 2024' },
      { time: '20:00 - 20:45', activity: 'Best Practices untuk Personal & Corporate' },
      { time: '20:45 - 21:00', activity: 'Q&A' }
    ],
    speakers: [
      { name: 'Bambang Pamungkas', title: 'Cyber Security Analyst', institution: 'BSSN' },
      { name: 'Jessica Lin', title: 'Security Consultant', institution: 'Cisco' }
    ],
    requirements: [
      'Tidak ada persyaratan khusus',
      'Laptop/Smartphone dengan akses Zoom'
    ],
    fullAddress: 'Platform Webinar (Link akan dibagikan H-1)',
    isRegistered: false
  },
  5: {
    id: 5,
    title: 'Hackathon IoT Innovation 2024',
    type: 'Hackathon',
    date: '2026-01-20',
    time: '08:00 - 20:00 WIB',
    location: 'Surabaya Tech Hub',
    participants: 98,
    maxParticipants: 150,
    description: 'Tantang diri Anda untuk menciptakan solusi IoT inovatif dalam waktu 12 jam! Tema tahun ini adalah "Smart Cities for Sustainable Future". Total hadiah Rp 50.000.000.',
    agenda: [
      { time: '08:00', activity: 'Check-in & Team Forming' },
      { time: '09:00', activity: 'Opening & Theme Announcement' },
      { time: '09:30 - 18:00', activity: 'Hacking Time!' },
      { time: '12:00', activity: 'Lunch' },
      { time: '18:00 - 19:30', activity: 'Pitching Session' },
      { time: '20:00', activity: 'Winner Announcement' }
    ],
    speakers: [
      { name: 'CEO Startup IoT', title: 'Judge', institution: 'Local Unicorn' },
      { name: 'Head of Smart City', title: 'Keynote', institution: 'Pemkot Surabaya' },
      { name: 'Senior Developer', title: 'Mentor', institution: 'Google Developer Expert' }
    ],
    requirements: [
      'Tim terdiri dari 3-5 orang',
      'Membawa perangkat IoT sendiri (Arduino/Raspberry Pi) disarankan',
      'Membawa laptop dan perlengkapan coding'
    ],
    fullAddress: 'Surabaya Tech Hub, Jl. Pemuda No. 1, Surabaya',
    isRegistered: false
  },
  default: {
    id: 0,
    title: 'Event Tidak Ditemukan',
    type: 'Unknown',
    date: '-',
    time: '-',
    location: '-',
    participants: 0,
    maxParticipants: 0,
    description: 'Maaf, detail event tidak dapat ditemukan.',
    agenda: [],
    speakers: [],
    requirements: [],
    fullAddress: '',
    isRegistered: false
  }
}

onMounted(() => {
  const id = route.params.id
  event.value = eventData[id] || eventData.default
  
  // Check registration status from localStorage
  const registeredEvents = JSON.parse(localStorage.getItem('registered_events') || '[]')
  if (registeredEvents.includes(parseInt(id))) {
    event.value.isRegistered = true
  }

  checkEventStatus()
  startCountdown()
})

onUnmounted(() => {
  if (countdownInterval.value) clearInterval(countdownInterval.value)
})

const checkEventStatus = () => {
  if (!event.value) return
  const eventDate = new Date(event.value.date)
  const now = new Date()
  
  if (eventDate < now) {
    if (now > new Date(event.value.date + 'T23:59:59')) {
         isEventEnded.value = true
    }
  }
}

const startCountdown = () => {
    if (isEventEnded.value || !event.value) return

    const eventDateStr = event.value.date
    const timeStr = event.value.time.split(' - ')[0]
    const eventTarget = new Date(`${eventDateStr}T${timeStr}`)
    
    // If parsing fails, fallback to just date
    const target = isNaN(eventTarget.getTime()) ? new Date(event.value.date) : eventTarget

    const updateTimer = () => {
        const now = new Date()
        const diff = target - now
        
        if (diff <= 0) {
            timeLeft.value = { days: 0, hours: 0, minutes: 0, seconds: 0 }
            return
        }

        timeLeft.value = {
            days: Math.floor(diff / (1000 * 60 * 60 * 24)),
            hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((diff / 1000 / 60) % 60),
            seconds: Math.floor((diff / 1000) % 60)
        }
    }

    updateTimer()
    countdownInterval.value = setInterval(updateTimer, 1000)
}

const handleShare = () => {
  if (event.value) {
    const textToShare = `Ikuti event ${event.value.title} di sini: ${window.location.href}`
    navigator.clipboard.writeText(textToShare).then(() => {
      shareText.value = 'Tersalin!'
      addToast('Link event berhasil disalin ke clipboard!', 'success')
      setTimeout(() => {
        shareText.value = 'Bagikan'
      }, 2000)
    })
  }
}

const goBack = () => {
  router.back()
}

const handleRegister = () => {
  if (isEventEnded.value) return 

  if (event.value) {
    let registeredEvents = JSON.parse(localStorage.getItem('registered_events') || '[]')
    const id = event.value.id
    
    if (event.value.isRegistered) {
      // Already registered, so unregister
      if (confirm('Batalkan pendaftaran event ini?')) {
        registeredEvents = registeredEvents.filter(eventId => eventId !== id)
        event.value.isRegistered = false
        addToast('Pendaftaran dibatalkan.', 'info')

        // Add cancellation notif
        const notif = {
           id: Date.now(),
           text: `Anda membatalkan pendaftaran event "${event.value.title}".`,
           time: 'Baru saja',
           read: false, 
           type: 'info'
        }
        const userNotifications = JSON.parse(localStorage.getItem('user_notifications') || '[]')
        userNotifications.unshift(notif)
        localStorage.setItem('user_notifications', JSON.stringify(userNotifications.slice(0, 10)))

      } else {
        // User cancelled unregistration, do nothing
        return
      }
    } else {
      // Not registered, so register
      registeredEvents.push(id)
      event.value.isRegistered = true
      addToast('Berhasil mendaftar event!', 'success')

      // Add registration notif
        const notif = {
           id: Date.now(),
           text: `Pendaftaran berhasil! Anda terdaftar di event "${event.value.title}".`,
           time: 'Baru saja',
           read: false, 
           type: 'success'
        }
        const userNotifications = JSON.parse(localStorage.getItem('user_notifications') || '[]')
        userNotifications.unshift(notif)
        localStorage.setItem('user_notifications', JSON.stringify(userNotifications.slice(0, 10)))
    }
    
    localStorage.setItem('registered_events', JSON.stringify(registeredEvents))
  }
}
</script>

<template>
  <div class="page-container">
    <DashboardNavbar />
    
    <main class="container page-content" v-if="event">
      <button class="back-link" @click="goBack">
        <ArrowLeft :size="20" /> Kembali
      </button>

      <!-- Hero / Header Card -->
      <div class="event-header-card">
        <div class="badge-container">
          <span class="type-badge">{{ event.type }}</span>
        </div>
        
        <h1 class="event-title">{{ event.title }}</h1>
        
        <div class="meta-grid">
          <div class="meta-item">
             <div class="meta-label"><Calendar :size="18" /> Tanggal</div>
             <div class="meta-value">{{ event.date }}</div>
          </div>
          <div class="meta-item">
             <div class="meta-label"><Clock :size="18" /> Waktu</div>
             <div class="meta-value">{{ event.time }}</div>
          </div>
          <div class="meta-item">
             <div class="meta-label"><MapPin :size="18" /> Lokasi</div>
             <div class="meta-value">{{ event.location }}</div>
          </div>
          <div class="meta-item">
             <div class="meta-label"><User :size="18" /> Peserta</div>
             <div class="meta-value">{{ event.participants }}/{{ event.maxParticipants }}</div>
          </div>
        </div>
        
        <!-- Countdown Widget -->
        <div v-if="!isEventEnded && (timeLeft.days > 0 || timeLeft.hours > 0)" class="countdown-widget">
           <div class="time-block">
             <span class="time-val">{{ timeLeft.days }}</span>
             <span class="time-label">Hari</span>
           </div>
           <div class="time-sep">:</div>
           <div class="time-block">
             <span class="time-val">{{ timeLeft.hours }}</span>
             <span class="time-label">Jam</span>
           </div>
           <div class="time-sep">:</div>
           <div class="time-block">
             <span class="time-val">{{ timeLeft.minutes }}</span>
             <span class="time-label">Menit</span>
           </div>
        </div>
        <div v-if="isEventEnded" class="event-ended-badge">
           Event Telah Berakhir
        </div>

      </div>

      <!-- Action Bar -->
      <div class="action-bar">
        <button 
          class="btn-register" 
          :class="{ 'btn-cancel': event.isRegistered && !isEventEnded, 'disabled': isEventEnded }"
          @click="handleRegister"
          :disabled="isEventEnded"
        >
          <span v-if="isEventEnded">Pendaftaran Ditutup</span>
          <span v-else-if="event.isRegistered" class="btn-content">
             Batalkan Pendaftaran
          </span>
          <span v-else>Daftar Sekarang</span>
        </button>
        <button class="btn-share" @click="handleShare">
          <Share2 :size="20" /> {{ shareText }}
        </button>
      </div>

      <!-- Main Content -->
      <div class="content-section">
        <section class="mb-8">
          <h2>Deskripsi</h2>
          <p class="description-text">{{ event.description }}</p>
        </section>

        <section class="mb-8">
          <h2>Agenda</h2>
          <div class="agenda-list">
            <div v-for="(item, index) in event.agenda" :key="index" class="agenda-item">
              <span class="agenda-time">{{ item.time }}</span>
              <span class="agenda-activity">{{ item.activity }}</span>
            </div>
          </div>
        </section>

        <section class="mb-8">
          <h2>Pembicara</h2>
          <div class="speakers-grid">
            <div v-for="(speaker, index) in event.speakers" :key="index" class="speaker-card">
              <div class="speaker-info">
                <h3>{{ speaker.name }}</h3>
                <p class="speaker-institution">{{ speaker.institution }}</p>
                <p class="speaker-title">{{ speaker.title }}</p>
              </div>
            </div>
          </div>
        </section>

        <section class="mb-8">
          <h2>Persyaratan</h2>
          <ul class="requirements-list">
            <li v-for="(req, index) in event.requirements" :key="index">{{ req }}</li>
          </ul>
        </section>

        <section>
          <h2>Lokasi</h2>
          <div class="location-box">
            <p>{{ event.location }}</p>
            <p class="text-muted">{{ event.fullAddress }}</p>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<style scoped>
.page-container {
  min-height: 100vh;
  background-color: var(--bg-color); /* Use variable instead of hardcoded white */
}

.page-content {
  padding-top: 2rem;
  padding-bottom: 4rem;
  max-width: 1000px; /* Limit width for better readability like detailed pages */
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

.back-link:hover {
  color: #1e293b;
}

/* Header Card */
.event-header-card {
  background-color: #059669; /* Emerald 600 */
  border-radius: 1rem;
  padding: 2.5rem;
  color: white;
  margin-bottom: 1.5rem;
}

.badge-container {
  margin-bottom: 1.5rem;
}

.type-badge {
  background-color: rgba(255, 255, 255, 0.2);
  padding: 0.5rem 1.5rem;
  border-radius: 2rem;
  font-weight: 500;
  backdrop-filter: blur(4px);
}

.event-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2.5rem;
  line-height: 1.2;
}

.meta-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.meta-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  opacity: 0.9;
}

.meta-value {
  font-size: 1.1rem;
  font-weight: 600;
  padding-left: 1.6rem; /* Align with text of label */
}

.meta-value {
  font-size: 1.1rem;
  font-weight: 600;
  padding-left: 1.6rem; /* Align with text of label */
}

/* Countdown */
.countdown-widget {
  margin-top: 2rem;
  display: flex;
  gap: 1rem;
  align-items: center;
  background: rgba(0,0,0,0.1);
  padding: 1rem 1.5rem;
  border-radius: 0.5rem;
  width: fit-content;
}

.time-block {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.time-val {
  font-size: 1.5rem;
  font-weight: 800;
  line-height: 1;
}

.time-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  opacity: 0.8;
}

.time-sep {
  font-size: 1.5rem;
  font-weight: 700;
  margin-top: -10px;
}

.event-ended-badge {
  margin-top: 2rem;
  background-color: #ef4444;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  display: inline-block;
  font-weight: 600;
}

/* Action Bar */
.action-bar {
  display: flex;
  gap: 1rem;
  margin-bottom: 3rem;
}

.btn-register {
  flex: 1;
  background-color: #10b981;
  color: white;
  border: none;
  padding: 0.875rem;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-register:hover {
  background-color: #059669;
}

.btn-share {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  background-color: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  color: #1e293b;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-share:hover {
  background-color: #f8fafc;
}

/* content sections */
h2 {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 1rem;
}

.mb-8 {
  margin-bottom: 2.5rem;
}

.description-text {
  color: var(--text-muted);
  line-height: 1.7;
}

/* Agenda */
.agenda-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.agenda-item {
  display: flex;
  background-color: var(--secondary); /* Was #f8fafc */
  padding: 1rem;
  border-radius: 0.5rem;
  border: 1px solid var(--border-color); /* Added border for consistency */
}

.agenda-time {
  width: 140px;
  color: #10b981;
  font-weight: 500;
  flex-shrink: 0;
}

.agenda-activity {
  color: var(--text-main);
  font-weight: 500;
}

/* Speakers */
.speakers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.speaker-card {
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  padding: 1.5rem;
}

.speaker-info h3 {
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.25rem;
}

.speaker-institution {
  font-size: 0.875rem;
  color: #64748b;
  margin-bottom: 0.5rem;
}

.speaker-title {
  font-size: 0.875rem;
  color: #10b981;
  font-weight: 500;
}

/* Requirements */
.requirements-list {
  list-style: none;
  padding: 0;
}

.requirements-list li {
  position: relative;
  padding-left: 1.5rem;
  margin-bottom: 0.75rem;
  color: #475569;
}

.requirements-list li::before {
  content: "•";
  color: #10b981;
  font-weight: bold;
  position: absolute;
  left: 0.5rem;
}

.location-box {
  background-color: #f8fafc;
  padding: 1.5rem;
  border-radius: 0.5rem;
}

.map-container {
  border-radius: 0.5rem;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  margin-top: 1rem;
}

.text-muted {
  color: #64748b;
  margin-top: 0.25rem;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .event-header-card {
    padding: 1.5rem;
  }
  
  .event-title {
    font-size: 1.5rem;
  }
  
  .agenda-item {
    flex-direction: column;
    gap: 0.25rem;
  }
  
  .agenda-time {
    width: 100%;
    font-size: 0.9rem;
  }
}

.btn-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-register.registered {
  background-color: #10b981;
  cursor: default;
}

.btn-register.disabled {
  background-color: #94a3b8;
  cursor: not-allowed;
}

/* Dark Mode Styles */
:global(body.dark-mode) .page-container {
  background-color: #0f172a !important;
}

:global(body.dark-mode) .event-header-card {
  background-color: #047857; /* Darker emerald */
}

:global(body.dark-mode) .btn-share {
  background-color: var(--card-bg);
  border-color: var(--border-color);
  color: var(--text-main);
}

:global(body.dark-mode) .btn-share:hover {
  background-color: #374151;
}

:global(body.dark-mode) h2 {
  color: var(--text-main) !important;
}

:global(body.dark-mode) .description-text {
  color: var(--text-muted) !important;
}

:global(body.dark-mode) .agenda-item {
  background-color: var(--card-bg);
}

:global(body.dark-mode) .agenda-activity {
  color: var(--text-main) !important;
}

:global(body.dark-mode) .speaker-info h3 {
  color: var(--text-main) !important;
}

:global(body.dark-mode) .requirements-list li {
  color: var(--text-muted) !important;
}

:global(body.dark-mode) .speaker-institution {
  color: var(--text-muted);
}

.btn-cancel {
  background-color: #ef4444;
  color: white;
}

.btn-cancel:hover {
  background-color: #dc2626;
}
</style>

<style>
body.dark-mode .location-box {
  background-color: #1e293b !important;
  color: #f8fafc !important;
  border: 1px solid #334155;
}


body.dark-mode .speaker-card {
  border-color: var(--border-color);
  background-color: var(--card-bg);
}

body.dark-mode .speaker-info h3 {
  color: #f8fafc !important;
}

body.dark-mode .speaker-institution {
  color: #94a3b8 !important; /* Muted text */
}

body.dark-mode .requirements-list li {
  color: #f8fafc !important;
}

body.dark-mode .back-link {
  color: var(--text-muted);
}

body.dark-mode .back-link:hover {
  color: var(--text-main);
}
</style>
