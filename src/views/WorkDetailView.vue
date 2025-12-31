<script setup>
import DashboardNavbar from '../components/DashboardNavbar.vue'
import { ArrowLeft, Download, Bookmark, Share2, Eye } from 'lucide-vue-next'
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBookmarkStore } from '../stores/bookmarks'

const route = useRoute()
const router = useRouter()
const work = ref(null)

// Same dummy data as in ExploreView (simulated backend)
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
  }
]

onMounted(() => {
  const workId = route.params.id
  
  // Check in user works
  // Check in user works
  // Determine key
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

  const storedWorks = localStorage.getItem(worksKey)
  let found = false
  
  if (storedWorks) {
    try {
      const works = JSON.parse(storedWorks)
      const workIndex = works.findIndex(w => w.id == workId)
      if (workIndex !== -1) {
          const uWork = works[workIndex]
          
          // Increment View Count
          uWork.views = (uWork.views || 0) + 1
          
          // Save back to storage
          works[workIndex] = uWork
          localStorage.setItem(worksKey, JSON.stringify(works))
          
          work.value = uWork
          found = true
      }
    } catch (e) {
      console.error('Error parsing works', e)
    }
  }
  
  // Check in dummy works if not found
  if (!found) {
      const dWork = dummyWorks.find(w => w.id == workId)
      if (dWork) {
          work.value = dWork
          found = true
      }
  }
  
  if (!found) {
    // Handle case where work is not found
    alert('Karya tidak ditemukan')
    router.push('/explore') // Redirect to explore instead of my-works is safer
  } else {
    // checkBookmarkStatus removed, using computed property now
  }
})

const bookmarkStore = useBookmarkStore()

const isBookmarked = computed(() => {
    if (!work.value) return false
    return bookmarkStore.isBookmarked(work.value.id)
})

const toggleBookmark = () => {
    if (work.value) {
        bookmarkStore.toggleBookmark(work.value.id)
    }
}


// Mock downloads count since we don't track it yet
const downloads = ref(89)

