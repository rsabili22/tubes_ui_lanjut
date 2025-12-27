import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
    const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))

    const isAuthenticated = computed(() => !!user.value)

    function login(userData) {
        user.value = userData
        localStorage.setItem('user', JSON.stringify(userData))
    }

    function logout() {
        user.value = null
        localStorage.removeItem('user')
    }

    return { user, isAuthenticated, login, logout }
})
