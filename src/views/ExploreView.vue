<script setup>
import DashboardNavbar from '../components/DashboardNavbar.vue'
import { Search, Bookmark, Eye, Calendar, User } from 'lucide-vue-next'
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import workService from '../services/workService'

const router = useRouter()
const searchQuery = ref('')
const selectedCategory = ref('Semua Kategori')
const sortOption = ref('Terbaru')

const allWorks = ref([])
const bookmarkedIds = ref([])

const loadBookmarks = () => {
  bookmarkedIds.value = JSON.parse(localStorage.getItem('user_bookmarks') || '[]')
}

const isBookmarked = (id) => {
  return bookmarkedIds.value.some(bId => bId == id)
}

const toggleBookmark = (id) => {
  let bookmarks = JSON.parse(localStorage.getItem('user_bookmarks') || '[]')
  if (bookmarks.some(bId => bId == id)) {
    // Remove
    bookmarks = bookmarks.filter(bId => bId != id)
  } else {
    // Add
    bookmarks.push(id)
  }
  localStorage.setItem('user_bookmarks', JSON.stringify(bookmarks))
  bookmarkedIds.value = bookmarks
}

onMounted(async () => {
  loadBookmarks()
  
  try {
    // Fetch from API
    const response = await workService.getWorks()
    const apiWorks = response.data

    // Load user works (local storage works - kept for backward compatibility or mixed mode)
    const storedWorks = localStorage.getItem('user_works')
    let userWorks = []
    if (storedWorks) {
      try {
        const parsed = JSON.parse(storedWorks)
        if (Array.isArray(parsed)) {
          userWorks = parsed
        }
      } catch (e) {
        console.error('Error parsing user works', e)
      }
    }
    const formattedUserWorks = userWorks.map(w => ({...w, isUserWork: true}))
    
    // Merge API works and Local User Works
    allWorks.value = [...formattedUserWorks, ...apiWorks]

  } catch (error) {
    console.error('Failed to fetch works:', error)
    // Fallback or empty state handling could go here
  }
})

const filteredWorks = computed(() => {
  return allWorks.value.filter(work => {
    if (!work) return false
    
    // Safely access properties for filtering
    const title = work.title ? work.title.toLowerCase() : ''
    const author = work.author ? work.author.toLowerCase() : ''
    const keywords = work.keywords ? work.keywords.toLowerCase() : ''
    const query = searchQuery.value.toLowerCase()

    // Search filter
    const matchesSearch = title.includes(query) || 
                          author.includes(query) ||
                          keywords.includes(query)
    
    // Category filter
    const matchesCategory = selectedCategory.value === 'Semua Kategori' || work.category === selectedCategory.value
    
    return matchesSearch && matchesCategory
  }).sort((a, b) => {
      if (sortOption.value === 'Terbaru') {
          const dateA = a.date ? new Date(a.date) : new Date(0)
          const dateB = b.date ? new Date(b.date) : new Date(0)
          return dateB - dateA
      }
      return 0
  })
})

const goToDetail = (id) => {
  router.push(`/my-works/${id}`)
}
</script>

