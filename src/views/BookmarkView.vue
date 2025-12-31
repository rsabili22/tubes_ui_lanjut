<script setup>
import DashboardNavbar from '../components/DashboardNavbar.vue'
import { Eye, Bookmark } from 'lucide-vue-next'
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useBookmarkStore } from '../stores/bookmarks'

const router = useRouter()
const bookmarkStore = useBookmarkStore()

// Duplicated dummy data for prototype simplicity
const dummyWorks = [
  {
    id: 1001,
    title: 'Deep Learning untuk Klasifikasi Gambar Medis',
    author: 'Dr. Ahmad, Prof. Siti',
    abstract: 'Penelitian ini mengeksplorasi penggunaan deep learning dalam meningkatkan akurasi diagnosa medis melalui klasifikasi gambar X-Ray dan MRI. Metode yang digunakan adalah Convolutional Neural Networks (CNN) dengan arsitektur ResNet-50.',
    category: 'Kecerdasan Buatan',
    views: 456,
    date: '2024-12-15',
    keywords: 'deep learning, medical imaging, CNN'
  },
  {
    id: 1002,
    title: 'Blockchain untuk Keamanan Data Kesehatan',
    author: 'Dr. Budi, M. Rizki',
    abstract: 'Implementasi teknologi blockchain untuk meningkatkan keamanan dan privasi data rekam medis pasien di rumah sakit. Studi kasus dilakukan pada 3 rumah sakit besar di Jakarta.',
    category: 'Keamanan Siber',
    views: 389,
    date: '2024-12-14',
    keywords: 'blockchain, health data, security'
  },
  {
    id: 1003,
    title: 'Analisis Big Data untuk Prediksi Cuaca',
    author: 'Prof. Lisa, Dr. Andi',
    abstract: 'Menggunakan big data analytics untuk memprediksi pola cuaca ekstrem dengan akurasi yang lebih tinggi. Data diambil dari satelit BMKG selama 10 tahun terakhir.',
    category: 'Data Science',
    views: 523,
    date: '2024-12-13',
    keywords: 'big data, weather prediction, analytics'
  },
  {
    id: 1004,
    title: 'IoT untuk Monitoring Pertanian Cerdas',
    author: 'Ir. Dedi, M.Sc. Rina',
    abstract: 'Sistem IoT yang dirancang untuk memantau kelembaban tanah, suhu, dan intensitas cahaya pada lahan pertanian cabai. Sistem terintegrasi dengan aplikasi mobile untuk notifikasi petani.',
    category: 'Internet of Things',
    views: 298,
    date: '2024-12-12',
    keywords: 'IoT, smart farming, user agriculture'
  },
  {
    id: 1005,
    title: 'Sistem Rekomendasi Berbasis AI',
    author: 'Dr. Faisal, Eng. Nina',
    abstract: 'Pengembangan sistem rekomendasi produk e-commerce menggunakan algoritma Collaborative Filtering hibrida. Hasil menunjukkan peningkatan konversi penjualan sebesar 15%.',
    category: 'Kecerdasan Buatan',
    views: 412,
    date: '2024-12-11',
    keywords: 'recommender system, AI, e-commerce'
  },
  {
    id: 1006,
    title: 'Analisis Sentimen Menggunakan NLP',
    author: 'Prof. Andi, Dr. Rina',
    abstract: 'Studi ini menerapkan Natural Language Processing untuk menganalisis sentimen publik di media sosial terkait kebijakan baru pemerintah.',
    category: 'Data Science',
    views: 567,
    date: '2024-12-08',
    keywords: 'NLP, sentiment analysis, social media'
  }
]

// Computed property to filter works based on bookmarks in store
const bookmarkedWorks = computed(() => {
  // Get User Works
  let worksKey = 'user_works'
  const userStr = localStorage.getItem('user')
  if (userStr) {
      try {
          const user = JSON.parse(userStr)
          if (user.email) {
              worksKey = 'data_' + user.email.replace(/[^a-zA-Z0-9]/g, '_') + '_works'
          }
      } catch(e) {}
  }

  let userWorks = []
  try {
    const storedUserWorks = localStorage.getItem(worksKey)
    if (storedUserWorks) {
      userWorks = JSON.parse(storedUserWorks)
    }
  } catch (e) {
    console.error('Error parsing user works', e)
  }

  // Combine
  const allWorks = [...userWorks, ...dummyWorks]
  
  // Filter based on store
  return allWorks.filter(w => bookmarkStore.isBookmarked(w.id))
})

