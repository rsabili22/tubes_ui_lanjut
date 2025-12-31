<script setup>
import DashboardNavbar from '../components/DashboardNavbar.vue'
import { FileText, Eye, Bookmark, Calendar } from 'lucide-vue-next'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const userName = ref('User Demo')
const recentWorks = ref([])
const upcomingEvents = ref([])
const totalWorks = ref(0)
const totalViews = ref(0)
const totalBookmarks = ref(0)
const totalEvents = ref(0)
const router = useRouter()

const eventData = [
  {
    id: 1,
    title: 'Seminar Nasional Artificial Intelligence 2024',
    date: '2026-12-20',
    location: 'Jakarta Convention Center',
    image: 'https://images.unsplash.com/photo-1544531586-fde5298cdd40?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 2,
    title: 'Workshop Machine Learning for Beginners',
    date: '2026-12-25',
    location: 'Online via Zoom',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 3,
    title: 'Konferensi Internasional Teknologi Informasi',
    date: '2026-01-15',
    location: 'Bandung Institute of Technology',
    image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 4,
    title: 'Webinar Cybersecurity Best Practices',
    date: '2026-12-18',
    location: 'Online',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 5,
    title: 'Hackathon IoT Innovation 2024',
    date: '2026-01-20',
    location: 'Surabaya Tech Hub',
    image: 'https://images.unsplash.com/photo-1504384308090-c54be3855485?q=80&w=1000&auto=format&fit=crop'
  }
]

const getKey = (type) => {
    const userStr = localStorage.getItem('user')
    if (!userStr) return `user_${type}` // fallback
    try {
        const user = JSON.parse(userStr)
        if (user.email) {
            const prefix = 'data_' + user.email.replace(/[^a-zA-Z0-9]/g, '_')
            return `${prefix}_${type}`
        }
    } catch (e) {}
    return `user_${type}`
}

onMounted(() => {
  const storedUser = localStorage.getItem('user')
  let isDemo = true
  if (storedUser) {
    try {
      const userData = JSON.parse(storedUser)
      if (userData.name) {
        userName.value = userData.name
      }
      if (userData.email !== 'user@demo.com') {
          isDemo = false
      }
    } catch (e) {
      console.error('Error parsing user data', e)
    }
  }

  // Fetch recent works
  const worksKey = getKey('works')
  const storedWorks = localStorage.getItem(worksKey)
  
  if (storedWorks) {
    try {
      const works = JSON.parse(storedWorks)
      recentWorks.value = works.slice(0, 5)
      
      // Calculate Stats
      totalWorks.value = works.length
      totalViews.value = works.reduce((sum, work) => sum + (work.views || 0), 0)
    } catch (e) {
      console.error('Error parsing works', e)
    }
  } else {
    // Only init defaults if it IS the demo user (or no user)
    // Real users start with 0 as requested
    if (isDemo) {
        const defaultWorks = [
          {
            id: 1,
            title: 'Implementasi Machine Learning untuk Deteksi Penyakit',
            category: 'Teknologi Informasi',
            date: '2024-12-10',
            views: 234,
            status: 'Published'
          },
          {
            id: 2,
            title: 'Analisis Sentimen Media Sosial Menggunakan NLP',
            category: 'Data Science',
            date: '2024-12-08',
            views: 189,
            status: 'Published'
          },
          {
            id: 3,
            title: 'Perancangan Sistem IoT untuk Smart Home',
            category: 'Internet of Things',
            date: '2024-12-05',
            views: 156,
            status: 'Draft'
          }
        ]
        recentWorks.value = defaultWorks
        localStorage.setItem(worksKey, JSON.stringify(defaultWorks))
        
        // Default stats
        totalWorks.value = defaultWorks.length
        totalViews.value = defaultWorks.reduce((sum, work) => sum + (work.views || 0), 0)
    } else {
        recentWorks.value = []
        totalWorks.value = 0
        totalViews.value = 0
    }
  }

  // Calculate Bookmarks
  const bookmarksKey = getKey('bookmarks')
  const bookmarks = JSON.parse(localStorage.getItem(bookmarksKey) || '[]')
  totalBookmarks.value = bookmarks.length 

  // Fetch Registered Events
  const eventsKey = getKey('events')
  const registeredIds = JSON.parse(localStorage.getItem(eventsKey) || '[]')
  totalEvents.value = registeredIds.length
  
  // Filter events: Date >= today (Show 5 nearest upcoming events globally)
  const now = new Date()
  
  upcomingEvents.value = eventData.filter(event => {
    // Check if future
    const endOfDay = new Date(event.date + 'T23:59:59')
    return endOfDay >= now
  }).sort((a, b) => new Date(a.date) - new Date(b.date)).slice(0, 5)
})

const goToEvent = (id) => {
  router.push(`/events/${id}`)
}
</script>