const handleDownload = () => {
  if (!work.value) return

  if (work.value.pdfUrl) {
    const link = document.createElement('a')
    link.href = work.value.pdfUrl
    link.download = work.value.pdfName || `${work.value.title}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } else {
    // Fallback for default data which doesn't have real PDFs
    alert('Ini adalah data dummy. File PDF tidak tersedia.')
  }
}

const handleShare = async () => {
  try {
    await navigator.clipboard.writeText(window.location.href)
    alert('Link berhasil disalin!')
  } catch (err) {
    console.error('Gagal menyalin link:', err)
    alert('Gagal menyalin link. Silakan salin URL secara manual.')
  }
}
</script>

<template>
  <div class="page-container">
    <DashboardNavbar />
    
    <main class="container page-content">
      <button @click="router.back()" class="btn-back">
        <ArrowLeft :size="20" /> Kembali
      </button>

      <div v-if="work" class="card detail-card">
        <div class="work-header">
          <h1 class="work-title">{{ work.title }}</h1>
          <div class="work-meta">
            <span class="author">{{ work.author }}</span>
            <span class="dot">•</span>
            <span>{{ work.date }}</span>
            <span class="dot">•</span>
            <span class="views"><Eye :size="16" /> {{ work.views }} views</span>
            <span class="dot">•</span>
            <span class="downloads"><Download :size="16" /> {{ downloads }} downloads</span>
          </div>
          
          <div class="category-badge">
            {{ work.category }}
          </div>
          
          <div class="work-actions">
            <button class="btn btn-primary btn-download" @click="handleDownload">
              <Download :size="18" /> Download PDF
            </button>
            <button 
              class="btn btn-outline" 
              :class="{ 'btn-active-bookmark': isBookmarked }"
              @click="toggleBookmark"
            >
              <Bookmark :size="18" :fill="isBookmarked ? 'currentColor' : 'none'" /> Bookmark
            </button>
            <button class="btn btn-outline" @click="handleShare">
              <Share2 :size="18" /> Bagikan
            </button>
          </div>
        </div>

        <div class="divider"></div>

        <div class="work-section">
          <h2>Abstrak</h2>
          <p class="abstract-text">
            {{ work.abstract }}
          </p>
        </div>

        <div class="work-section">
          <h2>Kata Kunci</h2>
          <div class="keywords-list">
            <span v-for="keyword in work.keywords ? work.keywords.split(',') : []" :key="keyword" class="keyword-tag">
              {{ keyword.trim() }}
            </span>
          </div>
        </div>
        
        <div class="divider"></div>

        <div class="work-section full-content">
          <h1>Isi Lengkap</h1>
          
          <div v-if="work.fullContent" class="dynamic-content">
            <p>{{ work.fullContent }}</p>
          </div>
          
          <div v-else>
              <div class="content-chapter">
                <h3>1. PENDAHULUAN (CONTOH)</h3>
                <p>
                  Perkembangan teknologi telah membuka peluang baru dalam berbagai bidang,
                  khususnya untuk menyelesaikan permasalahan kompleks yang ada di masyarakat.
                  Penelitian ini mengeksplorasi penerapan metode terkini untuk meningkatkan efisiensi dan efektivitas solusi yang ada.
                </p>
              </div>

              <div class="content-chapter">
                <h3>2. METODOLOGI (CONTOH)</h3>
                <p>
                  Penelitian ini menggunakan pendekatan eksperimental dengan data yang dikumpulkan dari berbagai sumber terpercaya.
                  Prosedur pengumpulan data dilakukan secara sistematis untuk menjamin validitas dan reliabilitas hasil penelitian.
                  Analisis data dilakukan menggunakan perangkat lunak statistik terkini.
                </p>
              </div>

              <div class="content-chapter">
                <h3>3. HASIL DAN PEMBAHASAN (CONTOH)</h3>
                <p>
                  Hasil penelitian menunjukkan adanya peningkatan signifikan dalam metrik kinerja utama.
                  Hal ini mengindikasikan bahwa pendekatan yang diusulkan memiliki potensi besar untuk diterapkan dalam skala yang lebih luas.
                  Analisis lebih lanjut mengungkapkan korelasi positif antara variabel-variabel kunci.
                </p>
              </div>

              <div class="content-chapter">
                <h3>4. KESIMPULAN (CONTOH)</h3>
                <p>
                  Berdasarkan hasil analisis, dapat disimpulkan bahwa metode yang dikembangkan efektif dalam mengatasi masalah yang diidentifikasi.
                  Penelitian lebih lanjut diperlukan untuk mengoptimalkan parameter-parameter tertentu dan menguji ketahanan model pada kondisi yang lebih beragam.
                </p>
              </div>
          </div>
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
}

.btn-back {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: var(--text-muted);
  font-weight: 500;
  cursor: pointer;
  margin-bottom: 1.5rem;
  padding: 0;
}

.btn-back:hover {
  color: var(--text-main);
}

.detail-card {
  background: var(--card-bg);
  border-radius: 1rem;
  padding: 3rem;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-color);
}

.work-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 1rem;
  line-height: 1.3;
}

.work-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
  color: var(--text-muted);
  font-size: 0.95rem;
  margin-bottom: 1.5rem;
}

.dot {
  color: #cbd5e1;
}

.views, .downloads {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.category-badge {
  display: inline-block;
  background-color: #dcfce7;
  color: #166534;
  padding: 0.35rem 1rem;
  border-radius: 2rem;
  font-weight: 500;
  font-size: 0.9rem;
  margin-bottom: 2rem;
}

.work-actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary.btn-download {
  background-color: #059669;
  border: 1px solid #059669;
  color: white;
}

.btn-primary.btn-download:hover {
  background-color: #047857;
}

.btn-outline {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  color: var(--text-main);
}

.btn-outline:hover {
  background-color: #f8fafc;
  border-color: #cbd5e1;
}

.btn-active-bookmark {
  background-color: #dcfce7;
  color: #166534;
  border-color: #86efac;
}

.divider {
  height: 1px;
  background-color: var(--border-color);
  margin: 2rem 0;
}

.work-section {
  margin-bottom: 2rem;
}

.work-section h2 {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 1rem;
}

.abstract-text {
  color: var(--text-secondary);
  line-height: 1.7;
  font-size: 1.05rem;
}

.keywords-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.keyword-tag {
  background-color: var(--bg-color); /* Matches page bg or slightly different */
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  padding: 0.35rem 1rem;
  border-radius: 2rem;
  font-size: 0.9rem;
}

.full-content h1 {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 2rem;
}

.content-chapter {
  margin-bottom: 2rem;
}

.content-chapter h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.content-chapter p {
  color: var(--text-secondary);
  line-height: 1.7;
  font-size: 1.05rem;
}

.dynamic-content p {
  white-space: pre-wrap;
  color: var(--text-secondary);
  line-height: 1.8;
  font-size: 1.05rem;
}
</style>
