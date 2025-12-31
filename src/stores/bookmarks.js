import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useBookmarkStore = defineStore('bookmarks', () => {
    // We need to access auth to know WHICH user's bookmarks to load
    // But we encounter circular dependency if we use useAuthStore here directly inside defineStore 
    // IF auth also uses bookmarks. Assuming auth doesn't use bookmarks.

    const bookmarks = ref([])

    // Get user from localStorage directly to avoid circular dep issues or just simplicity
    function getUserKey() {
        const userStr = localStorage.getItem('user')
        if (!userStr) return 'user' // default key
        try {
            const user = JSON.parse(userStr)
            if (user && user.email) {
                return 'data_' + user.email.replace(/[^a-zA-Z0-9]/g, '_')
            }
        } catch (e) { }
        return 'user'
    }

    function loadBookmarks() {
        const key = getUserKey() + '_bookmarks'
        bookmarks.value = JSON.parse(localStorage.getItem(key) || '[]')
    }

    // Initial load
    loadBookmarks()

    function isBookmarked(id) {
        // Reload to be safe?? or assume reactivity works if we watch
        return bookmarks.value.some(bId => bId == id)
    }

    function addBookmark(id) {
        if (!isBookmarked(id)) {
            bookmarks.value.push(id)
            syncLocalStorage()
        }
    }

    function removeBookmark(id) {
        bookmarks.value = bookmarks.value.filter(bId => bId != id)
        syncLocalStorage()
    }

    function toggleBookmark(id) {
        if (isBookmarked(id)) {
            removeBookmark(id)
        } else {
            addBookmark(id)
        }
    }

    function syncLocalStorage() {
        const key = getUserKey() + '_bookmarks'
        localStorage.setItem(key, JSON.stringify(bookmarks.value))
    }

    // Listen to storage events or auth changes? 
    // A simple hack is to expose a 'reload' action that views calls on mount

    return { bookmarks, isBookmarked, addBookmark, removeBookmark, toggleBookmark, loadBookmarks }
})
