<script setup>
import { BookOpen, Mail, Lock, ArrowLeft } from 'lucide-vue-next'
import { useRouter, useRoute } from 'vue-router'
import { onMounted, ref } from 'vue'

import { useAuthStore } from '../stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const showSuccessMessage = ref(false)
const email = ref('')

onMounted(() => {
  if (route.query.registered === 'success') {
    showSuccessMessage.value = true
    // Hide message after 5 seconds
    setTimeout(() => {
      showSuccessMessage.value = false
    }, 5000)
  }
})

const handleLogin = () => {
  // Simulate login
  let name = 'User Demo'
  let userEmail = email.value || 'user@demo.com'

  // Check if there is a registered user
  const registeredUser = localStorage.getItem('registered_user')
  if (registeredUser) {
    try {
      const parsedUser = JSON.parse(registeredUser)
      // If email matches or no email entered (assuming flow from register), use registered name
      if (!email.value || parsedUser.email === email.value) {
        name = parsedUser.name
        userEmail = parsedUser.email
      }
    } catch (e) {
      console.error('Error parsing registered user', e)
    }
  }

  const userData = {
    name: name,
    email: userEmail,
    role: 'user'
  }
  
  authStore.login(userData)
  window.dispatchEvent(new Event('storage')) // Trigger storage event for other components if needed
  router.push('/dashboard')
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
          <h2>Selamat Datang Kembali!</h2>
          <p>Masuk untuk mengakses ribuan karya ilmiah dan terhubung dengan para akademisi.</p>
        </div>
        <div class="brand-footer">
          &copy; 2024 Jelajah Karya
        </div>
      </div>

      <!-- Right Side: Form -->
      <div class="auth-form-side">
        <div class="form-header">
          <h2>Masuk ke Akun</h2>
          <p>Silakan masukkan detail akun Anda</p>
        </div>

        <form class="auth-form" @submit.prevent>
          <div v-if="showSuccessMessage" class="alert-success">
            Pendaftaran berhasil silahkan masuk ke akun anda
          </div>

          <div class="form-group">
            <label>Email</label>
            <div class="input-wrapper">
              <Mail class="input-icon" :size="20" />
              <input type="email" placeholder="email@example.com" v-model="email" />
            </div>
          </div>

          <div class="form-group">
            <label>Password</label>
            <div class="input-wrapper">
              <Lock class="input-icon" :size="20" />
              <input type="password" placeholder="........" />
            </div>
          </div>

          <div class="form-options">
            <label class="remember-me">
              <input type="checkbox" />
              <span>Ingat saya</span>
            </label>
            <router-link to="/forgot-password" class="forgot-password">Lupa password?</router-link>
          </div>

          <button class="btn btn-primary btn-block" @click="handleLogin">Masuk</button>
        </form>

        <div class="auth-footer">
          Belum punya akun? <router-link to="/register">Daftar sekarang</router-link>
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
  background-color: var(--secondary);
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
  max-width: 1000px;
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--border-color);
  display: flex;
  overflow: hidden;
  min-height: 600px;
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
  flex: 1;
  padding: 4rem;
  background-color: var(--card-bg);
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.form-header {
  margin-bottom: 2.5rem;
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
  margin-bottom: 1.5rem;
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

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  color: var(--text-main);
  font-size: 0.95rem;
}

.forgot-password {
  color: var(--primary);
  font-weight: 600;
  font-size: 0.95rem;
}

.btn-block {
  width: 100%;
  padding: 0.875rem;
  font-size: 1rem;
}

.alert-success {
  background-color: #dcfce7;
  border: 1px solid #bbf7d0;
  color: #166534;
  padding: 0.75rem;
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
  text-align: center;
  font-weight: 500;
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
