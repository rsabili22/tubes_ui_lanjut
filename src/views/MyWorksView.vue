<script setup>
import DashboardNavbar from '../components/DashboardNavbar.vue'
import { Eye, Edit, Trash2, Plus } from 'lucide-vue-next'
import { ref, onMounted } from 'vue'

const works = ref([])

// Helper to get key (duplicated for now, could be in a service)
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

onMounted(() => {
  const worksKey = getWorksKey()
  const storedWorks = localStorage.getItem(worksKey)
  
  // Check if demo user
  let isDemo = true
  const userStr = localStorage.getItem('user')
  if (userStr) {
      try {
          const u = JSON.parse(userStr)
          if (u.email && u.email !== 'user@demo.com') isDemo = false
      } catch(e) {}
  }

  if (storedWorks) {
    try {
      works.value = JSON.parse(storedWorks)
    } catch (e) {
      console.error('Error parsing user works', e)
    }
  } else {
    // Default dummy data ONLY if demo or fallback
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
        works.value = defaultWorks
        localStorage.setItem(worksKey, JSON.stringify(defaultWorks))
    } else {
        works.value = []
    }
  }
})

const getStatusClass = (status) => {
  return status === 'Published' ? 'status-published' : 'status-draft'
}

const deleteWork = (id) => {
  if (confirm('Apakah Anda yakin ingin menghapus karya ini?')) {
    // Remove from local list
    works.value = works.value.filter(w => w.id !== id)
    
    // Update local storage
    const worksKey = getWorksKey()
    localStorage.setItem(worksKey, JSON.stringify(works.value))
    
    // Dispatch event to update dashboard immediately if needed
    // (though dashboard reloads from storage on mount/refresh)
    window.dispatchEvent(new Event('storage'))
  }
}
</script>

<template>
  <div class="page-container">
    <DashboardNavbar />
    
    <main class="container page-content">
      <div class="page-header">
        <div class="header-text">
          <h1>Karya Saya</h1>
          <p>Kelola semua karya ilmiah Anda</p>
        </div>
        <router-link to="/my-works/upload" class="btn btn-primary btn-add">
          <Plus :size="18" /> Unggah Karya Baru
        </router-link>
      </div>

      <div class="works-table-container">
        <table class="works-table">
          <thead>
            <tr>
              <th>Judul</th>
              <th>Kategori</th>
              <th>Tanggal</th>
              <th>Views</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="work in works" :key="work.id">
              <td class="col-title">{{ work.title }}</td>
              <td>{{ work.category }}</td>
              <td>{{ work.date }}</td>
              <td>
                 <div class="view-count">
                   <Eye :size="14" /> {{ work.views }}
                 </div>
              </td>
              <td>
                <span :class="['status-badge', getStatusClass(work.status)]">
                  {{ work.status }}
                </span>
              </td>
              <td class="col-actions">
                <div class="action-buttons">
                  <router-link :to="`/my-works/${work.id}`" class="btn-icon text-blue">
                    <Eye :size="18" />
                  </router-link>
                  <router-link :to="`/my-works/edit/${work.id}`" class="btn-icon text-green">
                    <Edit :size="18" />
                  </router-link>
                  <button class="btn-icon text-red" @click="deleteWork(work.id)">
                    <Trash2 :size="18" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
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

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.header-text h1 {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 0.25rem;
}

.header-text p {
  color: var(--text-muted);
}

.btn-add {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border-radius: 0.5rem;
  font-weight: 600;
  background-color: #059669; /* Green */
  border-color: #059669;
  color: white;
  text-decoration: none;
}

.btn-add:hover {
  background-color: #047857;
}

.works-table-container {
  background: var(--card-bg);
  border-radius: 0.75rem;
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
  overflow-x: auto;
}

.works-table {
  width: 100%;
  border-collapse: collapse;
}

.works-table th,
.works-table td {
  padding: 1rem 1.5rem;
  text-align: left;
  border-bottom: 1px solid var(--border-color);
}

.works-table th {
  background-color: var(--secondary);
  font-weight: 600;
  color: var(--text-main);
  font-size: 0.95rem;
}

.works-table td {
  font-size: 0.95rem;
  color: var(--text-muted);
}

.works-table tr:last-child td {
  border-bottom: none;
}

.col-title {
  color: var(--text-main);
  font-weight: 500;
  max-width: 300px;
}

.view-count {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: var(--text-muted);
}

.status-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.85rem;
  font-weight: 500;
}

.status-published {
  background-color: #dcfce7;
  color: #166534;
}

.status-draft {
  background-color: #fef9c3;
  color: #854d0e;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.btn-icon {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.25rem;
  transition: background-color 0.2s;
}

.btn-icon:hover {
  background-color: var(--secondary);
}

.text-blue { color: #3b82f6; }
.text-green { color: #10b981; }
.text-red { color: #ef4444; }

/* Dark Mode Overrides */
:global(body.dark-mode) .page-container {
  background-color: #0f172a !important;
}

:global(body.dark-mode) .works-table-container {
  background-color: var(--card-bg);
  border-color: var(--border-color);
}

:global(body.dark-mode) .works-table th {
  background-color: #1e293b;
  color: var(--text-main);
}

:global(body.dark-mode) .works-table td {
  border-bottom-color: var(--border-color);
}

:global(body.dark-mode) .col-title {
  color: var(--text-main);
}

:global(body.dark-mode) .btn-icon:hover {
  background-color: #334155;
}
</style>