<template>
  <div class="dashboard-page">
    <DashboardNavbar />
    
    <main class="container dashboard-content">
      <!-- Welcome Banner -->
      <div class="welcome-banner">
        <h1>Selamat Datang, {{ userName }}!</h1>
        <p>Ayo bagikan karya ilmiah Anda dan jelajahi penelitian dari akademisi lainnya</p>
      </div>
      
      <!-- Stats Grid -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon-bg bg-blue">
            <FileText :size="24" color="white" />
          </div>
          <div class="stat-info">
            <h3>{{ totalWorks }}</h3>
            <p>Total Karya</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon-bg bg-green">
            <Eye :size="24" color="white" />
          </div>
          <div class="stat-info">
            <h3>{{ totalViews.toLocaleString() }}</h3>
            <p>Dilihat</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon-bg bg-purple">
            <Bookmark :size="24" color="white" />
          </div>
          <div class="stat-info">
            <h3>{{ totalBookmarks }}</h3>
            <p>Bookmark</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon-bg bg-orange">
            <Calendar :size="24" color="white" />
          </div>
          <div class="stat-info">
            <h3>{{ totalEvents }}</h3>
            <p>Event Diikuti</p>
          </div>
        </div>
      </div>
      
      <!-- Split Content -->
      <div class="content-grid">
        <!-- Recent Works -->
        <div class="section-column">
          <div class="section-header">
            <h2>Karya Terbaru Anda</h2>
            <router-link to="/my-works" class="see-all">Lihat Semua</router-link>
          </div>
          
          <div class="card-list">
            <div v-for="work in recentWorks" :key="work.id" class="list-card">
              <h3>{{ work.title }}</h3>
              <div class="card-meta">
                <span>{{ work.views }} views</span>
                <span class="dot">•</span>
                <span>{{ work.date }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Upcoming Events -->
        <div class="section-column">
          <div class="section-header">
            <h2>Event Mendatang</h2>
            <router-link to="/events" class="see-all">Lihat Semua</router-link>
          </div>
          
          <div class="event-list">
            <div v-if="upcomingEvents.length === 0" class="empty-state">
              <p>Belum ada event mendatang.</p>
              <router-link to="/events" class="btn-sm">Lihat Semua Event</router-link>
            </div>

            <div v-for="event in upcomingEvents" :key="event.id" class="event-card" @click="goToEvent(event.id)">
              <div class="event-img" :style="{ backgroundImage: `url(${event.image})` }"></div>
              <div class="event-details">
                <h3>{{ event.title }}</h3>
                <div class="event-meta">
                  <Calendar :size="14" /> {{ event.date }} • {{ event.location }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.dashboard-page {
  background-color: var(--bg-color);
  min-height: 100vh;
}

.dashboard-content {
  padding-top: 2rem;
  padding-bottom: 4rem;
}

.welcome-banner {
  background-color: var(--primary);
  color: white;
  padding: 2.5rem;
  border-radius: 1rem;
  margin-bottom: 2.5rem;
  box-shadow: var(--shadow-md);
}

.welcome-banner h1 {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.welcome-banner p {
  opacity: 0.9;
  font-size: 1rem;
}

/* Stats */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 2.5rem;
}

.stat-card {
  background: var(--card-bg);
  padding: 1.5rem;
  border-radius: 1rem;
  border: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  box-shadow: var(--shadow-sm);
}

.stat-icon-bg {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bg-blue { background-color: #3b82f6; }
.bg-green { background-color: var(--primary); }
.bg-purple { background-color: #a855f7; }
.bg-orange { background-color: #f97316; }

.stat-info h3 {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text-main);
  line-height: 1;
  margin-bottom: 0.25rem;
}

.stat-info p {
  color: var(--text-muted);
  font-size: 0.9rem;
}

/* Content Grid */
.content-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.section-header h2 {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-main);
}

.see-all {
  font-size: 0.85rem;
  color: var(--primary);
  font-weight: 600;
}

.card-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.list-card {
  background: var(--card-bg);
  padding: 1.25rem;
  border-radius: 0.75rem;
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
}

.list-card h3 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  line-height: 1.4;
}

.card-meta, .event-meta {
  font-size: 0.85rem;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.dot {
  font-weight: bold;
}

.event-card {
  background: var(--card-bg);
  border-radius: 0.75rem;
  border: 1px solid var(--border-color);
  margin-bottom: 1rem;
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  display: flex;
  cursor: pointer;
  transition: transform 0.2s;
}

.event-card:hover {
  transform: translateY(-2px);
}

.event-img {
  width: 100px;
  background-color: #e2e8f0;
  background-image: url('data:image/svg+xml;charset=UTF-8,%3csvg width="100" height="100" xmlns="http://www.w3.org/2000/svg"%3e%3crect width="100" height="100" fill="%23cbd5e1"/%3e%3c/svg%3e');
  background-size: cover;
}

.event-details {
  padding: 1rem;
  flex: 1;
}

.event-details h3 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--text-main);
}


@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .content-grid {
    grid-template-columns: 1fr;
  }
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: var(--text-muted);
  background: var(--card-bg);
  border-radius: 0.75rem;
  border: 1px dashed var(--border-color);
}

.btn-sm {
  display: inline-block;
  margin-top: 0.5rem;
  font-size: 0.85rem;
  color: var(--primary);
  font-weight: 500;
  text-decoration: none;
}

/* Dark Mode Overrides */
:global(body.dark-mode) .dashboard-page {
  background-color: #0f172a !important;
}

:global(body.dark-mode) .welcome-banner {
  background-color: var(--primary); /* Keep brand color or darken */
}

:global(body.dark-mode) .card-list::-webkit-scrollbar-track {
  background: #0f172a;
}
</style>
