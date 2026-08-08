import api from './api'

export const getFoods = (params) => api.post('/feed', {}, { params })
export const getFoodById = (id) => api.get(`/feed/id/${id}`)
export const createFood = (payload) => api.post('/food', payload)
export const toggleLike = (payload) => api.post('/like', payload)
export const toggleBookmark = (payload) => api.post('/bookmark', payload)
export const getSavedReels = () => api.get('/bookmark/saved-reels')
export const createComment = (payload) => api.post('/comment', payload)
export const getComments = (foodId) => api.get(`/comment/${foodId}`)
export const deleteFood = (foodId) => api.delete(`/food/${foodId}`)
export const searchFoods = (info) => api.get('/feed/info', { params: { info } })
