<script setup>
import { BookOpen, User, Mail, Lock, ArrowLeft } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { ref } from 'vue'

const router = useRouter()
const name = ref('')
const email = ref('')
const profession = ref('')
const password = ref('')
const confirmPassword = ref('')

const handleRegister = () => {
  if (password.value !== confirmPassword.value) {
    alert('Password tidak sama')
    return
  }
  
  if (!profession.value) {
    alert('Silakan pilih pekerjaan')
    return
  }
  
  // Retrieve existing users or initialize empty array
  const usersDb = JSON.parse(localStorage.getItem('users_db') || '[]')
  
  // Check if email already exists
  if (usersDb.some(u => u.email === email.value)) {
    alert('Email sudah terdaftar')
    return
  }

  const userData = {
    name: name.value,
    email: email.value,
    role: profession.value,
    password: password.value // storing password for login check (in clear text for prototype)
  }
  
  // Add to DB
  usersDb.push(userData)
  localStorage.setItem('users_db', JSON.stringify(usersDb))
  
  // Initialize ONLY this user's data
  // Using email as key prefix for simplicity
  const userKey = email.value.replace(/[^a-zA-Z0-9]/g, '_')
  localStorage.setItem(`data_${userKey}_works`, '[]')
  localStorage.setItem(`data_${userKey}_bookmarks`, '[]')
  localStorage.setItem(`data_${userKey}_events`, '[]')
  
  // Also keep the single "registered_user" for backward compatibility if needed, 
  // but LoginView should be updated to check users_db
  
  // Simulate registration success
  router.push('/login?registered=success')
}
</script>

<template>
  <div class="auth-page">
    <router-link to="/" class="back-btn">
      <ArrowLeft :size="20" /> Kembali ke Beranda
    </router-link>
    <div class="auth-card">
      <!-- Left Side: Branding -->
      <div class="auth-brand-side">
        <div class="brand-content">
          <div class="logo-wrapper">
            <div class="logo-icon">
              <BookOpen :size="32" color="white" />
            </div>
            <h1>Jelajah Karya</h1>
          </div>
          <h2>Bergabung Bersama Kami</h2>
          <p>Daftar sekarang untuk mulai mempublikasikan karya dan berkolaborasi dengan komunitas.</p>
        </div>
        <div class="brand-footer">
          &copy; 2024 Jelajah Karya
        </div>
      </div>

      <!-- Right Side: Form -->
      <div class="auth-form-side">
        <div class="form-header">
          <h2>Buat Akun Baru</h2>
          <p>Lengkapi data diri Anda untuk mendaftar</p>
        </div>

        <form class="auth-form" @submit.prevent>
          <div class="form-group">
            <label>Nama Lengkap</label>
            <div class="input-wrapper">
              <User class="input-icon" :size="20" />
              <input type="text" placeholder="Nama Anda" v-model="name" />
            </div>
          </div>

          <div class="form-group">
            <label>Email</label>
            <div class="input-wrapper">
              <Mail class="input-icon" :size="20" />
              <input type="email" placeholder="email@example.com" v-model="email" />
            </div>
          </div>

          <div class="form-group">
             <label>Pekerjaan</label>
             <div class="input-wrapper">
               <User class="input-icon" :size="20" />
               <input type="text" placeholder="Contoh: Mahasiswa, Dosen, dll" v-model="profession" />
             </div>
          </div>

          <div class="form-group">
            <label>Password</label>
            <div class="input-wrapper">
              <Lock class="input-icon" :size="20" />
              <input type="password" placeholder="Minimal 8 karakter" v-model="password" />
            </div>
          </div>

          <div class="form-group">
            <label>Konfirmasi Password</label>
            <div class="input-wrapper">
              <Lock class="input-icon" :size="20" />
              <input type="password" placeholder="Ulangi password" v-model="confirmPassword" />
            </div>
          </div>

          <button class="btn btn-primary btn-block" @click="handleRegister">Daftar</button>
        </form>

        <div class="auth-footer">
          Sudah punya akun? <router-link to="/login">Masuk di sini</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--secondary); /* Light Green, or dark gray */
  padding: 2rem;
  position: relative;
}

.back-btn {
  position: absolute;
  top: 2rem;
  left: 2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-main);
  font-weight: 600;
  padding: 0.75rem 1.25rem;
  background: var(--card-bg);
  border-radius: 2rem;
  box-shadow: var(--shadow-sm);
  transition: all 0.2s;
  text-decoration: none;
  z-index: 10;
}

.back-btn:hover {
  transform: translateX(-3px);
  box-shadow: var(--shadow-md);
  background: var(--bg-color);
}

.auth-card {
  background: var(--card-bg);
  border-radius: 1.5rem;
  width: 100%;
  max-width: 1100px;
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--border-color);
  display: flex;
  overflow: hidden;
  min-height: 700px; /* Taller for registration form */
}

/* Brand Side (Left) */
.auth-brand-side {
  flex: 1;
  background: linear-gradient(135deg, var(--primary) 0%, #059669 100%);
  padding: 4rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: white;
  position: relative;
}

.brand-content {
  position: relative;
  z-index: 2;
}

.logo-wrapper {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 3rem;
}

.logo-icon {
  background-color: rgba(255, 255, 255, 0.2);
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  backdrop-filter: blur(10px);
}

.auth-brand-side h1 {
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0;
}

.auth-brand-side h2 {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  line-height: 1.2;
}

.auth-brand-side p {
  font-size: 1.1rem;
  opacity: 0.9;
  line-height: 1.6;
  max-width: 80%;
}

.brand-footer {
  font-size: 0.9rem;
  opacity: 0.7;
}

/* Form Side (Right) */
.auth-form-side {
  flex: 1.2; /* Slightly wider space for form */
  padding: 4rem;
  background-color: var(--card-bg);
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.form-header {
  margin-bottom: 2rem;
}

.form-header h2 {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 0.5rem;
}

.form-header p {
  color: var(--text-muted);
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--text-main);
  font-weight: 500;
  font-size: 0.95rem;
}

.input-wrapper {
  position: relative;
}

.input-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
  pointer-events: none;
}

.input-wrapper input {
  width: 100%;
  padding: 0.875rem 1rem 0.875rem 3rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  font-size: 1rem;
  outline: none;
  transition: all 0.2s;
  background-color: var(--bg-color);
  color: var(--text-main);
}

.input-wrapper input:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.btn-block {
  width: 100%;
  padding: 0.875rem;
  font-size: 1rem;
  margin-top: 1rem;
}

.auth-footer {
  margin-top: 2rem;
  text-align: center;
  font-size: 0.95rem;
  color: var(--text-muted);
}

.auth-footer a {
  color: var(--primary);
  font-weight: 600;
}

/* Responsive */
@media (max-width: 900px) {
  .auth-card {
    flex-direction: column;
    max-width: 500px;
  }
  
  .auth-brand-side {
    padding: 2rem;
    min-height: auto;
  }
  
  .auth-brand-side h2 {
    font-size: 1.75rem;
  }
  
  .logo-wrapper {
    margin-bottom: 1.5rem;
  }
  
  .auth-form-side {
    padding: 2rem;
  }
}
</style>