<template>
  <div class="page-container">
    <DashboardNavbar />
    
    <main class="container page-content">
      <div class="header-section">
        <h1>Jelajahi Karya Ilmiah</h1>
        <p>Temukan referensi akademik yang Anda butuhkan</p>
      </div>

      <div class="search-filters">
        <div class="search-bar">
          <Search class="search-icon" :size="20" />
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Cari judul, penulis, atau kata kunci..." 
          />
        </div>
        
        <div class="dropdowns">
          <select v-model="selectedCategory" class="filter-select">
            <option>Semua Kategori</option>
            <option>Teknologi Informasi</option>
            <option>Data Science</option>
            <option>Internet of Things</option>
            <option>Kecerdasan Buatan</option>
            <option>Keamanan Siber</option>
          </select>
          
          <select v-model="sortOption" class="filter-select">
            <option>Terbaru</option>
            <option>Terpopuler</option>
          </select>
        </div>
      </div>

      <div class="results-info">
        Menampilkan {{ filteredWorks.length }} karya
      </div>

      <div class="works-list">
        <div 
          v-for="work in filteredWorks" 
          :key="work.id" 
          class="work-card"
          @click="goToDetail(work.id)"
        >
          <div class="card-content">
            <div class="card-header">
              <h2 class="work-title">{{ work.title || 'Tanpa Judul' }}</h2>
              <button 
                class="bookmark-btn" 
                :class="{ 'active': isBookmarked(work.id) }"
                @click.stop="toggleBookmark(work.id)"
              >
                 <Bookmark :size="20" :fill="isBookmarked(work.id) ? 'currentColor' : 'none'" />
              </button>
            </div>
            
            <p class="work-author">{{ work.author || 'Anonim' }}</p>
            
            <!-- Safe Abstract Display -->
            <p class="work-abstract">
              {{ work.abstract ? (work.abstract.length > 150 ? work.abstract.substring(0, 150) + '...' : work.abstract) : 'Tidak ada abstrak.' }}
            </p>
            
            <div class="card-footer">
              <span class="category-badge">{{ work.category || 'Umum' }}</span>
              <div class="meta-info">
                 <span class="meta-item"><Eye :size="16" /> {{ work.views || 0 }}</span>
                 <span class="meta-item" style="color: #cbd5e1">•</span>
                 <span class="meta-item">{{ work.date || '0000-00-00' }}</span>
              </div>
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
  background-color: #f8fafc;
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

.search-filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.search-bar {
  flex: 1;
  min-width: 300px;
  position: relative;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
}

.search-bar input {
  width: 100%;
  padding: 0.875rem 1rem 0.875rem 3rem;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.2s;
}

.search-bar input:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.1);
}

.dropdowns {
  display: flex;
  gap: 1rem;
}

.filter-select {
  padding: 0.875rem 2rem 0.875rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  background-color: white;
  color: var(--text-main);
  font-size: 0.95rem;
  cursor: pointer;
  outline: none;
  min-width: 160px;
}

.results-info {
  margin-bottom: 1.5rem;
  color: var(--text-muted);
  font-size: 0.9rem;
}

.works-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.work-card {
  background: white;
  border: 1px solid var(--border-color);
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

.bookmark-btn {
  background: none;
  border: none;
  color: #cbd5e1;
  cursor: pointer;
  padding: 0.25rem;
  transition: color 0.2s;
}

.bookmark-btn:hover {
  color: var(--primary);
  background-color: #f0fdf4;
  border-radius: 50%;
}

.bookmark-btn.active {
  color: var(--primary);
  fill: var(--primary);
}

.work-author {
  color: var(--text-secondary);
  font-size: 0.95rem;
  margin-bottom: 1rem;
  font-weight: 500;
}

.work-abstract {
  color: var(--text-muted);
  line-height: 1.6;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
}

.card-footer {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.page-container {
  min-height: 100vh;
  background-color: var(--bg-color);
}

.filter-select {
  padding: 0.875rem 2rem 0.875rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  background-color: var(--card-bg);
  color: var(--text-main);
  font-size: 0.95rem;
  cursor: pointer;
  outline: none;
  min-width: 160px;
}

.work-card {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 1rem;
  padding: 1.5rem;
  transition: all 0.2s;
  cursor: pointer;
}

.search-bar input {
  background-color: var(--card-bg);
  color: var(--text-main);
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

/* Dark Mode Overrides */
:global(body.dark-mode) .page-container {
  background-color: #0f172a !important;
}

:global(body.dark-mode) .work-card:hover {
  background-color: #1f2937;
  border-color: #374151;
}

:global(body.dark-mode) .bookmark-btn:hover {
  background-color: rgba(16, 185, 129, 0.1);
}
</style>
