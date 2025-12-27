import apiClient from './api'

export default {
    getWorks() {
        return apiClient.get('/works')
    },
    getWork(id) {
        return apiClient.get(`/works/${id}`)
    },
    getEvents() {
        return apiClient.get('/events')
    },
    getEvent(id) {
        return apiClient.get(`/events/${id}`)
    }
}