const removeBookmark = (id) => {
  if (confirm('Hapus dari bookmark?')) {
    bookmarkStore.removeBookmark(id)
  }
}

const goToDetail = (id) => {
  router.push(`/my-works/${id}`)
}
</script>

<template>
  <div class="page-container">
    <DashboardNavbar />
    
    <main class="container page-content">
      <div class="header-section">
        <h1>Bookmark</h1>
        <p>Karya yang Anda simpan untuk dibaca nanti</p>
      </div>

      <div v-if="bookmarkedWorks.length === 0" class="empty-state">
        <p>Belum ada karya yang dibookmark.</p>
        <router-link to="/explore" class="explore-link">Jelajahi Karya</router-link>
      </div>

      <div class="works-list">
        <div 
          v-for="work in bookmarkedWorks" 
          :key="work.id" 
          class="work-card"
          @click="goToDetail(work.id)"
        >
          <div class="card-content">
            <div class="card-header">
              <h2 class="work-title">{{ work.title }}</h2>
              <!-- Red icon for removing -->
              <button class="remove-btn" @click.stop="removeBookmark(work.id)">
                 <Bookmark :size="20" class="bookmark-icon-filled" />
              </button>
            </div>
            
            <p class="work-author">{{ work.author }}</p>
            
            <div class="card-footer">
              <span class="category-badge" :class="getCategoryClass(work.category)">{{ work.category || 'Umum' }}</span>
              <div class="meta-info">
                 <span class="meta-item"><Eye :size="16" /> {{ work.views || 0 }}</span>
                 <span class="meta-item" style="color: #cbd5e1">•</span>
                 <span class="meta-item">{{ work.date }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
// Helper for dynamic classes if needed, for now just returning green style logic
function getCategoryClass(category) {
    // For now, all same style like design
    return 'bg-green' 
}
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  background-color: var(--bg-color);
}

.page-content {
  padding-top: 2rem;
  padding-bottom: 4rem;
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

.works-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.work-card {
  background: var(--card-bg);
  border: 1px solid var(--border-color); /* Default border */
  border-radius: 1rem;
  padding: 1.5rem;
  transition: all 0.2s;
  cursor: pointer;
}

.work-card:hover {
  border-color: var(--primary);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.work-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-main);
  line-height: 1.4;
}

.remove-btn {
  background: #fef2f2; /* Light red bg */
  border: none;
  border-radius: 0.5rem;
  padding: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.remove-btn:hover {
  background: #fee2e2;
}

.bookmark-icon-filled {
  fill: #ef4444; /* Red fill */
  color: #ef4444; /* Red stroke */
}

.work-author {
  color: var(--text-secondary);
  font-size: 0.95rem;
  margin-bottom: 1rem;
  font-weight: 500;
}

.card-footer {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.category-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 2rem;
  font-size: 0.85rem;
  font-weight: 500;
}

/* Default green style */
.category-badge {
  background-color: #dcfce7;
  color: #166534;
}

.meta-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--text-muted);
  font-size: 0.85rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.empty-state {
  text-align: center;
  padding: 4rem 0;
  color: var(--text-muted);
}

.explore-link {
  color: var(--primary);
  text-decoration: none;
  font-weight: 600;
  margin-top: 1rem;
  display: inline-block;
}

/* Dark Mode Overrides */
:global(body.dark-mode) .page-container {
  background-color: #0f172a !important;
}

:global(body.dark-mode) .work-card:hover {
  background-color: #1f2937;
  border-color: #374151;
}

:global(body.dark-mode) .remove-btn {
  background-color: rgba(239, 68, 68, 0.1); /* transparent red */
}
</style>
