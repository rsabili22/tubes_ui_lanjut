import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useBookmarkStore = defineStore('bookmarks', () => {
    const bookmarks = ref(JSON.parse(localStorage.getItem('user_bookmarks') || '[]'))

    function isBookmarked(id) {
        return bookmarks.value.includes(id)
    }

    function addBookmark(id) {
        if (!isBookmarked(id)) {
            bookmarks.value.push(id)
            syncLocalStorage()
        }
    }

    function removeBookmark(id) {
        const index = bookmarks.value.indexOf(id)
        if (index > -1) {
            bookmarks.value.splice(index, 1)
            syncLocalStorage()
        }
    }

    function toggleBookmark(id) {
        if (isBookmarked(id)) {
            removeBookmark(id)
        } else {
            addBookmark(id)
        }
    }

    function syncLocalStorage() {
        localStorage.setItem('user_bookmarks', JSON.stringify(bookmarks.value))
    }

    return { bookmarks, isBookmarked, addBookmark, removeBookmark, toggleBookmark }
})
